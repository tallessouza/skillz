---
name: rs-nextjs-app-router-criando-projeto
description: "Generates Next.js App Router project setup when user asks to 'create a Next.js project', 'start a new Next app', 'setup Next.js', or 'init next project'. Applies correct CLI options, folder structure conventions, ESLint config, and Tailwind cleanup. Make sure to use this skill whenever scaffolding a new Next.js application with App Router. Not for Next.js Pages Router, Remix, Gatsby, or React Native projects."
---

# Criando Projeto Next.js com App Router

> Ao criar um projeto Next.js, use App Router, configure aliases de importacao e limpe os arquivos gerados antes de comecar a desenvolver.

## Prerequisites

- Node.js 18+
- Gerenciador de pacotes: pnpm (recomendado), yarn ou npx
- Se usar pnpm: melhor cache, symbolic links para dependencias duplicadas, economia de espaco em disco

## Steps

### Step 1: Criar o projeto

```bash
# Com pnpm (recomendado)
pnpm create next-app nome-do-projeto

# Com npx
npx create-next-app@latest nome-do-projeto

# Com yarn
yarn create next-app nome-do-projeto
```

### Step 2: Responder as perguntas do CLI

| Pergunta | Resposta | Motivo |
|----------|----------|--------|
| TypeScript? | Yes | Padrao de qualidade |
| ESLint? | Yes | Sera reconfigurado depois |
| Tailwind CSS? | Yes | Estilo padrao do Next.js |
| `src/` directory? | Yes | Evita bagunca na raiz do projeto |
| App Router? | Yes | Futuro do Next.js, recomendado pelo React |
| Import alias? | Yes, `@/*` | Importacoes limpas sem `../../..` |

### Step 3: Limpar arquivos gerados

```typescript
// src/app/page.tsx — remover todo conteudo padrao
export default function Home() {
  return (
    <h1>Hello World</h1>
  )
}
```

```css
/* src/app/globals.css — manter apenas Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```typescript
// tailwind.config.ts — limpar theme.extend desnecessario
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {},
  plugins: [],
}
export default config
```

### Step 4: Configurar ESLint da Skillz

```bash
pnpm add -D @skillz/eslint-config
```

```json
// .eslintrc.json
{
  "extends": ["next/core-web-rules", "@skillz/eslint-config/next"]
}
```

### Step 5: Verificar funcionamento

```bash
pnpm dev
# Abrir http://localhost:3000 — deve exibir "Hello World"
```

## Estrutura de pastas resultante

```
nome-do-projeto/
├── src/
│   └── app/           # NAO renomear (convencao Next.js)
│       ├── layout.tsx  # Layout raiz (nao mexer)
│       ├── page.tsx    # Pagina inicial (limpa)
│       └── globals.css # Apenas imports Tailwind
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
└── package.json
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Pouco espaco em disco | Use pnpm — symbolic links evitam duplicacao |
| Projeto sem necessidade de estilos | Ainda aceite Tailwind — util para prototipar rapido |
| Duvida se App Router ou Pages Router | App Router — e o futuro, recomendado pelo React desde 2023 |
| Import em arquivo profundo | Use `@/` alias — `@/components/Button` em vez de `../../../components/Button` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deixar landing page padrao do Next | Limpar page.tsx e globals.css imediatamente |
| Renomear pasta `app/` ou `src/` | Manter nomes — sao convencoes obrigatorias do Next |
| Usar ESLint padrao do Next sem extensao | Instalar `@skillz/eslint-config` para regras mais completas |
| Ignorar documentacao ao criar projeto | Verificar react.dev e nextjs.org — perguntas do CLI podem mudar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
