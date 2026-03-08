---
name: rs-full-stack-on-change
description: "Enforces React onChange pattern and controlled input state management when building forms, handling user input, or capturing field values in real time. Use when user asks to 'create a form', 'handle input change', 'capture form values', 'use useState with inputs', or 'build a controlled input'. Applies onChange with e.target.value, stores values in useState, and renders state updates in real time. Make sure to use this skill whenever implementing form inputs in React. Not for form submission, validation libraries, or uncontrolled refs."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-fundamentals
  tags: [react, onChange, useState, controlled-input, forms]
---

# onChange e Estado em Inputs React

> Capture o valor de cada input via onChange + e.target.value e armazene em useState para manter o componente sincronizado com o que o usuário digita.

## Rules

1. **Use onChange em todo input que precisa ser lido** — `onChange={(e) => setState(e.target.value)}`, porque sem onChange o componente não sabe o que o usuário digitou
2. **Nomeie o parâmetro do evento como `e`** — não `batata` ou nomes arbitrários, porque `e` é a convenção universal para event handler e facilita leitura por qualquer dev
3. **Acesse o valor via `e.target.value`** — não `e.value` ou `e.target.text`, porque `target.value` é o caminho correto do DOM para recuperar o conteúdo atual do input
4. **Crie um useState por campo** — `const [name, setName] = useState("")`, porque cada campo precisa de seu próprio estado para atualizar independentemente
5. **Prefixe a função de atualização com `set`** — `setName`, `setEmail`, `setDate`, porque é o padrão React e comunica que a função modifica estado
6. **Inicialize com string vazia para inputs de texto** — `useState("")`, porque o valor inicial deve corresponder ao tipo esperado do input

## How to write

### Estado + onChange básico

```tsx
import { useState } from "react"

function EventForm() {
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

### Múltiplos campos

```tsx
const [name, setName] = useState("")
const [date, setDate] = useState("")

<input onChange={(e) => setName(e.target.value)} />
<input type="date" onChange={(e) => setDate(e.target.value)} />
```

## Example

**Before (sem estado, console.log solto):**
```tsx
function EventForm() {
  return (
    <input
      onChange={(e) => console.log(e.target.value)}
    />
  )
}
```

**After (com estado controlado):**
```tsx
function EventForm() {
  const [name, setName] = useState("")

  return (
    <div>
      <input
        onChange={(e) => setName(e.target.value)}
      />
      <p>Evento: {name}</p>
    </div>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Input de texto simples | `useState("")` + `onChange={(e) => setSomething(e.target.value)}` |
| Precisa ver o valor na tela | Renderize `{state}` dentro de JSX — o React re-renderiza a cada mudança de estado |
| Debugging de input | Use `console.log(e.target.value)` temporariamente dentro do onChange |
| Parâmetro do evento | Nomeie como `e` (convenção) — funciona com qualquer nome mas `e` é padrão |
| Cada letra digitada dispara onChange | Comportamento normal — onChange dispara a cada keystroke, não só no blur |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `onChange={(batata) => ...}` | `onChange={(e) => ...}` |
| `console.log(e.target.value)` sem armazenar | `setName(e.target.value)` |
| `const [name, name_update] = useState()` | `const [name, setName] = useState("")` |
| `e.value` | `e.target.value` |
| Estado sem valor inicial: `useState()` | Com valor inicial: `useState("")` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Input nao atualiza na tela | Faltou `onChange` ou `setState` | Adicione `onChange={(e) => setState(e.target.value)}` |
| `e.target.value` retorna `undefined` | Acessou `e.value` em vez de `e.target.value` | Use o caminho completo `e.target.value` |
| Estado inicializa como `undefined` | `useState()` sem valor inicial | Use `useState("")` para inputs de texto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre onChange, ciclo de re-renderizacao e event object
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes