# Code Examples: Prisma Studio

## Comando basico

```bash
# Abrir Prisma Studio (porta padrao 5555)
npx prisma studio
```

Saida esperada:
```
Prisma Studio is up on http://localhost:5555
```

## Porta customizada

```bash
# Se 5555 estiver ocupada
npx prisma studio --port 5556
```

## Fluxo completo de verificacao

```bash
# 1. Aplicar migration
npx prisma migrate dev --name add-user-model

# 2. Gerar client (se necessario)
npx prisma generate

# 3. Abrir Studio para verificar
npx prisma studio
```

## Exemplo de schema referenciado na aula

```prisma
// schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
}
```

No Prisma Studio, este modelo aparece como "User" na lista de modelos, com colunas id, name e email visiveis na interface.

## Usando em paralelo com desenvolvimento

Terminal 1 (desenvolvimento):
```bash
npm run dev
```

Terminal 2 (Prisma Studio):
```bash
npx prisma studio
```

Manter ambos rodando simultaneamente permite verificar o banco em tempo real enquanto desenvolve.

## Script de seed para dados reproduziveis (alternativa ao insert manual)

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

```bash
# Executar seed
npx prisma db seed

# Verificar no Prisma Studio
npx prisma studio
```