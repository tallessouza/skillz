# Code Examples: Cadastrando Usuário no Banco

## Instalação das dependências

```bash
# Bcrypt para criptografia de senha
npm i bcrypt@5.1.1

# Tipagem do bcrypt (devDependency)
npm i @types/bcrypt@5.0.2 -D
```

## Exemplo completo do controller de cadastro

```typescript
import { Request, Response } from "express"
import { z } from "zod"
import { hash } from "bcrypt"

import prisma from "@/database/prisma"
import { AppError } from "@/utils/AppError"

export async function usersCreate(req: Request, res: Response) {
  // Validação com Zod (vinda da aula anterior)
  const bodySchema = z.object({
    name: z.string().trim().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["employee", "admin"]).default("employee")
  })

  const { name, email, password, role } = bodySchema.parse(req.body)

  // Verificação de e-mail duplicado
  const userWithSameEmail = await prisma.user.findFirst({
    where: { email }
  })

  if (userWithSameEmail) {
    throw new AppError("Já existe um usuário cadastrado com esse e-mail")
  }

  // Criptografia da senha
  const hashedPassword = await hash(password, 8)

  // Criação do usuário
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    }
  })

  return res.status(201).end()
}
```

## Verificação de duplicidade — variações

### Com findFirst (abordagem do instrutor)
```typescript
const userWithSameEmail = await prisma.user.findFirst({
  where: { email }
})

if (userWithSameEmail) {
  throw new AppError("Já existe um usuário cadastrado com esse e-mail")
}
```

### Com findUnique (alternativa quando email é @unique no schema)
```typescript
const userWithSameEmail = await prisma.user.findUnique({
  where: { email }
})

if (userWithSameEmail) {
  throw new AppError("Já existe um usuário cadastrado com esse e-mail")
}
```

### Com count (mais leve, não carrega dados)
```typescript
const emailCount = await prisma.user.count({
  where: { email }
})

if (emailCount > 0) {
  throw new AppError("Já existe um usuário cadastrado com esse e-mail")
}
```

## Bcrypt — exemplos de uso

### Hash básico (da aula)
```typescript
import { hash } from "bcrypt"

const hashedPassword = await hash(password, 8)
// Resultado: "$2b$08$K4r3j8h5..."
```

### Erro comum: esquecer o await
```typescript
// ERRADO — retorna Promise, não string
const hashedPassword = hash(password, 8)
console.log(hashedPassword) // Promise { <pending> }

// CORRETO — retorna a string do hash
const hashedPassword = await hash(password, 8)
console.log(hashedPassword) // "$2b$08$K4r3j8h5..."
```

### Comparação de senha (usado no login, aula futura)
```typescript
import { compare } from "bcrypt"

const passwordMatch = await compare(plainPassword, hashedPassword)
// true ou false
```

## Criação do usuário — variações

### Criação simples (da aula)
```typescript
await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    role
  }
})

return res.status(201).end()
```

### Criação retornando dados (sem a senha)
```typescript
const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    role
  },
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    created_at: true
  }
})

return res.status(201).json(user)
```

### Criação com omit (Prisma 5.16+)
```typescript
const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    role
  },
  omit: {
    password: true
  }
})

return res.status(201).json(user)
```

## Testando no Insomnia/Thunder Client

### Request
```
POST http://localhost:3333/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "role": "employee"
}
```

### Response esperada
```
Status: 201 Created
Body: (vazio)
```

### Tentando cadastrar mesmo e-mail novamente
```
Status: 400 Bad Request (ou o status que AppError define)
Body: {
  "message": "Já existe um usuário cadastrado com esse e-mail"
}
```

## Verificando no banco de dados

Após cadastro bem-sucedido, a tabela `user` deve conter:

| id | name | email | password | role |
|----|------|-------|----------|------|
| uuid... | João Silva | joao@email.com | $2b$08$K4r3... | employee |

A senha aparece como hash bcrypt — nunca como texto plano.