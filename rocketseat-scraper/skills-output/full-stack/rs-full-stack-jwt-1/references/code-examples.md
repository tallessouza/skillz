# Code Examples: JWT

## Gerando um JWT (Node.js com jsonwebtoken)

```typescript
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

// Gerar token após login bem-sucedido
function generateToken(userId: string, role: string): string {
  const payload = {
    sub: userId,
    role,
  }

  const token = jwt.sign(payload, secret, {
    expiresIn: '1h', // expira em 1 hora
  })

  return token
}
```

## Verificando um JWT

```typescript
import jwt from 'jsonwebtoken'

interface TokenPayload {
  sub: string
  role: string
  iat: number
  exp: number
}

function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload
  return decoded
}
```

## Middleware de autenticação (Express/Fastify)

```typescript
// Express middleware
function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided' })
  }

  const [, token] = authHeader.split(' ') // "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload
    req.userId = decoded.sub
    req.userRole = decoded.role
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
```

## Middleware de autorização (verificar permissão)

```typescript
function authorize(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Insufficient permissions' })
    }
    return next()
  }
}

// Uso:
app.delete('/users/:id', authenticate, authorize(['admin']), deleteUser)
```

## Fluxo completo de login

```typescript
app.post('/sessions', async (req, res) => {
  const { email, password } = req.body

  const user = await usersRepository.findByEmail(email)

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const passwordMatch = await compare(password, user.passwordHash)

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  return res.json({ token })
})
```

## Decodificando sem verificar (para debug)

```typescript
// jwt.decode NÃO verifica a signature — use apenas para debug
const decoded = jwt.decode(token)
console.log(decoded)
// { sub: "user-123", role: "admin", iat: 1700000000, exp: 1700003600 }
```

## Estrutura visual do token (da aula)

```
Token codificado:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│──────── HEADER ─────────│────────────── PAYLOAD ──────────────│──────── SIGNATURE ────────│

Token decodificado:
HEADER:  { "alg": "HS256", "typ": "JWT" }
PAYLOAD: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }
SIGNATURE: verificação HMAC-SHA256
```

## Variação: Fastify com @fastify/jwt

```typescript
import Fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'

const app = Fastify()

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
})

// Gerar token
app.post('/sessions', async (request, reply) => {
  // ... validar credenciais ...
  const token = await reply.jwtSign({ sub: user.id, role: user.role })
  return reply.send({ token })
})

// Verificar token via decorator
app.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
})

// Rota protegida
app.get('/me', { onRequest: [app.authenticate] }, async (request) => {
  const userId = request.user.sub
  // ...
})
```