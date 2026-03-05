---
name: rs-redux-zustand-testes-unitarios-zustand
description: "Enforces Zustand store unit testing patterns when writing tests for Zustand stores with Vitest. Use when user asks to 'test a zustand store', 'write unit tests for zustand', 'test state management', or 'migrate redux tests to zustand'. Applies rules: use getState/setState outside React, reset state with beforeEach, isolate tests from shared state. Make sure to use this skill whenever creating or reviewing Zustand store tests. Not for React component testing, Redux testing, or integration/E2E tests."
---

# Testes Unitarios no Zustand

> Ao testar stores Zustand, use getState/setState diretamente e garanta isolamento entre testes com beforeEach.

## Rules

1. **Use getState() fora de componentes React** — `store.getState()` nao `store()`, porque o hook so funciona dentro de componentes React
2. **Use setState() para preparar estado nos testes** — `store.setState({ course })` para setar dados antes de testar, porque e a forma direta de manipular estado fora do React
3. **Resete estado antes de cada teste com beforeEach** — capture o estado inicial UMA VEZ fora do beforeEach, e restaure dentro dele, porque testes nao podem depender da ordem de execucao
4. **Capture initialState fora do beforeEach** — `const initialState = store.getState()` deve ficar fora, porque dentro do beforeEach pegaria o estado ja modificado por testes anteriores
5. **Renomeie useStore para store em arquivos de teste** — porque fora de componentes React o prefixo `use` e semanticamente incorreto

## How to write

### Setup do arquivo de teste

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useStore as store } from '.'

const initialState = store.getState()

beforeEach(() => {
  store.setState(initialState)
})
```

### Teste de action simples (play)

```typescript
it('should be able to play', () => {
  const { play } = store.getState()
  play([1, 2])

  const { currentModuleIndex, currentLessonIndex } = store.getState()
  expect(currentModuleIndex).toBe(1)
  expect(currentLessonIndex).toBe(2)
})
```

### Teste com estado pre-configurado (next)

```typescript
it('should be able to play next video automatically', () => {
  store.setState({ course })

  const { next } = store.getState()
  next()

  const { currentModuleIndex, currentLessonIndex } = store.getState()
  expect(currentModuleIndex).toBe(0)
  expect(currentLessonIndex).toBe(1)
})
```

### Teste com multiplas pre-condicoes

```typescript
it('should jump to next module', () => {
  store.setState({ course, currentLessonIndex: 1 })

  const { next } = store.getState()
  next()

  const { currentModuleIndex, currentLessonIndex } = store.getState()
  expect(currentModuleIndex).toBe(1)
  expect(currentLessonIndex).toBe(0)
})
```

## Example

**Before (teste acoplado, sem isolamento):**
```typescript
import { useStore } from '.'

it('test play', () => {
  useStore.getState().play([1, 2])
  // Estado vaza para proximo teste!
})

it('test next', () => {
  // currentModuleIndex ja e 1 do teste anterior - FRAGIL
  useStore.getState().next()
})
```

**After (com isolamento correto):**
```typescript
import { useStore as store } from '.'

const initialState = store.getState()

beforeEach(() => {
  store.setState(initialState)
})

it('test play', () => {
  const { play } = store.getState()
  play([1, 2])
  const { currentModuleIndex, currentLessonIndex } = store.getState()
  expect(currentModuleIndex).toBe(1)
  expect(currentLessonIndex).toBe(2)
})

it('test next', () => {
  store.setState({ course })
  const { next } = store.getState()
  next()
  const { currentModuleIndex, currentLessonIndex } = store.getState()
  expect(currentModuleIndex).toBe(0)
  expect(currentLessonIndex).toBe(1)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Acessar store fora de componente React | `store.getState()` e `store.setState()` |
| Teste precisa de dados pre-existentes | `store.setState({ dados })` antes da action |
| Testes compartilham o mesmo store | `beforeEach` com `setState(initialState)` |
| Capturar estado inicial | Fora do `beforeEach`, no top-level do describe/arquivo |
| Importar store em teste | Renomear `useStore as store` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useStore()` em arquivo de teste | `store.getState()` |
| `initialState` dentro do `beforeEach` | `initialState` no top-level do arquivo |
| Testes que dependem da ordem de execucao | `beforeEach` resetando estado |
| `const state = useStore()` no teste | `const state = store.getState()` |
| Testar sem setar dados necessarios | `store.setState({ course })` antes da action |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
