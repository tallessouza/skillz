# Code Examples: Configurando Autoplay

## Exemplo completo do slice com play e next

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Course {
  modules: {
    title: string
    lessons: {
      id: string
      title: string
      duration: string
    }[]
  }[]
}

interface PlayerState {
  course: Course
  currentModuleIndex: number
  currentLessonIndex: number
}

const initialState: PlayerState = {
  course: { modules: [] },
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

    next: (state) => {
      const nextLessonIndex = state.currentLessonIndex + 1
      const nextLesson =
        state.course.modules[state.currentModuleIndex].lessons[nextLessonIndex]

      if (nextLesson) {
        state.currentLessonIndex = nextLessonIndex
      } else {
        const nextModuleIndex = state.currentModuleIndex + 1
        const nextModule = state.course.modules[nextModuleIndex]

        if (nextModule) {
          state.currentModuleIndex = nextModuleIndex
          state.currentLessonIndex = 0
        }
      }
    },
  },
})

export const { play, next } = playerSlice.actions
export default playerSlice.reducer
```

## Componente Video completo

```typescript
import ReactPlayer from 'react-player'
import { useAppDispatch, useAppSelector } from '../store'
import { next } from '../store/slices/player'

export function Video() {
  const dispatch = useAppDispatch()

  const currentLesson = useAppSelector((state) => {
    const currentModule = state.player.course.modules[state.player.currentModuleIndex]
    return currentModule?.lessons[state.player.currentLessonIndex]
  })

  function handlePlayNext() {
    dispatch(next())
  }

  return (
    <div>
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${currentLesson?.id}`}
        onEnded={handlePlayNext}
        playing={true}
        controls
        width="100%"
        height="100%"
      />
    </div>
  )
}
```

## Componente Module com defaultOpen

```typescript
import { Collapsible } from './ui/collapsible'

interface ModuleProps {
  moduleIndex: number
  title: string
  lessonsAmount: number
}

export function Module({ moduleIndex, title, lessonsAmount }: ModuleProps) {
  return (
    <Collapsible defaultOpen={moduleIndex === 0}>
      {/* conteudo do modulo */}
    </Collapsible>
  )
}
```

## Fluxo do Redux DevTools

Ao implementar o autoplay, o Redux DevTools mostra:

```
player/play      → payload: [0, 2]     (usuario clicou na aula)
player/next      → payload: undefined  (video acabou, autoplay)
player/next      → payload: undefined  (proximo video acabou)
```

A action `next` sempre aparece sem payload, confirmando que toda a logica esta no reducer.