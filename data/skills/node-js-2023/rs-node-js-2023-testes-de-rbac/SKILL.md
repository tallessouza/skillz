---
name: rs-node-js-2023-testes-de-rbac
description: "Applies RBAC test fixing patterns when writing or fixing end-to-end tests that break after adding role-based access control. Use when user asks to 'fix broken tests after RBAC', 'add admin role to test user', 'create authenticated test user with role', or 'tests failing 401 after authorization'. Ensures test helpers create users with correct roles via direct database insertion instead of API routes. Make sure to use this skill whenever tests fail due to missing role/permission context. Not for implementing RBAC middleware, designing role systems, or unit testing use cases."
---

# Testes de RBAC

> Quando testes quebram apos adicionar RBAC, corrija o helper de criacao de usuario para suportar roles via insercao direta no banco, nao pela rota da API.

## Rules

1. **Crie usuarios de teste via Prisma, nao via rota da API** — porque a rota de registro cria usuarios com role padrao (MEMBER), e testes de rotas admin precisam de usuarios admin
2. **Receba a role como parametro no helper** — `isAdmin: boolean = false`, porque cada teste precisa controlar o nivel de acesso do usuario
3. **Use hash real no password do helper** — `await hash('123456', 6)` com bcrypt, porque o fluxo de autenticacao precisa validar a senha corretamente
4. **Mantenha o email consistente** — o email usado na criacao deve ser o mesmo usado na autenticacao, porque o login busca por email
5. **Passe `true` apenas nos testes que precisam de admin** — testes de criacao de academia, validacao de check-in, porque o principio do menor privilegio se aplica tambem a testes

## How to write

### Helper de criacao e autenticacao com role

```typescript
export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
```

### Uso em teste que exige admin

```typescript
const { token } = await createAndAuthenticateUser(app, true)

await request(app.server)
  .post('/gyms')
  .set('Authorization', `Bearer ${token}`)
  .send({ name: 'JavaScript Gym', ... })
```

### Uso em teste que NAO exige admin

```typescript
const { token } = await createAndAuthenticateUser(app)
// isAdmin defaults to false — user is MEMBER
```

## Example

**Before (quebra apos RBAC):**
```typescript
export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body
  return { token }
}
```

**After (funciona com RBAC):**
```typescript
export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body
  return { token }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Teste de rota protegida por role admin | Passe `true` no helper: `createAndAuthenticateUser(app, true)` |
| Teste de rota acessivel por qualquer usuario autenticado | Use o default: `createAndAuthenticateUser(app)` |
| Teste cria recursos (academias) como pre-condicao | O usuario criador precisa ser admin se a rota de criacao exige admin |
| Testes retornam 401 apos adicionar middleware de role | Verifique se o helper esta passando a role correta |
| Teste precisa de multiplos usuarios com roles diferentes | Crie helpers separados ou parametrize email tambem |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar usuario de teste via rota POST /users quando precisa de role especifica | Criar via `prisma.user.create()` com role explicita |
| Hardcodar role ADMIN no helper para todos os testes | Receber `isAdmin` como parametro com default `false` |
| Usar senha em texto puro no campo `password_hash` | Usar `await hash('123456', 6)` do bcrypt |
| Ignorar testes quebrando apos RBAC e desativar middleware | Corrigir o helper para suportar a nova realidade de roles |
| Criar academia via Prisma para evitar o problema de role | Corrigir o usuario para ter permissao e testar o fluxo completo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
