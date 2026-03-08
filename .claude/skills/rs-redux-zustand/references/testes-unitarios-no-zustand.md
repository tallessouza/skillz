---
name: rs-redux-zustand-testes-unitarios-no-zustand
description: "Enforces Zustand store unit testing patterns when writing tests with Vitest outside React components. Use when user asks to 'test a Zustand store', 'write unit tests for Zustand', 'test state management outside React', 'use getState setState in tests', or 'isolate Zustand tests with beforeEach'. Applies getState/setState outside React, state reset with beforeEach, and initialState capture. Make sure to use this skill whenever creating or reviewing Zustand store tests. Not for React component testing, Redux testing (use criando-testes-unitarios), or E2E tests."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: testes-zustand
  tags: [zustand, vitest, testing, getState, setState, beforeEach, isolation]
---

# Testes Unitarios no Zustand

> Use getState/setState diretamente fora do React e garanta isolamento entre testes com beforeEach.

## Rules

1. **getState() fora de React** — `store.getState()` nao `store()`, porque hook so funciona em componentes
2. **setState() para preparar estado** — `store.setState({ course })` antes de testar
3. **beforeEach reseta estado** — capture initialState UMA VEZ fora, restaure dentro de beforeEach
4. **initialState fora do beforeEach** — `const initialState = store.getState()` no top-level, porque dentro pegaria estado modificado
5. **Renomeie useStore para store** — fora de React, `use` prefix e semanticamente incorreto

## How to write

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useStore as store } from '.'

const initialState = store.getState()  // FORA do beforeEach

beforeEach(() => {
  store.setState(initialState)  // Reseta antes de cada teste
})

it('should be able to play', () => {
  const { play } = store.getState()
  play([1, 2])
  const { currentModuleIndex, currentLessonIndex } = store.getState()
  expect(currentModuleIndex).toBe(1)
  expect(currentLessonIndex).toBe(2)
})

it('should play next video', () => {
  store.setState({ course })  // Pre-condicao
  const { next } = store.getState()
  next()
  expect(store.getState().currentLessonIndex).toBe(1)
})
```

## Example

**Before (sem isolamento):** Estado vaza entre testes, resultados dependem da ordem
**After (com beforeEach):** Cada teste comeca com estado limpo

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useStore()` em arquivo de teste | `store.getState()` |
| `initialState` dentro do beforeEach | `initialState` no top-level |
| Testes que dependem da ordem | `beforeEach` resetando estado |

## Troubleshooting

### Segundo teste falha com estado do primeiro
**Symptom:** `currentModuleIndex` e 1 quando deveria ser 0 no segundo teste.
**Cause:** Zustand store e global e mutavel — estado persiste entre testes.
**Fix:** Adicione `beforeEach(() => store.setState(initialState))` com initialState capturado no top-level.

### initialState dentro do beforeEach pega estado modificado
**Symptom:** Reset nao funciona — estado permanece alterado.
**Cause:** `const initialState = store.getState()` dentro do beforeEach executa apos testes modificarem.
**Fix:** Mova a captura para o top-level do arquivo, fora de qualquer describe/beforeEach.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-testes-unitarios-no-zustand/references/deep-explanation.md) — getState/setState como feature, estado compartilhado, comparacao com Redux
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-testes-unitarios-no-zustand/references/code-examples.md) — Arquivo spec completo, padrao sem pre-condicoes, com pre-condicoes, multiplas
