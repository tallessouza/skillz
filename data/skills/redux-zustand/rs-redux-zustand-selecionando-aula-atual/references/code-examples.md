# Code Examples: Selecionando Aula Atual

## Exemplo completo do slice

```typescript
// store/slices/player.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Lesson {
  id: string
  title: string
  duration: string
}

interface Module {
  id: number
  title: string
  lessons: Lesson[]
}

interface Course {
  id: number
  modules: Module[]
}

interface PlayerState {
  course: Course | null
  currentModuleIndex: number
  currentLessonIndex: number
}

const initialState: PlayerState = {
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play: (state, action: PayloadAction<[number, number]>) => {
      state.currentModuleIndex = action.payload[0]
      state.currentLessonIndex = action.payload[1]
    },
  },
})

export const { play } = playerSlice.actions
export default playerSlice.reducer
```

## Componente de video com selector

```typescript
// components/Video.tsx
import { useAppSelector } from '../store'

export function Video() {
  const lesson = useAppSelector((state) => {
    const { currentModuleIndex, currentLessonIndex } = state.player

    return state.player.course?.modules[currentModuleIndex]
      .lessons[currentLessonIndex]
  })

  if (!lesson) return null

  return (
    <div>
      <iframe
        src={`https://www.youtube.com/embed/${lesson.id}`}
        allowFullScreen
      />
    </div>
  )
}
```

## Componente Module com dispatch

```typescript
// components/Module.tsx
import { useDispatch } from 'react-redux'
import { play } from '../store/slices/player'
import { Lesson } from './Lesson'

interface ModuleProps {
  moduleIndex: number
  title: string
  lessons: Array<{ id: string; title: string; duration: string }>
}

export function Module({ moduleIndex, title, lessons }: ModuleProps) {
  const dispatch = useDispatch()

  return (
    <div>
      <h3>{title}</h3>
      {lessons.map((lesson, lessonIndex) => (
        <Lesson
          key={lesson.id}
          title={lesson.title}
          duration={lesson.duration}
          onPlay={() => dispatch(play([moduleIndex, lessonIndex]))}
        />
      ))}
    </div>
  )
}
```

## Componente Lesson com callback

```typescript
// components/Lesson.tsx
interface LessonProps {
  title: string
  duration: string
  onPlay: () => void
}

export function Lesson({ title, duration, onPlay }: LessonProps) {
  return (
    <button onClick={onPlay}>
      <span>{title}</span>
      <span>{duration}</span>
    </button>
  )
}
```

## Verificacao via Redux DevTools

Ao clicar nas aulas, o DevTools mostra:

```
Action: player/play
Payload: [0, 0]  → Modulo 1, Aula 1
Payload: [0, 1]  → Modulo 1, Aula 2
Payload: [1, 3]  → Modulo 2, Aula 4
```

O state atualiza automaticamente e o componente Video re-renderiza com o novo `lesson.id`.