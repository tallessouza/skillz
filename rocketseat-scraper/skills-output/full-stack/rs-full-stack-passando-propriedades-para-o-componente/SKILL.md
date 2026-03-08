---
name: rs-full-stack-passando-propriedades
description: "Enforces React component props patterns when passing data to components, typing props with TypeScript, and destructuring parameters. Use when user asks to 'create a component', 'pass props', 'add properties to a component', 'make a component dynamic', or 'type component props'. Applies rules: always type props with TypeScript type/interface, use curly braces for dynamic content in JSX, destructure props in function parameters, never leave props as 'any'. Make sure to use this skill whenever creating or modifying React components that receive data. Not for state management, hooks, or context API patterns."
---

# Passando Propriedades Para Componentes React

> Componentes recebem propriedades tipadas e desestruturadas para manter dados dinamicos, consistentes e legiveis.

## Rules

1. **Sempre tipe as props com TypeScript** — crie um `type` ou `interface` antes do componente, porque sem tipagem o TypeScript aceita `any` e voce perde autocompletar e validacao de erros
2. **Use chaves para conteudo dinamico no JSX** — `{name}` nao `name`, porque sem chaves o React interpreta como texto literal e nao como valor da variavel
3. **Desestruture props no parametro da funcao** — `({ name })` nao `(props)`, porque acessa direto a propriedade sem prefixo `props.` e deixa claro o que o componente espera
4. **Nomeie o type com letra maiuscula** — `type ButtonProps` nao `type buttonProps`, porque types seguem PascalCase por convencao no TypeScript
5. **Passe todas as props obrigatorias** — se o type define `name: string`, todo uso do componente deve incluir `name`, porque o TypeScript vai reclamar e o componente pode renderizar vazio

## How to write

### Tipando props do componente

```tsx
type ButtonProps = {
  name: string
}

function Button({ name }: ButtonProps) {
  return <button>{name}</button>
}
```

### Usando o componente com props

```tsx
function App() {
  return (
    <>
      <Button name="Criar" />
      <Button name="Editar" />
      <Button name="Remover" />
    </>
  )
}
```

## Example

**Before (props sem tipo e sem desestruturacao):**

```tsx
function Button(props) {
  return <button>props.name</button>
}

// No App:
<Button name="Salvar" />
// Renderiza o texto literal "props.name" em todos os botoes
```

**After (com tipo, desestruturacao e chaves):**

```tsx
type ButtonProps = {
  name: string
}

function Button({ name }: ButtonProps) {
  return <button>{name}</button>
}

// No App:
<Button name="Salvar" />
// Renderiza "Salvar" corretamente
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente recebe dados do pai | Criar type com todas as props e desestruturar |
| Prop e texto simples | Passar entre aspas: `name="Criar"` |
| Prop e valor dinamico (variavel, expressao) | Passar entre chaves: `count={total}` |
| Componente tem muitas props | Desestruturar apenas as usadas no corpo |
| Prop e opcional | Marcar com `?` no type: `subtitle?: string` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `function Button(props)` sem tipo | `function Button({ name }: ButtonProps)` |
| `<button>props.name</button>` (sem chaves) | `<button>{name}</button>` |
| `type props = { ... }` (minuscula) | `type ButtonProps = { ... }` (PascalCase) |
| `props.name` dentro do JSX com props inteiro | Desestruturar: `{ name }` no parametro |
| `<Button />` omitindo prop obrigatoria | `<Button name="Criar" />` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre props, tipagem e desestruturacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes