# Code Examples: useEffect em Múltiplos Contextos

## Exemplo 1: useEffect dentro de custom hook (useMessage)

O hook useMessage encapsula estado e efeito colateral:

```typescript
// hooks/useMessage.ts
import { useState, useEffect } from "react"

function useMessage() {
  const [message, setMessage] = useState("Oi")

  useEffect(() => {
    console.log("useEffect do useMessage")
  }, [])

  return { message, setMessage }
}

export { useMessage }
```

Ponto importante: o useEffect é declarado **antes do return**, como qualquer outro hook. A ordem dos hooks dentro da função importa para o React.

## Exemplo 2: useEffect dentro de componente (Button)

```typescript
// components/Button.tsx
import { useEffect } from "react"

interface ButtonProps {
  label: string
}

function Button({ label }: ButtonProps) {
  useEffect(() => {
    console.log("useEffect do componente Button")
  }, [])

  return <button>{label}</button>
}

export { Button }
```

## Exemplo 3: App consumindo ambos os contextos

```typescript
// App.tsx
import { useEffect } from "react"
import { useMessage } from "./hooks/useMessage"
import { Button } from "./components/Button"

function App() {
  const { message } = useMessage()

  useEffect(() => {
    console.log("Oi") // useEffect do próprio App
  }, [])

  return (
    <div>
      <p>{message}</p>
      <Button label="Ação 1" />
      <Button label="Ação 2" />
    </div>
  )
}
```

### Saída no console ao carregar a página:

```
useEffect do componente Button   // primeira instância
useEffect do componente Button   // segunda instância
useEffect do useMessage          // hook dentro do App
Oi                                // useEffect do App
```

## Exemplo 4: Variação — hook com efeito que observa dependência

```typescript
function useMessage() {
  const [message, setMessage] = useState("Oi")

  // Efeito que reage a mudanças no message
  useEffect(() => {
    console.log("Mensagem mudou para:", message)
  }, [message])

  return { message, setMessage }
}
```

## Exemplo 5: Variação — componente com múltiplos useEffects

```typescript
function Button({ label }: { label: string }) {
  useEffect(() => {
    console.log("Button montou")
    return () => console.log("Button desmontou")
  }, [])

  useEffect(() => {
    console.log("Label mudou para:", label)
  }, [label])

  return <button>{label}</button>
}
```

## Exemplo 6: Limpeza após experimentação

O instrutor demonstrou o processo de limpeza — remover useEffects de teste:

**Antes da limpeza (código de experimentação):**
```typescript
// Button.tsx — com useEffect de teste
import { useEffect } from "react"

function Button({ label }: { label: string }) {
  useEffect(() => {
    console.log("useEffect do componente")
  }, [])

  return <button>{label}</button>
}
```

**Após limpeza (código limpo):**
```typescript
// Button.tsx — sem useEffect de teste
function Button({ label }: { label: string }) {
  return <button>{label}</button>
}
```

Note que a importação do useEffect também foi removida quando o hook não é mais usado.