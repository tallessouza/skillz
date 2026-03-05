# Code Examples: Logo e Input de Busca

## Layout base com sidebar extraida

```tsx
// app/layout.tsx
import { Sidebar } from './components/sidebar'

export default function Layout() {
  return (
    <div>
      <Sidebar />
      <main>{/* conteudo */}</main>
    </div>
  )
}
```

## Componente Logo (SVG convertido)

```tsx
// components/sidebar/logo.tsx
export function Logo() {
  return (
    <svg
      width={38}
      height={38}
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* paths do SVG convertidos para camelCase */}
    </svg>
  )
}
```

## Logo com texto

```tsx
// Dentro de components/sidebar/index.tsx
import { Logo } from './logo'

<strong className="flex items-center gap-2 text-xl font-semibold text-zinc-900">
  <Logo />
  <span>Untitled UI</span>
</strong>
```

### Classes explicadas:
- `flex` — display flex para alinhar SVG e texto lado a lado
- `items-center` — alinha verticalmente no centro
- `gap-2` — 8px de espacamento entre SVG e texto
- `text-xl` — 20px de tamanho de fonte
- `font-semibold` — peso 600
- `text-zinc-900` — cinza muito escuro

## Input de busca completo

```tsx
import { Search } from 'lucide-react'

<div className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
  <Search className="h-5 w-5 text-zinc-500" />
  <input
    type="text"
    placeholder="Search"
    className="flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder:text-zinc-600"
  />
</div>
```

### Classes da div wrapper:
- `flex` — display flex
- `w-full` — largura 100%
- `items-center` — centraliza icone e input verticalmente
- `gap-2` — 8px entre icone e input
- `rounded-lg` — border-radius 8px
- `border border-zinc-300` — borda cinza clara
- `px-3` — padding horizontal 12px
- `py-2` — padding vertical 8px
- `shadow-sm` — sombra sutil

### Classes do input real:
- `flex-1` — ocupa todo espaco restante
- `border-0` — remove borda padrao do input
- `bg-transparent` — sem cor de fundo
- `p-0` — sem padding (o wrapper ja tem)
- `text-zinc-900` — cor do texto digitado
- `placeholder:text-zinc-600` — cor do placeholder

## Sidebar completa com space-y

```tsx
// components/sidebar/index.tsx
import { Logo } from './logo'
import { Search } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="flex flex-col space-y-6">
      {/* Logo */}
      <strong className="flex items-center gap-2 text-xl font-semibold text-zinc-900">
        <Logo />
        <span>Untitled UI</span>
      </strong>

      {/* Search Input */}
      <div className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
        <Search className="h-5 w-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder:text-zinc-600"
        />
      </div>

      {/* Nav e outros componentes virao aqui */}
    </aside>
  )
}
```

## Valores de referencia Tailwind usados

| Classe | Valor CSS |
|--------|-----------|
| `gap-2` | `gap: 0.5rem` (8px) |
| `text-xl` | `font-size: 1.25rem` (20px) |
| `rounded-lg` | `border-radius: 0.5rem` (8px) |
| `px-3` | `padding-left/right: 0.75rem` (12px) |
| `py-2` | `padding-top/bottom: 0.5rem` (8px) |
| `h-5` / `w-5` | `height/width: 1.25rem` (20px) |
| `space-y-6` | `margin-top: 1.5rem` (24px) em filhos exceto primeiro |