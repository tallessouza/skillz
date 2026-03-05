# Code Examples: API de Entregas — Setup Inicial

> Nota: Esta aula eh introdutoria e nao contem codigo. Os exemplos abaixo sao configuracoes iniciais tipicas da stack mencionada, preparando para as proximas aulas.

## Docker Compose para Postgres

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: delivery-api
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Prisma Schema inicial

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Models serao definidos nas proximas aulas
```

## Zod — Exemplo de validacao de entrada

```typescript
import { z } from 'zod'

// Schema para criacao de um pedido
const createOrderSchema = z.object({
  customerName: z.string().min(1),
  deliveryAddress: z.string().min(5),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
})

// Tipo inferido automaticamente
type CreateOrderInput = z.infer<typeof createOrderSchema>
```

## Variavel de ambiente

```env
# .env
DATABASE_URL="postgresql://docker:docker@localhost:5432/delivery-api"
```

## Package.json — dependencias tipicas

```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "fastify": "^4.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```