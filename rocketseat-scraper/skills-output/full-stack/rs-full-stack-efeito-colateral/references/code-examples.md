# Code Examples: Efeito Colateral com useEffect

## Exemplo 1: useEffect básico com dependência (da aula)

O ponto de partida — useEffect que loga toda mudança de `count`:

```tsx
import { useState, useEffect } from "react"

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("O valor mudou")
  }, [count])

  function handleAdd() {
    setCount(prevState => prevState + 1)
  }

  function handleRemove() {
    setCount(prevState => prevState - 1)
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

**Comportamento:** Cada clique em Adicionar ou Remover dispara "O valor mudou" no console. Mensagens iguais são agrupadas pelo browser com contador.

## Exemplo 2: useEffect com condicional e valor interpolado (da aula)

Evolução — só loga quando `count > 0` e mostra o valor:

```tsx
useEffect(() => {
  if (count > 0) {
    console.log(`O valor mudou para ${count}`)
  }
}, [count])
```

**Comportamento:** Quando `count` chega a zero, nenhuma mensagem aparece. Cada mensagem agora é única (não agrupa).

## Exemplo 3: Handler com proteção contra negativo (da aula)

Versão final — `handleRemove` só decrementa se `count > 0`:

```tsx
function handleRemove() {
  if (count > 0) {
    setCount(prevState => prevState - 1)
  }
}
```

**Comportamento:** Botão Remover para de funcionar quando `count` é zero. Não gera valores negativos.

## Exemplo 4: Variação — useEffect para salvar no localStorage

Mesmo padrão aplicado a persistência:

```tsx
const [count, setCount] = useState(() => {
  const saved = localStorage.getItem("count")
  return saved ? Number(saved) : 0
})

useEffect(() => {
  localStorage.setItem("count", String(count))
}, [count])
```

**Quando usar:** Toda vez que `count` muda, salva automaticamente. Na próxima visita, recupera o valor.

## Exemplo 5: Variação — useEffect para atualizar título da página

```tsx
useEffect(() => {
  document.title = `Contador: ${count}`
}, [count])
```

**Quando usar:** Feedback visual na aba do browser mostrando o valor atual.

## Exemplo 6: Variação — Múltiplas dependências

```tsx
const [count, setCount] = useState(0)
const [step, setStep] = useState(1)

useEffect(() => {
  console.log(`Count: ${count}, Step: ${step}`)
}, [count, step])

function handleAdd() {
  setCount(prevState => prevState + step)
}
```

**Quando usar:** Quando o efeito depende de mais de um estado. O useEffect executa quando QUALQUER dependência muda.

## Exemplo 7: Variação — Proteção de limite superior e inferior

```tsx
const MAX_COUNT = 10

function handleAdd() {
  if (count < MAX_COUNT) {
    setCount(prevState => prevState + 1)
  }
}

function handleRemove() {
  if (count > 0) {
    setCount(prevState => prevState - 1)
  }
}

useEffect(() => {
  if (count === MAX_COUNT) {
    console.log("Limite máximo atingido!")
  }
  if (count === 0) {
    console.log("Contador zerado")
  }
}, [count])
```

**Quando usar:** Quando há limites em ambas as direções. Validação nos handlers, notificação no useEffect.

## Exemplo 8: Componente completo final (da aula)

```tsx
import { useState, useEffect } from "react"

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count > 0) {
      console.log(`O valor mudou para ${count}`)
    }
  }, [count])

  function handleAdd() {
    setCount(prevState => prevState + 1)
  }

  function handleRemove() {
    if (count > 0) {
      setCount(prevState => prevState - 1)
    }
  }

  return (
    <div>
      <span>{count}</span>
      <button onClick={handleAdd}>Adicionar</button>
      <button onClick={handleRemove}>Remover</button>
    </div>
  )
}

export default App
```