---
name: rs-full-stack-criar-o-app-layout
description: "Enforces shared layout pattern with React Router Outlet and Tailwind CSS when building multi-page applications. Use when user asks to 'create a layout', 'share header across pages', 'wrap routes with layout', 'add app layout', or 'reuse components between routes'. Applies nested Route with layout element, Outlet for child rendering, responsive Tailwind classes. Make sure to use this skill whenever structuring route layouts in React Router. Not for individual page components, navigation logic, or authentication guards."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-router
  tags: [react, react-router, layout, outlet, tailwind, routing]
---

# Criar o AppLayout

> Crie um componente de layout compartilhado usando React Router Outlet para reaproveitar elementos comuns (header, sidebar) entre rotas do mesmo grupo.

## Rules

1. **Use Outlet do React Router para renderizar rotas filhas** — o layout define a estrutura visual e o Outlet injeta o conteudo da rota ativa, porque isso evita duplicacao de header/footer em cada pagina
2. **Envolva rotas relacionadas com uma Route pai que renderiza o layout** — `<Route path="/" element={<AppLayout />}>` com rotas filhas dentro, porque isso compartilha o layout automaticamente
3. **Compartilhe o mesmo layout entre perfis diferentes** — se employee e manager tem o mesmo header, use o mesmo AppLayout para ambos, porque reduz duplicacao
4. **Aplique responsividade com breakpoints do Tailwind** — use prefixo `md:` para ajustar largura a partir de 768px, porque garante que o layout funciona em mobile e desktop
5. **Separe o layout em arquivo proprio na pasta components** — `app.layout.tsx`, porque mantem a organizacao e facilita importacao

## How to write

### Componente AppLayout

```tsx
import { Outlet } from "react-router-dom"

export function AppLayout() {
  return (
    <div className="w-full h-screen bg-gray-400 flex flex-col items-center text-gray-100">
      {/* Header compartilhado vai aqui */}
      <main className="m-3 w-full md:w-auto">
        <Outlet />
      </main>
    </div>
  )
}
```

### Envolvendo rotas com o layout

```tsx
import { Route } from "react-router-dom"
import { AppLayout } from "./components/app.layout"

// Rotas do employee
<Route path="/" element={<AppLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="profile" element={<Profile />} />
</Route>
```

## Example

**Before (layout duplicado em cada pagina):**

```tsx
function Dashboard() {
  return (
    <div className="w-full h-screen bg-gray-400 flex flex-col items-center text-gray-100">
      <header>Logo | User | Sair</header>
      <main className="m-3 w-full md:w-auto">
        <h1>Dashboard</h1>
      </main>
    </div>
  )
}

function Profile() {
  return (
    <div className="w-full h-screen bg-gray-400 flex flex-col items-center text-gray-100">
      <header>Logo | User | Sair</header>
      <main className="m-3 w-full md:w-auto">
        <h1>Profile</h1>
      </main>
    </div>
  )
}
```

**After (layout compartilhado via Outlet):**

```tsx
// app.layout.tsx
export function AppLayout() {
  return (
    <div className="w-full h-screen bg-gray-400 flex flex-col items-center text-gray-100">
      <header>Logo | User | Sair</header>
      <main className="m-3 w-full md:w-auto">
        <Outlet />
      </main>
    </div>
  )
}

// routes — cada pagina so tem seu conteudo
<Route path="/" element={<AppLayout />}>
  <Route index element={<h1>Dashboard</h1>} />
  <Route path="profile" element={<h1>Profile</h1>} />
</Route>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Header/footer comum entre paginas | Extraia para AppLayout com Outlet |
| Perfis diferentes (employee/manager) com mesmo header | Reutilize o mesmo AppLayout |
| Tela cheia com fundo colorido | `w-full h-screen bg-{color}` na div raiz |
| Conteudo centralizado responsivo | `w-full md:w-auto` no main |
| Espacamento interno uniforme | `m-3` (12px em todas as direcoes) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Duplicar header em cada componente de pagina | Usar Outlet dentro de um layout compartilhado |
| Criar layouts separados identicos para employee e manager | Compartilhar o mesmo AppLayout |
| Hardcodar largura fixa no main | Usar `w-full md:w-auto` para responsividade |
| Colocar logica de rota dentro do layout | Layout so define estrutura visual, rotas ficam no router |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Pagina filha nao renderiza dentro do layout | Falta `<Outlet />` no componente de layout | Adicione `<Outlet />` onde as rotas filhas devem aparecer |
| Layout aparece duplicado | Rotas filhas nao estao aninhadas dentro da Route pai | Mova as rotas filhas para dentro de `<Route element={<AppLayout />}>` |
| `Outlet` importado mas nao encontrado | Importacao de pacote errado | Importe de `react-router-dom`: `import { Outlet } from "react-router-dom"` |
| Conteudo nao centraliza em telas grandes | Falta breakpoint responsivo no container | Use `w-full md:w-auto` ou `max-w-{size} mx-auto` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre layouts compartilhados, Outlet e organizacao de rotas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes