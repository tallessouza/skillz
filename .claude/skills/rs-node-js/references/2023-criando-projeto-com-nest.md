---
name: 2023-criando-projeto-com-nest
description: "Scaffolds a clean NestJS project by removing default Jest/ESLint/Prettier configs and preparing for custom tooling setup. Use when user asks to 'create NestJS project', 'setup Nest application', 'scaffold backend with NestJS', or 'initialize NestJS with pnpm'. Enforces: use nest CLI with pnpm, remove Jest and configure Vitest later, change default port from 3000, clean generated test and lint files. Make sure to use this skill whenever starting a new NestJS backend project from scratch. Not for adding features to existing NestJS projects, Express/Fastify standalone setup, or frontend projects."
category: workflow
tags: [cache, fastify, modules, nestjs, testing, typescript]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: nestjs-setup
  tags: [nestjs, project-setup, pnpm, vitest, typescript, scaffolding]
---

# Criando Projeto com NestJS

> Ao criar um projeto NestJS, limpe o scaffolding padrao e configure as preferencias do time antes de escrever qualquer codigo.

## Rules

1. **Use a CLI global do Nest** — `npm i -g @nestjs/cli` depois `nest new nome-projeto`, porque o scaffolding via CLI e mais rapido que clone manual
2. **Escolha pnpm como gerenciador** — porque reutiliza cache global, instalacao mais rapida e ocupa menos espaco que npm/yarn
3. **Remova Jest do scaffolding** — porque sera substituido por Vitest por questoes de performance
4. **Remova configs padrao de lint/prettier** — `.prettierrc`, `.eslintrc.js`, porque serao reconfigurados do zero conforme o time
5. **Troque a porta padrao 3000** — use `3353` ou outra porta que nao conflite com React/Next, porque 3000 e usada por frontends
6. **Limpe a pasta test/** — remova testes e2e gerados, porque serao reescritos com a stack escolhida

## Steps

### Step 1: Instalar CLI e criar projeto
```bash
npm i -g @nestjs/cli
nest new nome-projeto
# Selecione pnpm quando perguntado
cd nome-projeto
```

### Step 2: Limpar arquivos desnecessarios
```bash
# Remover configs padrao
rm -f README.md .prettierrc .eslintrc.js

# Limpar pasta de testes
rm -rf test/*

# Remover arquivo de teste do app
rm -f src/app.controller.spec.ts
```

### Step 3: Limpar package.json
Remover do `package.json`:
- Scripts de teste (`test`, `test:watch`, `test:cov`, `test:debug`, `test:e2e`)
- Bloco `jest` de configuracao
- Dependencias: `jest`, `ts-jest`, `@types/jest`, `supertest`, `@types/supertest`
- Dependencias: `eslint`, `@typescript-eslint/*`, `eslint-config-prettier`, `eslint-plugin-prettier`, `prettier`

### Step 4: Trocar porta padrao
```typescript
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3353); // Nao usar 3000 — conflita com React/Next
}
```

### Step 5: Reinstalar e verificar
```bash
pnpm install
pnpm run start:dev
# Deve exibir: Nest application successfully started
curl http://localhost:3353  # Hello World
```

## Verification

- `pnpm run start:dev` inicia sem erros
- `curl http://localhost:3353` retorna "Hello World"
- Nenhum arquivo `.prettierrc`, `.eslintrc.js` ou `jest.config` presente
- `package.json` nao contem dependencias de Jest/ESLint

## Heuristics

| Situacao | Acao |
|----------|------|
| Time sem lider tecnico definido | NestJS e ideal — traz opiniao pronta |
| Precisa de produtividade maxima | NestJS — menos decisoes tecnicas, mais codigo |
| Quer total controle arquitetural | Use Express/Fastify puro |
| Projeto fullstack com React/Next | Mude a porta do Nest para evitar conflito |
| Precisa de GraphQL, WebSocket, mensageria | NestJS tem docs oficiais para cada um |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Manter Jest do scaffolding | Remover e configurar Vitest |
| Usar porta 3000 em backend | Usar 3353 ou porta dedicada |
| Manter configs padrao sem revisar | Limpar e reconfigurar do zero |
| Instalar via git clone do starter | Usar `nest new` via CLI global |
| Manter testes e2e gerados | Limpar e reescrever com stack propria |

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
