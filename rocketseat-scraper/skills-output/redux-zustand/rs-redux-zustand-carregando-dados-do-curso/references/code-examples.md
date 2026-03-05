# Code Examples: Carregando Dados da API para o Redux Store

## Estrutura do JSON Server (server.json)

```json
{
  "courses": [
    {
      "id": 1,
      "modules": [
        {
          "id": 1,
          "title": "Iniciando com React",
          "lessons": [
            {
              "id": "1",
              "title": "CSS Modules",
              "duration": "13:45"
            },
            {
              "id": "2",
              "title": "Styled Components",
              "duration": "10:05"
            }
          ]
        }
      ]
    }
  ]
}
```

Nota: O instrutor converte os IDs dos modulos para numeros porque assim e possivel buscar por `/courses/1` diretamente no JSON Server.

## Interface completa do estado

```typescript
// playerSlice.ts

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

export interface PlayerState {
  course: Course | null
  currentModuleIndex: number
  currentLessonIndex: number
}
```

A interface e exportada porque pode ser usada em selectors de outros arquivos.

## Slice completo com action start

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: PlayerState = {
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    start: (state, action: PayloadAction<Course>) => {
      state.course = action.payload
    },
    // outras actions existentes com optional chaining:
    play: (state, action: PayloadAction<[number, number]>) => {
      state.currentModuleIndex = action.payload[0]
      state.currentLessonIndex = action.payload[1]
    },
    next: (state) => {
      const currentModule = state.course?.modules[state.currentModuleIndex]
      const nextLessonIndex = state.currentLessonIndex + 1

      if (currentModule?.lessons[nextLessonIndex]) {
        state.currentLessonIndex = nextLessonIndex
      } else {
        const nextModuleIndex = state.currentModuleIndex + 1
        if (state.course?.modules[nextModuleIndex]) {
          state.currentModuleIndex = nextModuleIndex
          state.currentLessonIndex = 0
        }
      }
    },
  },
})

export const { start, play, next } = playerSlice.actions
export default playerSlice.reducer
```

## Componente Player com useEffect

```typescript
import { useEffect } from 'react'
import { useAppDispatch } from '../store'
import { start } from '../store/slices/player'
import { api } from '../lib/axios'

export function Player() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    api.get('/courses/1').then((response) => {
      dispatch(start(response.data))
    })
  }, [])

  // ... resto do componente
}
```

## Guard clauses nos componentes filhos

### Video component
```typescript
export function Video() {
  const currentLesson = useAppSelector(/* selector */)

  if (!currentLesson) return null

  return (
    <div>
      <video src={currentLesson.url} />
    </div>
  )
}
```

### Header component
```typescript
export function Header() {
  const currentModule = useAppSelector(/* selector */)
  const currentLesson = useAppSelector(/* selector */)

  if (!currentModule || !currentLesson) return null

  return (
    <div>
      <h1>{currentLesson.title}</h1>
      <span>{currentModule.title}</span>
    </div>
  )
}
```

### Module component com verificacao de lessons
```typescript
export function Module({ moduleIndex, title, lessonsCount }) {
  const lessons = useAppSelector((state) => {
    return state.player.course?.modules[moduleIndex]?.lessons
  })

  return (
    <div>
      <h2>{title}</h2>
      {lessons && lessons.map((lesson) => (
        <Lesson key={lesson.id} title={lesson.title} />
      ))}
    </div>
  )
}
```

## Package.json com delay do JSON Server

```json
{
  "scripts": {
    "server": "json-server server.json -w -d 1000"
  }
}
```

O `-d 1000` adiciona 1 segundo de delay em todas as respostas para simular latencia.