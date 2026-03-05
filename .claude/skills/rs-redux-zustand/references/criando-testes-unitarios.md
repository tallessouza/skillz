---
name: rs-redux-zustand-criando-testes-unitarios
description: "Enforces patterns for unit testing Redux reducers with Vitest. Use when user asks to 'test a reducer', 'write unit tests for Redux', 'test a slice', 'test Redux actions', or 'setup Vitest'. Applies patterns: test reducer as pure function, use getInitialState, create example states, test all edge cases including boundary conditions. Make sure to use this skill whenever writing tests for Redux/Zustand stores or reducers. Not for component testing, integration testing, or E2E testing."
---

# Testes Unitarios para Reducers Redux

> Teste reducers como funcoes puras: passe estado + acao, verifique o estado resultante.

## Rules

1. **Teste o reducer diretamente como funcao** — `reducer(state, action)` retorna novo estado, porque reducers sao funcoes puras e nao precisam de store para teste
2. **Use `getInitialState()` ou crie estados exemplo explicitos** — evite depender do initial state interno, porque estados exemplo simplificados tornam testes legiveis
3. **Nomeie testes descritivamente em ingles** — `should be able to play next video automatically`, porque o nome do teste documenta o comportamento esperado
4. **Teste todos os caminhos do reducer** — caso feliz, transicao de modulo, e boundary (sem proximo disponivel), porque logica condicional como `next` tem multiplos branches
5. **Use Vitest ao inves de Jest** — ja entende TypeScript sem configuracao extra, porque usa esbuild internamente e segue a mesma API do Jest
6. **Use extensao `.spec.ts`** — `.test.ts` tambem funciona, mas mantenha consistencia no projeto

## How to write

### Setup basico do teste

```typescript
import { describe, it, expect } from 'vitest'
import { player as reducer, play, next } from './player-slice'

describe('player slice', () => {
  it('should be able to play', () => {
    const initialState = playerSlice.getInitialState()
    const state = reducer(initialState, play({ moduleIndex: 1, lessonIndex: 2 }))

    expect(state.currentModuleIndex).toEqual(1)
    expect(state.currentLessonIndex).toEqual(2)
  })
})
```

### Estado exemplo para testes complexos

```typescript
const exampleState = {
  course: {
    modules: [
      { id: '1', title: 'Modulo 1', lessons: [
        { id: '1', title: 'Aula 1', duration: '09:45' },
        { id: '2', title: 'Aula 2', duration: '10:00' },
      ]},
      { id: '2', title: 'Modulo 2', lessons: [
        { id: '3', title: 'Aula 3', duration: '08:30' },
        { id: '4', title: 'Aula 4', duration: '11:00' },
      ]},
    ],
  },
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  isLoading: false,
}
```

### Teste de boundary condition

```typescript
it('should not update indexes if there is no next lesson available', () => {
  const state = reducer(
    { ...exampleState, currentModuleIndex: 1, currentLessonIndex: 1 },
    next()
  )

  expect(state.currentModuleIndex).toEqual(1)
  expect(state.currentLessonIndex).toEqual(1)
})
```

## Example

**Before (sem testes, confiando apenas na UI):**
```typescript
// Nenhum teste — bugs so aparecem quando usuario interage
```

**After (reducer testado unitariamente):**
```typescript
import { describe, it, expect } from 'vitest'
import { player as reducer, play, next, playerSlice } from './player-slice'

const exampleState = {
  course: { modules: [
    { id: '1', title: 'Mod 1', lessons: [
      { id: '1', title: 'Aula 1', duration: '09:45' },
      { id: '2', title: 'Aula 2', duration: '10:00' },
    ]},
    { id: '2', title: 'Mod 2', lessons: [
      { id: '3', title: 'Aula 3', duration: '08:30' },
      { id: '4', title: 'Aula 4', duration: '11:00' },
    ]},
  ]},
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  isLoading: false,
}

describe('player slice', () => {
  it('should be able to play', () => {
    const state = reducer(exampleState, play({ moduleIndex: 1, lessonIndex: 2 }))
    expect(state.currentModuleIndex).toEqual(1)
    expect(state.currentLessonIndex).toEqual(2)
  })

  it('should be able to play next video automatically', () => {
    const state = reducer(exampleState, next())
    expect(state.currentModuleIndex).toEqual(0)
    expect(state.currentLessonIndex).toEqual(1)
  })

  it('should be able to jump to the next module automatically', () => {
    const state = reducer(
      { ...exampleState, currentLessonIndex: 1 },
      next()
    )
    expect(state.currentModuleIndex).toEqual(1)
    expect(state.currentLessonIndex).toEqual(0)
  })

  it('should not update indexes if there is no next lesson available', () => {
    const state = reducer(
      { ...exampleState, currentModuleIndex: 1, currentLessonIndex: 1 },
      next()
    )
    expect(state.currentModuleIndex).toEqual(1)
    expect(state.currentLessonIndex).toEqual(1)
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Reducer tem logica condicional (if/else) | Teste cada branch separadamente |
| Action tem payload | Verifique que o estado reflete os valores do payload |
| Action muda indices/cursors | Teste inicio, meio e fim (boundary) |
| Reducer ignora acao em certo estado | Teste que estado permanece inalterado |
| Warning no console sobre combineReducers | Ignore — nao afeta testes unitarios |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Testar reducer via componente renderizado | Testar reducer como funcao pura |
| Depender do store configurado para teste unitario | Chamar `reducer(state, action)` diretamente |
| Copiar initial state gigante em cada teste | Criar `exampleState` simplificado e reusar com spread |
| Nomes de teste genericos `test 1`, `test 2` | Nomes descritivos `should be able to play next video` |
| Configurar Jest com TypeScript manualmente | Usar Vitest que ja suporta TypeScript |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/redux-zustand/rs-redux-zustand-criando-testes-unitarios/references/deep-explanation.md)
- [Code examples](../../../data/skills/redux-zustand/rs-redux-zustand-criando-testes-unitarios/references/code-examples.md)
