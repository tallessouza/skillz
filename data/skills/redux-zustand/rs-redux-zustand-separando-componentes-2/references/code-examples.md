# Code Examples: Separando Componentes

## Estrutura de arquivos resultante

```
src/
├── pages/
│   └── Player.tsx          # Pagina principal (container)
└── components/
    ├── Header.tsx           # Titulo da aula + modulo
    ├── Video.tsx            # Wrapper do ReactPlayer
    ├── Module.tsx           # Secao de modulo com lista de aulas
    └── Lesson.tsx           # Botao individual de aula
```

## Header.tsx

```tsx
export function Header() {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-zinc-300">Módulo: Desvendando o Redux</span>
      <h1 className="text-2xl font-bold">Fundamentos do Redux</h1>
    </div>
  )
}
```

## Video.tsx

```tsx
import ReactPlayer from 'react-player'

export function Video() {
  return (
    <div className="w-full bg-zinc-950 aspect-video">
      <ReactPlayer
        width="100%"
        height="100%"
        controls
      />
    </div>
  )
}
```

## Module.tsx

```tsx
import { ChevronDown } from 'lucide-react'
import { Lesson } from './Lesson'

interface ModuleProps {
  title: string
  amountOfLessons: number
  moduleIndex: number
}

export function Module({ title, amountOfLessons, moduleIndex }: ModuleProps) {
  return (
    <div>
      <button className="flex w-full items-center gap-3 bg-zinc-800 p-4">
        <div className="flex h-10 w-10 rounded-full items-center justify-center bg-zinc-950 text-xs">
          {moduleIndex + 1}
        </div>
        <div className="flex flex-col gap-1 text-left">
          <strong className="text-sm">{title}</strong>
          <span className="text-xs text-zinc-400">{amountOfLessons} aulas</span>
        </div>
        <ChevronDown className="w-5 h-5 ml-auto text-zinc-400" />
      </button>

      <nav className="relative flex flex-col gap-4 p-6">
        <Lesson title="Fundamentos do Redux" duration="09:13" />
        <Lesson title="Usando Redux" duration="11:45" />
        <Lesson title="Redux Toolkit" duration="08:30" />
      </nav>
    </div>
  )
}
```

## Lesson.tsx

```tsx
import { Video } from 'lucide-react'

interface LessonProps {
  title: string
  duration: string
}

export function Lesson({ title, duration }: LessonProps) {
  return (
    <button className="flex items-center gap-3 text-sm text-zinc-400">
      <Video className="w-4 h-4 text-zinc-500" />
      <span>{title}</span>
      <span className="ml-auto font-mono text-xs text-zinc-500">{duration}</span>
    </button>
  )
}
```

## Player.tsx (pagina final)

```tsx
import { Header } from '../components/Header'
import { Video } from '../components/Video'
import { Module } from '../components/Module'

export function Player() {
  return (
    <div className="h-screen bg-zinc-950 text-zinc-50 flex justify-center items-center">
      <div className="flex w-[1100px] flex-col gap-6">
        <div className="flex items-center justify-between">
          <Header />
        </div>

        <main className="relative flex overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow">
          <div className="flex-1">
            <Video />
          </div>

          <aside className="w-80 border-l border-zinc-800 bg-zinc-900 overflow-y-scroll divide-y-2 divide-zinc-900">
            <Module title="Desvendando o Redux" amountOfLessons={3} moduleIndex={0} />
            <Module title="Estrutura Redux" amountOfLessons={2} moduleIndex={1} />
            <Module title="Aplicando Zustand" amountOfLessons={4} moduleIndex={2} />
          </aside>
        </main>
      </div>
    </div>
  )
}
```

## Evolucao das props (antes vs depois)

### Lesson — versao inicial (esta aula)

```tsx
interface LessonProps {
  title: string
  duration: string
}
```

### Lesson — versao futura (com estado)

```tsx
interface LessonProps {
  title: string
  duration: string
  isCurrent?: boolean
  onPlay: () => void
}
```

O instrutor deixa claro que props evoluem — comece simples, adicione conforme necessario.