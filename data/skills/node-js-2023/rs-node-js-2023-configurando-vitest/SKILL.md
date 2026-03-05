---
name: rs-node-js-2023-configurando-vitest
description: "Configures Vitest test runner with TypeScript path aliases in Node.js projects. Use when user asks to 'setup tests', 'configure vitest', 'add testing', 'create test environment', or 'setup vitest with tsconfig paths'. Applies vite-tsconfig-paths plugin, creates vit.config.ts, and sets up test/test:watch scripts. Make sure to use this skill whenever setting up a new Node.js project test environment with Vitest. Not for writing actual test cases, Jest configuration, or frontend testing setup."
---

# Configurando Vitest

> Configure o Vitest com suporte a path aliases do tsconfig desde o inicio do projeto, porque testes nao sao opcionais no back-end.

## Prerequisites

- Node.js 18+ com projeto TypeScript existente
- `tsconfig.json` com paths configurados (ex: `@/` aliases)
- Se paths nao existem: pule o plugin `vite-tsconfig-paths`

## Steps

### Step 1: Instalar dependencias

```bash
npm i vitest vite-tsconfig-paths -D
```

### Step 2: Criar vite.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
})
```

O plugin `tsconfigPaths()` faz o Vitest entender importacoes como `@/use-cases/register` que comecam com os aliases definidos no `tsconfig.json`.

### Step 3: Adicionar scripts no package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

| Script | Comportamento |
|--------|--------------|
| `test` | Roda todos os testes uma vez e encerra |
| `test:watch` | Roda e fica observando mudancas, re-executa automaticamente |

### Step 4: Verificar que funciona

Criar arquivo de teste temporario (ex: `src/use-cases/register.spec.ts`):

```typescript
import { test, expect } from 'vitest'

test('check if it works', () => {
  expect(2 + 2).toBe(4)
})
```

```bash
npm run test
```

## Verification

- `npm run test` executa sem erros
- `npm run test:watch` fica observando e re-executa ao salvar arquivos
- Importacoes com `@/` funcionam dentro dos arquivos `.spec.ts`

## Error handling

- Se Vitest nao entende `@/` imports: verificar que `vite-tsconfig-paths` esta nos plugins do `vite.config.ts`
- Se `defineConfig` nao e encontrado: importar de `vitest/config`, nao de `vite`
- Se testes nao rodam: verificar que o script usa `vitest run` (execucao unica) ou `vitest` (watch mode)

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo com TypeScript paths | Sempre instale `vite-tsconfig-paths` junto com vitest |
| CI/CD pipeline | Use `vitest run` (nao watch) |
| Desenvolvimento local | Use `vitest` (watch mode) para feedback rapido |
| Arquivo de teste | Nomeie como `*.spec.ts` dentro da pasta do modulo que testa |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Deixar testes pra depois | Configurar testes desde o inicio do projeto |
| Tirar uma semana so pra escrever testes | Escrever testes junto com cada feature/caso de uso |
| Importar `defineConfig` de `vite` | Importar `defineConfig` de `vitest/config` |
| Criar apenas script `test` sem watch | Criar ambos `test` e `test:watch` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
