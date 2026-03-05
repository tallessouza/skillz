# Code Examples: Criando Reducer do Player

## Exemplo completo do slice

```typescript
// store/slices/player.ts
import { createSlice } from '@reduxjs/toolkit'

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    course: {
      modules: [
        {
          id: '1',
          title: 'Iniciando com React',
          lessons: [
            { id: 'Jai8w6K_GnY', title: 'CSS Modules', duration: '13:45' },
            { id: 'w-DW4DhDfcw', title: 'Estilização do Post', duration: '10:05' },
            { id: 'D83-55LUdKE', title: 'Componente: Header', duration: '06:33' },
            { id: 'W_ATsETujaY', title: 'Componente: Sidebar', duration: '09:12' },
            { id: 'Pj8dPeameYo', title: 'CSS Global', duration: '03:23' },
            { id: '8KBq2vhwbac', title: 'Form de comentários', duration: '11:34' },
          ],
        },
        {
          id: '2',
          title: 'Estrutura da aplicação',
          lessons: [
            { id: 'gE48FQXRZ_o', title: 'Componente: Comment', duration: '13:45' },
            { id: 'Ng_Vk4tBl0g', title: 'Responsividade', duration: '10:05' },
            { id: 'h5JA3wfuW1k', title: 'Interações no JSX', duration: '06:33' },
            { id: '1G0vSTqWELg', title: 'Utilizando estado', duration: '09:12' },
          ],
        },
      ],
    },
  },
  reducers: {},
})

export const player = playerSlice.reducer
```

## Registrando no store

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import { player } from './slices/player'

export const store = configureStore({
  reducer: {
    player,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

## Consumindo modules na pagina

```typescript
// pages/Player.tsx
export function Player() {
  const modules = useAppSelector(state => state.player.course.modules)

  return (
    <div>
      {modules.map((module, index) => (
        <Module
          key={module.id}
          moduleIndex={index}
          title={module.title}
          amountOfLessons={module.lessons.length}
        />
      ))}
    </div>
  )
}
```

## Consumindo lessons dentro do componente Module

```typescript
// components/Module.tsx
interface ModuleProps {
  moduleIndex: number
  title: string
  amountOfLessons: number
}

export function Module({ moduleIndex, title, amountOfLessons }: ModuleProps) {
  const lessons = useAppSelector(state =>
    state.player.course.modules[moduleIndex].lessons
  )

  return (
    <div>
      <h3>{title} — {amountOfLessons} aulas</h3>
      {lessons.map(lesson => (
        <Lesson
          key={lesson.id}
          title={lesson.title}
          duration={lesson.duration}
        />
      ))}
    </div>
  )
}
```

## Comparacao: Context API vs Redux selector

```typescript
// Context API — re-renderiza em QUALQUER mudanca do contexto
const { modules, currentLesson, isPlaying } = useContext(PlayerContext)
// Se isPlaying mudar, este componente re-renderiza mesmo usando apenas modules

// Redux — re-renderiza APENAS quando modules muda
const modules = useAppSelector(state => state.player.course.modules)
// Se isPlaying mudar, este componente NAO re-renderiza
```

## Anti-pattern: retornando slice inteiro

```typescript
// ERRADO — qualquer mudanca no player causa re-render
const player = useAppSelector(state => state.player)
const modules = player.course.modules

// ERRADO — desestruturacao dentro do selector
const { course } = useAppSelector(state => state.player)

// CORRETO — acesso granular
const modules = useAppSelector(state => state.player.course.modules)
```