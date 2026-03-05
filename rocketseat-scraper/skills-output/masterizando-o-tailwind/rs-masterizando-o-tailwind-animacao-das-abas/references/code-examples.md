# Code Examples: Animacao de Abas com Framer Motion

## Exemplo completo do commit da aula

Baseado no commit [e759d42](https://github.com/rocketseat-education/ignite-tailwind/commit/e759d4287f58688ffc626bcf34c4be6c1bd98a89):

### Instalacao

```bash
npm i framer-motion
```

### TabItem component

```tsx
'use client' // necessario se usar Next.js App Router

import { motion } from 'framer-motion'

interface TabItemProps {
  value: string
  label: string
  isActive?: boolean
  onClick?: () => void
}

export function TabItem({ value, label, isActive = false, onClick }: TabItemProps) {
  return (
    <button
      onClick={onClick}
      className="relative px-1 pb-4 text-sm font-medium text-zinc-500 hover:text-violet-700 data-[state=active]:text-violet-700"
      data-state={isActive ? 'active' : 'inactive'}
    >
      <span className="whitespace-nowrap">{label}</span>

      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute -bottom-px left-0 right-0 h-0.5 bg-violet-400"
        />
      )}
    </button>
  )
}
```

### Container de Tabs

```tsx
'use client'

import { useState } from 'react'
import { TabItem } from './TabItem'

const tabs = [
  { value: 'my-details', label: 'My details' },
  { value: 'profile', label: 'Profile' },
  { value: 'password', label: 'Password' },
  { value: 'team', label: 'Team' },
  { value: 'plan', label: 'Plan' },
  { value: 'billing', label: 'Billing' },
  { value: 'email', label: 'Email' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'integrations', label: 'Integrations' },
  { value: 'api', label: 'API' },
]

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('my-details')

  return (
    <div className="mt-6 flex items-center gap-4 border-b border-zinc-200">
      {tabs.map((tab) => (
        <TabItem
          key={tab.value}
          value={tab.value}
          label={tab.label}
          isActive={activeTab === tab.value}
          onClick={() => setActiveTab(tab.value)}
        />
      ))}
    </div>
  )
}
```

## Variacao: Multiplos grupos de tabs na mesma pagina

```tsx
interface TabItemProps {
  groupId: string  // diferencia grupos
  value: string
  label: string
  isActive?: boolean
  onClick?: () => void
}

export function TabItem({ groupId, value, label, isActive, onClick }: TabItemProps) {
  return (
    <button onClick={onClick} className="relative px-4 py-2">
      <span>{label}</span>
      {isActive && (
        <motion.div
          layoutId={`activeTab-${groupId}`}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"
        />
      )}
    </button>
  )
}
```

## Variacao: Customizando a transicao

```tsx
{isActive && (
  <motion.div
    layoutId="activeTab"
    className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"
    transition={{
      type: 'spring',
      stiffness: 500,
      damping: 30,
    }}
  />
)}
```

## Variacao: Indicador como background (pill style)

```tsx
function TabItem({ label, isActive, onClick }: TabItemProps) {
  return (
    <button onClick={onClick} className="relative px-4 py-2 z-10">
      <span className={isActive ? 'text-white' : 'text-zinc-600'}>
        {label}
      </span>

      {isActive && (
        <motion.div
          layoutId="activeTabBg"
          className="absolute inset-0 rounded-full bg-violet-500 -z-10"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  )
}
```