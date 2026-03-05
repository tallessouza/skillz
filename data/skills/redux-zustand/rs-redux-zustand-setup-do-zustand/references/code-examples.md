# Code Examples: Setup do Zustand

## Instalacao

```bash
npm install zustand
# Apenas zustand — sem pacotes extras
```

## Interfaces reutilizadas do Redux

```typescript
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
  play: (moduleIndex: number, lessonIndex: number) => void
  next: () => void
}
```

## Store completo — zustand-store/index.ts

```typescript
import { create } from 'zustand'

export const useStore = create<PlayerState>((set, get) => {
  return {
    course: null,
    currentModuleIndex: 0,
    currentLessonIndex: 0,

    play: (moduleIndex: number, lessonIndex: number) => {
      set({
        currentModuleIndex: moduleIndex,
        currentLessonIndex: lessonIndex,
      })
    },

    next: () => {
      const { currentLessonIndex, currentModuleIndex, course } = get()

      const nextLessonIndex = currentLessonIndex + 1
      const nextModule = course?.modules[currentModuleIndex]

      if (nextModule && nextLessonIndex < nextModule.lessons.length) {
        set({ currentLessonIndex: nextLessonIndex })
      } else {
        const nextModuleIndex = currentModuleIndex + 1
        if (course?.modules[nextModuleIndex]) {
          set({
            currentModuleIndex: nextModuleIndex,
            currentLessonIndex: 0,
          })
        }
      }
    },
  }
})
```

## Comparacao lado a lado: Redux vs Zustand

### Redux — play action

```typescript
// playerSlice.ts (Redux)
const playerSlice = createSlice({
  name: 'player',
  initialState: {
    course: null,
    currentModuleIndex: 0,
    currentLessonIndex: 0,
  },
  reducers: {
    play: (state, action: PayloadAction<[number, number]>) => {
      state.currentModuleIndex = action.payload[0]
      state.currentLessonIndex = action.payload[1]
    },
  },
})

// No componente
import { useDispatch } from 'react-redux'
const dispatch = useDispatch()
dispatch(play([0, 1]))
```

### Zustand — play action

```typescript
// store.ts (Zustand)
export const useStore = create<PlayerState>((set) => ({
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  play: (moduleIndex: number, lessonIndex: number) => {
    set({ currentModuleIndex: moduleIndex, currentLessonIndex: lessonIndex })
  },
}))

// No componente
const play = useStore(state => state.play)
play(0, 1)
```

### Diferencas chave nesse exemplo

| Aspecto | Redux | Zustand |
|---------|-------|---------|
| Boilerplate | createSlice + reducers + actions | create() com retorno direto |
| Parametros | `action.payload[0]` | `moduleIndex` direto |
| Chamada | `dispatch(play([0, 1]))` | `play(0, 1)` |
| Tipagem | PayloadAction generic | Parametros tipados na funcao |
| Mutacao | Immer (mutacao no state) | `set({})` objeto parcial |

## Usando get() dentro de acoes

```typescript
next: () => {
  // get() retorna todo o estado — desestruture o que precisa
  const { currentLessonIndex, currentModuleIndex, course } = get()

  // Logica de negocio com valores do estado
  const nextLessonIndex = currentLessonIndex + 1
  const nextModule = course?.modules[currentModuleIndex]

  // set() aceita objeto parcial — atualiza apenas os campos passados
  if (nextModule && nextLessonIndex < nextModule.lessons.length) {
    set({ currentLessonIndex: nextLessonIndex })
  } else {
    const nextModuleIndex = currentModuleIndex + 1
    if (course?.modules[nextModuleIndex]) {
      // Multiplas atualizacoes no mesmo set()
      set({ currentModuleIndex: nextModuleIndex, currentLessonIndex: 0 })
    }
  }
}
```