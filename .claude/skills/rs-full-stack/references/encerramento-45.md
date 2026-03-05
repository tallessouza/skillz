---
name: rs-full-stack-encerramento-45
description: "Applies Prisma ORM fundamentals when setting up database access in Node.js/TypeScript projects. Use when user asks to 'setup prisma', 'connect to database', 'create a model', 'use an ORM', or 'query database with typescript'. Covers what an ORM is, why Prisma over raw SQL, and basic Prisma workflow. Make sure to use this skill whenever initializing a new Prisma project or explaining ORM concepts. Not for advanced Prisma features like migrations strategy, raw SQL optimization, or database administration."
---

# Prisma ORM — Fundamentos

> Utilize um ORM para abstrair queries SQL em operacoes tipadas, mantendo produtividade e seguranca de tipos.

## Conceito central

Um ORM (Object-Relational Mapping) mapeia tabelas do banco de dados para objetos/modelos na linguagem de programacao, porque isso elimina SQL manual, previne SQL injection, e oferece autocomplete via tipos.

## Quando usar Prisma

| Situacao | Decisao |
|----------|---------|
| Projeto Node.js/TypeScript com banco relacional | Prisma e a escolha padrao |
| Queries extremamente complexas com CTEs/window functions | Considerar `$queryRaw` ou query builder |
| Prototipagem rapida | Prisma acelera com schema declarativo |
| Projeto sem TypeScript | Prisma funciona, mas perde o principal beneficio (tipos) |

## Workflow basico do Prisma

### 1. Inicializacao
```bash
npx prisma init
```

### 2. Definir schema
```prisma
// prisma/schema.prisma
model User {
  id    String @id @default(uuid())
  name  String
  email String @unique
}
```

### 3. Migrar
```bash
npx prisma migrate dev --name init
```

### 4. Usar no codigo
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const users = await prisma.user.findMany()
const user = await prisma.user.create({
  data: { name: 'Diego', email: 'diego@skillz.com.br' }
})
```

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `new PrismaClient()` em cada request | Instancia unica (singleton) reutilizada |
| Ignorar tipos gerados pelo Prisma | Usar os tipos de `@prisma/client` para inputs e outputs |
| Escrever SQL manual para CRUD simples | Usar os metodos tipados do Prisma (`findMany`, `create`, etc.) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — O que e um ORM, por que Prisma, e como ele se compara a alternativas
- [code-examples.md](references/code-examples.md) — Exemplos completos de setup e operacoes CRUD com Prisma

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-encerramento-45/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-encerramento-45/references/code-examples.md)
