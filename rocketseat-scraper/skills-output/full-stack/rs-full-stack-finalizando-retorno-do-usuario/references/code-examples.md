# Code Examples: Finalizando Retorno do Usuário

## Exemplo do instrutor — Destructuring e retorno

O instrutor parte de um endpoint de autenticação que já recuperou o usuário do banco e gerou o token. O passo final é estruturar a resposta.

### Passo 1: Destructuring para separar senha

```typescript
// O usuário vem do banco com todos os campos, incluindo password
const user = await findUserByEmail(email)

// Renomeia password para hashedPassword (clareza) e coleta o resto
const { password: hashedPassword, ...userWithoutPassword } = user
```

### Passo 2: Retorno agrupado (escolha do instrutor)

```typescript
return response.status(200).json({
  token,
  user: userWithoutPassword,
})
```

**Resultado no Insomnia/Postman:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "c3a2f1e0-...",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

### Passo 2 (alternativa): Retorno flat

```typescript
return response.status(200).json({
  token,
  ...userWithoutPassword,
})
```

**Resultado:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "c3a2f1e0-...",
  "name": "João Silva",
  "email": "joao@email.com"
}
```

## Variação: Múltiplos campos sensíveis

Quando o modelo de usuário tem mais campos sensíveis:

```typescript
const {
  password: hashedPassword,
  resetToken,
  refreshTokenHash,
  ...userWithoutSensitiveData
} = user

return response.json({
  token,
  user: userWithoutSensitiveData,
})
```

## Variação: Com Knex/Prisma — Select específico

Alternativa ao destructuring: buscar apenas os campos necessários direto do banco.

### Com Knex
```typescript
const user = await knex('users')
  .select('id', 'name', 'email')
  .where({ email })
  .first()
```

### Com Prisma
```typescript
const user = await prisma.user.findUnique({
  where: { email },
  select: { id: true, name: true, email: true },
})
```

Neste caso, o password nem chega ao código da aplicação — é filtrado no nível da query. Mas o instrutor escolheu o approach de destructuring porque é mais didático e funciona independente do ORM.

## Variação: Endpoint completo de sessão

Contexto completo de como o endpoint fica na prática:

```typescript
// sessions.controller.ts
async function create(request, response) {
  const { email, password } = request.body

  const user = await knex('users').where({ email }).first()

  if (!user) {
    return response.status(401).json({ error: 'Invalid credentials' })
  }

  const passwordMatch = await compare(password, user.password)

  if (!passwordMatch) {
    return response.status(401).json({ error: 'Invalid credentials' })
  }

  const token = sign({}, SECRET, {
    subject: String(user.id),
    expiresIn: '1d',
  })

  const { password: hashedPassword, ...userWithoutPassword } = user

  return response.json({
    token,
    user: userWithoutPassword,
  })
}
```

## Variação: TypeScript com tipos explícitos

```typescript
interface User {
  id: string
  name: string
  email: string
  password: string
}

type UserWithoutPassword = Omit<User, 'password'>

function excludePassword(user: User): UserWithoutPassword {
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Uso
const safeUser = excludePassword(user)
return response.json({ token, user: safeUser })
```