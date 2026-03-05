---
name: rs-saas-nextjs-rbac-password-recover
description: "Enforces secure password recovery and reset route patterns when building authentication flows in Node.js/Fastify APIs. Use when user asks to 'implement password reset', 'add forgot password', 'create recovery route', 'build password change endpoint', or any auth recovery feature. Applies rules: always return success regardless of user existence, separate recover and reset into two routes, use token-based flow. Make sure to use this skill whenever implementing password recovery in any API. Not for login routes, session management, or OAuth flows."
---

# Rotas de Recuperacao e Troca de Senha

> Rotas de recuperacao de senha SEMPRE retornam sucesso, independente do usuario existir ou nao, para proteger a privacidade dos dados.

## Rules

1. **Sempre retorne sucesso na rota de recover** — retorne 201 mesmo quando o usuario nao existe, porque expor a existencia de usuarios permite enumeracao de contas por atacantes
2. **Separe recover e reset em duas rotas** — `POST /password/recover` gera o token, `POST /password/reset` consome o token, porque sao operacoes distintas com inputs diferentes
3. **Recover nao exige autenticacao** — o usuario esqueceu a senha, entao nao pode estar logado
4. **Valide o token antes de resetar** — se o token nao existe, lance UnauthorizedError imediatamente, porque tokens invalidos indicam tentativa de ataque
5. **Hash a nova senha antes de salvar** — nunca armazene senha em texto plano, use hash com cost factor (ex: 6 rounds bcrypt)
6. **Use status 204 no reset** — operacao de sucesso sem conteudo no body, porque nao ha dados para retornar apos a troca

## How to write

### Rota de solicitacao de recuperacao

```typescript
app.post('/password/recover', async (request, reply) => {
  const { email } = request.body

  const userFromEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (!userFromEmail) {
    // We don't want people to know if user really exists
    return reply.status(201).send()
  }

  const token = await prisma.token.create({
    data: {
      type: 'PASSWORD_RECOVER',
      userId: userFromEmail.id,
    },
  })

  // TODO: send email with password recover link using token.id
  console.log('Recover password token:', token.id) // dev only

  return reply.status(201).send()
})
```

### Rota de reset de senha

```typescript
app.post('/password/reset', async (request, reply) => {
  const { code, password } = request.body

  const tokenFromCode = await prisma.token.findUnique({
    where: { id: code },
  })

  if (!tokenFromCode) {
    throw new UnauthorizedError()
  }

  const passwordHash = await hash(password, 6)

  await prisma.user.update({
    where: { id: tokenFromCode.userId },
    data: { passwordHash },
  })

  return reply.status(204).send()
})
```

## Example

**Before (inseguro — expoe existencia do usuario):**
```typescript
const user = await prisma.user.findUnique({ where: { email } })
if (!user) {
  throw new NotFoundError('User not found') // VULNERAVEL: enumeracao de contas
}
```

**After (seguro — resposta identica):**
```typescript
const user = await prisma.user.findUnique({ where: { email } })
if (!user) {
  return reply.status(201).send() // Mesma resposta de sucesso
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Usuario nao encontrado no recover | Retorne 201 silenciosamente |
| Token invalido no reset | Lance UnauthorizedError (401) |
| Senha nova recebida | Hash antes de salvar, minimo 6 caracteres |
| Sucesso no reset | Status 204 (no content) |
| Ambiente de desenvolvimento | Pode logar o token no console |
| Ambiente de producao | Envie o token por email, nunca logue |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `throw new NotFoundError('User not found')` no recover | `return reply.status(201).send()` |
| `await prisma.user.update({ data: { password } })` | `await prisma.user.update({ data: { passwordHash: await hash(password, 6) } })` |
| Recover e reset na mesma rota | Duas rotas separadas: `/password/recover` e `/password/reset` |
| `return reply.status(200).send({ token })` no recover | `return reply.status(201).send()` (nunca exponha o token na response) |
| Reset sem validar o token | `if (!tokenFromCode) throw new UnauthorizedError()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-rota-troca-de-senha/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-rota-troca-de-senha/references/code-examples.md)
