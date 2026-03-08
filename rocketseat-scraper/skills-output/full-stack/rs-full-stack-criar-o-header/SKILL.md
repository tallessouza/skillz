---
name: rs-full-stack-criar-o-header
description: "Enforces Tailwind CSS header component patterns when building app headers with logo, user greeting, and action icons. Use when user asks to 'create a header', 'build a navbar', 'add a top bar', 'style a header component', or 'layout header with flexbox'. Applies flex justify-between pattern, SVG image imports, hover opacity transitions, and responsive spacing. Make sure to use this skill whenever creating navigation headers or top-level layout components with Tailwind. Not for footer components, sidebar navigation, or complex multi-level menu systems."
---

# Criar o Header com Tailwind CSS

> Estruture headers com flex justify-between para separar logo e ações, aplicando hover transitions nos elementos interativos.

## Rules

1. **Separe logo e ações com flex + justify-between** — `w-full flex justify-between` no container header, porque garante que logo fica à esquerda e ações à direita automaticamente
2. **Agrupe elementos relacionados com flex + items-center + gap** — a div de ações usa `flex items-center gap-3`, porque centraliza verticalmente e mantém espaçamento consistente
3. **Importe SVGs como módulos** — `import logoSVG from "../assets/logo.svg"` e use no `src`, porque permite tree-shaking e type-checking
4. **Aplique hover com opacity e transition** — `cursor-pointer hover:opacity-75 transition ease-linear` em ícones clicáveis, porque dá feedback visual suave sem alterar layout
5. **Use espaçamento vertical com my-{n}** — `my-8` nas imagens para margem vertical, porque separa o header do conteúdo sem afetar o fluxo horizontal
6. **Estilize texto de saudação com classes utilitárias** — `text-sm font-semibold text-gray-200`, porque mantém hierarquia visual clara e legibilidade em fundos escuros

## How to write

### Estrutura do componente Header

```tsx
import logoSVG from "../assets/logo.svg"
import logoutIcon from "../assets/logout.svg"

export function Header() {
  return (
    <header className="w-full flex justify-between">
      <img src={logoSVG} alt="Logo" className="my-8" />

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-200">
          Olá, Rodrigo
        </span>
        <img
          src={logoutIcon}
          alt="Ícone de sair"
          className="my-8 cursor-pointer hover:opacity-75 transition ease-linear"
        />
      </div>
    </header>
  )
}
```

### Integração no Layout

```tsx
import { Header } from "../components/header"
import { Outlet } from "react-router-dom"

export function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
```

## Example

**Before (sem estilização):**
```tsx
export function Header() {
  return (
    <header>
      <img src={logoSVG} alt="Logo" />
      <div>
        <span>Olá, Rodrigo</span>
        <img src={logoutIcon} alt="Sair" />
      </div>
    </header>
  )
}
```

**After (com Tailwind aplicado):**
```tsx
export function Header() {
  return (
    <header className="w-full flex justify-between">
      <img src={logoSVG} alt="Logo" className="my-8" />
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-200">
          Olá, Rodrigo
        </span>
        <img
          src={logoutIcon}
          alt="Ícone de sair"
          className="my-8 cursor-pointer hover:opacity-75 transition ease-linear"
        />
      </div>
    </header>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Header com logo + ações | `flex justify-between` no container |
| Múltiplos itens no mesmo lado | `flex items-center gap-{n}` para agrupar |
| Ícone clicável sem `<button>` | `cursor-pointer hover:opacity-75 transition ease-linear` |
| Texto secundário em fundo escuro | `text-sm font-semibold text-gray-200` |
| Espaçamento vertical do header | `my-8` na imagem principal |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `style={{ display: 'flex', justifyContent: 'space-between' }}` | `className="flex justify-between"` |
| `<div onClick>` sem cursor visual | `className="cursor-pointer hover:opacity-75"` |
| `margin-top` e `margin-bottom` separados | `my-8` (margem vertical unificada) |
| Hover sem transition | `hover:opacity-75 transition ease-linear` |
| `<img>` sem `alt` descritivo | `alt="Ícone de sair"` com contexto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre padrões de layout de header e decisões de estilização
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações