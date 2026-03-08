---
name: rs-seguranca-devs-reset-senha-pagina
description: "Enforces security best practices for password reset pages when building authentication flows. Use when user asks to 'implement password reset', 'build forgot password page', 'create reset password flow', 'secure password change', or 'handle password recovery submission'. Applies rules: rate limiting by IP with progressive backoff, password confirmation field, MFA verification before reset, email notification on change, session invalidation after reset, redirect to login instead of auto-authenticate. Make sure to use this skill whenever implementing any password reset or recovery feature. Not for login pages (use devs-boas-praticas-para-autenticacao), token generation (use devs-gerando-token-de-reset), or OAuth/SSO flows."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: authentication
  tags: [security, password-reset, authentication, rate-limiting, mfa, session-management]
---

# Seguranca na Pagina de Reset de Senha

> Ao implementar reset de senha, trate cada etapa como superficie de ataque: rate limit, confirme a senha, exija MFA, notifique, invalide sessoes e redirecione para login.

## Rules

1. **Implemente rate limit por IP** — limite tentativas (ex: 5 tentativas, depois aguardar 1min, depois 10min), porque impede forca bruta de tokens e evita consumo desnecessario de recursos
2. **Exija confirmacao de senha (senha + confirme a senha)** — diferente do cadastro onde um campo basta, no reset o usuario frequentemente e alguem que errou a senha original, entao confirmar garante digitacao correta
3. **Exija MFA antes de trocar a senha** — se o usuario tem MFA ativo, valide antes de permitir o reset, porque e-mail comprometido nao deve ser suficiente para resetar senha em servicos com MFA
4. **Notifique por e-mail apos a troca** — envie aviso imediato, porque se a troca foi ilegitima, inicia corrida contra o tempo entre usuario e atacante
5. **Invalide todas as sessoes ativas** — apos trocar a senha, deslogue de todos os dispositivos, porque o usuario pode ter compartilhado a senha e o reset e a forma de revogar acesso
6. **Redirecione para tela de login** — nunca autentique automaticamente apos reset, porque manter unico ponto de autenticacao reduz superficie de ataque

## How to write

### Rate limit por IP

```typescript
const resetPasswordLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { error: "Muitas tentativas. Aguarde antes de tentar novamente." },
  keyGenerator: (req) => req.ip,
});

app.post("/reset-password", resetPasswordLimiter, resetPasswordHandler);
```

### Fluxo completo pos-reset

```typescript
async function resetPassword(userId: string, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword);
  await updateUserPassword(userId, hashedPassword);
  await sendPasswordChangedEmail(userId);
  await invalidateAllSessions(userId);
  return { redirectTo: "/login" };
}
```

### Verificacao de MFA antes do reset

```typescript
async function handleResetSubmission(req: Request, res: Response) {
  const user = await getUserByResetToken(req.body.token);

  if (user.mfaEnabled) {
    if (!req.body.mfaCode) {
      return res.status(400).json({ error: "MFA obrigatorio", requireMfa: true });
    }
    const mfaValid = await verifyMfaCode(user.id, req.body.mfaCode);
    if (!mfaValid) {
      return res.status(401).json({ error: "Codigo MFA invalido" });
    }
  }

  if (req.body.password !== req.body.passwordConfirmation) {
    return res.status(400).json({ error: "Senhas nao conferem" });
  }

  await resetPassword(user.id, req.body.password);
  return res.json({ redirectTo: "/login" });
}
```

## Example

**Before (inseguro):**
```typescript
app.post("/reset-password", async (req, res) => {
  const user = await getUserByToken(req.body.token);
  await updatePassword(user.id, req.body.password);
  const session = await createSession(user.id); // Auto-autentica!
  res.json({ token: session.token });
});
```

**After (com esta skill aplicada):**
```typescript
app.post("/reset-password", resetPasswordLimiter, async (req, res) => {
  const user = await getUserByResetToken(req.body.token);
  if (user.mfaEnabled && !await verifyMfaCode(user.id, req.body.mfaCode)) {
    return res.status(401).json({ error: "MFA invalido" });
  }
  if (req.body.password !== req.body.passwordConfirmation) {
    return res.status(400).json({ error: "Senhas nao conferem" });
  }
  await updatePassword(user.id, req.body.password);
  await sendPasswordChangedEmail(user.email);
  await invalidateAllSessions(user.id);
  await invalidateResetToken(req.body.token);
  res.json({ redirectTo: "/login" });
});
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Auto-autenticar apos reset | Redirecionar para `/login` |
| Permitir tentativas ilimitadas | Rate limit por IP com backoff progressivo |
| Ignorar MFA no fluxo de reset | Verificar MFA se usuario tem ativo |
| Trocar senha silenciosamente | Enviar e-mail de notificacao imediata |
| Manter sessoes apos troca | Invalidar todas as sessoes ativas |
| Unico campo de senha no reset | Senha + confirmacao de senha |

## Troubleshooting

### Usuario com MFA nao consegue resetar senha
**Symptom:** Fluxo de reset bloqueia usuario que perdeu acesso ao dispositivo MFA
**Cause:** MFA exigido mas usuario nao tem backup codes ou acesso ao autenticador
**Fix:** Implemente fluxo de recuperacao de MFA separado com verificacao de identidade alternativa (documento, suporte). Nunca pule MFA automaticamente.

### Rate limit bloqueando usuarios legitimos
**Symptom:** Usuarios reportam "muitas tentativas" na primeira tentativa
**Cause:** IP compartilhado (NAT, VPN corporativa) fazendo multiplos usuarios parecerem o mesmo
**Fix:** Combine rate limit por IP com rate limit por conta (email). Use CAPTCHA como alternativa ao bloqueio total.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-alguns-conselhos-sobre-a-pagina-de-reset-de-senha/references/deep-explanation.md) — Raciocinio do instrutor sobre cada regra, corrida contra o tempo atacante vs usuario
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-alguns-conselhos-sobre-a-pagina-de-reset-de-senha/references/code-examples.md) — Implementacoes completas com Express, rate limit progressivo
