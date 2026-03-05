---
name: rs-seguranca-devs-reset-senha
description: "Enforces security best practices for password reset pages when building authentication flows. Use when user asks to 'implement password reset', 'build forgot password page', 'create reset password flow', or 'secure authentication'. Applies rules: rate limiting by IP, password confirmation field, MFA verification, email notification on change, session invalidation, redirect to login. Make sure to use this skill whenever implementing any password reset or recovery feature. Not for login pages, registration forms, or OAuth/SSO flows."
---

# Seguranca na Pagina de Reset de Senha

> Ao implementar reset de senha, trate cada etapa como superficie de ataque: rate limit, confirme a senha, exija MFA, notifique, invalide sessoes e redirecione para login.

## Rules

1. **Implemente rate limit por IP** — limite tentativas (ex: 5 tentativas, depois aguardar 1min, depois 10min), porque impede forca bruta de tokens mesmo que tokens sejam criptograficamente seguros, e evita consumo desnecessario de recursos do servidor
2. **Exija confirmacao de senha (senha + confirme a senha)** — diferente do cadastro onde um campo basta, no reset o usuario frequentemente e alguem que errou a senha original, entao confirmar garante que ele consegue digitar a nova senha corretamente
3. **Exija MFA antes de trocar a senha** — se o usuario tem MFA ativo, valide antes de permitir o reset, porque e-mail comprometido nao deve ser suficiente para resetar senha em servicos com MFA
4. **Notifique por e-mail apos a troca** — envie aviso imediato ao usuario, porque se a troca foi ilegitima, inicia uma corrida contra o tempo entre usuario e atacante — quanto antes souber, menor o dano
5. **Invalide todas as sessoes ativas** — apos trocar a senha, deslogue de todos os dispositivos, porque o usuario pode ter compartilhado a senha e o reset e a forma de revogar acesso de terceiros
6. **Redirecione para tela de login** — nunca autentique automaticamente apos reset, porque manter um unico ponto de autenticacao reduz superficie de ataque e facilita manutencao futura

## How to write

### Rate limit por IP

```typescript
// Middleware de rate limit especifico para a rota de reset
const resetPasswordLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 5,
  message: { error: "Muitas tentativas. Aguarde antes de tentar novamente." },
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({
      error: "Muitas tentativas. Tente novamente em alguns minutos.",
    });
  },
});

app.post("/reset-password", resetPasswordLimiter, resetPasswordHandler);
```

### Fluxo completo pos-reset

```typescript
async function resetPassword(userId: string, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword);
  await updateUserPassword(userId, hashedPassword);

  // 1. Notificar por e-mail
  await sendPasswordChangedEmail(userId);

  // 2. Invalidar todas as sessoes
  await invalidateAllSessions(userId);

  // 3. Retornar instrucao para redirecionar ao login (NAO autenticar)
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
  res.json({ token: session.token }); // Ja logado
});
```

**After (com esta skill aplicada):**
```typescript
app.post("/reset-password", resetPasswordLimiter, async (req, res) => {
  const user = await getUserByResetToken(req.body.token);

  if (user.mfaEnabled) {
    const mfaValid = await verifyMfaCode(user.id, req.body.mfaCode);
    if (!mfaValid) return res.status(401).json({ error: "MFA invalido" });
  }

  if (req.body.password !== req.body.passwordConfirmation) {
    return res.status(400).json({ error: "Senhas nao conferem" });
  }

  await updatePassword(user.id, req.body.password);
  await sendPasswordChangedEmail(user.email);
  await invalidateAllSessions(user.id);
  await invalidateResetToken(req.body.token);

  res.json({ redirectTo: "/login" }); // Redireciona, NAO autentica
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Cadastro de novo usuario | Um campo de senha basta (com toggle de visibilidade) |
| Reset de senha | Sempre pedir senha + confirmacao |
| Usuario tem MFA ativo | Exigir MFA antes de permitir o reset |
| Troca de senha bem-sucedida | Notificar + invalidar sessoes + redirecionar ao login |
| Falha na confirmacao de senha | Retornar erro claro, nao prosseguir |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Auto-autenticar apos reset | Redirecionar para `/login` |
| Permitir tentativas ilimitadas | Rate limit por IP com backoff progressivo |
| Ignorar MFA no fluxo de reset | Verificar MFA se usuario tem ativo |
| Trocar senha silenciosamente | Enviar e-mail de notificacao imediata |
| Manter sessoes apos troca | Invalidar todas as sessoes ativas |
| Unico campo de senha no reset | Senha + confirmacao de senha |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-alguns-conselhos-sobre-a-pagina-de-reset-de-senha/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-alguns-conselhos-sobre-a-pagina-de-reset-de-senha/references/code-examples.md)
