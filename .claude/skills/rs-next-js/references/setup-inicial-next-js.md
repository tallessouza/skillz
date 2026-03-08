---
name: rs-next-js-setup-inicial-next-js
description: "Generates initial Next.js project setup with Docker Compose when user asks to 'create a Next.js project', 'setup Next.js', 'start a new Next app', 'initialize Next.js with Docker', or 'scaffold a pet shop app'. Follows Skillz conventions: TypeScript, ESLint, Tailwind, App Router, src directory, no Turbopack. Make sure to use this skill whenever setting up a new Next.js project from scratch. Not for adding features to existing Next.js projects, not for Docker-only setups, not for other frameworks."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: project-setup
  tags: [next-js, setup, docker-compose, typescript, eslint, tailwind, app-router]
---

# Setup Inicial Next.js

> Criar um projeto Next.js com TypeScript, ESLint, Tailwind, App Router e Docker Compose pronto para desenvolvimento.

## Prerequisites

- Node.js 18+
- Docker e Docker Compose instalados
- Terminal com acesso ao npx

## Steps

### Step 1: Criar o projeto Next.js

```bash
npx create-next-app@latest nome-do-projeto
```

Respostas para as perguntas interativas:

| Pergunta | Resposta |
|----------|----------|
| TypeScript? | Yes |
| ESLint? | Yes |
| Tailwind CSS? | Yes |
| `src/` directory? | Yes |
| App Router? | Yes |
| Turbopack? | No |
| Customize import alias? | Yes (manter default `@/*`) |

### Step 2: Limpar o page.tsx inicial

```typescript
// src/app/page.tsx
export default function Home() {
  return (
    <div>
      <h2>Nome do Projeto</h2>
    </div>
  )
}
```

Remover todo o boilerplate do Next.js e deixar apenas uma estrutura minima.

### Step 3: Criar docker-compose.yaml na raiz

```yaml
# docker-compose.yaml na raiz do projeto
# Funciona como uma "receita de bolo" para o Docker:
# lista os ingredientes (services), modo de preparo (config) e o Docker executa
```

Criar o arquivo `docker-compose.yaml` na raiz do projeto (mesmo nivel que `package.json`).

## Output format

```
nome-do-projeto/
├── src/
│   └── app/
│       ├── page.tsx          # Limpo, sem boilerplate
│       ├── layout.tsx        # Root layout padrao
│       └── globals.css       # Tailwind imports
├── docker-compose.yaml       # Na raiz do projeto
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── eslint.config.mjs
```

## Verification

- `npm run dev` inicia sem erros na porta 3000
- Pagina exibe apenas o conteudo limpo (sem boilerplate Next.js)
- `docker-compose.yaml` existe na raiz do projeto
- TypeScript, ESLint e Tailwind configurados

## Error handling

- Se `npx create-next-app` falhar: verificar versao do Node.js (precisa 18+)
- Se porta 3000 ocupada: parar outros processos ou mudar porta com `--port`

## Troubleshooting

### Erro ao iniciar projeto Next.js
**Symptom:** `npm run dev` falha com erros de modulo ou dependencia
**Cause:** Dependencias nao instaladas, versao do Node incompativel, ou conflito de pacotes
**Fix:** Rodar `npm install` para garantir dependencias. Verificar versao do Node (`node -v`, minimo 18+). Deletar `node_modules` e `package-lock.json` e reinstalar

### TypeScript errors no projeto novo
**Symptom:** Erros de tipo em arquivos recem-criados
**Cause:** tsconfig.json nao inclui os paths corretos ou falta `@types` de dependencias
**Fix:** Verificar `include` no tsconfig.json. Instalar types necessarios: `npm i -D @types/react @types/node`

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-setup-inicial-next-js/references/deep-explanation.md) — O curso inteiro usa TypeScript. Ativar desde o inicio evita migracoes futuras e garante type safety
- [code-examples.md](../../../data/skills/next-js/rs-next-js-setup-inicial-next-js/references/code-examples.md) — npx create-next-app@latest pet-shop
