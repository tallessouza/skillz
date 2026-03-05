# Code Examples: Radix Collapsible nos Módulos

## Instalação

```bash
npm install @radix-ui/react-collapsible
```

## Importação

```tsx
import * as Collapsible from '@radix-ui/react-collapsible'
```

## Componente Module completo (da aula)

```tsx
import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronDown } from 'lucide-react'

interface ModuleProps {
  moduleIndex: number
  title: string
  amountOfLessons: number
  children: React.ReactNode
}

export function Module({ moduleIndex, title, amountOfLessons, children }: ModuleProps) {
  return (
    <Collapsible.Root className="group">
      <Collapsible.Trigger className="flex w-full items-center gap-3 bg-zinc-800 p-4">
        <div className="flex h-10 w-10 rounded-full items-center justify-center bg-zinc-950 text-xs">
          {moduleIndex}
        </div>

        <div className="flex flex-col gap-1 text-left">
          <strong className="text-sm">{title}</strong>
          <span className="text-xs text-zinc-400">{amountOfLessons} aulas</span>
        </div>

        <ChevronDown className="ml-auto h-5 w-5 text-zinc-400 group-data-[state=open]:rotate-180 transition-transform" />
      </Collapsible.Trigger>

      <Collapsible.Content>
        <nav className="relative flex flex-col gap-4 p-6">
          {children}
        </nav>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
```

## Estilização condicional — exemplos variados

### Borda no Root quando aberto
```tsx
<Collapsible.Root className="data-[state=open]:border-l-4 data-[state=open]:border-green-500">
```

### Background diferente quando aberto
```tsx
<Collapsible.Root className="data-[state=open]:bg-zinc-700">
```

### Rotação do ícone via group
```tsx
<Collapsible.Root className="group">
  <Collapsible.Trigger>
    <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform" />
  </Collapsible.Trigger>
</Collapsible.Root>
```

### Opacidade do texto via group
```tsx
<Collapsible.Root className="group">
  <Collapsible.Trigger>
    <span className="group-data-[state=open]:text-green-400">Módulo 1</span>
  </Collapsible.Trigger>
</Collapsible.Root>
```

## Múltiplos collapsibles independentes

```tsx
{modules.map((module, index) => (
  <Module
    key={module.id}
    moduleIndex={index + 1}
    title={module.title}
    amountOfLessons={module.lessons.length}
  >
    {module.lessons.map((lesson) => (
      <Lesson key={lesson.id} title={lesson.title} duration={lesson.duration} />
    ))}
  </Module>
))}
```

Cada Module tem seu próprio Collapsible.Root, então abrir um não fecha os outros.