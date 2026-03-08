---
name: rs-full-stack-configurando-o-jest
description: "Enforces Jest configuration best practices when setting up testing in TypeScript Node.js projects. Use when user asks to 'configure Jest', 'setup testing', 'add unit tests', 'initialize test config', or 'configure ts-jest'. Applies rules: use ts-jest preset, configure testMatch for .test.ts files in src, add moduleNameMapper for path aliases, enable bail and clearMocks. Make sure to use this skill whenever initializing Jest in a TypeScript project or troubleshooting test configuration. Not for writing test cases, E2E testing with Playwright/Cypress, or frontend React testing setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: testing
  tags: [jest, ts-jest, testing, typescript, test-config, moduleNameMapper]
---

# Configurando o Jest

> Configure Jest com ts-jest para projetos TypeScript Node.js usando preset, testMatch e moduleNameMapper alinhados ao tsconfig.

## Rules

1. **Use o preset ts-jest** — `preset: "ts-jest"`, porque permite executar testes TypeScript sem compilacao previa
2. **Defina testEnvironment como node** — `testEnvironment: "node"`, porque APIs Node.js nao rodam em ambiente jsdom
3. **Configure testMatch para src/** — aponte para `<rootDir>/src/**/*.test.ts`, porque centraliza testes junto ao codigo fonte
4. **Espelhe aliases do tsconfig no moduleNameMapper** — mapeie `@/*` para `<rootDir>/src/$1`, porque Jest nao resolve paths do TypeScript automaticamente
5. **Ative bail: true** — para na primeira falha, porque em desenvolvimento rapido feedback imediato e mais util que relatorio completo
6. **Ative clearMocks: true** — limpa mocks entre testes, porque estado residual entre testes causa falhas intermitentes

## How to write

### jest.config.ts completo

```typescript
import type { Config } from "jest";

const config: Config = {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
```

### Inicializacao via CLI

```bash
# Inicializa com wizard interativo
npx jest --init

# Instala dependencias necessarias
npm install -D jest ts-jest @types/jest
```

## Example

**Before (jest.config.ts gerado pelo wizard — cheio de comentarios e propriedades desativadas):**
```typescript
// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/configuration

const config = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,
  // Automatically clear mock calls, instances, contexts and results
  // clearMocks: false,
  // ...200+ linhas de comentarios...
};
```

**After (com esta skill aplicada):**
```typescript
import type { Config } from "jest";

const config: Config = {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto TypeScript com paths no tsconfig | Adicione moduleNameMapper espelhando os aliases |
| Projeto sem path aliases | Omita moduleNameMapper |
| Precisa de cobertura de codigo | Adicione `collectCoverage: true` e `coverageDirectory` |
| Testes em diretorio separado `__tests__/` | Ajuste testMatch para `<rootDir>/__tests__/**/*.test.ts` |
| Usa `.spec.ts` por convencao | Troque testMatch para `**/*.spec.ts` |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Manter o jest.config.ts com 200 linhas comentadas | Limpe tudo, mantenha apenas propriedades ativas |
| Esquecer moduleNameMapper quando usa `@/` no tsconfig | Espelhe cada alias do tsconfig no Jest |
| Usar `testEnvironment: "jsdom"` para API Node | Use `testEnvironment: "node"` |
| Rodar Jest sem ts-jest em projeto TypeScript | Configure `preset: "ts-jest"` |
| Deixar clearMocks como false | Ative `clearMocks: true` para isolamento entre testes |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `Cannot find module '@/...'` nos testes | moduleNameMapper nao configurado | Adicionar `"^@/(.*)$": "<rootDir>/src/$1"` no jest.config |
| Testes TypeScript nao executam | Preset ts-jest ausente | Instalar `ts-jest` e configurar `preset: "ts-jest"` |
| Testes passam localmente mas falham no CI | clearMocks desativado, estado residual | Ativar `clearMocks: true` no jest.config |
| Jest nao encontra arquivos de teste | testMatch apontando para diretorio errado | Ajustar testMatch para `<rootDir>/src/**/*.test.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada propriedade do jest.config e decisoes do wizard
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes