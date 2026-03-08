# Code Examples: Build da Aplicação

## 1. Instalação do tsup

```bash
# Instalar tsup como dependência de desenvolvimento
npm i tsup -D

# Verificar instalação
npm ls tsup
```

Versão utilizada na aula: `tsup@8.3.0`. Em projetos novos, use a versão mais recente estável.

## 2. Configuração do package.json — Build básico

```jsonc
{
  "name": "meu-projeto",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup src"
  },
  "devDependencies": {
    "tsup": "^8.3.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

Saída padrão: pasta `dist/`.

## 3. Configuração com diretório customizado

```jsonc
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup src --out-dir build"
  }
}
```

Saída: pasta `build/` em vez de `dist/`.

## 4. Executando o build

```bash
# Gerar build
npm run build

# Verificar saída
ls dist/
# ou
ls build/

# Testar execução do JavaScript gerado
node dist/server.js
```

## 5. Exemplo de .gitignore

```gitignore
# Dependências
node_modules/

# Build output
dist/
build/

# Variáveis de ambiente
.env
```

## 6. Variações comuns do script de build

```jsonc
{
  "scripts": {
    // Build básico (saída em dist/)
    "build": "tsup src",

    // Build com pasta customizada
    "build": "tsup src --out-dir build",

    // Build com formato ESM
    "build": "tsup src --format esm",

    // Build com formato CJS e ESM
    "build": "tsup src --format cjs,esm",

    // Build com minificação
    "build": "tsup src --minify",

    // Build limpo (apaga pasta anterior antes)
    "build": "rm -rf dist && tsup src"
  }
}
```

## 7. Exemplo de arquivo convertido

**Antes (TypeScript) — `src/controllers/users-controller.ts`:**

```typescript
import { Request, Response } from 'express'
import { prisma } from '../prisma/client'

interface CreateUserBody {
  name: string
  email: string
}

export class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body as CreateUserBody

    const user = await prisma.user.create({
      data: { name, email }
    })

    return response.status(201).json(user)
  }
}
```

**Depois (JavaScript) — `dist/controllers/users-controller.js`:**

```javascript
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    // código auxiliar gerado pelo compilador
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const client_1 = require("../prisma/client");

class UsersController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email } = request.body;
            const user = yield client_1.prisma.user.create({
                data: { name, email }
            });
            return response.status(201).json(user);
        });
    }
}
exports.UsersController = UsersController;
```

Note que:
- Todas as tipagens (`Request`, `Response`, `CreateUserBody`, `: Promise<Response>`) foram removidas
- Código auxiliar foi adicionado (como `__awaiter`) para compatibilidade
- A estrutura lógica permanece a mesma

## 8. Uso em Dockerfile para deploy

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
EXPOSE 3333
CMD ["node", "dist/server.js"]
```