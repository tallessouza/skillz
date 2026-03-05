---
name: rs-next-js-efeitos-de-hover-e-focus
description: "Enforces consistent hover and focus-visible patterns when writing Tailwind CSS interactive components. Use when user asks to 'create a button', 'add hover effect', 'style a card', 'make focusable component', or 'improve accessibility'. Applies rules: focus-visible over focus, ring pattern for keyboard navigation, tw-merge multi-line organization, transition-colors with short duration. Make sure to use this skill whenever creating interactive UI elements with Tailwind. Not for animation libraries, CSS-in-JS, or non-Tailwind styling."
---

# Efeitos de Hover e Focus

> Componentes interativos separam estilos base, hover e focus-visible em linhas distintas no tw-merge, usando focus-visible para acessibilidade real.

## Rules

1. **Use `focus-visible` em vez de `focus`** — porque `focus` dispara ao clicar no elemento, `focus-visible` dispara apenas na navegacao por tab, que e o comportamento desejado para acessibilidade
2. **Organize estilos por responsabilidade** — uma linha para base, uma para hover, uma para focus no tw-merge, porque facilita leitura e manutencao
3. **Duration curta no hover (150ms)** — `duration-150` em vez do padrao 300ms, porque animacoes longas em hover parecem estranhas e lentas
4. **Ring pattern completo para focus-visible** — sempre inclua `ring-2`, `ring-offset-2`, `ring-offset-{bg-color}`, porque o offset precisa da cor de fundo para nao ficar transparente
5. **`outline-none` antes do focus-visible** — remova o outline padrao do browser antes de aplicar o ring customizado
6. **Opacidade para hover em backgrounds escuros** — use `/60` ou `/50` quando a cor de hover fica muito clara sobre fundo escuro

## How to write

### Button com hover e focus-visible

```typescript
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ComponentProps<"button"> {}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={twMerge(
        // Base
        "bg-navy-600 text-white px-4 py-2 rounded-lg font-medium",
        // Hover
        "hover:bg-navy-500 transition-colors duration-150",
        // Focus
        "outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950",
        className,
      )}
      {...props}
    />
  );
}
```

### Card/Anchor com hover e focus-visible

```typescript
<a
  className={twMerge(
    // Base
    "block p-4 bg-navy-700 border border-navy-600 rounded-lg",
    // Hover
    "hover:bg-navy-600/50 hover:border-navy-500 transition-colors duration-150",
    // Focus
    "outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950",
  )}
/>
```

## Example

**Before (focus errado, estilos misturados):**
```typescript
<button className="bg-navy-600 text-white px-4 py-2 rounded-lg hover:bg-navy-500 focus:ring-2 focus:ring-navy-400 transition-colors">
```

**After (focus-visible, organizado por responsabilidade):**
```typescript
<button
  className={twMerge(
    "bg-navy-600 text-white px-4 py-2 rounded-lg",
    "hover:bg-navy-500 transition-colors duration-150",
    "outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950",
  )}
>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Botao, link, input — qualquer elemento clicavel | Sempre adicione hover + focus-visible |
| Background escuro com hover mais claro | Use opacidade (`/50`, `/60`) em vez da cor pura |
| Multiplos elementos com mesmo focus pattern | Copie o bloco inteiro de focus — e identico para todos |
| tw-merge com muitas classes | Separe em linhas por responsabilidade (base, hover, focus) |
| `ring-offset` sobre fundo colorido | Defina `ring-offset-{cor-do-fundo}` explicitamente |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `focus:ring-2` | `focus-visible:ring-2` |
| `duration-300` em hover | `duration-150` |
| Classes inline gigantes sem separacao | tw-merge com linhas por responsabilidade |
| `focus:outline-2` (outline padrao) | `outline-none` + `focus-visible:ring-2` |
| `hover:bg-navy-600` sem opacidade em fundo escuro | `hover:bg-navy-600/50` |
| Ring offset sem cor de fundo | `focus-visible:ring-offset-navy-950` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-efeitos-de-hover-e-focus/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-efeitos-de-hover-e-focus/references/code-examples.md)
