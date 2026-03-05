# Code Examples: Hash de Senha e Validação

## Setup inicial

### Instalação do bcryptjs

```bash
npm i bcryptjs
npm i -D @types/bcryptjs
```

O bcryptjs não é escrito em TypeScript, então os types precisam ser instalados separadamente como devDependency.

### Import

```typescript
import { hash } from 'bcryptjs'
```

## Exemplo completo da aula — Controller de registro

### Antes (senha em plaintext, sem validação)

```typescript
app.post('/users', async (request, reply) => {
  const { name, email, password } = request.body

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password, // PERIGO: senha salva sem hash
    },
  })

  return reply.status(201).send()
})
```

Problemas:
- Senha salva em texto puro no banco
- Email duplicado causa erro 500 genérico
- Nenhuma proteção contra cadastro duplicado

### Depois (com hash e validação de unicidade)

```typescript
import { hash } from 'bcryptjs'

app.post('/users', async (request, reply) => {
  const { name, email, password } = request.body

  // 1. Validar unicidade do email
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (userWithSameEmail) {
    return reply.status(409).send()
  }

  // 2. Gerar hash da senha (6 rounds)
  const passwordHash = await hash(password, 6)

  // 3. Criar usuário com senha hasheada
  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
  })

  return reply.status(201).send()
})
```

## Hash com diferentes rounds

```typescript
// 6 rounds — padrão para maioria das apps web (cadastro)
const passwordHash = await hash(password, 6)

// 10 rounds — mais seguro, mais lento
const passwordHash = await hash(password, 10)

// 12 rounds — muito seguro, visivelmente mais lento
const passwordHash = await hash(password, 12)
```

**Regra prática:** Para operações infrequentes (cadastro), 6 é suficiente. Para operações críticas em apps com poucos usuários, pode aumentar.

## Resultado do hash no banco de dados

O hash gerado pelo bcrypt tem este formato:

```
$2a$06$K5YzWGqM8kV7xKPqL1bRQOg3GfxCz5Qw9vN2kL8mJ7pN6rT4hS2Wy
```

Componentes:
- `$2a$` — identificador do algoritmo bcrypt
- `06$` — número de rounds usado
- Restante — salt + hash combinados

## Validação com findUnique do Prisma

```typescript
// findUnique SÓ funciona com campos @unique ou @id
// No schema:
// model User {
//   id    String @id @default(uuid())
//   email String @unique
//   ...
// }

// Por isso no where só aparece id ou email:
const user = await prisma.user.findUnique({
  where: { email }, // OK — campo @unique
})

const user = await prisma.user.findUnique({
  where: { id }, // OK — campo @id
})

// NÃO funciona com campos sem @unique:
// where: { name } // ERRO — name não é @unique
```

## Preview: Comparação no login (mencionado pelo instrutor)

```typescript
import { compare } from 'bcryptjs'

// No futuro, no endpoint de login:
const doesPasswordMatch = await compare(
  passwordFromLogin, // senha que o usuário digitou
  user.password_hash  // hash salvo no banco
)

if (!doesPasswordMatch) {
  return reply.status(401).send()
}
```

O `compare()` gera o hash da senha informada e compara internamente com o hash salvo. Não há reversão.