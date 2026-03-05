# Code Examples: Configurando Layout

## Exemplo completo do layout default

```tsx
// src/pages/layouts/default.tsx
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../../components/Sidebar'
import { Header } from '../../components/Header'

export default function DefaultLayout() {
  return (
    <div>
      <Sidebar />
      <div>
        <Header />
        <Outlet />
      </div>
    </div>
  )
}
```

## App apos extracao do layout

```tsx
// src/App.tsx
import './global.css'
import { Route, Routes } from 'react-router-dom'
import DefaultLayout from './pages/layouts/default'
import { Home } from './pages/Home'
import { Documents } from './pages/Documents'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/documents" element={<Documents />} />
      </Route>
    </Routes>
  )
}
```

## Multiplos layouts

```tsx
// Quando precisar de paginas sem sidebar (ex: login)
import AuthLayout from './pages/layouts/auth'

export function App() {
  return (
    <Routes>
      {/* Rotas com layout padrao */}
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/documents" element={<Documents />} />
      </Route>

      {/* Rotas com layout de autenticacao (sem sidebar) */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  )
}
```

## Configuracao da janela Electron

```typescript
// main.ts
const mainWindow = new BrowserWindow({
  width: 1120,
  height: 700,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
  },
})
```

## Estrutura de pastas resultante

```
src/
├── App.tsx                    # Rotas + CSS global
├── global.css
├── components/
│   ├── Sidebar.tsx
│   └── Header.tsx
└── pages/
    ├── layouts/
    │   └── default.tsx        # Layout com Outlet
    ├── Home.tsx
    └── Documents.tsx
```