# Code Examples: Autenticação e Autorização com JWT em Node.js

## Exemplo 1: Fluxo completo de autenticação

### Rota de login (autenticação)

```typescript
import { sign } from 'jsonwebtoken'
import { compare } from 'bcryptjs'

// POST /sessions — rota PÚBLICA (sem middleware de auth)
export async function authenticate(request, reply) {
  const { email, password } = request.body

  // 1. Buscar usuário
  const user = await usersRepository.findByEmail(email)

  if (!user) {
    return reply.status(401).send({ message: 'Invalid credentials.' })
  }

  // 2. Verificar senha
  const passwordMatch = await compare(password, user.passwordHash)

  if (!passwordMatch) {
    return reply.status(401).send({ message: 'Invalid credentials.' })
  }

  // 3. Gerar JWT
  const token = sign(
    { role: user.role },        // payload (claims)
    process.env.JWT_SECRET,     // chave secreta
    {
      subject: user.id,         // sub = userId
      expiresIn: '1d',          // expiração
    }
  )

  return reply.status(200).send({ token })
}
```

### Pontos importantes:
- Mensagem genérica "Invalid credentials" — nunca revele se o email existe ou não
- `subject` do JWT = userId (convenção padrão)
- Payload mínimo: apenas `role`, sem dados sensíveis

## Exemplo 2: Middleware de autorização

### Verificação de JWT (autorização - etapa 1: identidade)

```typescript
import { verify } from 'jsonwebtoken'

export async function verifyJWT(request, reply) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return reply.status(401).send({ message: 'Token missing.' })
  }

  // Bearer eyJhbGciOi...
  const [, token] = authHeader.split(' ')

  try {
    const decoded = verify(token, process.env.JWT_SECRET)

    // Injeta no request para uso nas rotas seguintes
    request.user = {
      id: decoded.sub,
      role: decoded.role,
    }
  } catch {
    return reply.status(401).send({ message: 'Invalid token.' })
  }
}
```

### Verificação de role (autorização - etapa 2: permissão)

```typescript
export function verifyRole(allowedRoles: string[]) {
  return async (request, reply) => {
    const { role } = request.user

    if (!allowedRoles.includes(role)) {
      return reply.status(403).send({ message: 'Insufficient permissions.' })
    }
  }
}
```

## Exemplo 3: Aplicando nas rotas

```typescript
import { verifyJWT } from './middlewares/verify-jwt'
import { verifyRole } from './middlewares/verify-role'

// Rotas PÚBLICAS — sem middleware
app.post('/users', registerController)
app.post('/sessions', authenticateController)

// Rotas que precisam de AUTENTICAÇÃO (qualquer usuário logado)
app.get('/me', { onRequest: [verifyJWT] }, profileController)
app.patch('/me', { onRequest: [verifyJWT] }, updateProfileController)

// Rotas que precisam de AUTORIZAÇÃO específica (role admin)
app.get('/users', { onRequest: [verifyJWT, verifyRole(['ADMIN'])] }, listUsersController)
app.delete('/users/:id', { onRequest: [verifyJWT, verifyRole(['ADMIN'])] }, deleteUserController)
```

### Padrão visual claro:
- Sem middleware = pública
- `verifyJWT` = precisa estar logado
- `verifyJWT` + `verifyRole` = precisa estar logado E ter permissão

## Exemplo 4: Header Authorization

```typescript
// Como o cliente envia o token
const response = await fetch('/me', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

O padrão é sempre `Bearer {token}` no header `Authorization`. Nunca envie o token no body ou query params (risco de log/cache expor o token).

## Variações comuns

### Com Fastify (decorators)

```typescript
// Registrar como decorator do Fastify
app.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
})

// Usar como preHandler
app.get('/me', { preHandler: [app.authenticate] }, profileController)
```

### Com Express (middleware clássico)

```typescript
// Middleware padrão Express
function verifyJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token missing.' })
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET)
    req.userId = decoded.sub
    req.userRole = decoded.role
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token.' })
  }
}

// Aplicar em rotas
router.get('/profile', verifyJWT, profileController)
router.delete('/users/:id', verifyJWT, verifyAdmin, deleteUserController)
```