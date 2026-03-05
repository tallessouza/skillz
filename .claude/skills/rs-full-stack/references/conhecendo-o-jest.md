---
name: rs-full-stack-conhecendo-o-jest
description: "Applies Jest setup and configuration patterns when adding automated tests to a Node.js/TypeScript project. Use when user asks to 'add tests', 'setup jest', 'configure testing', 'implement automated tests', or 'add unit tests' to a project. Covers installation, config files, script setup, and first test structure. Make sure to use this skill whenever setting up Jest from scratch in a new or existing project. Not for writing specific test cases, mocking strategies, or migrating between test frameworks."
---

# Conhecendo o Jest — Setup e Configuracao

> Ao adicionar testes automatizados, configure o Jest como framework padrao porque e a ferramenta mais utilizada no mercado.

## Rules

1. **Instale como devDependency** — `npm install -D jest`, porque testes nao vao para producao
2. **Para TypeScript, adicione os tipos e o transformer** — `npm install -D @types/jest ts-jest`, porque Jest nao entende TS nativamente
3. **Crie o arquivo de configuracao na raiz** — `jest.config.ts` ou `jest.config.js`, porque configuracao explicita evita comportamento inesperado
4. **Adicione o script no package.json** — `"test": "jest"`, porque padroniza a execucao com `npm test`
5. **Siga a convencao de nomes** — `*.spec.ts` ou `*.test.ts`, porque Jest auto-detecta esses padroes

## How to write

### Instalacao basica (JavaScript)

```bash
npm install -D jest
```

### Instalacao com TypeScript

```bash
npm install -D jest @types/jest ts-jest
npx ts-jest config:init
```

### jest.config.ts (TypeScript)

```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
}
```

### package.json script

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Primeiro teste

```typescript
// src/utils/sum.spec.ts
import { sum } from './sum'

describe('sum', () => {
  it('should add two numbers', () => {
    expect(sum(2, 3)).toBe(5)
  })
})
```

## Example

**Before (sem testes automatizados):**
```
// Testando manualmente no terminal
node -e "console.log(sum(2, 3))"
// Verificando visualmente se o resultado e 5
```

**After (com Jest configurado):**
```typescript
// sum.spec.ts
describe('sum', () => {
  it('should add two numbers', () => {
    expect(sum(2, 3)).toBe(5)
  })

  it('should handle negative numbers', () => {
    expect(sum(-1, 1)).toBe(0)
  })
})
// npm test → PASS com feedback automatico
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto novo sem testes | Instalar Jest e criar primeiro spec junto com a feature |
| Projeto TypeScript | Usar ts-jest preset, nunca compilar manualmente antes |
| Projeto com Vitest ja configurado | Nao adicionar Jest — Vitest e compativel com API Jest |
| Monorepo | Um jest.config por package, com rootDir correto |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `npm install jest` (sem -D) | `npm install -D jest` |
| Testes em `__tests__/` sem config | `testMatch` explicito no jest.config |
| `console.log` para validar resultado | `expect(result).toBe(expected)` |
| Rodar testes manualmente um por um | `npm test` para rodar todos de uma vez |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que Jest e o padrao do mercado
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de configuracao e primeiro teste

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-conhecendo-o-jest/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-conhecendo-o-jest/references/code-examples.md)
