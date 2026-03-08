# Code Examples: Criando Custom Hooks em React

## Exemplo 1 — Hook inline (ponto de partida)

O instrutor comeca criando o hook dentro do proprio `App.tsx` para mostrar que e apenas uma funcao:

```typescript
// App.tsx — hook definido inline (apenas para demonstracao)
function useMessage() {
  function show() {
    console.log("mensagem do meu proprio hook")
  }

  return { show }
}

function App() {
  const message = useMessage()

  return (
    <button onClick={() => message.show()}>
      Adicionar
    </button>
  )
}
```

**Resultado no console ao clicar:** `mensagem do meu proprio hook`

## Exemplo 2 — Hook extraido para arquivo separado

O instrutor extrai o hook para `src/hooks/useMessage.ts`:

```typescript
// src/hooks/useMessage.ts
export function useMessage() {
  function show() {
    console.log("mensagem do meu proprio hook")
  }

  return { show }
}
```

```typescript
// App.tsx
import { useMessage } from "./hooks/useMessage"

function App() {
  const { show } = useMessage() // desestruturacao direto

  return (
    <button onClick={() => show()}>
      Adicionar
    </button>
  )
}
```

**Nota:** extensao `.ts` (nao `.tsx`) porque hook nao renderiza JSX.

## Exemplo 3 — Hook com parametro no metodo

O instrutor adiciona `message` como parametro da funcao `show`:

```typescript
// src/hooks/useMessage.ts
export function useMessage() {
  function show(message: string) {
    console.log(message)
  }

  return { show }
}
```

```typescript
// App.tsx
import { useMessage } from "./hooks/useMessage"

function App() {
  const { show } = useMessage()

  return (
    <button onClick={() => show("Mensagem personalizada do meu hook")}>
      Adicionar
    </button>
  )
}
```

**Resultado:** `Mensagem personalizada do meu hook`

## Exemplo 4 — Hook com props tipadas (objeto)

O instrutor adiciona props ao hook com tipagem via `type`:

```typescript
// src/hooks/useMessage.ts
type Props = {
  name: string
}

export function useMessage({ name }: Props) {
  function show(message: string) {
    console.log(name, message)
  }

  return { show }
}
```

```typescript
// App.tsx
import { useMessage } from "./hooks/useMessage"

function App() {
  const { show } = useMessage({ name: "Rodrigo" })

  return (
    <button onClick={() => show("Mensagem personalizada do meu hook")}>
      Adicionar
    </button>
  )
}
```

**Resultado:** `Rodrigo Mensagem personalizada do meu hook`

## Exemplo 5 — Props extensiveis com objeto

O instrutor adiciona `age` para demonstrar extensibilidade:

```typescript
// src/hooks/useMessage.ts
type Props = {
  name: string
  age: number
}

export function useMessage({ name, age }: Props) {
  function show(message: string) {
    console.log(name, age, message)
  }

  return { show }
}
```

```typescript
// App.tsx — ordem nao importa com objeto!
const { show } = useMessage({ age: 18, name: "Rodrigo" })
```

**Resultado:** `Rodrigo 18 Mensagem personalizada do meu hook`

## Exemplo 6 — Contra-exemplo: parametros posicionais (problematico)

O instrutor demonstra por que parametros posicionais sao frageis:

```typescript
// NAO FACA ISSO — parametros posicionais
export function useMessage(name: string, age: number) {
  function show(message: string) {
    console.log(name, age, message)
  }

  return { show }
}

// Chamada correta (precisa lembrar a ordem):
useMessage("Rodrigo", 18)

// Chamada errada (inverte a ordem):
useMessage(18, "Rodrigo") // ERRO de tipo: 18 nao e string
```

O instrutor prefere a abordagem com objeto porque:
1. Ordem nao importa
2. Adicionar novos parametros nao quebra chamadas existentes
3. Nomes dos campos servem como documentacao inline

## Variacao — Hook com estado (mencionado pelo instrutor como proximo passo)

O instrutor menciona que hooks podem conter estado. Exemplo expandido:

```typescript
// src/hooks/useMessage.ts
import { useState } from "react"

type Props = {
  name: string
}

export function useMessage({ name }: Props) {
  const [history, setHistory] = useState<string[]>([])

  function show(message: string) {
    const fullMessage = `${name}: ${message}`
    console.log(fullMessage)
    setHistory(prev => [...prev, fullMessage])
  }

  function clear() {
    setHistory([])
  }

  return { show, clear, history }
}
```

```typescript
// App.tsx
const { show, clear, history } = useMessage({ name: "Rodrigo" })
```

## Variacao — Hook retornando multiplos metodos

```typescript
// src/hooks/useNotification.ts
type Props = {
  prefix: string
}

export function useNotification({ prefix }: Props) {
  function success(message: string) {
    console.log(`[${prefix}] SUCCESS: ${message}`)
  }

  function error(message: string) {
    console.error(`[${prefix}] ERROR: ${message}`)
  }

  function warn(message: string) {
    console.warn(`[${prefix}] WARN: ${message}`)
  }

  return { success, error, warn }
}
```