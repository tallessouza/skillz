# Code Examples: Token do Usuário — JWT e Exclusão de Dados Sensíveis

## Exemplo 1: Arquivo de configuração de auth

```typescript
// src/configs/auth.ts
export const authConfig = {
  jwt: {
    secret: "meu-nome-ou-chave-secreta",
    expiresIn: "1d", // 1 dia
  },
};
```

### Variação com variável de ambiente (produção)

```typescript
// src/configs/auth.ts
export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || "fallback-dev-only",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
};
```

## Exemplo 2: Instalação das dependências

```bash
# Instala jsonwebtoken com versão fixa
npm i jsonwebtoken@9.0.2

# Instala tipagem como devDependency
npm i @types/jsonwebtoken@9.0.7 -D
```

## Exemplo 3: Imports organizados no controller/session

```typescript
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";
import { prisma } from "@/database/prisma";
```

O instrutor organiza em "escadinha" por domínio: configs → libs externas → internal.

## Exemplo 4: Geração do token (código completo da aula)

```typescript
// Após verificar que a senha bate...
const { secret, expiresIn } = authConfig.jwt;

const token = sign({ role: user.role }, secret, {
  subject: user.id,
  expiresIn,
});
```

### Passo a passo:
1. Desestrutura `secret` e `expiresIn` da config centralizada
2. Chama `sign()` com:
   - Payload: `{ role: user.role }` — claim customizado com a role do usuário
   - Secret: chave para assinar o token
   - Options: `subject` = ID do usuário, `expiresIn` = tempo de validade

## Exemplo 5: Exclusão de password com destructuring

```typescript
// Separa password do restante
const { password, ...userWithoutPassword } = user;

// Retorna token + dados seguros
return { token, user: userWithoutPassword };
```

### O que o Insomnia mostra ANTES (com password):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": "uuid-123",
    "name": "João",
    "email": "joao@email.com",
    "password": "$2b$10$hash...",
    "role": "member"
  }
}
```

### O que o Insomnia mostra DEPOIS (sem password):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": "uuid-123",
    "name": "João",
    "email": "joao@email.com",
    "role": "member"
  }
}
```

## Exemplo 6: Excluindo múltiplos campos sensíveis

```typescript
// Se tiver mais campos sensíveis
const { password, cpf, ...safeUser } = user;

return { token, user: safeUser };
```

## Exemplo 7: Fluxo completo de um endpoint de autenticação

```typescript
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";
import { prisma } from "@/database/prisma";
import { compare } from "bcrypt";
import { Request, Response } from "express";

export class SessionsController {
  async create(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return response.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      return response.status(401).json({ message: "Invalid credentials" });
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.json({ token, user: userWithoutPassword });
  }
}
```

### Notas sobre o exemplo completo:
- `password: _` renomeia a variável extraída para `_` (convenção para "descartável")
- O fluxo segue: buscar usuário → validar senha → gerar token → excluir sensíveis → retornar
- As mensagens de erro são genéricas ("Invalid credentials") para não revelar se o email existe ou não

## Exemplo 8: Variações de expiração

```typescript
// Diferentes tempos de expiração
const configs = {
  shortLived: { expiresIn: "15m" },   // 15 minutos (access token)
  medium: { expiresIn: "1d" },         // 1 dia (padrão da aula)
  longLived: { expiresIn: "7d" },      // 7 dias (refresh token)
  numeric: { expiresIn: 3600 },        // 1 hora em segundos
};
```

## Exemplo 9: Verificação do token (próximo passo)

```typescript
import { verify } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";

// Em um middleware de autenticação
const { subject } = verify(token, authConfig.jwt.secret) as { subject: string };
// subject contém o user.id que foi passado na geração
```