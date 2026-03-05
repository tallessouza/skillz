---
name: rs-electron-configurando-layout
description: "Applies React Router DOM layout pattern with Outlet when structuring Electron or React apps. Use when user asks to 'create a layout', 'add sidebar layout', 'configure shared layout', 'use Outlet', or 'wrap routes with layout'. Enforces separation of shared UI (sidebar, header) into layout components using Outlet for dynamic content. Make sure to use this skill whenever creating route layouts in React Router DOM. Not for styling, CSS layout, or Flexbox/Grid questions."
---

# Configurando Layout com React Router DOM

> Separe elementos visuais compartilhados (sidebar, header) em componentes de layout usando Outlet para conteudo dinamico.

## Rules

1. **Extraia elementos repetidos para um layout** — sidebar, header e outros elementos presentes em todas as paginas devem viver em um componente de layout, porque mante-los no componente raiz impede customizacao futura (ex: paginas sem sidebar)
2. **Use Outlet para conteudo dinamico** — `<Outlet />` do React Router DOM funciona como `children`, indicando onde o conteudo especifico de cada pagina sera inserido
3. **Organize layouts em pasta dedicada** — `src/pages/layouts/default.tsx` para o layout padrao, porque facilita criar layouts alternativos no futuro
4. **Envolva rotas com Route pai** — o layout e aplicado como `element` de uma `<Route>` pai com `path="/"`, e as rotas filhas herdam o layout

## How to write

### Componente de layout

```tsx
// src/pages/layouts/default.tsx
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../../components/Sidebar'
import { Header } from '../../components/Header'

export default function DefaultLayout() {
  return (
    <div>
      <Sidebar />
      <Header />
      <Outlet />
    </div>
  )
}
```

### Rotas com layout

```tsx
// src/App.tsx
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

## Example

**Before (tudo no App):**
```tsx
export function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div>
          <Sidebar />
          <Header />
          <Home />
        </div>
      } />
      <Route path="/documents" element={
        <div>
          <Sidebar />
          <Header />
          <Documents />
        </div>
      } />
    </Routes>
  )
}
```

**After (com layout):**
```tsx
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

## Heuristics

| Situation | Do |
|-----------|-----|
| Sidebar/header em todas as paginas | Extrair para layout com Outlet |
| Pagina precisa layout diferente | Criar novo layout (ex: `auth.tsx`) com Route pai separado |
| Conteudo global (CSS reset, providers) | Manter no App, nao no layout |
| Janela Electron abre pequena demais | Configurar `width`/`height` no `main.ts` (ex: 1120x700) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Repetir sidebar/header em cada rota | Extrair para componente de layout |
| Usar `children` prop manual para layout | Usar `<Outlet />` do React Router DOM |
| Colocar CSS global no layout | Manter CSS global no App/entry point |
| Layout monolitico sem possibilidade de variacao | Route pai com layout como element |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
