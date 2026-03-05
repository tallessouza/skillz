---
name: rs-seguranca-devs-nosql-injection
description: "Guards against NoSQL Injection vulnerabilities when writing MongoDB or NoSQL database queries. Use when user asks to 'query MongoDB', 'authenticate users', 'build login', 'connect to NoSQL database', or any code that passes user input to NoSQL operations. Enforces input type validation before database queries to prevent operator injection ($regex, $gt, $ne). Make sure to use this skill whenever writing NoSQL query code that receives external input. Not for SQL databases, ORM configuration, or general input sanitization unrelated to database queries."
---

# NoSQL Injection Prevention

> Valide o tipo de toda entrada antes de passa-la para uma query NoSQL, porque operadores como `$regex`, `$gt` e `$ne` podem ser injetados via objetos onde strings eram esperadas.

## Rules

1. **Valide tipos antes da query** — verifique que cada parametro e do tipo esperado (string, number) antes de usar em `find()`, `findOne()`, etc., porque um objeto `{ $regex: "." }` no lugar de uma string bypassa qualquer filtro
2. **Nunca confie que a entrada e string** — APIs REST parsam JSON automaticamente, entao `{ "password": { "$regex": "." } }` chega como objeto, nao como string
3. **Force conversao de tipo** — use `String(email)` ou tipagem TypeScript para garantir que operadores MongoDB nao sejam injetados
4. **Seguranca em camadas** — valide na camada de API E na camada de query, porque uma camada pode falhar
5. **NoSQL nao e imune** — so porque SQL Injection e famoso, nao significa que bancos NoSQL sejam mais seguros; o mesmo tipo de problema existe

## How to write

### Funcao de login segura

```typescript
async function login(email: string, password: string) {
  // Forca tipos — impede que objetos com $regex/$gt passem
  const safeEmail = String(email)
  const safePassword = String(password)

  const user = await users.findOne({
    email: safeEmail,
    password: safePassword
  })

  return user
}
```

### Validacao explicita (JavaScript sem TypeScript)

```javascript
async function login(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') {
    return null
  }

  const user = await users.findOne({ email, password })
  return user
}
```

## Example

**Before (vulneravel a NoSQL Injection):**

```javascript
async function login(email, password) {
  // Nenhuma validacao — aceita objetos como { $regex: "." }
  const user = await users.findOne({ email, password })
  return user
}

// Atacante envia:
login("alice@example.com", { $regex: "." })
// MongoDB interpreta: senha que casa com qualquer caractere → login bem-sucedido
```

**After (com validacao de tipo):**

```javascript
async function login(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') {
    return null
  }

  const user = await users.findOne({ email, password })
  return user
}

// Atacante envia:
login("alice@example.com", { $regex: "." })
// typeof { $regex: "." } !== 'string' → retorna null
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Input vem de API REST (JSON body) | Sempre validar tipos — JSON parse transforma objetos automaticamente |
| Usando TypeScript | Tipar parametros como `string` ja protege em compile-time, mas adicione validacao runtime tambem |
| Query com campos do usuario | Forcar `String()` em cada campo antes de montar a query |
| Banco NoSQL qualquer (nao so MongoDB) | Mesma regra: validar entradas, operadores de query podem ser injetados |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `users.findOne({ email, password })` sem validacao | `if (typeof email !== 'string') return null` antes da query |
| Confiar que "NoSQL nao tem injection" | Tratar NoSQL com a mesma seriedade que SQL |
| Validar so na camada de API | Validar na API E na camada de dados (seguranca em camadas) |
| `users.findOne({ email: req.body.email })` direto | `users.findOne({ email: String(req.body.email) })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
