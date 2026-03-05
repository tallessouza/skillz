# Code Examples: Principios da Autenticacao JWT

## Estrutura do controller de profile

O instrutor cria um controller minimo para a rota `/me`:

```typescript
// src/http/controllers/profile.ts
import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  // Por enquanto, apenas retorna 200
  // Sera implementado com verificacao JWT na proxima aula
  return reply.status(200).send()
}
```

## Registro das rotas com separacao publica/protegida

```typescript
// src/http/routes.ts
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'

export async function appRoutes(app: FastifyInstance) {
  // Rotas publicas
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Rotas protegidas (requerem autenticacao)
  app.get('/me', profile)
}
```

## Base64 encoding/decoding (demonstracao do instrutor)

O instrutor demonstra no terminal como Basic Auth funciona:

```bash
# Encoding (cliente envia isso)
echo -n "diego@rocketseat.com:123456" | base64
# Output: ZGllZ29Acm9ja2V0c2VhdC5jb206MTIzNDU2

# Decoding (backend recupera credenciais)
echo "ZGllZ29Acm9ja2V0c2VhdC5jb206MTIzNDU2" | base64 --decode
# Output: diego@rocketseat.com:123456
```

## Anatomia completa de um JWT (do jwt.io)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.    ← Header (algoritmo + tipo)
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik   ← Payload (dados do usuario)
RpZWdvIEZlcm5hbmRlcyIsImlhdCI6MTUxNjIz
OTAyMn0.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQ  ← Assinatura (HMAC da chave secreta)
ssw5c
```

Decodificando:

```json
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "sub": "1234567890",
  "name": "Diego Fernandes",
  "iat": 1516239022
}

// Assinatura = HMACSHA256(
//   base64UrlEncode(header) + "." + base64UrlEncode(payload),
//   "minha-chave-secreta-super-complexa"
// )
```

## Exemplo de chave secreta (conselho do instrutor)

```env
# .env
# "Bata a cabeca no teclado" — quanto mais aleatoria, melhor
JWT_SECRET=asjdkl23jk4h5jk2h345kjh2jk34h5kjh23k4j5h2k3j4h5
```

## Headers de autenticacao comparados

```http
# Basic Auth (envia credenciais em toda requisicao)
Authorization: Basic ZGllZ29Acm9ja2V0c2VhdC5jb206MTIzNDU2

# JWT Bearer (envia token gerado no login)
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Fluxo completo ilustrado

```
Cliente                          Backend
  |                                |
  |-- POST /sessions ------------->|
  |   { email, senha }            |
  |                                |-- Valida credenciais no banco
  |                                |-- Gera JWT com sub = userId
  |<-- { token: "eyJhbG..." } ----|
  |                                |
  |-- GET /me -------------------->|
  |   Authorization: Bearer eyJ... |
  |                                |-- Valida assinatura com secret
  |                                |-- Extrai sub do payload
  |<-- { user: { id, name, ... } }|
```