# Code Examples: Loading State em Redux/Zustand

## 1. State completo com isLoading

```typescript
// player slice - state definition
interface PlayerState {
  course: Course | null
  currentModuleIndex: number
  currentLessonIndex: number
  isLoading: boolean
}

const initialState: PlayerState = {
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  isLoading: true,
}
```

## 2. extraReducers com pending e fulfilled

```typescript
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play: (state, action: PayloadAction<[number, number]>) => {
      state.currentModuleIndex = action.payload[0]
      state.currentLessonIndex = action.payload[1]
    },
    next: (state) => {
      // logica de proximo
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCourse.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(loadCourse.fulfilled, (state, action) => {
      state.course = action.payload
      state.isLoading = false
    })
  },
})
```

## 3. Componente Video com loading

```tsx
import { Loader } from 'lucide-react'
import { useAppSelector } from '../store'

export function Video() {
  const isCourseLoading = useAppSelector(
    (state) => state.player.isLoading
  )

  const currentLesson = useAppSelector((state) => {
    const { currentModuleIndex, currentLessonIndex } = state.player
    return state.player.course?.modules[currentModuleIndex]
      ?.lessons[currentLessonIndex]
  })

  if (isCourseLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="w-6 h-6 text-zinc-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full bg-zinc-950 aspect-video">
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${currentLesson?.id}`}
        width="100%"
        height="100%"
        controls
      />
    </div>
  )
}
```

## 4. Header com loading simples

```tsx
export function Header() {
  const isCourseLoading = useAppSelector(
    (state) => state.player.isLoading
  )

  const currentModule = useAppSelector(/* ... */)
  const currentLesson = useAppSelector(/* ... */)

  if (isCourseLoading) {
    return (
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Carregando...</h1>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{currentLesson?.title}</h1>
        <span className="text-sm text-zinc-400">
          Modulo: {currentModule?.title}
        </span>
      </div>
    </div>
  )
}
```

## 5. Skeleton screen para Sidebar (desafio do instrutor)

```tsx
export function SidebarSkeleton() {
  return (
    <aside className="w-80 border-l border-zinc-800 p-6 space-y-4">
      {Array.from({ length: 3 }).map((_, moduleIndex) => (
        <div key={moduleIndex} className="animate-pulse">
          {/* Module title skeleton */}
          <div className="h-5 bg-zinc-700 rounded w-3/4 mb-3" />

          {/* Lesson items skeleton */}
          {Array.from({ length: 4 }).map((_, lessonIndex) => (
            <div
              key={lessonIndex}
              className="flex items-center gap-3 py-2"
            >
              <div className="w-4 h-4 bg-zinc-700 rounded" />
              <div className="h-4 bg-zinc-700 rounded flex-1" />
            </div>
          ))}
        </div>
      ))}
    </aside>
  )
}

// Uso no componente Sidebar
export function Sidebar() {
  const isCourseLoading = useAppSelector(
    (state) => state.player.isLoading
  )

  if (isCourseLoading) {
    return <SidebarSkeleton />
  }

  return (
    <aside className="w-80 border-l border-zinc-800 p-6">
      {/* conteudo real */}
    </aside>
  )
}
```

## 6. Atualizacao do teste

```typescript
// Antes (teste quebra sem isLoading)
const initialState = {
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
}

// Depois (teste funciona)
const initialState = {
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  isLoading: false, // adicionar para testes
}
```

## 7. Equivalente em Zustand

```typescript
import { create } from 'zustand'

interface PlayerStore {
  course: Course | null
  currentModuleIndex: number
  currentLessonIndex: number
  isLoading: boolean
  load: () => Promise<void>
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  isLoading: true,

  load: async () => {
    set({ isLoading: true })

    const response = await fetch('/api/course')
    const course = await response.json()

    set({ course, isLoading: false })
  },
}))

// Uso no componente
function Video() {
  const isLoading = usePlayerStore((state) => state.isLoading)
  // ... mesmo padrao de renderizacao condicional
}
```