---
name: rs-seguranca-devs-reset-senha-user-enum
description: "Enforces secure password reset implementation that prevents user enumeration attacks. Use when user asks to 'implement password reset', 'forgot password flow', 'reset password endpoint', 'password recovery', or any authentication recovery feature. Applies rules: consistent responses regardless of user existence, timing attack prevention with fixed-duration responses, no information leakage via status codes or headers. Make sure to use this skill whenever building any password reset or account recovery flow. Not for login authentication, password hashing, or session management."
---

# Reset de Senha Seguro e Prevencao de User Enumeration

> Ao implementar reset de senha, garantir que a resposta seja identica em conteudo e tempo, independente de o usuario existir ou nao.

## Rules

1. **Resposta identica para usuario existente e inexistente** — retorne sempre a mesma mensagem, status code, headers e cookies, porque qualquer diferenca permite que atacantes descubram quais emails estao cadastrados (user enumeration)
2. **Tempo de resposta consistente** — force um tempo fixo de resposta usando delay calculado, porque ataques baseados em tempo (timing attacks) deduzem informacao interna pela diferenca de duracao
3. **Nunca retorne status codes diferentes** — use 200 para ambos os casos, porque 404 para "email nao encontrado" revela que o email nao existe no sistema
4. **Mensagem ambigua proposital** — use texto como "Se este email estiver cadastrado, voce recebera um link", porque confirmar ou negar existencia do email e uma vulnerabilidade
5. **Meca o tempo desde o inicio da funcao** — capture `start` antes de qualquer operacao (incluindo queries), porque diferencas no tempo de query tambem vazam informacao
6. **O delay fixo nao prejudica UX** — reset de senha e operacao rara e seguida de abrir email, 1-2 segundos extras sao imperceptiveis para o usuario

## How to write

### Endpoint de reset com protecao temporal

```typescript
app.post('/reset-password', async (req, res) => {
  const start = Date.now()

  const { email } = req.body
  const user = await getUserByEmail(email)

  if (user) {
    const token = generateSecureToken()
    await setUserResetToken(user.id, token)
    await sendResetEmail(email, token)
  }

  // Garantir tempo consistente independente do caminho
  const elapsed = Date.now() - start
  const TARGET_MS = 1500
  if (elapsed < TARGET_MS) {
    await sleep(TARGET_MS - elapsed)
  }

  // Mesma resposta SEMPRE
  res.status(200).json({
    message: 'Se este email estiver cadastrado, voce recebera um link para redefinir sua senha.'
  })
})
```

### Funcao sleep auxiliar

```typescript
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

## Example

**Before (vulneravel a user enumeration):**
```typescript
app.post('/reset-password', async (req, res) => {
  const user = await getUserByEmail(req.body.email)

  if (user) {
    const token = generateToken()
    await setResetToken(user.id, token)
    await sendEmail(user.email, token)
    return res.status(200).json({ message: 'Password reset email sent' })
  }

  // PROBLEMA 1: Status code diferente revela que email nao existe
  // PROBLEMA 2: Mensagem diferente confirma inexistencia
  // PROBLEMA 3: Tempo de resposta diferente (sem envio de email = rapido)
  return res.status(404).json({ message: 'Email not found' })
})
```

**After (seguro contra user enumeration):**
```typescript
app.post('/reset-password', async (req, res) => {
  const start = Date.now()
  const { email } = req.body
  const user = await getUserByEmail(email)

  if (user) {
    const token = generateSecureToken()
    await setResetToken(user.id, token)
    await sendEmail(user.email, token)
  }

  const elapsed = Date.now() - start
  if (elapsed < 1500) {
    await sleep(1500 - elapsed)
  }

  res.status(200).json({
    message: 'Se este email estiver cadastrado, voce recebera um link para redefinir sua senha.'
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint de reset de senha | Sempre aplicar tempo fixo + resposta unica |
| Qualquer endpoint que revela existencia de usuario | Aplicar mesma tecnica (ex: invite, compartilhamento) |
| Target de tempo fixo | 1-2 segundos e seguro — usuario vai abrir email depois |
| Operacao pode exceder o target | Usar `if (elapsed < TARGET)` para so dormir quando necessario |
| Headers e cookies | Verificar que sao identicos em ambos os caminhos |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `res.status(404).json({ message: 'Email not found' })` | `res.status(200).json({ message: 'Se este email estiver cadastrado...' })` |
| `if (!user) return res.json({ error: 'User not found' })` | Mesmo bloco de resposta para ambos os caminhos |
| Retorno imediato quando usuario nao existe | `sleep(TARGET - elapsed)` antes de retornar |
| `Math.random()` para gerar tokens de reset | `crypto.randomBytes()` ou equivalente seguro |
| Medir tempo so apos a query | `const start = Date.now()` na primeira linha da funcao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-sobre-reset-de-senha-e-user-enumeration/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-sobre-reset-de-senha-e-user-enumeration/references/code-examples.md)
