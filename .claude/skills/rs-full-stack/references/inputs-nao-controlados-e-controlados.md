---
name: rs-full-stack-inputs-nao-controlados-e-controlados
description: "Enforces correct controlled and uncontrolled input patterns in React forms. Use when user asks to 'create a form', 'handle input', 'build a controlled input', 'clear form fields', 'sync input state', or any React form task. Applies rules: always bind value prop to state for controlled inputs, use onChange to capture input, reset state to clear fields. Make sure to use this skill whenever building React forms or handling user input. Not for server-side validation, HTML-only forms, or non-React frameworks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-forms
  tags: [react, controlled-input, uncontrolled-input, useState, forms, state]
---

# Inputs Controlados e Não Controlados no React

> Todo input que precisa ser manipulado programaticamente deve ser controlado — vincule `value` ao estado e `onChange` ao setter.

## Rules

1. **Vincule `value` ao estado para controlar o input** — `<input value={name} />`, porque sem isso o React não consegue atualizar o campo visualmente quando o estado muda
2. **Use `onChange` para capturar o conteúdo** — `onChange={e => setName(e.target.value)}`, porque é o mecanismo padrão do React para sincronizar input → estado
3. **Limpe campos resetando o estado** — `setName("")` limpa o input automaticamente quando ele é controlado, porque o `value` reflete o estado
4. **Input não controlado = apenas leitura do valor** — sem `value` vinculado, o React pega o conteúdo mas não consegue manipulá-lo de volta
5. **Defina valor inicial no estado, não no input** — `useState("Rodrigo")` em vez de `defaultValue="Rodrigo"`, porque o estado é a fonte única de verdade

## How to write

### Input controlado (padrão recomendado)

```tsx
const [name, setName] = useState("")

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### Limpar campo ao submeter

```tsx
function handleSave() {
  // ... lógica de salvar
  setName("")  // limpa o input automaticamente
}
```

### Valor inicial via estado

```tsx
const [name, setName] = useState("Rodrigo")
// O input já renderiza com "Rodrigo" preenchido
```

## Example

**Before (input não controlado — bug ao limpar):**

```tsx
const [name, setName] = useState("")

function handleSave() {
  console.log(name)
  setName("")  // estado limpa, mas input mantém o texto visível
}

<input onChange={(e) => setName(e.target.value)} />
```

**After (input controlado — sincronizado):**

```tsx
const [name, setName] = useState("")

function handleSave() {
  console.log(name)
  setName("")  // estado limpa E input limpa visualmente
}

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa limpar, resetar ou preencher o input via código | Input controlado (`value={estado}`) |
| Precisa apenas ler o valor no submit (formulário simples) | Input não controlado pode ser suficiente |
| Precisa validar em tempo real enquanto digita | Input controlado |
| Precisa definir valor inicial dinâmico | `useState(valorInicial)` + input controlado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<input onChange={...} />` quando precisa manipular o valor | `<input value={state} onChange={...} />` |
| `setName("")` esperando limpar input não controlado | Vincule `value={name}` primeiro |
| `defaultValue={name}` em input que precisa ser atualizado | `value={name}` para controle total |
| Manipular DOM diretamente para limpar input (`ref.current.value = ""`) | `setState("")` com input controlado |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Input nao limpa ao resetar estado | Input nao controlado (sem `value` vinculado) | Adicionar `value={state}` ao input |
| Input nao aceita digitacao | `value` vinculado mas sem `onChange` | Adicionar `onChange={(e) => setState(e.target.value)}` |
| Valor inicial nao aparece no input | Usando `defaultValue` com controle de estado | Usar `useState("valorInicial")` + `value={state}` |
| `setState("")` nao limpa o campo visual | Input sem `value` prop (nao controlado) | Vincular `value={state}` para sincronizar estado com UI |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre sincronizacao estado/UI e quando usar cada tipo
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes