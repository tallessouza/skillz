# Code Examples: Redux DevTools

## Instalacao da extensao

### Chrome / Edge / Opera
1. Acesse a Chrome Web Store
2. Busque "Redux DevTools"
3. Clique em "Adicionar ao Chrome"
4. Reinicie o navegador

### Firefox
1. Acesse Firefox Add-ons
2. Busque "Redux DevTools"
3. Instale
4. Reinicie o navegador

## Configuracao no projeto (se necessario)

Na maioria dos projetos com Redux Toolkit, o DevTools ja funciona automaticamente. Para configuracoes manuais:

```typescript
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: rootReducer,
  // Redux Toolkit ja habilita DevTools automaticamente em dev
  // Para controle manual:
  devTools: process.env.NODE_ENV !== 'production',
})
```

Para projetos com `createStore` legado:

```typescript
import { createStore } from 'redux'

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
```

## Fluxo de uso demonstrado na aula

### 1. Abrindo o DevTools

```
F12 (ou Inspecionar Elemento) → Aba "Redux"
```

### 2. Observando o estado inicial

```
Aba Redux → State
// Mostra a arvore completa do estado global
// Ex:
{
  todos: [
    { id: 1, text: 'Primeiro todo', completed: false },
    { id: 2, text: 'Segundo todo', completed: true }
  ]
}
```

### 3. Disparando uma action pela aplicacao

```typescript
// No componente React
dispatch(addTodo('novo todo'))
```

No DevTools, aparece no painel esquerdo:
```
todos/addTodo
```

Clicando na action:
```json
{
  "type": "todos/addTodo",
  "payload": "novo todo"
}
```

### 4. Verificando o Diff

```diff
// Aba Diff mostra:
+ todos[2]: { id: 3, text: "novo todo", completed: false }
```

### 5. Usando a timeline

```
Timeline (barra inferior):
[init] → [addTodo] → [addTodo] → [addTodo]
  ←  arraste para voltar    →  arraste para avancar
  ▶  play para reproduzir sequencialmente
```

### 6. Copiando teste sugerido

O DevTools gera algo como:

```typescript
it('should handle addTodo', () => {
  const state = todosReducer(initialState, {
    type: 'todos/addTodo',
    payload: 'novo todo'
  })
  
  expect(state.todos).toHaveLength(3)
  expect(state.todos[2].text).toBe('novo todo')
})
```

## Desabilitando em producao

```typescript
const store = configureStore({
  reducer: rootReducer,
  devTools: false, // desabilita em producao
})
```

Ou com controle por ambiente:

```typescript
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development',
})
```