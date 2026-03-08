---
name: rs-testes-e-corrigindo-os-testes-com-polyfill
description: "Applies polyfill strategies to fix Jest/JSDOM test failures caused by missing browser APIs. Use when user asks to 'fix test error', 'polyfill missing API', 'fix TextEncoder not defined', 'fix structuredClone in tests', or 'resolve jsdom missing features'. Enforces global polyfill registration in jest.setup.ts and JSDOM limitation awareness. Make sure to use this skill whenever Jest tests fail due to missing browser APIs in JSDOM environment. Not for E2E tests (Playwright has real browser), or build-time errors."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: testing-setup
  tags: [jest, jsdom, polyfill, TextEncoder, structuredClone, testing, fix]
---

# Corrigindo Testes com Polyfill

> JSDOM nao implementa todas as APIs do browser — quando um teste falha com "X is not defined", registre o polyfill no jest.setup.ts.

## Rules

1. **Identifique a API ausente** — leia a mensagem de erro (`ReferenceError: X is not defined`), porque JSDOM simula o DOM mas omite APIs modernas
2. **Registre no jest.setup.ts** — adicione `global.X = ...` no setup file, porque afeta todos os testes uniformemente
3. **Use implementacoes minimas** — para `structuredClone`, use `JSON.parse(JSON.stringify(x))`; para `TextEncoder`, importe de `util`
4. **Nunca modifique o componente para contornar** — o problema e do ambiente de teste, nao do codigo de producao

## How to write

```typescript
// jest.setup.ts
import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "util"

global.TextEncoder = TextEncoder as any
global.TextDecoder = TextDecoder as any
global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val))
```

## Example

**Before (teste falha):**
```
ReferenceError: structuredClone is not defined
```

**After (polyfill no setup):**
```typescript
// jest.setup.ts
global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val))
// Teste passa normalmente
```

## Heuristics

| API ausente | Polyfill |
|------------|----------|
| `TextEncoder` / `TextDecoder` | `import { TextEncoder, TextDecoder } from "util"` |
| `structuredClone` | `JSON.parse(JSON.stringify(val))` |
| `fetch` | `jest-fetch-mock` ou `whatwg-fetch` |
| `ResizeObserver` | `global.ResizeObserver = class { observe() {} ... }` |

## Troubleshooting

### Polyfill registrado mas erro persiste
**Symptom:** Adicionou polyfill no setup mas teste continua falhando
**Cause:** jest.setup.ts nao esta listado em `setupFilesAfterEnv` no jest.config
**Fix:** Verificar `setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]` no config

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
