# Code Examples: Migrando do Redux para Zustand

## Store completa com Zustand

```typescript
import { create } from 'zustand'
import { api } from '../lib/axios'

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

interface PlayerStore {
  course: Course | null
  currentModuleIndex: number
  currentLessonIndex: number
  isLoading: boolean

  play: (moduleAndLessonIndex: [number, number]) => void
  next: () => void
  load: () => Promise<void>
}

export const useStore = create<PlayerStore>((set, get) => ({
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  isLoading: true,

  play: (moduleAndLessonIndex: [number, number]) => {
    const [moduleIndex, lessonIndex] = moduleAndLessonIndex
    set({ currentModuleIndex: moduleIndex, currentLessonIndex: lessonIndex })
  },

  next: () => {
    const { currentModuleIndex, currentLessonIndex, course } = get()
    const currentModule = course?.modules[currentModuleIndex]

    if (currentLessonIndex < (currentModule?.lessons.length ?? 0) - 1) {
      set({ currentLessonIndex: currentLessonIndex + 1 })
    } else if (currentModuleIndex < (course?.modules.length ?? 0) - 1) {
      set({
        currentModuleIndex: currentModuleIndex + 1,
        currentLessonIndex: 0,
      })
    }
  },

  load: async () => {
    set({ isLoading: true })
    const response = await api.get('/courses/1')
    set({
      course: response.data,
      isLoading: false,
    })
  },
}))
```

## Hook derivado useCurrentLesson

```typescript
export function useCurrentLesson() {
  return useStore((store) => {
    const currentModule = store.course?.modules[store.currentModuleIndex]
    const currentLesson = currentModule?.lessons[store.currentLessonIndex]
    return { currentModule, currentLesson }
  })
}
```

## Componente Page (Player) — migrado

```typescript
import { useEffect } from 'react'
import { useStore } from '../zupistand-store'

export function Player() {
  const { course, load } = useStore((store) => ({
    course: store.course,
    load: store.load,
  }))

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      {course?.modules.map((module, moduleIndex) => (
        <Module key={module.id} module={module} moduleIndex={moduleIndex} />
      ))}
    </div>
  )
}
```

## Componente Header — migrado

```typescript
import { useCurrentLesson } from '../zustand-store'
import { useStore } from '../zustand-store'

export function Header() {
  const { currentModule, currentLesson } = useCurrentLesson()
  const isLoading = useStore((store) => store.isLoading)

  if (isLoading) {
    return <h1>Carregando...</h1>
  }

  return (
    <div>
      <h1>{currentLesson?.title}</h1>
      <span>{currentModule?.title}</span>
    </div>
  )
}
```

## Componente Module — migrado

```typescript
import { useStore } from '../zustand-store'

export function Module({ module, moduleIndex }) {
  const { currentLessonIndex, currentModuleIndex, play } = useStore((store) => ({
    currentLessonIndex: store.currentLessonIndex,
    currentModuleIndex: store.currentModuleIndex,
    play: store.play,
  }))

  const lessons = useStore((store) => store.course?.modules[moduleIndex]?.lessons)

  return (
    <div>
      <h2>{module.title}</h2>
      {lessons?.map((lesson, lessonIndex) => (
        <button
          key={lesson.id}
          onClick={() => play([moduleIndex, lessonIndex])}
          data-active={
            currentModuleIndex === moduleIndex &&
            currentLessonIndex === lessonIndex
          }
        >
          {lesson.title}
        </button>
      ))}
    </div>
  )
}
```

## Componente Video — migrado

```typescript
import { useCurrentLesson } from '../zustand-store'
import { useStore } from '../zustand-store'

export function Video() {
  const { currentLesson } = useCurrentLesson()
  const { isLoading, next } = useStore((store) => ({
    isLoading: store.isLoading,
    next: store.next,
  }))

  useEffect(() => {
    if (currentLesson) {
      document.title = `Assistindo: ${currentLesson.title}`
    }
  }, [currentLesson])

  // ...
}
```

## Mapeamento Redux → Zustand (referencia rapida)

| Redux | Zustand |
|-------|---------|
| `configureStore({ reducer: { player: playerSlice } })` | `create<Store>((set, get) => ({ ... }))` |
| `createSlice({ reducers: { play(state, action) { ... } } })` | `play: (args) => set({ ... })` |
| `createAsyncThunk('player/load', async () => { ... })` | `load: async () => { set(...); await api...; set(...) }` |
| `extraReducers: { [load.pending]: ..., [load.fulfilled]: ... }` | Tudo dentro da propria funcao async |
| `useAppSelector(state => state.player.course)` | `useStore(store => store.course)` |
| `const dispatch = useAppDispatch(); dispatch(play([0, 1]))` | `const play = useStore(s => s.play); play([0, 1])` |
| `<Provider store={store}><App /></Provider>` | `<App />` (sem provider) |