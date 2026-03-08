---
name: rs-full-stack-finalizando-retorno-do-usuario
description: "Enforces secure user data return patterns when building authentication endpoints that return user info with tokens. Use when user asks to 'return user data', 'send token response', 'exclude password from response', 'structure auth response', or 'login endpoint response'. Applies destructuring to strip sensitive fields and structure clean API responses. Make sure to use this skill whenever implementing login/auth endpoints that return user profiles. Not for token generation logic, password hashing, or frontend auth state management."
---

# Finalizando Retorno do Usuário

> Ao retornar dados do usuário em endpoints de autenticação, sempre separe campos sensíveis via destructuring e estruture a resposta para facilitar integração com o front-end.

## Rules

1. **Nunca retorne o password na resposta** — destructure para separar `hashedPassword` do restante, porque vazamento de hash é vulnerabilidade direta
2. **Nomeie o campo excluído de forma explícita** — `hashedPassword` não `password`, porque clarifica que é o hash sendo removido e evita confusão com o input do usuário
3. **Agrupe dados do usuário sob uma chave `user`** — `{ token, user }` não `{ token, id, name, email }`, porque separa autenticação de dados de perfil e facilita tipagem no front-end
4. **Use rest operator para coletar campos seguros** — `const { hashedPassword, ...userWithoutPassword } = user`, porque é extensível automaticamente quando novos campos são adicionados

## How to write

### Destructuring para excluir senha

```typescript
const { password: hashedPassword, ...userWithoutPassword } = user

return response.status(200).json({
  token,
  user: userWithoutPassword,
})
```

### Resposta flat (alternativa)

```typescript
// Alternativa: tudo no mesmo nível (menos recomendado)
return response.status(200).json({
  token,
  ...userWithoutPassword,
})
```

## Example

**Before (expondo senha):**
```typescript
const user = await findUserByEmail(email)
const token = generateToken(user.id)

return response.json({ token, user })
// Retorna: { token: "...", user: { id, name, email, password: "$2b$..." } }
```

**After (com esta skill aplicada):**
```typescript
const user = await findUserByEmail(email)
const token = generateToken(user.id)

const { password: hashedPassword, ...userWithoutPassword } = user

return response.json({ token, user: userWithoutPassword })
// Retorna: { token: "...", user: { id, name, email } }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Endpoint retorna user após login | Sempre destructure para remover password |
| Front-end espera dados agrupados | Use `{ token, user: {...} }` |
| Front-end espera dados flat | Use `{ token, ...userWithoutPassword }` |
| Múltiplos campos sensíveis | Destructure todos: `{ password, resetToken, ...safe } = user` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `return res.json({ token, user })` (com password) | `const { password, ...safe } = user; return res.json({ token, user: safe })` |
| `delete user.password; return res.json(user)` | `const { password, ...userWithoutPassword } = user` (não muta o objeto original) |
| `user.password = undefined` | Destructuring com rest operator |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre estruturação de respostas de auth e trade-offs entre flat vs agrupado
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações