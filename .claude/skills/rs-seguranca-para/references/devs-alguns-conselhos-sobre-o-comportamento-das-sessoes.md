---
name: rs-seguranca-devs-sessoes-conselhos
description: "Enforces secure session management practices when implementing authentication, login flows, or session handling in web applications. Use when user asks to 'implement login', 'create session', 'add authentication', 'handle cookies', 'secure user sessions', or 'configure session timeout'. Applies rules: validate session ID format as untrusted input, renew session on privilege change, use Cache-Control no-store for authenticated routes, implement business-appropriate timeouts, auto-logout on inactivity. Make sure to use this skill whenever building any authenticated area or session-based feature. Not for JWT token management, OAuth flows, or password hashing (use devs-seguranca-no-armazenamento-de-senhas)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: session-management
  tags: [security, sessions, cookies, authentication, cache-control, timeout, session-management]
---

# Gerenciamento Seguro de Sessoes

> Trate o ID de sessao como input nao confiavel, renove-o em mudancas de privilegio, e nunca permita cache de requisicoes autenticadas.

## Rules

1. **Valide o ID de sessao como input de usuario** — `validateSessionId(id)` nao `trustSessionId(id)`, porque um agressor pode preparar o ID para SQL Injection se o formato nao for validado
2. **Renove o ID de sessao em mudancas de privilegio** — expire todas as sessoes do usuario quando roles/permissoes mudarem, porque permissoes antigas ficam cached na session
3. **Use Cache-Control: no-store para area logada** — `no-store` nao `no-cache`, porque `no-cache` ainda salva a requisicao HTTP completa (incluindo headers com session ID) no disco
4. **Defina expiracao curta adequada ao negocio** — fintech: 2-5min, e-commerce: 15-30min, software corporativo: 4-8h, porque sessoes longas ampliam a janela de ataque
5. **Implemente timeout na tela de login** — redirecione para logout apos 30s sem interacao, porque um atacante pode copiar o session ID da tela de login aberta e esperar a vitima logar
6. **Implemente logout automatico por inatividade** — faca no servidor (obrigatorio) e no cliente (UX), porque o servidor e a unica garantia real de encerramento

## How to write

### Validacao de Session ID

```typescript
function validateSessionId(sessionId: string): boolean {
  const SESSION_ID_PATTERN = /^[a-f0-9]{32}$/;
  return SESSION_ID_PATTERN.test(sessionId);
}

if (!validateSessionId(req.cookies.sessionId)) {
  return res.status(401).json({ error: 'Invalid session' });
}
```

### Cache-Control para area logada

```typescript
function authenticatedRoute(req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  next();
}
```

### Renovacao de sessao em mudanca de privilegio

```typescript
async function changeUserRole(userId: string, newRole: string) {
  await database.updateUserRole(userId, newRole);
  await sessionStore.invalidateAllSessions(userId);
}
```

## Example

**Before (inseguro):**
```typescript
app.post('/admin/change-role', async (req, res) => {
  await db.query(`UPDATE users SET role = '${req.body.role}' WHERE id = '${req.body.userId}'`);
  res.json({ success: true }); // Sessoes antigas mantidas com role antigo
});
app.get('/dashboard', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache'); // ERRADO: ainda salva no disco
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
  // Cache-Control: no-store aplicado pelo middleware
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Qualquer rota atras de login | `Cache-Control: no-store` |
| Usuario mudou de plano/role | Invalidar todas as sessoes |
| Tela de login aberta sem interacao | Redirect para logout apos 30s |
| Session ID chegou via cookie | Validar formato antes de usar |
| Fintech/banco | Timeout de 2-5 minutos |
| E-commerce | Timeout de 15-30 minutos |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `Cache-Control: no-cache` em area logada | `Cache-Control: no-store` |
| Confiar no formato do session ID | Validar com regex do formato esperado |
| Mudar role sem expirar sessoes | `invalidateAllSessions(userId)` |
| Sessao com expiracao de 1 mes | Expiracao adequada ao tipo de negocio |
| Logout por inatividade so no cliente | Logout no servidor + cliente complementar |

## Troubleshooting

### Usuario mantem permissoes antigas apos mudanca de role
**Symptom:** Admin removeu role mas usuario continua acessando recursos protegidos
**Cause:** Sessoes antigas nao foram invalidadas apos mudanca de permissoes
**Fix:** Sempre chame `invalidateAllSessions(userId)` apos qualquer mudanca de role/permissoes.

### Cache-Control no-cache nao protege dados sensiveis
**Symptom:** Dados de area logada aparecem no historico do navegador ou cache em disco
**Cause:** `no-cache` permite armazenamento local, apenas revalida com servidor
**Fix:** Use `Cache-Control: no-store` — impede qualquer armazenamento da resposta.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-alguns-conselhos-sobre-o-comportamento-das-sessoes/references/deep-explanation.md) — Diferenca tecnica entre no-cache e no-store, timeouts por tipo de negocio, ataque via tela de login
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-alguns-conselhos-sobre-o-comportamento-das-sessoes/references/code-examples.md) — Middleware completo, timeout implementations, session validation patterns
