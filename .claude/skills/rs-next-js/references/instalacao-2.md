---
name: rs-next-js-instalacao-2
description: "Guides Next.js Pages Router project setup and installation when user asks to 'create a next app', 'setup next.js project', 'install next', 'start a new next project', or 'configure pages router'. Follows official Next.js docs with TypeScript, Tailwind, and src directory. Make sure to use this skill whenever scaffolding a new Next.js project with Pages Router. Not for App Router setup, deployment, or Next.js runtime configuration."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-instalacao-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-instalacao-2/references/code-examples.md)
