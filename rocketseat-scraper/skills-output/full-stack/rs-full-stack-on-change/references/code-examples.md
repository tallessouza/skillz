# Code Examples: onChange e Estado em Inputs React

## Exemplo 1: Console.log para debugging (demonstrado na aula)

O instrutor começou sem estado, apenas observando o comportamento do onChange:

```tsx
function App() {
  return (
    <input
      type="text"
      placeholder="Nome do evento"
      onChange={(e) => console.log(e.target.value)}
    />
  )
}
```

**Resultado no console ao digitar "React":**
```
R
RE
REA
REAC
REACT
```

**Ao apagar o "T":**
```
REAC
```

## Exemplo 2: onChange + useState (demonstrado na aula)

O instrutor evoluiu para armazenar o valor em estado:

```tsx
import { useState } from "react"

function App() {
  const [name, setName] = useState("")

  return (
    <div>
      <input
        type="text"
        placeholder="Nome do evento"
        onChange={(e) => setName(e.target.value)}
      />
      <p>Evento: {name}</p>
    </div>
  )
}
```

**Comportamento:** Conforme o usuário digita, o texto ao lado de "Evento:" atualiza em tempo real.

## Exemplo 3: Nomenclatura do parâmetro de evento

O instrutor demonstrou que o parâmetro é livre:

```tsx
// Funciona, mas não é convenção
onChange={(batata) => console.log(batata.target.value)}

// Convenção aceita
onChange={(e) => setName(e.target.value)}

// Também aceito (mais verboso)
onChange={(event) => setName(event.target.value)}
```

## Variação: Múltiplos campos de formulário

Expandindo o padrão da aula para um formulário completo:

```tsx
import { useState } from "react"

function EventForm() {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")

  return (
    <form>
      <input
        type="text"
        placeholder="Nome do evento"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Local"
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
      />

      <p>Evento: {name}</p>
      <p>Local: {location}</p>
      <p>Data: {date}</p>
    </form>
  )
}
```

## Variação: onChange com handler extraído

Quando a lógica fica mais complexa, extraia o handler:

```tsx
function EventForm() {
  const [name, setName] = useState("")

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  return (
    <input
      type="text"
      placeholder="Nome do evento"
      onChange={handleNameChange}
    />
  )
}
```

## Variação: Debugging com estado visível

Combinando console.log e estado (útil durante desenvolvimento):

```tsx
function EventForm() {
  const [name, setName] = useState("")

  return (
    <div>
      <input
        onChange={(e) => {
          console.log("Valor atual:", e.target.value)
          setName(e.target.value)
        }}
      />
      <pre>{JSON.stringify({ name }, null, 2)}</pre>
    </div>
  )
}
```

## Variação: Select e Textarea seguem o mesmo padrão

```tsx
const [description, setDescription] = useState("")
const [category, setCategory] = useState("")

<textarea
  onChange={(e) => setDescription(e.target.value)}
/>

<select onChange={(e) => setCategory(e.target.value)}>
  <option value="">Selecione</option>
  <option value="tech">Tecnologia</option>
  <option value="music">Música</option>
</select>
```