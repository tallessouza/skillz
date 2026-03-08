---
name: rs-testes-e-iniciando-com-o-next-js
description: "Generates Next.js project setup with Prisma ORM configuration when user asks to 'create a Next.js project', 'setup Next.js with Prisma', 'initialize a new frontend project', or 'configure Prisma schema'. Follows Skillz conventions: pnpm, TypeScript, App Router, src directory, CUID IDs, snake_case DB columns with camelCase fields. Make sure to use this skill whenever scaffolding a Next.js + Prisma project from scratch. Not for database migrations, Docker setup, or deployment configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: ci-cd
  tags: [testing, next-js, react, prisma, docker]
---

# Setup Next.js com Prisma

> Ao criar um projeto Next.js com Prisma, configure todas as ferramentas base antes de rodar qualquer migration.

## Prerequisites

- Node.js 18+
- pnpm instalado (`npm i -g pnpm`)
- Se nao encontrado: usar `npx` como fallback

## Steps

### Step 1: Criar projeto Next.js

```bash
pnpm create next-app@latest nome-do-projeto
```

Opcoes recomendadas:
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **Yes**
- App Router: **Yes**
- Import alias: **default (@/\*)**
- Turbopack: opcional

### Step 2: Instalar Prisma

```bash
pnpm add @prisma/client
pnpm add -D prisma
```

### Step 3: Inicializar Prisma

```bash
npx prisma init
```

### Step 4: Configurar dotenv no Prisma

```bash
pnpm add -D dotenv
```

Adicionar import no `prisma/schema.prisma` config (se necessario pela versao).

### Step 5: Definir schema

```prisma
model Prompt {
  id        String   @id @default(cuid())
  title     String   @unique
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("prompts")
}
```

## Rules

1. **IDs sempre CUID** — `@id @default(cuid())`, porque sao URL-safe e nao expoe sequencia
2. **camelCase no codigo, snake_case no banco** — use `@map("created_at")` e `@@map("prompts")`, porque mantém convencao de cada camada
3. **`@updatedAt` no Prisma** — nunca setar manualmente, o Prisma gerencia automaticamente
4. **Tabelas no plural com `@@map`** — `@@map("prompts")` para nome da tabela no banco
5. **Nao rodar migrate sem Docker/DB configurado** — deixar migration para depois que o banco existir

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto novo do zero | Criar com pnpm create next-app, nao copiar boilerplate |
| Campo de data automatico | Usar `@default(now())` para createdAt, `@updatedAt` para updatedAt |
| Campo unico de negocio | Adicionar `@unique` (ex: title de prompt) |
| Extensao Prisma no VS Code | Instalar extensao oficial do Prisma para autocomplete |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `id Int @id @default(autoincrement())` | `id String @id @default(cuid())` |
| `created_at` como nome do field | `createdAt` com `@map("created_at")` |
| `@@map("Prompt")` singular | `@@map("prompts")` plural |
| Rodar `prisma migrate` sem DB rodando | Configurar Docker/DB primeiro |
| Manter boilerplate do Next.js | Limpar page.tsx imediatamente |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
