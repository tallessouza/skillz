---
name: rs-full-stack-seed
description: "Generates Prisma seed files and configuration when user asks to 'seed the database', 'populate tables', 'create test data', 'insert initial data', or 'setup seed script'. Applies Prisma createMany pattern with proper async/disconnect flow and package.json configuration. Make sure to use this skill whenever setting up database seeding with Prisma ORM. Not for migrations, schema changes, or non-Prisma ORMs."
---

# Prisma Database Seed

> Crie arquivos de seed usando `createMany` com desconexao graceful e configuracao no package.json.

## Prerequisites

- Prisma ORM configurado com `PrismaClient` instanciado
- Schema com pelo menos um model definido
- `tsx` instalado como devDependency (para executar .ts diretamente)
- Se `tsx` nao disponivel: use `ts-node` como alternativa

## Steps

### Step 1: Criar arquivo de seed

Criar `prisma/seed.ts`:

```typescript
import { prisma } from '../src/lib/prisma'

async function seed() {
  await prisma.user.createMany({
    data: [
      { name: 'Mike Brito', email: 'mike@email.com' },
      { name: 'Diego Fernandes', email: 'diego@email.com' },
    ],
  })
}

seed()
  .then(() => {
    console.log('Database seeded')
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### Step 2: Configurar package.json

Adicionar no `package.json` (fora de `scripts`, no nivel raiz):

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### Step 3: Executar

```bash
npx prisma db seed
```

## Output format

```
Running seed command `tsx prisma/seed.ts` ...
Database seeded
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Seed com dados que podem ja existir | Use `skipDuplicates: true` no `createMany` |
| Multiplas tabelas | Insira na ordem das dependencias (foreign keys) |
| Seed precisa rodar apos migrate | `npx prisma migrate reset` ja executa o seed automaticamente |
| Dados sensíveis (senhas) | Hash antes de inserir, nunca plaintext no seed |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Colocar config `prisma.seed` dentro de `scripts` | Colocar no nivel raiz do package.json, como propriedade `prisma` |
| Esquecer `$disconnect()` no finally | Sempre desconectar no `.finally()` |
| Usar `create` em loop para muitos registros | Usar `createMany` com array de objetos |
| Hardcodar path errado no seed config | Usar path relativo a raiz: `prisma/seed.ts` |

## Error handling

- Se `createMany` falhar por unique constraint: adicione `skipDuplicates: true` nas options
- Se `tsx` nao encontrado: instale com `npm i -D tsx` ou troque para `ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts`
- Se seed nao executar: verifique que a propriedade `prisma` esta no nivel raiz do package.json, nao dentro de `scripts`

## Verification

- Abrir Prisma Studio (`npx prisma studio`) e verificar os registros inseridos
- Ou executar `npx prisma db seed` e confirmar o console.log "Database seeded"

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre seed patterns e lifecycle
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variacoes