---
name: rs-full-stack-criando-sessao
description: "Applies JWT session creation patterns when building authentication login endpoints in Node.js/Express. Use when user asks to 'create login', 'implement authentication', 'generate JWT token', 'create session endpoint', or 'build sign-in route'. Enforces proper credential validation, secure error messages, JWT signing with config-based secrets, and token response structure. Make sure to use this skill whenever implementing login or session creation logic. Not for registration, password reset, middleware guards, or token refresh flows."
---

# Criando Sessão com JWT

> Ao implementar login, valide credenciais sem revelar qual campo está errado e retorne um JWT assinado com secret e expiração externalizados.

## Rules

1. **Nunca revele qual campo está errado** — retorne "Usuário e/ou senha incorreta" genérico, porque mensagens específicas facilitam ataques de enumeração
2. **Externalize secret e expiresIn** — coloque em arquivo de configuração (authConfig), nunca hardcoded no controller, porque facilita rotação e evita vazamento em commits
3. **Use subject para o ID do usuário** — passe o userId como `sub` no JWT, porque é o claim padrão para identificar o dono do token
4. **Converta ID para string** — `String(user.id)` no subject, porque o JWT spec espera string no claim sub
5. **Retorne apenas o token** — o endpoint de login retorna `{ token }`, porque o frontend só precisa do token para autenticação subsequente
6. **Status 401 para credenciais inválidas** — nunca 400 ou 403, porque 401 Unauthorized é o código semanticamente correto

## How to write

### Controller de sessão

```typescript
import { sign } from "jsonwebtoken"
import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/AppError"

class SessionsController {
  async create(request, response) {
    const { username, password } = request.body

    // Simula busca no banco (substituir por query real)
    const user = await usersRepository.findByUsername(username)

    if (!user || user.password !== password) {
      throw new AppError("Usuário e/ou senha incorreta", 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    })

    return response.json({ token })
  }
}
```

## Example

**Before (inseguro e acoplado):**
```typescript
async create(req, res) {
  const { email, password } = req.body
  const user = await db.find(email)
  if (!user) return res.status(400).json({ error: "Email não encontrado" })
  if (user.password !== password) return res.status(400).json({ error: "Senha incorreta" })
  const token = sign({ id: user.id }, "minha-secret-hardcoded", { expiresIn: "1d" })
  return res.json({ user, token })
}
```

**After (com esta skill):**
```typescript
async create(req, res) {
  const { username, password } = req.body
  const user = await usersRepository.findByUsername(username)

  if (!user || user.password !== password) {
    throw new AppError("Usuário e/ou senha incorreta", 401)
  }

  const { secret, expiresIn } = authConfig.jwt

  const token = sign({}, secret, {
    subject: String(user.id),
    expiresIn,
  })

  return res.json({ token })
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Login por email ou username | Mesma lógica, apenas mude o campo de busca |
| Payload do JWT | Vazio por padrão — adicione claims só quando necessário |
| Cada login gera token novo | Correto — não reutilize tokens anteriores |
| Senha em produção | Substitua comparação direta por `bcrypt.compare()` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `"Email não encontrado"` | `"Usuário e/ou senha incorreta"` |
| `sign({}, "secret-hardcoded")` | `sign({}, authConfig.jwt.secret)` |
| `sign({ id: user.id }, ...)` | `sign({}, secret, { subject: String(user.id) })` |
| `res.status(400)` para login | `throw new AppError("...", 401)` |
| Retornar dados do usuário no login | Retornar apenas `{ token }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre segurança de mensagens de erro e arquitetura JWT
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-sessao/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-sessao/references/code-examples.md)
