# Code Examples: Sidebar Flexível com Radix UI Collapsible

## Instalação

```bash
npm install @radix-ui/react-collapsible
```

## Passo 1: Layout com Collapsible.Root

O Root envolve todos os componentes que precisam compartilhar o contexto:

```tsx
// src/renderer/src/pages/layouts/default.tsx
import * as Collapsible from '@radix-ui/react-collapsible'
import { useState } from 'react'

export function DefaultLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <Collapsible.Root defaultOpen onOpenChange={setIsSidebarOpen}>
      <Header isSidebarOpen={isSidebarOpen} />
      <Sidebar />
    </Collapsible.Root>
  )
}
```

**Ponto-chave:** `defaultOpen` faz a sidebar começar aberta. Sem isso, o Collapsible inicia fechado.

## Passo 2: Trocar botão por Collapsible.Trigger na Sidebar

```tsx
// Antes (botão normal):
<button onClick={handleToggle}>
  <CaretDoubleLeft />
</button>

// Depois (Collapsible.Trigger):
<Collapsible.Trigger asChild>
  <button>
    <CaretDoubleLeft />
  </button>
</Collapsible.Trigger>
```

## Passo 3: Trocar aside por Collapsible.Content

```tsx
// Antes:
<aside className="sidebar-styles">
  {/* conteúdo */}
</aside>

// Depois:
<Collapsible.Content className="sidebar-styles data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut">
  {/* conteúdo */}
</Collapsible.Content>
```

## Passo 4: Header com botão condicional

```tsx
// src/renderer/src/components/Header.tsx
interface HeaderProps {
  isSidebarOpen: boolean
}

export function Header({ isSidebarOpen }: HeaderProps) {
  return (
    <header className="...">
      {!isSidebarOpen && (
        <Collapsible.Trigger asChild>
          <button className="...">
            <CaretDoubleRight />
          </button>
        </Collapsible.Trigger>
      )}
      {/* resto do header */}
    </header>
  )
}
```

**Nota:** O Diego tinha inicialmente uma variável manual `isSidebarOpen = true` hardcoded. Ele substituiu por estado real vindo do `onOpenChange`.

## Passo 5: Validação com console.log

Antes de implementar o estado, o Diego validou o comportamento:

```tsx
<Collapsible.Root
  defaultOpen
  onOpenChange={(open) => {
    console.log(open) // false quando fecha, true quando abre
  }}
>
```

## Passo 6: Keyframes e animações no Tailwind

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          from: { width: '0' },
          to: { width: 'var(--radix-collapsible-content-width)' },
        },
        slideOut: {
          from: { width: 'var(--radix-collapsible-content-width)' },
          to: { width: '0' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.25s ease',
        slideOut: 'slideOut 0.25s ease',
      },
    },
  },
}
```

**Detalhe crucial:** `var(--radix-collapsible-content-width)` é uma variável CSS exposta automaticamente pelo Radix. Não é necessário calcular ou hardcodar a largura — o Radix resolve isso.

## Fluxo completo de interação

1. Usuário clica no botão da sidebar (Collapsible.Trigger)
2. Radix alterna o estado interno
3. `onOpenChange` dispara com `false`
4. `setIsSidebarOpen(false)` atualiza o estado React
5. Header recebe `isSidebarOpen=false` e renderiza o botão de abrir
6. Collapsible.Content recebe `data-state="closed"` e executa `animate-slideOut`
7. Usuário clica no botão do header (outro Collapsible.Trigger)
8. Processo inverso: sidebar reaparece com `animate-slideIn`