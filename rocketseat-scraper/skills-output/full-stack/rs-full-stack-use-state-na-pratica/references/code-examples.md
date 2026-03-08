# Code Examples: useState na Prática

## Exemplo 1: Setup básico do useState

Importação e declaração do estado com valor inicial zero:

```tsx
import { useState } from "react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <span>{count}</span>
    </div>
  )
}
```

Mudando o valor inicial para verificar que funciona:
```tsx
const [count, setCount] = useState(5) // exibe 5 na tela
```

## Exemplo 2: Incremento e decremento com arrow functions inline

```tsx
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>Adicionar</button>
      <button onClick={() => setCount(count - 1)}>Remover</button>
    </div>
  )
}
```

## Exemplo 3: Handlers extraídos em funções nomeadas

Evolução do exemplo anterior — mesma funcionalidade, melhor organização:

```tsx
import { useState } from "react"

function App() {
  const [count, setCount] = useState(0)

  function handleAdd() {
    setCount(count + 1)
  }

  function handleRemove() {
    setCount(count - 1)
  }

  return (
    <div>
      <span>{count}</span>
      <button onClick={handleAdd}>Adicionar</button>
      <button onClick={handleRemove}>Remover</button>
    </div>
  )
}
```

## Exemplo 4: Variável comum — demonstração de que NÃO funciona

O instrutor cria este código para provar que variáveis `let` não disparam re-renderização:

```tsx
function App() {
  let count = 0

  function handleAdd() {
    count = count + 1
    console.log(count) // o valor muda no console, mas a tela NÃO atualiza
  }

  function handleRemove() {
    count = count - 1
  }

  return (
    <div>
      <span>{count}</span>
      <button onClick={handleAdd}>Adicionar</button>
      <button onClick={handleRemove}>Remover</button>
    </div>
  )
}
```

**Por que não funciona:** O React não monitora variáveis `let`. Sem chamar `setState`, o React não sabe que precisa re-renderizar. O valor de `count` muda na memória mas nunca aparece na tela.

## Exemplo 5: Variações para outros tipos de estado

### Estado com string
```tsx
const [name, setName] = useState("")

function handleChange(event) {
  setName(event.target.value)
}

return <input value={name} onChange={handleChange} />
```

### Estado com boolean
```tsx
const [isVisible, setIsVisible] = useState(false)

function toggleVisibility() {
  setIsVisible(!isVisible)
}

return (
  <div>
    <button onClick={toggleVisibility}>
      {isVisible ? "Ocultar" : "Mostrar"}
    </button>
    {isVisible && <p>Conteúdo visível</p>}
  </div>
)
```

### Estado com array
```tsx
const [items, setItems] = useState([])

function addItem(newItem) {
  setItems([...items, newItem])
}
```

### Estado com objeto
```tsx
const [user, setUser] = useState({ name: "", email: "" })

function updateName(newName) {
  setUser({ ...user, name: newName })
}
```

## Exemplo 6: Erro comum — executar setState direto no onClick

```tsx
// ERRADO — executa imediatamente e causa loop infinito
<button onClick={setCount(count + 1)}>Adicionar</button>

// CORRETO — passa referência de função
<button onClick={() => setCount(count + 1)}>Adicionar</button>

// CORRETO — passa handler nomeado
<button onClick={handleAdd}>Adicionar</button>
```

## Exemplo 7: Contador completo com limite

Extensão prática do exemplo da aula com validação de limites:

```tsx
import { useState } from "react"

function Counter() {
  const [count, setCount] = useState(0)

  function handleAdd() {
    setCount(count + 1)
  }

  function handleRemove() {
    if (count > 0) {
      setCount(count - 1)
    }
  }

  return (
    <div>
      <button onClick={handleRemove} disabled={count === 0}>
        Remover
      </button>
      <span>{count}</span>
      <button onClick={handleAdd}>Adicionar</button>
    </div>
  )
}
```