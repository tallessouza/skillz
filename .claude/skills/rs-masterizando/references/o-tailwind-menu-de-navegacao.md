---
name: rs-tailwind-menu-de-navegacao
description: "Applies Tailwind group hover patterns and sidebar navigation structure when building navigation menus or sidebars. Use when user asks to 'create a sidebar', 'build a navigation menu', 'style nav items', 'group hover effect', or 'component extraction for menu items'. Enforces group modifier for parent-state-based styling, proper spacing with space-y, and ml-auto alignment tricks. Make sure to use this skill whenever generating sidebar navigation with Tailwind. Not for routing logic, authentication guards, or non-Tailwind CSS frameworks."
---

# Menu de Navegacao com Tailwind

> Use `group` no elemento pai e `group-hover:` nos filhos para estilizar com base no estado do pai.

## Rules

1. **Use `group` para hover coordenado** — aplique `group` no pai (ancora) e `group-hover:` nos filhos (texto, icone), porque hover individual em cada filho so ativa quando o mouse esta exatamente sobre aquele filho
2. **Use `space-y-0.5` para espacamento entre itens** — `0.5` = 2px, menor que `1` (4px), porque menus precisam de espacamento compacto
3. **Use `ml-auto` para empurrar elementos para a direita** — em vez de position absolute ou flexbox complexo, porque ml-auto consome todo espaco disponivel a esquerda
4. **Extraia NavItem como componente** — receba `icon` como `ElementType` (nao `ReactNode`), porque permite aplicar classes internamente no componente
5. **Ajuste padding/margem para hover extrapolar** — use `px-3 py-2` no item e `mx-1` nos elementos vizinhos (logo, input), porque o hover do menu deve ser mais largo que outros elementos da sidebar
6. **Prefira `rounded` (4px) para hover states** — arredondamento sutil em menus melhora a aparencia do estado hover

## How to write

### Estrutura do NavItem

```tsx
import { ChevronDown, ElementType } from 'lucide-react'

interface NavItemProps {
  title: string
  icon: ElementType
}

export function NavItem({ title, icon: Icon }: NavItemProps) {
  return (
    <a href="#" className="group flex items-center gap-3 rounded px-3 py-2 hover:bg-violet-50">
      <Icon className="h-5 w-5 text-zinc-500" />
      <span className="font-medium text-zinc-700 group-hover:text-violet-500">
        {title}
      </span>
      <ChevronDown className="ml-auto h-5 w-5 text-zinc-400 group-hover:text-violet-300" />
    </a>
  )
}
```

### Estrutura do MainNavigation

```tsx
import { Home, BarChart, SquareStack, CheckSquare, Flag, Users } from 'lucide-react'
import { NavItem } from './NavItem'

export function MainNavigation() {
  return (
    <nav className="space-y-0.5">
      <NavItem title="Home" icon={Home} />
      <NavItem title="Dashboard" icon={BarChart} />
      <NavItem title="Projects" icon={SquareStack} />
      <NavItem title="Tasks" icon={CheckSquare} />
      <NavItem title="Reporting" icon={Flag} />
      <NavItem title="Users" icon={Users} />
    </nav>
  )
}
```

## Example

**Before (hover individual — quebrado):**
```tsx
<a href="#" className="flex items-center gap-3 hover:bg-violet-50">
  <Home className="h-5 w-5 text-zinc-500" />
  <span className="font-medium text-zinc-700 hover:text-violet-500">Home</span>
</a>
```
Problema: texto so fica roxo quando mouse esta sobre o span, nao sobre toda a ancora.

**After (group hover — correto):**
```tsx
<a href="#" className="group flex items-center gap-3 rounded px-3 py-2 hover:bg-violet-50">
  <Home className="h-5 w-5 text-zinc-500" />
  <span className="font-medium text-zinc-700 group-hover:text-violet-500">Home</span>
  <ChevronDown className="ml-auto h-5 w-5 text-zinc-400 group-hover:text-violet-300" />
</a>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Hover deve afetar multiplos filhos | `group` no pai + `group-hover:` nos filhos |
| Elemento deve ficar no final da linha | `ml-auto` no elemento |
| Icone vem como prop de componente | Receba como `ElementType`, renomeie com maiuscula |
| Espacamento minimo entre itens de lista | `space-y-0.5` (2px) ou `space-y-px` (1px) |
| Hover do item precisa ser mais largo | Padding no item + margem nos vizinhos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `hover:text-violet-500` no filho direto | `group-hover:text-violet-500` com `group` no pai |
| `icon: ReactNode` como prop | `icon: ElementType` para controlar classes internamente |
| Replicar ancora inteira para cada item | Extrair componente NavItem |
| `justify-between` para um unico elemento na direita | `ml-auto` no elemento |
| `padding` na sidebar para largura do hover | `mx-1` nos elementos vizinhos (logo, input) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-menu-de-navegacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-menu-de-navegacao/references/code-examples.md)
