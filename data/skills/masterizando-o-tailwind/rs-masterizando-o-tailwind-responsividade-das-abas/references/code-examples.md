# Code Examples: Responsividade de Abas

## Exemplo completo do SettingsTabs com ScrollArea

```tsx
import * as Tabs from '@radix-ui/react-tabs'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { TabItem } from './TabItem'

export function SettingsTabs() {
  return (
    <Tabs.Root defaultValue="my-details">
      <ScrollArea.Root className="w-full" type="scroll">
        <ScrollArea.Viewport className="w-full overflow-x-scroll">
          <Tabs.List className="flex w-full items-center gap-4 border-b border-zinc-200">
            <TabItem value="my-details" title="My Details" />
            <TabItem value="profile" title="Profile" />
            <TabItem value="password" title="Password" />
            <TabItem value="team" title="Team" />
            <TabItem value="billing" title="Billing" />
            <TabItem value="notifications" title="Notifications" />
          </Tabs.List>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          orientation="horizontal"
          className="flex h-0.5 translate-y-1.5 touch-none select-none flex-col bg-zinc-100"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-lg bg-zinc-300" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Tab content panels */}
    </Tabs.Root>
  )
}
```

## TabItem com whitespace-nowrap

```tsx
import * as Tabs from '@radix-ui/react-tabs'

interface TabItemProps {
  value: string
  title: string
}

export function TabItem({ value, title }: TabItemProps) {
  return (
    <Tabs.Trigger
      value={value}
      className="group relative px-1 pb-4 text-sm font-medium text-zinc-500 hover:text-violet-700 data-[state=active]:text-violet-700"
    >
      <span className="whitespace-nowrap">{title}</span>

      {/* Active indicator */}
      <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-violet-700 opacity-0 group-data-[state=active]:opacity-100" />
    </Tabs.Trigger>
  )
}
```

## Layout responsivo (correcao do grid)

```tsx
// ANTES: grid aplicado em todas as telas (quebra mobile)
<main className="grid grid-cols-app">
  <Sidebar />
  <Content />
</main>

// DEPOIS: grid apenas em telas grandes
<main className="lg:grid lg:grid-cols-app max-w-[100vw]">
  <Sidebar />
  <Content />
</main>
```

## Instalacao do pacote

```bash
npm install @radix-ui/react-scroll-area
```

## Hierarquia de componentes obrigatoria do ScrollArea

```
ScrollArea.Root          ← Container principal (type="scroll")
├── ScrollArea.Viewport  ← Envolve o conteudo scrollavel
│   └── {children}       ← Seu conteudo (TabList, etc)
└── ScrollArea.Scrollbar ← A barra de scroll (orientation="horizontal"|"vertical")
    └── ScrollArea.Thumb ← A parte arrastavel da scrollbar
```

Omitir qualquer nivel desta hierarquia faz o scroll nao funcionar silenciosamente.