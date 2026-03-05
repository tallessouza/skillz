# Code Examples: Gerenciamento Seguro de Sessoes

## 1. Validacao completa de Session ID

```typescript
// Definir o formato esperado do session ID
const SESSION_FORMAT = {
  pattern: /^[a-f0-9]{32}$/,
  length: 32,
  charset: 'hexadecimal'
};

function validateSessionId(sessionId: unknown): sessionId is string {
  if (typeof sessionId !== 'string') return false;
  if (sessionId.length !== SESSION_FORMAT.length) return false;
  return SESSION_FORMAT.pattern.test(sessionId);
}

// Uso em middleware Express
function sessionValidationMiddleware(req, res, next) {
  const sessionId = req.cookies?.sessionId;

  if (!sessionId || !validateSessionId(sessionId)) {
    res.clearCookie('sessionId');
    return res.status(401).json({ error: 'Invalid session' });
  }

  next();
}
```

## 2. Cache-Control no-store para area logada

```typescript
// Middleware que aplica no-store em todas as rotas autenticadas
function noCacheAuthenticated(req, res, next) {
  if (req.session?.userId) {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
}

app.use(noCacheAuthenticated);
```

```typescript
// Comparacao: no-cache vs no-store

// ERRADO - navegador pode salvar no disco
res.setHeader('Cache-Control', 'no-cache');
// Atacante com acesso ao filesystem pode ler o cache

// CORRETO - nada salvo no disco
res.setHeader('Cache-Control', 'no-store');
// Dados ficam apenas em memoria
```

## 3. Renovacao de sessao em mudanca de privilegio

```typescript
async function changeUserPrivileges(
  userId: string,
  newRole: string,
  sessionStore: SessionStore
) {
  // 1. Atualizar no banco
  await db.query(
    'UPDATE users SET role = $1 WHERE id = $2',
    [newRole, userId]
  );

  // 2. Invalidar TODAS as sessoes do usuario
  await sessionStore.invalidateAllSessions(userId);

  // Quando o usuario fizer a proxima requisicao,
  // sera forcado a logar novamente e recebera
  // uma nova sessao com as permissoes atualizadas
}
```

## 4. Timeout na tela de login (client-side)

```typescript
// Na pagina de login, redirecionar para logout apos inatividade
function setupLoginPageTimeout() {
  let timeoutId: number;
  const TIMEOUT_MS = 30_000; // 30 segundos

  function resetTimeout() {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      // Redirecionar para rota que limpa o session ID
      window.location.href = '/logout';
    }, TIMEOUT_MS);
  }

  // Monitorar qualquer interacao
  document.addEventListener('mousemove', resetTimeout);
  document.addEventListener('keydown', resetTimeout);

  // Iniciar o timer
  resetTimeout();
}
```

## 5. Logout automatico por inatividade (servidor)

```typescript
// Verificacao no servidor a cada requisicao
async function checkSessionInactivity(req, res, next) {
  const session = await sessionStore.get(req.cookies.sessionId);

  if (!session) {
    return res.status(401).json({ error: 'Session expired' });
  }

  const lastActivityAt = new Date(session.lastActivityAt);
  const now = new Date();
  const inactiveMinutes = (now.getTime() - lastActivityAt.getTime()) / 60_000;

  // Timeout configuravel por tipo de aplicacao
  const maxInactiveMinutes = getMaxInactiveMinutes(session.appType);

  if (inactiveMinutes > maxInactiveMinutes) {
    await sessionStore.destroy(req.cookies.sessionId);
    res.clearCookie('sessionId');
    return res.status(401).json({ error: 'Session expired due to inactivity' });
  }

  // Atualizar timestamp de ultima atividade
  await sessionStore.touch(req.cookies.sessionId);
  next();
}

function getMaxInactiveMinutes(appType: string): number {
  const timeouts = {
    fintech: 5,
    ecommerce: 30,
    corporate: 480, // 8 horas
    social: 43200,  // 30 dias
  };
  return timeouts[appType] ?? 30;
}
```

## 6. Logout automatico no cliente (estilo WordPress)

```typescript
// Overlay amigavel que permite relogar sem perder trabalho
function setupInactivityOverlay() {
  let timeoutId: number;
  const WARNING_MS = 25 * 60_000; // 25 min (aviso antes do servidor expirar)

  function showReauthOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'reauth-overlay';
    overlay.innerHTML = `
      <div class="reauth-modal">
        <h2>Sessao expirada</h2>
        <p>Faca login novamente para continuar.</p>
        <form id="reauth-form">
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('reauth-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const response = await fetch('/api/reauth', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        overlay.remove();
        resetTimeout();
      }
    });
  }

  function resetTimeout() {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(showReauthOverlay, WARNING_MS);
  }

  document.addEventListener('mousemove', resetTimeout);
  document.addEventListener('keydown', resetTimeout);
  resetTimeout();
}
```