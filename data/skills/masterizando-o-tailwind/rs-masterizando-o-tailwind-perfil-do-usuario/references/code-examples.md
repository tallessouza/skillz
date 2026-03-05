# Code Examples: Perfil do Usuario com Tailwind

## Exemplo 1: Componente Profile completo

```tsx
// Profile.tsx
import { LogOut } from 'lucide-react'

export function Profile() {
  return (
    <div className="grid grid-cols-profile items-center gap-3">
      <img
        src="https://github.com/Diego3g.png"
        alt=""
        className="h-10 w-10 rounded-full"
      />
      <div className="flex flex-col truncate">
        <span className="text-sm font-semibold text-zinc-700 truncate">
          Diego Fernandes
        </span>
        <span className="text-sm text-zinc-500 truncate">
          diego@skillz.com.br
        </span>
      </div>
      <button
        type="button"
        className="rounded-md p-2 hover:bg-zinc-50"
      >
        <LogOut className="h-5 w-5 text-zinc-500" />
      </button>
    </div>
  )
}
```

## Exemplo 2: Configuracao do tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // ...
  theme: {
    extend: {
      gridTemplateColumns: {
        profile: 'max-content 1fr max-content',
      },
    },
  },
}
```

## Exemplo 3: Integracao na Sidebar

```tsx
// Sidebar.tsx
import { Profile } from './Profile'

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-6 border-r border-zinc-200 px-5 py-8">
      {/* ... outros componentes da sidebar ... */}

      {/* Divisoria */}
      <div className="h-px bg-zinc-200" />

      {/* Profile */}
      <Profile />
    </aside>
  )
}
```

## Exemplo 4: O que truncate gera no CSS

```css
/* A classe truncate do Tailwind equivale a: */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

## Exemplo 5: Evolucao do layout (flex → grid)

### Versao 1 — Flex simples (quebra com texto longo)
```tsx
<div className="flex items-center gap-3">
  <img src="..." className="h-10 w-10 rounded-full" alt="" />
  <div className="flex flex-col">
    <span className="text-sm font-semibold text-zinc-700">Diego</span>
    <span className="text-sm text-zinc-500">diego@skillz.com.br</span>
  </div>
  <button className="ml-auto">
    <LogOut className="h-5 w-5 text-zinc-500" />
  </button>
</div>
```

### Versao 2 — Flex com flex-1 (ainda problematico)
```tsx
<div className="flex items-center gap-3">
  <img src="..." className="h-10 w-10 rounded-full" alt="" />
  <div className="flex flex-1 flex-col truncate">
    <span className="text-sm text-zinc-700 truncate">Diego</span>
    <span className="text-sm text-zinc-500 truncate">diego@skillz.com.br</span>
  </div>
  <button className="ml-auto">
    <LogOut className="h-5 w-5 text-zinc-500" />
  </button>
</div>
```

### Versao 3 — Grid customizado (solucao final)
```tsx
<div className="grid grid-cols-profile items-center gap-3">
  <img src="..." className="h-10 w-10 rounded-full" alt="" />
  <div className="flex flex-col truncate">
    <span className="text-sm font-semibold text-zinc-700 truncate">Diego</span>
    <span className="text-sm text-zinc-500 truncate">diego@skillz.com.br</span>
  </div>
  <button type="button" className="rounded-md p-2 hover:bg-zinc-50">
    <LogOut className="h-5 w-5 text-zinc-500" />
  </button>
</div>
```

## Exemplo 6: Botao de icone com hover

```tsx
{/* Sem padding — hover:bg nao tem area visivel */}
<button className="hover:bg-zinc-50">
  <LogOut className="h-5 w-5 text-zinc-500" />
</button>

{/* Com padding + rounded — hover funciona corretamente */}
<button type="button" className="rounded-md p-2 hover:bg-zinc-50">
  <LogOut className="h-5 w-5 text-zinc-500" />
</button>
```