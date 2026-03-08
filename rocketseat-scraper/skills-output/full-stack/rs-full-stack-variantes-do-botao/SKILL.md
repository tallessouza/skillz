---
name: rs-full-stack-variantes-do-botao
description: "Enforces React component variant patterns using clsx and tailwind-merge when creating reusable UI components with multiple visual variations. Use when user asks to 'create a button variant', 'add icon button', 'merge tailwind classes', 'create component variations', or 'build reusable component with variants'. Applies classMerge utility, variant objects, and className passthrough patterns. Make sure to use this skill whenever building UI components that need multiple visual states or conditional Tailwind classes. Not for state management, API routes, or CSS-in-JS solutions."
---

# Variantes de Componentes com Tailwind CSS

> Crie variações visuais de componentes usando um objeto de variantes, clsx para junção condicional e tailwind-merge para deduplicação de classes.

## Rules

1. **Crie um utilitário classMerge** — combine `clsx` + `twMerge` em uma função única, porque clsx unifica condicionalmente e twMerge deduplica classes Tailwind com performance
2. **Defina variantes como objeto constante** — `const variants = { button: { basic: "...", icon: "..." } }`, porque centraliza todas as variações em um só lugar
3. **Use tipagem para variantes** — defina as variantes possíveis na interface de props com union type, porque previne variantes inválidas em tempo de compilação
4. **Sempre defina um valor padrão** — destructure com fallback `variant = "basic"`, porque garante que o componente funciona sem prop explícita
5. **Passe className como última classe no classMerge** — `classMerge([...base, variants.button[variant], className])`, porque permite override pontual onde o componente é usado
6. **Separe classes base de classes variantes** — classes comuns ficam no array principal, classes que mudam ficam no objeto de variantes, porque evita duplicação

## How to write

### Utilitário classMerge

```typescript
// src/utils/classmerge.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function classMerge(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Objeto de variantes

```typescript
const variants = {
  button: {
    basic: "h-12",
    icon: "h-12 w-12",
  },
}
```

### Componente com variantes

```tsx
import { classMerge } from "@/utils/classmerge"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  variant?: "basic" | "icon"
}

export function Button({ isLoading, variant = "basic", className, ...rest }: ButtonProps) {
  return (
    <button
      className={classMerge([
        "flex items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-gray-100",
        variants.button[variant],
        className,
      ])}
      {...rest}
    />
  )
}
```

## Example

**Before (classe fixa, sem variações):**
```tsx
export function Button({ children }) {
  return (
    <button className="h-12 flex items-center justify-center rounded-xl bg-green-600 text-sm">
      {children}
    </button>
  )
}

// Uso: precisa de um botão quadrado com ícone? Cria outro componente.
```

**After (com variantes e classMerge):**
```tsx
const variants = {
  button: {
    basic: "h-12",
    icon: "h-12 w-12",
  },
}

export function Button({ variant = "basic", className, ...rest }: ButtonProps) {
  return (
    <button
      className={classMerge([
        "flex items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold",
        variants.button[variant],
        className,
      ])}
      {...rest}
    />
  )
}

// Uso com ícone:
<Button variant="icon" type="submit">
  <img src={searchSvg} alt="Ícone de pesquisar" className="w-5" />
</Button>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Componente precisa de 2+ aparências visuais | Crie objeto de variantes + classMerge |
| Diferença entre variantes é só tamanho | Use variantes simples com classes de dimensão |
| Precisa de override pontual em uso específico | Passe className como prop e coloque por último no classMerge |
| Projeto usa Tailwind CSS | Instale clsx + tailwind-merge e crie o utilitário classMerge |
| Botão com apenas ícone | Use variante `icon` com mesma altura e largura |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| Componente separado para cada variação visual | Objeto de variantes no mesmo componente |
| Template literals para juntar classes Tailwind | `classMerge()` com clsx + twMerge |
| `className={isIcon ? "h-12 w-12 ..." : "h-12 ..."}` (ternário com classes longas) | `variants.button[variant]` (lookup no objeto) |
| Classes duplicadas entre variantes | Classes base no array principal, só diferenças nas variantes |
| className hardcoded sem possibilidade de override | Aceitar `className` como prop e passar ao classMerge |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre classMerge, fluxo clsx→twMerge e padrão de variantes
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações