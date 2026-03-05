# Code Examples: Setup Next.js com Prisma

## 1. Comando de criacao do projeto

```bash
pnpm create next-app@latest skillz-prompt-manager
```

Respostas na CLI:
```
Would you like to customize? Yes
TypeScript? Yes
ESLint? Yes
Turbopack? No
Tailwind CSS? Yes
src/ directory? Yes
App Router? Yes
Import alias? @/* (default)
```

## 2. Instalacao do Prisma

```bash
# Cliente Prisma (dependencia de producao)
pnpm add @prisma/client

# CLI do Prisma (dependencia de desenvolvimento)
pnpm add -D prisma
```

## 3. Inicializacao do Prisma

```bash
npx prisma init
```

Isso cria:
- `prisma/schema.prisma` — arquivo de schema
- `.env` — com DATABASE_URL placeholder

## 4. Instalacao do dotenv

```bash
pnpm add -D dotenv
```

## 5. Schema completo do Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Prompt {
  id        String   @id @default(cuid())
  title     String   @unique
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("prompts")
}
```

## 6. Page.tsx limpa (apos remover boilerplate)

```tsx
// src/app/page.tsx
export default function Home() {
  return (
    <div>
      <h2>Skillz</h2>
    </div>
  );
}
```

O instrutor removeu todo o conteudo padrao do Next.js (imports de Image, CSS modules, etc.) e deixou apenas uma div com h2.

## 7. Estrutura de pastas apos setup

```
skillz-prompt-manager/
├── prisma/
│   └── schema.prisma
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── .env
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```