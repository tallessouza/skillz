---
name: rs-seguranca-devs-sessoes-conselhos
description: "Enforces secure session management practices when implementing authentication, login flows, or session handling in web applications. Use when user asks to 'implement login', 'create session', 'add authentication', 'handle cookies', or 'secure user sessions'. Applies rules: validate session ID as user input, renew session on privilege change, use Cache-Control no-store, implement login timeout and auto-logout. Make sure to use this skill whenever building any authenticated area or session-based feature. Not for OAuth/JWT token flows, API key management, or password hashing."
---

# Gerenciamento Seguro de Sessoes

> Trate o ID de sessao como input nao confiavel, renove-o em mudancas de privilegio, e nunca permita cache de requisicoes autenticadas.

## Rules

1. **Valide o ID de sessao como input de usuario** — `validateSessionId(id)` nao `trustSessionId(id)`, porque um agressor pode preparar o ID para SQL Injection se o formato nao for validado
2. **Renove o ID de sessao em mudancas de privilegio** — expire todas as sessoes do usuario quando roles/permissoes mudarem, porque permissoes antigas ficam cached na session e o usuario continua com acesso que nao deveria ter
3. **Use Cache-Control: no-store para area logada** — `no-store` nao `no-cache`, porque `no-cache` ainda salva a requisicao HTTP completa (incluindo headers com session ID) no disco
4. **Defina expiracao curta adequada ao negocio** — fintech: 2-5min, e-commerce: 15-30min, software corporativo: 4-8h, porque sessoes longas ampliam a janela de ataque
5. **Implemente timeout na tela de login** — redirecione para logout apos 30s sem interacao, porque um atacante pode copiar o session ID da tela de login aberta e esperar a vitima logar
6. **Implemente logout automatico por inatividade** — faca no servidor (obrigatorio) e no cliente (UX), porque o servidor e a unica garantia real de que a sessao foi encerrada

## How to write

### Validacao de Session ID
```typescript
// Valide formato antes de qualquer operacao com o ID
function validateSessionId(sessionId: string): boolean {
  const SESSION_ID_PATTERN = /^[a-f0-9]{32}$/;
  return SESSION_ID_PATTERN.test(sessionId);
}

// No middleware de autenticacao
if (!validateSessionId(req.cookies.sessionId)) {
  return res.status(401).json({ error: 'Invalid session' });
}
```

### Cache-Control para area logada
```typescript
// Middleware para rotas autenticadas
function authenticatedRoute(req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  next();
}
```

### Renovacao de sessao em mudanca de privilegio
```typescript
async function changeUserRole(userId: string, newRole: string) {
  await database.updateUserRole(userId, newRole);
  // Expire TODAS as sessoes do usuario
  await sessionStore.invalidateAllSessions(userId);
}
```

## Example

**Before (inseguro):**
```typescript
app.post('/admin/change-role', async (req, res) => {
  await db.query(`UPDATE users SET role = '${req.body.role}' WHERE id = '${req.body.userId}'`);
  res.json({ success: true });
});

app.get('/dashboard', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  // ...
});
```

**After (com esta skill aplicada):**
```typescript
app.post('/admin/change-role', async (req, res) => {
  const { userId, role } = req.body;
  await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
  await sessionStore.invalidateAllSessions(userId);
  res.json({ success: true });
});

app.get('/dashboard', authenticatedRoute, (req, res) => {
  // Cache-Control: no-store ja aplicado pelo middleware
  // ...
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Qualquer rota atras de login | `Cache-Control: no-store` |
| Usuario mudou de plano/role | Invalidar todas as sessoes |
| Tela de login aberta sem interacao | Redirect para logout apos 30s |
| Usuario logado sem requisicoes por tempo X | Logout automatico no servidor |
| Session ID chegou via cookie | Validar formato antes de usar |
| Fintech/banco | Timeout de 2-5 minutos |
| E-commerce | Timeout de 15-30 minutos |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `Cache-Control: no-cache` em area logada | `Cache-Control: no-store` |
| Confiar no formato do session ID do cookie | Validar com regex do formato esperado |
| Mudar role sem expirar sessoes | `invalidateAllSessions(userId)` apos mudanca |
| Sessao com expiracao de 1 mes | Expiracao adequada ao tipo de negocio |
| Logout por inatividade so no cliente | Logout no servidor (cliente e complementar para UX) |
| Interpolar session ID direto em SQL | Usar prepared statements/parametros |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
