# Code Examples: Destacando Aula Atual

## Header exibindo modulo e aula ativos

```typescript
// Header.tsx
import { useAppSelector } from '../store'

export function Header() {
  const { currentModule, currentLesson } = useAppSelector((state) => {
    const { currentModuleIndex, currentLessonIndex } = state.player

    const currentModule = state.player.course.modules[currentModuleIndex]
    const currentLesson = currentModule.lessons[currentLessonIndex]

    return { currentModule, currentLesson }
  })

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
      <span className="text-sm text-zinc-400">
        Módulo "{currentModule.title}"
      </span>
    </div>
  )
}
```

## Module.tsx calculando isCurrent para cada lesson

```typescript
// Module.tsx
import { useAppSelector } from '../store'
import { Lesson } from './Lesson'

interface ModuleProps {
  moduleIndex: number
  title: string
  lessonsAmount: number
}

export function Module({ moduleIndex, title, lessonsAmount }: ModuleProps) {
  const { currentModuleIndex, currentLessonIndex } = useAppSelector(
    (state) => ({
      currentModuleIndex: state.player.currentModuleIndex,
      currentLessonIndex: state.player.currentLessonIndex,
    })
  )

  const lessons = useAppSelector(
    (state) => state.player.course.modules[moduleIndex].lessons
  )

  return (
    <div>
      <strong className="text-sm font-medium text-zinc-400">{title}</strong>
      <div className="flex flex-col gap-2 mt-2">
        {lessons.map((lesson, lessonIndex) => {
          const isCurrent =
            currentModuleIndex === moduleIndex &&
            currentLessonIndex === lessonIndex

          return (
            <Lesson
              key={lesson.id}
              title={lesson.title}
              duration={lesson.duration}
              isCurrent={isCurrent}
              onPlay={() => dispatch(play([moduleIndex, lessonIndex]))}
            />
          )
        })}
      </div>
    </div>
  )
}
```

## Lesson.tsx com data attribute e disabled

```typescript
// Lesson.tsx
import { PlayCircle, Video } from 'lucide-react'

interface LessonProps {
  title: string
  duration: string
  isCurrent?: boolean
  onPlay: () => void
}

export function Lesson({
  title,
  duration,
  isCurrent = false,
  onPlay,
}: LessonProps) {
  return (
    <button
      data-active={isCurrent}
      disabled={isCurrent}
      onClick={onPlay}
      className="flex items-center gap-3 text-sm text-zinc-400 data-[active=true]:text-emerald-400 enabled:hover:text-zinc-300"
    >
      {isCurrent ? (
        <PlayCircle className="w-4 h-4 text-emerald-400" />
      ) : (
        <Video className="w-4 h-4 text-zinc-500" />
      )}
      <span>{title}</span>
      <span className="ml-auto font-mono text-xs text-zinc-500">
        {duration}
      </span>
    </button>
  )
}
```

## Variacao: mesmo padrao com Zustand

```typescript
// Com Zustand ao inves de Redux
import { usePlayerStore } from '../stores/player'

export function Module({ moduleIndex }: { moduleIndex: number }) {
  const currentModuleIndex = usePlayerStore((s) => s.currentModuleIndex)
  const currentLessonIndex = usePlayerStore((s) => s.currentLessonIndex)
  const lessons = usePlayerStore(
    (s) => s.course.modules[moduleIndex].lessons
  )

  return (
    <div>
      {lessons.map((lesson, lessonIndex) => {
        const isCurrent =
          currentModuleIndex === moduleIndex &&
          currentLessonIndex === lessonIndex

        return (
          <Lesson key={lesson.id} isCurrent={isCurrent} {...lesson} />
        )
      })}
    </div>
  )
}
```

## Padrao enabled:hover em outros contextos

```tsx
// Tabs com item ativo desabilitado
<button
  data-selected={isSelected}
  disabled={isSelected}
  className="px-4 py-2 text-zinc-400 data-[selected=true]:text-white data-[selected=true]:border-b-2 data-[selected=true]:border-violet-500 enabled:hover:text-zinc-200"
>
  {tab.label}
</button>

// Lista de opcoes com item escolhido
<li
  data-chosen={isChosen}
  className="cursor-pointer text-zinc-300 data-[chosen=true]:text-emerald-400 data-[chosen=true]:cursor-default"
>
  {option.label}
</li>
```