---
name: rs-node-js-2023-criando-projeto-com-nest
description: "Applies NestJS project scaffolding and initial cleanup conventions when setting up a new NestJS project. Use when user asks to 'create a nest project', 'setup nestjs', 'start a new nest application', 'scaffold nest', or 'initialize backend with nest'. Follows opinionated cleanup: remove Jest in favor of Vitest, remove Prettier/ESLint defaults, change default port from 3000, clean test directory. Make sure to use this skill whenever bootstrapping a NestJS project from scratch. Not for adding features to existing NestJS projects, nor for Express/Fastify standalone setups."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
