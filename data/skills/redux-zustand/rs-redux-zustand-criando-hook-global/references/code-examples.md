# Code Examples: Criando Hook Global de Seletor

## Exemplo completo do slice com hook exportado

```typescript
// src/store/slices/player.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { useAppSelector } from '..'

interface Course {
  id: number
  modules: Array<{
    id: number
    title: string
    lessons: Array<{
      id: string
      title: string
      duration: string
    }>
  }>
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

export const player = playerSlice.reducer
export const { play } = playerSlice.actions

// Hook global exportado do slice
export const useCurrentLesson = () => {
  return useAppSelector((state) => {
    const { currentModuleIndex, currentLessonIndex } = state.player

    const currentModule = state.player.course?.modules[currentModuleIndex]
    const currentLesson = currentModule?.lessons[currentLessonIndex]

    return { currentModule, currentLesson }
  })
}
```

## Header usando o hook (ambos os campos)

```typescript
// src/components/Header.tsx
import { useCurrentLesson } from '../store/slices/player'

export function Header() {
  const { currentModule, currentLesson } = useCurrentLesson()

  return (
    <div>
      <h1>{currentLesson?.title}</h1>
      <span>{currentModule?.title}</span>
    </div>
  )
}
```

## Video usando o hook (apenas lesson)

```typescript
// src/pages/Player/Video.tsx
import { useCurrentLesson } from '../../store/slices/player'

export function Video() {
  const { currentLesson } = useCurrentLesson()

  return (
    <div>
      <video src={`/videos/${currentLesson?.id}.mp4`} controls />
      <h2>{currentLesson?.title}</h2>
    </div>
  )
}
```

## Player usando hook + side effect no componente

```typescript
// src/pages/Player/index.tsx
import { useEffect } from 'react'
import { useCurrentLesson } from '../../store/slices/player'

export function Player() {
  const { currentLesson } = useCurrentLesson()

  // Side effect FORA do hook, no componente
  useEffect(() => {
    document.title = `Assistindo ${currentLesson?.title}`
  }, [currentLesson])

  return (
    <div>
      {/* Video, Header, Module list, etc */}
    </div>
  )
}
```

## Variacao: hook com parametro

```typescript
// Quando o hook precisa de input externo
export const useLesson = (moduleIndex: number, lessonIndex: number) => {
  return useAppSelector((state) => {
    const module = state.player.course?.modules[moduleIndex]
    const lesson = module?.lessons[lessonIndex]
    return { module, lesson }
  })
}
```

## Variacao: multiplos hooks do mesmo slice

```typescript
// Cada hook expoe um "corte" diferente do estado
export const useCurrentLesson = () => {
  return useAppSelector((state) => {
    const { currentModuleIndex, currentLessonIndex } = state.player
    const currentModule = state.player.course?.modules[currentModuleIndex]
    const currentLesson = currentModule?.lessons[currentLessonIndex]
    return { currentModule, currentLesson }
  })
}

export const usePlayerProgress = () => {
  return useAppSelector((state) => {
    const { course, currentModuleIndex, currentLessonIndex } = state.player
    const totalModules = course?.modules.length ?? 0
    const totalLessons = course?.modules.reduce(
      (acc, mod) => acc + mod.lessons.length, 0
    ) ?? 0
    return { currentModuleIndex, currentLessonIndex, totalModules, totalLessons }
  })
}
```