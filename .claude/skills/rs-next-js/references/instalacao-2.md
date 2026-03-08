---
name: rs-next-js-instalacao-2
description: "Guides Next.js Pages Router project setup and installation when user asks to 'create a next app', 'setup next.js project', 'install next', 'start a new next project', or 'configure pages router'. Follows official Next.js docs with TypeScript, Tailwind, and src directory. Make sure to use this skill whenever scaffolding a new Next.js project with Pages Router. Not for App Router setup, deployment, or Next.js runtime configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: instalacao
  tags: [next-js, pages-router, create-next-app, typescript, tailwind, project-setup]
---

# Instalacao Next.js com Pages Router

> Ao criar um novo projeto Next.js com Pages Router, use o CLI oficial com TypeScript, Tailwind e pasta src habilitados.

## Prerequisites

- Node.js 18.18 ou mais recente
- Se nao encontrado: `nvm install 18` ou atualizar manualmente

## Steps

### Step 1: Executar o CLI de instalacao

```bash
npx create-next-app@latest nome-do-projeto
```

### Step 2: Responder as perguntas do CLI

| Pergunta | Resposta recomendada | Motivo |
|----------|---------------------|--------|
| TypeScript? | **Yes** | Tipagem previne bugs em producao |
| ESLint? | **Yes** | Padronizacao de codigo |
| Tailwind CSS? | **Yes** | Estilizacao rapida e consistente |
| `src/` directory? | **Yes** | Separacao clara entre config e codigo |
| App Router? | **No** | Pages Router e o foco — ainda muito usado no mercado |
| Turbopack? | **No** | Opcional, pode habilitar depois |
| Import alias? | **Yes** (default `@/*`) | Imports limpos sem `../../..` |

### Step 3: Abrir e verificar a estrutura

```
nome-do-projeto/
├── src/
│   ├── pages/          # Aqui tudo ganha forma no browser
│   │   ├── _app.tsx    # Wrapper global da aplicacao
│   │   ├── _document.tsx
│   │   └── index.tsx   # Porta de entrada — rota "/"
│   └── styles/         # Estilos globais e Tailwind
├── public/             # Assets estaticos
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Step 4: Rodar o projeto

```bash
cd nome-do-projeto
npm run dev
```

Acessar `http://localhost:3000` — o arquivo `src/pages/index.tsx` e o que aparece.

## Output format

Projeto Next.js funcional com Pages Router, pronto para desenvolvimento de rotas.

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo do zero | Sempre usar `create-next-app@latest` |
| Precisa de Pages Router | Responder **No** para App Router no CLI |
| Quer testar rapido | Editar `index.tsx` e ver no browser |
| Arquivo `index.tsx` muito grande apos scaffold | Limpar e deixar apenas o essencial |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Instalar Next.js manualmente com `npm install` | Usar `npx create-next-app@latest` |
| Selecionar App Router quando o objetivo e Pages Router | Responder **No** para App Router |
| Ignorar a pasta `src/` | Sempre habilitar para manter organizacao |
| Editar arquivos de config antes de verificar se roda | Rodar `npm run dev` primeiro, confirmar que funciona |

## Troubleshooting

### Comportamento diferente entre dev e producao
**Symptom:** Funcionalidade funciona em `npm run dev` mas nao em `npm run build && npm start`
**Cause:** Dev mode e mais permissivo — producao aplica otimizacoes, cache agressivo, e validacoes mais estritas
**Fix:** Sempre testar com `npm run build && npm start` antes de deploy. Verificar que nao ha erros no build output. Limpar .next antes de rebuildar

### Erro "Module not found" apos refatoracao
**Symptom:** Import de modulo falha apos mover arquivo
**Cause:** Path do import nao foi atualizado, ou alias de path (@/) nao esta configurado
**Fix:** Atualizar todos os imports que referenciam o arquivo movido. Verificar tsconfig.json paths para aliases

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-instalacao-2/references/deep-explanation.md) — O instrutor enfatiza que aprender Pages Router antes da App Router e estrategico. A Pages Router ain
- [code-examples.md](../../../data/skills/next-js/rs-next-js-instalacao-2/references/code-examples.md) — npx create-next-app@latest site-blog
