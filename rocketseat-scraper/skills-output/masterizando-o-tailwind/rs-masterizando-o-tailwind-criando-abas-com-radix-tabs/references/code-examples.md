# Code Examples: Criando Abas com Radix Tabs

## Instalacao

```bash
npm install @radix-ui/react-tabs
```

## Estrutura de arquivos

```
src/
├── app/
│   ├── layout.tsx          # antialiased no html
│   └── page.tsx            # usa <SettingsTabs />
└── components/
    └── SettingsTabs/
        ├── index.tsx        # 'use client' + Tabs.Root/List
        └── TabItem.tsx      # 'use client' + Tabs.Trigger
```

## layout.tsx — Anti-aliased

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  )
}
```

## page.tsx — Server Component com Fragment

```tsx
import { SettingsTabs } from '@/components/SettingsTabs'

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-medium text-zinc-900">Settings</h1>
      <SettingsTabs />
    </>
  )
}
```

## SettingsTabs/index.tsx — Componente completo

```tsx
'use client'

import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { TabItem } from './TabItem'

export function SettingsTabs() {
  const [currentTab, setCurrentTab] = useState('tab1')

  return (
    <Tabs.Root value={currentTab} onValueChange={setCurrentTab}>
      <Tabs.List className="mt-6 flex w-full items-center gap-4 border-b border-zinc-200">
        <TabItem value="tab1" title="My details" isSelected={currentTab === 'tab1'} />
        <TabItem value="tab2" title="Profile" isSelected={currentTab === 'tab2'} />
        <TabItem value="tab3" title="Password" isSelected={currentTab === 'tab3'} />
        <TabItem value="tab4" title="Team" isSelected={currentTab === 'tab4'} />
        <TabItem value="tab5" title="Plan" isSelected={currentTab === 'tab5'} />
        <TabItem value="tab6" title="Billing" isSelected={currentTab === 'tab6'} />
        <TabItem value="tab7" title="Email" isSelected={currentTab === 'tab7'} />
        <TabItem value="tab8" title="Notifications" isSelected={currentTab === 'tab8'} />
        <TabItem value="tab9" title="Integrations" isSelected={currentTab === 'tab9'} />
      </Tabs.List>
    </Tabs.Root>
  )
}
```

## TabItem.tsx — Componente completo

```tsx
'use client'

import * as Tabs from '@radix-ui/react-tabs'

interface TabItemProps {
  value: string
  title: string
  isSelected?: boolean
}

export function TabItem({ value, title, isSelected = false }: TabItemProps) {
  return (
    <Tabs.Trigger
      value={value}
      className="relative px-1 pb-4 text-sm font-medium text-zinc-500 hover:text-violet-700 data-[state=active]:text-violet-700"
    >
      <span>{title}</span>

      {isSelected && (
        <div className="absolute left-0 right-0 -bottom-px h-0.5 bg-violet-700" />
      )}
    </Tabs.Trigger>
  )
}
```

## Data-attribute styling — Variações

```tsx
// Cor de texto quando ativo
className="data-[state=active]:text-violet-700"

// Background quando ativo
className="data-[state=active]:bg-violet-50"

// Borda quando ativo
className="data-[state=active]:border-violet-700"

// Font weight quando ativo
className="data-[state=active]:font-semibold"

// Combinando hover e data-state
className="hover:text-violet-700 data-[state=active]:text-violet-700"
```

## Valores negativos no Tailwind

```tsx
// Posicionamento negativo
className="-bottom-px"     // bottom: -1px
className="-bottom-1"      // bottom: -4px
className="-top-2"         // top: -8px

// Margin negativa
className="-mt-4"          // margin-top: -16px
className="-ml-2"          // margin-left: -8px

// Util para sobreposicao de bordas e alinhamento preciso
```

## Commit de referencia

[Criando Abas com Radix Tabs](https://github.com/rocketseat-education/ignite-tailwind/commit/64660cefc308dcaf1702767b1595f7324e923f18)