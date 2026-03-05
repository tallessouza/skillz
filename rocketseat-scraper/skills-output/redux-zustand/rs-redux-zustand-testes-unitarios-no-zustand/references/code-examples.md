# Code Examples: Testes Unitarios no Zustand

## Estrutura completa do arquivo de teste

```typescript
// store.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useStore as store } from '.'

// Dados de teste — objeto course com modulos e aulas
const course = {
  id: 1,
  modules: [
    {
      id: 1,
      title: 'Iniciando com React',
      lessons: [
        { id: 1, title: 'CSS Modules', duration: '13:45' },
        { id: 2, title: 'Estilização do Post', duration: '10:05' },
      ],
    },
    {
      id: 2,
      title: 'Estrutura da aplicação',
      lessons: [
        { id: 1, title: 'Componente: Header', duration: '13:45' },
        { id: 2, title: 'Componente: Sidebar', duration: '10:05' },
      ],
    },
  ],
}

// Captura estado inicial ANTES de qualquer teste modificar o store
const initialState = store.getState()

// Reseta estado antes de CADA teste
beforeEach(() => {
  store.setState(initialState)
})

describe('zustand store', () => {
  it('should be able to play', () => {
    const { play } = store.getState()
    play([1, 2])

    const { currentModuleIndex, currentLessonIndex } = store.getState()
    expect(currentModuleIndex).toBe(1)
    expect(currentLessonIndex).toBe(2)
  })

  it('should be able to play next video automatically', () => {
    store.setState({ course })

    const { next } = store.getState()
    next()

    const { currentModuleIndex, currentLessonIndex } = store.getState()
    expect(currentModuleIndex).toBe(0)
    expect(currentLessonIndex).toBe(1)
  })

  it('should be able to jump to the next module automatically', () => {
    store.setState({ course, currentLessonIndex: 1 })

    const { next } = store.getState()
    next()

    const { currentModuleIndex, currentLessonIndex } = store.getState()
    expect(currentModuleIndex).toBe(1)
    expect(currentLessonIndex).toBe(0)
  })

  it('should not go beyond the last lesson of the last module', () => {
    store.setState({
      course,
      currentModuleIndex: 1,
      currentLessonIndex: 1,
    })

    const { next } = store.getState()
    next()

    const { currentModuleIndex, currentLessonIndex } = store.getState()
    expect(currentModuleIndex).toBe(1)
    expect(currentLessonIndex).toBe(1)
  })
})
```

## Padrao: Testar action sem pre-condicoes

Quando a action nao depende de dados existentes no estado:

```typescript
it('should be able to play', () => {
  // 1. Pega a action do estado
  const { play } = store.getState()

  // 2. Executa a action
  play([1, 2])

  // 3. Verifica o novo estado
  const { currentModuleIndex, currentLessonIndex } = store.getState()
  expect(currentModuleIndex).toBe(1)
  expect(currentLessonIndex).toBe(2)
})
```

## Padrao: Testar action com pre-condicoes

Quando a action depende de dados que nao existem no estado inicial:

```typescript
it('should play next video', () => {
  // 1. Prepara o estado necessario
  store.setState({ course })

  // 2. Pega e executa a action
  const { next } = store.getState()
  next()

  // 3. Verifica
  const { currentModuleIndex, currentLessonIndex } = store.getState()
  expect(currentModuleIndex).toBe(0)
  expect(currentLessonIndex).toBe(1)
})
```

## Padrao: Testar action com multiplas pre-condicoes

Quando voce precisa simular um estado especifico antes de testar:

```typescript
it('should jump to next module when last lesson', () => {
  // 1. Seta AMBOS: dados e posicao
  store.setState({ course, currentLessonIndex: 1 })

  // 2. Executa
  const { next } = store.getState()
  next()

  // 3. Verifica que mudou de modulo
  const { currentModuleIndex, currentLessonIndex } = store.getState()
  expect(currentModuleIndex).toBe(1)
  expect(currentLessonIndex).toBe(0)
})
```

## Comando para rodar os testes

```bash
npm run test
```

O Vitest roda todos os arquivos `*.spec.ts` automaticamente, incluindo tanto os testes do Redux quanto do Zustand se ambos existirem no projeto.