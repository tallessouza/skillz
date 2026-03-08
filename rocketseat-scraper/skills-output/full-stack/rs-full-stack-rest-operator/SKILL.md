---
name: rs-full-stack-rest-operator
description: "Enforces the rest operator pattern when forwarding props in React components. Use when user asks to 'create a component', 'forward props', 'wrap a button', 'extend HTML element', or 'spread props'. Applies destructuring with ...rest to capture and forward all remaining props to underlying HTML elements. Make sure to use this skill whenever building wrapper components that extend native HTML elements. Not for state management, hooks, or non-component utility functions."
---

# Rest Operator em Componentes React

> Ao criar componentes wrapper, use o rest operator (`...rest`) para capturar e repassar todas as propriedades restantes ao elemento nativo, em vez de passar cada prop individualmente.

## Rules

1. **Extraia apenas props personalizadas, repasse o resto** — desestruture as props customizadas explicitamente e capture tudo mais com `...rest`, porque isso garante que novas props nativas funcionem automaticamente sem alterar o componente
2. **Sempre espalhe `...rest` no elemento nativo** — coloque `{...rest}` no elemento HTML subjacente, porque isso preserva todas as funcionalidades nativas (onClick, disabled, aria-*, etc.)
3. **Combine tipagem customizada com a do elemento nativo** — estenda `React.ComponentProps<'element'>` ou `React.ButtonHTMLAttributes<HTMLButtonElement>`, porque isso habilita autocomplete de todas as props nativas no consumidor

## How to write

### Componente wrapper com rest operator

```tsx
// Extraia props customizadas, capture o restante com ...rest
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary'
}

function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} {...rest} />
  )
}
```

### Uso no componente pai

```tsx
// Todas as props nativas do button funcionam automaticamente
<Button variant="primary" onClick={() => alert('Criado!')}>
  Criar
</Button>
```

## Example

**Before (passando props uma a uma):**

```tsx
interface ButtonProps {
  title: string
  onClick?: () => void
}

function Button({ title, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>{title}</button>
  )
}

// Problema: disabled, type, aria-label etc. não funcionam
<Button title="Criar" onClick={handleClick} />
```

**After (com rest operator):**

```tsx
interface ButtonProps extends React.ComponentProps<'button'> {
  title: string
}

function Button({ title, ...rest }: ButtonProps) {
  return (
    <button {...rest}>{title}</button>
  )
}

// Todas as props nativas funcionam automaticamente
<Button title="Criar" onClick={handleClick} disabled={isLoading} aria-label="Criar item" />
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente wrapping um elemento HTML nativo | Estenda o tipo do elemento + use `...rest` |
| Precisa de 1-2 props customizadas + props nativas | Desestruture as customizadas, `...rest` para o resto |
| Componente puramente customizado sem elemento nativo | Defina interface própria, rest operator não se aplica |
| Precisa interceptar uma prop antes de repassar | Desestruture a prop específica, transforme, e passe junto com `...rest` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `function Button({ onClick, disabled, type, className })` (listando cada prop nativa) | `function Button({ variant, ...rest })` (só props customizadas explícitas) |
| `<button onClick={onClick} disabled={disabled}>` (repassando uma a uma) | `<button {...rest}>` (spread de todas as props) |
| `interface ButtonProps { onClick?: () => void }` (redefinindo props nativas) | `interface ButtonProps extends ComponentProps<'button'> {}` (estendendo) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre rest operator vs passagem explícita
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variações para diferentes elementos HTML