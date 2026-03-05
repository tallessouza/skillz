# Code Examples: Testes Unitarios para Reducers Redux

## Setup: Instalacao do Vitest

```bash
npm install vitest -D
```

## Setup: Scripts no package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

## Arquivo de teste completo: player.spec.ts

```typescript
import { describe, it, expect } from 'vitest'
import { player as reducer, play, next, playerSlice } from './player-slice'

// Estado exemplo simplificado — independente dos dados reais
const exampleState = {
  course: {
    modules: [
      {
        id: '1',
        title: 'Modulo 1',
        lessons: [
          { id: '1', title: 'Aula 1', duration: '09:45' },
          { id: '2', title: 'Aula 2', duration: '10:00' },
        ],
      },
      {
        id: '2',
        title: 'Modulo 2',
        lessons: [
          { id: '3', title: 'Aula 3', duration: '08:30' },
          { id: '4', title: 'Aula 4', duration: '11:00' },
        ],
      },
    ],
  },
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  isLoading: false,
}

describe('player slice', () => {
  // Teste 1: Acao play seta os indices corretamente
  it('should be able to play', () => {
    const state = reducer(
      exampleState,
      play({ moduleIndex: 1, lessonIndex: 2 })
    )

    expect(state.currentModuleIndex).toEqual(1)
    expect(state.currentLessonIndex).toEqual(2)
  })

  // Teste 2: Next avanca para proxima aula no mesmo modulo
  it('should be able to play next video automatically', () => {
    // Comeca em module=0, lesson=0
    const state = reducer(exampleState, next())

    // Deve ir para module=0, lesson=1
    expect(state.currentModuleIndex).toEqual(0)
    expect(state.currentLessonIndex).toEqual(1)
  })

  // Teste 3: Next pula para proximo modulo quando na ultima aula
  it('should be able to jump to the next module automatically', () => {
    // Comeca na ultima aula do primeiro modulo
    const state = reducer(
      { ...exampleState, currentLessonIndex: 1 },
      next()
    )

    // Deve pular para modulo 1, aula 0
    expect(state.currentModuleIndex).toEqual(1)
    expect(state.currentLessonIndex).toEqual(0)
  })

  // Teste 4: Next nao faz nada quando nao ha mais aulas
  it('should not update the current module and lesson index if there is no next lesson available', () => {
    // Comeca na ultima aula do ultimo modulo
    const state = reducer(
      { ...exampleState, currentModuleIndex: 1, currentLessonIndex: 1 },
      next()
    )

    // Deve permanecer no mesmo lugar
    expect(state.currentModuleIndex).toEqual(1)
    expect(state.currentLessonIndex).toEqual(1)
  })
})
```

## Usando getInitialState (alternativa para testes simples)

```typescript
it('should be able to play', () => {
  // getInitialState retorna o initialState definido na slice
  const initialState = playerSlice.getInitialState()
  const state = reducer(initialState, play({ moduleIndex: 1, lessonIndex: 2 }))

  expect(state.currentModuleIndex).toEqual(1)
  expect(state.currentLessonIndex).toEqual(2)
})
```

## Exportando a slice para acesso ao getInitialState

```typescript
// player-slice.ts
export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play: (state, action) => { /* ... */ },
    next: (state) => { /* ... */ },
  },
})

// Exportar a slice permite usar playerSlice.getInitialState() nos testes
export const player = playerSlice.reducer
export const { play, next } = playerSlice.actions
```

## Pattern: Spread do estado exemplo para variacoes

```typescript
// Reusar exampleState com override de campos especificos
const stateAtLastLesson = {
  ...exampleState,
  currentModuleIndex: 1,
  currentLessonIndex: 1,
}

// Mais legivel que criar estados completos para cada teste
```