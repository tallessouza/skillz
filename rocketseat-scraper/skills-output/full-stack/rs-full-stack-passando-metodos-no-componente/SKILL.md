---
name: rs-full-stack-passando-metodos-no-componente
description: "Enforces correct patterns for passing functions as props to React components. Use when user asks to 'pass a callback', 'handle click in component', 'create onClick prop', 'pass function to child component', or 'communicate between components'. Applies rules: type callbacks with arrow function notation, mark optional with '?', destructure in component signature, forward native event handlers. Make sure to use this skill whenever creating interactive React components that receive behavior from parents. Not for state management, context API, or event bubbling in vanilla JS."
---

# Passando Métodos como Props em Componentes React

> Componentes recebem comportamento dos pais via props tipadas com notação de arrow function, repassando-as para elementos nativos.

## Rules

1. **Tipe callbacks com notação de arrow function** — `onClick: () => void` não `onClick: Function`, porque `Function` não garante a assinatura e perde type safety
2. **Marque callbacks opcionais com `?`** — `onClick?: () => void`, porque nem todo uso do componente precisa do handler
3. **Desestruture callbacks junto com outras props** — `{ title, onClick }`, porque mantém consistência com props de dados
4. **Repasse callbacks para elementos nativos diretamente** — `<button onClick={onClick}>`, porque preserva a API nativa sem wrappers desnecessários

## How to write

### Tipagem de props com callback

```tsx
interface ButtonProps {
  title: string
  onClick?: () => void
}
```

### Componente que recebe e repassa callback

```tsx
function Button({ title, onClick }: ButtonProps) {
  return <button onClick={onClick}>{title}</button>
}
```

### Uso do componente com callback

```tsx
function App() {
  return (
    <Button
      title="Criar"
      onClick={() => alert('Criado!')}
    />
  )
}
```

## Example

**Before (callback sem tipagem, prop obrigatória sem necessidade):**
```tsx
interface ButtonProps {
  title: string
  onClick: Function
}

function Button(props: ButtonProps) {
  return <button onClick={() => props.onClick()}>{props.title}</button>
}
```

**After (com esta skill aplicada):**
```tsx
interface ButtonProps {
  title: string
  onClick?: () => void
}

function Button({ title, onClick }: ButtonProps) {
  return <button onClick={onClick}>{title}</button>
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Callback sem retorno | Tipe como `() => void` |
| Callback que recebe dados do filho | Tipe com parâmetros: `(value: string) => void` |
| Callback opcional | Use `?` na interface |
| Callback repassada para elemento nativo | Atribua diretamente sem wrapper |
| Componente nunca usado sem callback | Mantenha como prop obrigatória (sem `?`) |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `onClick: Function` | `onClick: () => void` |
| `props.onClick && props.onClick()` (no JSX) | `<button onClick={onClick}>` (opcional já é seguro) |
| `onClick={() => props.onClick()}` (wrapper desnecessário) | `onClick={props.onClick}` (referência direta) |
| `any` para callbacks | Assinatura explícita com tipos dos parâmetros |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre comunicação pai-filho via props, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações