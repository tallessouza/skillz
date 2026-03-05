# Code Examples: Widget de Espaco Usado

## Exemplo completo do widget

```tsx
// UsedSpaceWidget.tsx
export function UsedSpaceWidget() {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-violet-50 px-4 py-5">
      <div className="space-y-1">
        <span className="text-sm/5 font-medium text-violet-700">
          Used space
        </span>
        <p className="text-sm/5 text-violet-500">
          Your team has used 80% of your available space. Need more?
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="h-2 rounded-full bg-violet-100">
        <div className="h-2 w-4/5 rounded-full bg-violet-600" />
      </div>

      {/* Botoes de acao */}
      <div className="space-x-3">
        <button
          type="button"
          className="text-sm font-medium text-violet-500 hover:text-violet-600"
        >
          Dismiss
        </button>
        <button
          type="button"
          className="text-sm font-medium text-violet-700 hover:text-violet-900"
        >
          Upgrade plan
        </button>
      </div>
    </div>
  )
}
```

## Sidebar completa com widget integrado

```tsx
// Sidebar/index.tsx
import { UsedSpaceWidget } from './UsedSpaceWidget'
import { NavItem } from './NavItem'
import {
  LifeBuoy,
  Cog,
  Home,
  BarChart,
  // ... outros icones
} from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-6 border-r border-zinc-200 px-5 py-8">
      {/* Logo */}
      {/* Input de busca */}

      {/* Navegacao principal */}
      <nav className="space-y-0.5">
        <NavItem icon={Home}>Home</NavItem>
        <NavItem icon={BarChart}>Dashboard</NavItem>
        {/* ... mais items */}
      </nav>

      {/* Conteudo empurrado para baixo */}
      <div className="mt-auto flex flex-col gap-6">
        <nav className="space-y-0.5">
          <NavItem icon={LifeBuoy}>Support</NavItem>
          <NavItem icon={Cog}>Settings</NavItem>
        </nav>

        <UsedSpaceWidget />

        {/* Profile (proxima aula) */}
      </div>
    </aside>
  )
}
```

## Evolucao: space-y para flex+gap

### Antes (quebrado)
```tsx
<aside className="space-y-6 border-r border-zinc-200 px-5 py-8">
  <nav>{/* navegacao principal */}</nav>
  <div className="mt-auto"> {/* mt-auto ignorado pelo space-y */}
    <UsedSpaceWidget />
  </div>
</aside>
```

### Depois (funcionando)
```tsx
<aside className="flex flex-col gap-6 border-r border-zinc-200 px-5 py-8">
  <nav>{/* navegacao principal */}</nav>
  <div className="mt-auto flex flex-col gap-6">
    <UsedSpaceWidget />
  </div>
</aside>
```

## Variacoes de barra de progresso

### Com larguras fracionais diferentes
```tsx
{/* 25% usado */}
<div className="h-2 w-1/4 rounded-full bg-violet-600" />

{/* 50% usado */}
<div className="h-2 w-1/2 rounded-full bg-violet-600" />

{/* 66% usado */}
<div className="h-2 w-2/3 rounded-full bg-violet-600" />

{/* 80% usado */}
<div className="h-2 w-4/5 rounded-full bg-violet-600" />

{/* Valor arbitrario: 73% */}
<div className="h-2 w-[73%] rounded-full bg-violet-600" />
```

### Com altura e cores diferentes
```tsx
{/* Barra mais alta */}
<div className="h-3 rounded-full bg-zinc-100">
  <div className="h-3 w-3/4 rounded-full bg-emerald-500" />
</div>

{/* Barra fina */}
<div className="h-1 rounded-full bg-zinc-100">
  <div className="h-1 w-1/2 rounded-full bg-blue-500" />
</div>
```

## Propriedades do widget explicadas

```tsx
<div className="
  flex flex-col  /* empilha titulo, barra, botoes verticalmente */
  gap-4          /* 16px entre cada secao */
  rounded-lg     /* arredondamento de 8px */
  bg-violet-50   /* roxo bem clarinho de fundo */
  px-4           /* 16px padding horizontal */
  py-5           /* 20px padding vertical */
">
```

O instrutor leu esses valores diretamente do Figma:
- Padding top/bottom: 20px → `py-5`
- Padding left/right: 16px → `px-4`
- Border radius: 8px → `rounded-lg`