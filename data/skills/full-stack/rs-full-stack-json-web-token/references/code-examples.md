# Code Examples: Configuração de JSON Web Token

## 1. Instalação completa

```bash
# Terminal 1: servidor rodando
# Terminal 2: instalações

# Pacote principal (dependência de produção)
npm install jsonwebtoken@9.0.2

# Tipagem TypeScript (dependência de desenvolvimento)
npm install -D @types/jsonwebtoken@9.0.6
```

## 2. Arquivo de configuração (como na aula)

```typescript
// src/configs/auth.ts
export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || "default",
    expiresIn: "1d",
  },
}
```

## 3. Variação: com validação em produção

```typescript
// src/configs/auth.ts
const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be defined in production")
}

export const authConfig = {
  jwt: {
    secret: jwtSecret || "dev-default-secret",
    expiresIn: "1d",
  },
}
```

## 4. Variação: múltiplas durações por contexto

```typescript
// src/configs/auth.ts
export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || "default",
    expiresIn: "1d",
    refreshExpiresIn: "7d",
  },
}
```

## 5. Uso do config ao gerar token

```typescript
import jwt from "jsonwebtoken"
import { authConfig } from "@/configs/auth"

function generateToken(userId: string) {
  const token = jwt.sign(
    { sub: userId },
    authConfig.jwt.secret,
    { expiresIn: authConfig.jwt.expiresIn }
  )
  return token
}
```

## 6. Uso do config ao verificar token

```typescript
import jwt from "jsonwebtoken"
import { authConfig } from "@/configs/auth"

function verifyToken(token: string) {
  const decoded = jwt.verify(token, authConfig.jwt.secret)
  return decoded
}
```

## 7. Variável de ambiente no .env

```env
# .env
JWT_SECRET=minha-chave-secreta-super-segura
```

## 8. Estrutura de pastas completa

```
src/
├── configs/
│   └── auth.ts          # Configuração JWT
├── controllers/
├── routes/
├── middlewares/
└── server.ts
```