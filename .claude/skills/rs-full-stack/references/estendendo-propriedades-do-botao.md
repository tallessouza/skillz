---
name: rs-full-stack-estendendo-propriedades-do-botao
description: "Enforces React component prop extension patterns when wrapping native HTML elements in TypeScript. Use when user asks to 'create a button component', 'wrap an HTML element', 'extend element props', 'type component properties', or 'reuse native HTML attributes'. Applies React.ComponentProps to inherit all native props instead of manually redeclaring them. Make sure to use this skill whenever creating wrapper components around native HTML elements. Not for form libraries, state management, or non-TypeScript React projects."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-typescript-props
  tags: [react, typescript, props, ComponentProps, wrapper, html-elements]
---

# Estendendo Propriedades de Elementos HTML em React

> Ao criar componentes que encapsulam elementos HTML nativos, estenda a tipagem nativa com `React.ComponentProps` em vez de redeclarar propriedades manualmente.

## Rules

1. **Use `React.ComponentProps<"element">` para herdar tipagem nativa** — porque elementos HTML têm dezenas de propriedades (onClick, className, disabled, etc.) e listar cada uma manualmente é inviável e propenso a erros
2. **Combine props nativas com props customizadas usando `&`** — `type Props = React.ComponentProps<"button"> & { customProp: string }`, porque isso preserva todas as props nativas enquanto adiciona as específicas do componente
3. **Repasse as props herdadas para o elemento nativo** — desestruture e passe via spread ou individualmente, porque declarar o tipo sem repassar faz a prop ser aceita mas ignorada silenciosamente

## How to write

### Tipo com extensão de props nativas

```typescript
// Combina props nativas do button com props customizadas
type ButtonProps = React.ComponentProps<"button"> & {
  name: string
}
```

### Componente com repasse de props

```typescript
function Button({ name, onClick, ...rest }: ButtonProps) {
  return (
    <button onClick={onClick} {...rest}>
      {name}
    </button>
  )
}
```

### Uso no componente pai

```typescript
function App() {
  return (
    <Button
      name="Criar"
      onClick={() => alert("Criado!")}
    />
  )
}
```

## Example

**Before (redeclarando props manualmente):**

```typescript
type ButtonProps = {
  name: string
  onClick: () => void
  // E as outras dezenas de props? disabled? className? type?
}

function Button({ name, onClick }: ButtonProps) {
  return <button onClick={onClick}>{name}</button>
}
```

**After (estendendo props nativas):**

```typescript
type ButtonProps = React.ComponentProps<"button"> & {
  name: string
}

function Button({ name, onClick, ...rest }: ButtonProps) {
  return (
    <button onClick={onClick} {...rest}>
      {name}
    </button>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Wrapper de qualquer elemento HTML (button, input, div) | Use `React.ComponentProps<"element">` |
| Componente que NÃO renderiza elemento nativo diretamente | Defina apenas as props que realmente usa |
| Precisa de ref forwarding | Use `React.ComponentPropsWithRef<"element">` |
| Quer excluir props nativas específicas | Use `Omit<React.ComponentProps<"button">, "onClick">` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `onClick: () => void` manual no type | `React.ComponentProps<"button">` herda onClick |
| `className?: string` manual no type | `React.ComponentProps<"div">` herda className |
| Aceitar prop no tipo mas não repassar ao elemento | Desestruturar e repassar com spread `{...rest}` |
| `React.HTMLAttributes<HTMLButtonElement>` | `React.ComponentProps<"button">` (mais simples e completo) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Prop nativa nao funciona no componente wrapper | Props aceitas no tipo mas nao repassadas ao elemento | Usar spread `{...rest}` para repassar props restantes |
| Erro de tipo ao estender ComponentProps | Conflito entre prop customizada e prop nativa com mesmo nome | Usar `Omit` para excluir a prop nativa conflitante antes de combinar |
| Ref nao funciona no componente wrapper | `ComponentProps` nao inclui ref por padrao | Usar `ComponentPropsWithRef` e `forwardRef` |
| TypeScript nao reconhece `React.ComponentProps` | Import do React ausente ou versao antiga | Verificar `import React from 'react'` e versao do `@types/react` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre extensão de tipagem, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações para diferentes elementos