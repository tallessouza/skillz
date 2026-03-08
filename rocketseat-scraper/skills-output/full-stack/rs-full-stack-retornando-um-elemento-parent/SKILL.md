---
name: rs-full-stack-retornando-um-elemento-parent
description: "Enforces React single parent element rule when writing JSX components. Use when user asks to 'create a component', 'return multiple elements', 'fix JSX error', or 'wrap elements in React'. Applies rules: every component returns exactly one parent element, use Fragment when no visual wrapper needed, use div or semantic HTML when styling applies. Make sure to use this skill whenever writing JSX that returns multiple sibling elements. Not for CSS layout, state management, or non-React templating."
---

# Retornando um Elemento Parent

> Todo componente React deve retornar exatamente um elemento pai — nunca múltiplos elementos irmãos soltos.

## Rules

1. **Retorne sempre um único elemento pai** — JSX exige um wrapper porque React precisa de uma árvore com raiz única para reconciliação do Virtual DOM
2. **Use `<div>` ou HTML semântico quando precisar de estilização** — porque o wrapper participa do layout e pode receber classes CSS
3. **Use Fragment (`<>...</>`) quando não precisar de impacto visual** — porque Fragment não gera nenhum elemento no DOM real, evitando divs desnecessárias
4. **Elementos filhos (children) podem ser quantos quiser** — a regra se aplica apenas ao nível raiz do retorno, não aos filhos internos

## How to write

### Com div (quando precisa de estilização)

```tsx
function MyComponent() {
  return (
    <div>
      <button>Primeiro</button>
      <button>Segundo</button>
      <button>Terceiro</button>
    </div>
  )
}
```

### Com Fragment (sem impacto visual)

```tsx
function MyComponent() {
  return (
    <>
      <button>Primeiro</button>
      <button>Segundo</button>
      <button>Terceiro</button>
    </>
  )
}
```

## Example

**Before (erro — múltiplos elementos raiz):**

```tsx
function Buttons() {
  return (
    <button>Salvar</button>
    <button>Cancelar</button>
  )
}
// ❌ Erro: "JSX expressions must have one parent element"
```

**After (com Fragment):**

```tsx
function Buttons() {
  return (
    <>
      <button>Salvar</button>
      <button>Cancelar</button>
    </>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa aplicar CSS no wrapper | Use `<div>` ou elemento semântico (`<section>`, `<nav>`) |
| Wrapper não deve afetar o DOM | Use Fragment `<>...</>` |
| Precisa passar `key` no Fragment (ex: listas) | Use `<Fragment key={id}>` com import explícito |
| Retorna um único elemento | Nenhum wrapper necessário |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| Dois elementos irmãos soltos no return | Envolva com `<div>` ou `<>...</>` |
| `<div>` desnecessária só para satisfazer a regra | `<>...</>` (Fragment) quando não precisa de estilização |
| Fragment quando precisa de flex/grid no container | `<div className="container">` com a classe de layout |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre a regra do elemento pai e Fragment
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações