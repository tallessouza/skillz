---
name: rs-redux-zustand-criando-testes-unitarios
description: "Enforces patterns for unit testing Redux reducers with Vitest as pure functions. Use when user asks to 'test a reducer', 'write unit tests for Redux', 'test a slice', 'test Redux actions', 'setup Vitest for Redux', or 'test boundary conditions in reducers'. Applies: test reducer as pure function, create example states, test all branches including boundaries. Make sure to use this skill whenever writing tests for Redux stores or reducers. Not for component testing, integration testing, E2E testing, or Zustand testing (use testes-unitarios-no-zustand)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: testes-unitarios-redux
  tags: [vitest, testing, reducer, pure-function, boundary, unit-test]
---

# Testes Unitarios para Reducers Redux

> Teste reducers como funcoes puras: passe estado + acao, verifique estado resultante.

## Rules

1. **Teste reducer diretamente** — `reducer(state, action)` retorna novo estado, sem store
2. **Crie exampleState simplificado** — independente dos dados reais, 2 modulos, 2 aulas cada
3. **Nomeie testes descritivamente** — `should be able to play next video automatically`
4. **Teste todos os branches** — caso feliz, transicao de modulo, boundary (sem proximo)
5. **Vitest ao inves de Jest** — entende TypeScript sem configuracao
6. **Extensao `.spec.ts`** — ou `.test.ts`, mas consistente

## How to write

```typescript
import { describe, it, expect } from 'vitest'
import { player as reducer, play, next } from './player-slice'

const exampleState = {
  course: { modules: [
    { id: '1', title: 'Mod 1', lessons: [{ id: '1', title: 'A1', duration: '09:45' }, { id: '2', title: 'A2', duration: '10:00' }] },
    { id: '2', title: 'Mod 2', lessons: [{ id: '3', title: 'A3', duration: '08:30' }, { id: '4', title: 'A4', duration: '11:00' }] },
  ] },
  currentModuleIndex: 0, currentLessonIndex: 0, isLoading: false,
}

it('should play next video', () => {
  const state = reducer(exampleState, next())
  expect(state.currentLessonIndex).toEqual(1)
})

it('should jump to next module', () => {
  const state = reducer({ ...exampleState, currentLessonIndex: 1 }, next())
  expect(state.currentModuleIndex).toEqual(1)
  expect(state.currentLessonIndex).toEqual(0)
})

it('should not go beyond last lesson', () => {
  const state = reducer({ ...exampleState, currentModuleIndex: 1, currentLessonIndex: 1 }, next())
  expect(state.currentModuleIndex).toEqual(1)
})
```

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Testar via componente renderizado | Testar reducer como funcao pura |
| Initial state gigante em cada teste | exampleState + spread |
| `test 1`, `test 2` | `should be able to play next video` |
| Jest com TypeScript manual | Vitest (suporta TS nativamente) |

## Troubleshooting

### Warning sobre combineReducers nos testes
**Symptom:** Console mostra aviso sobre "valid reducer" ao rodar testes.
**Cause:** Slice importada sem store completo configurado.
**Fix:** Ignore — nao afeta testes unitarios de reducers.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-criando-testes-unitarios/references/deep-explanation.md) — Vitest vs Jest, getInitialState, cobertura de branches, DevTools gerando testes
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-criando-testes-unitarios/references/code-examples.md) — Setup Vitest, arquivo spec completo, exampleState, spread pattern
