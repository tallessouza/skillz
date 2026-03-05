# Code Examples: Menu de Navegacao

## Exemplo completo do NavItem

```tsx
// sidebar/mainNavigation/NavItem.tsx
import { ChevronDown } from 'lucide-react'
import { ElementType } from 'react'

interface NavItemProps {
  title: string
  icon: ElementType
}

export function NavItem({ title, icon: Icon }: NavItemProps) {
  return (
    <a
      href="#"
      className="group flex items-center gap-3 rounded px-3 py-2 hover:bg-violet-50"
    >
      <Icon className="h-5 w-5 text-zinc-500" />
      <span className="font-medium text-zinc-700 group-hover:text-violet-500">
        {title}
      </span>
      <ChevronDown className="ml-auto h-5 w-5 text-zinc-400 group-hover:text-violet-300" />
    </a>
  )
}
```

## Exemplo completo do MainNavigation

```tsx
// sidebar/mainNavigation/index.tsx
import {
  Home,
  BarChart,
  SquareStack,
  CheckSquare,
  Flag,
  Users,
} from 'lucide-react'
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

## Uso na Sidebar

```tsx
// sidebar/index.tsx
import { MainNavigation } from './mainNavigation'

export function Sidebar() {
  return (
    <aside>
      {/* Logo com mx-1 para hover do menu ser mais largo */}
      <strong className="mx-1">Logo</strong>

      {/* Input de busca com mx-1 */}
      <div className="mx-1">
        <input type="text" placeholder="Search" />
      </div>

      {/* Menu de navegacao — sem mx, hover ocupa largura total */}
      <MainNavigation />
    </aside>
  )
}
```

## Evolucao do hover: sem group vs com group

### Sem group (quebrado)
```tsx
<a href="#" className="flex items-center gap-3 hover:bg-violet-50">
  <Home className="h-5 w-5 text-zinc-500" />
  {/* hover so ativa quando mouse esta sobre este span especifico */}
  <span className="hover:text-violet-500">Home</span>
</a>
```

### Com group (correto)
```tsx
<a href="#" className="group flex items-center gap-3 hover:bg-violet-50">
  <Home className="h-5 w-5 text-zinc-500" />
  {/* group-hover ativa quando mouse esta em qualquer lugar da ancora */}
  <span className="group-hover:text-violet-500">Home</span>
  <ChevronDown className="ml-auto group-hover:text-violet-300" />
</a>
```

## Variacoes do group com outras variantes

```tsx
{/* group-focus: estilizar filho quando pai tem focus */}
<button className="group">
  <span className="group-focus:text-blue-500">Texto</span>
</button>

{/* group-disabled: estilizar filho quando pai esta disabled */}
<fieldset disabled className="group">
  <input className="group-disabled:opacity-50" />
</fieldset>
```