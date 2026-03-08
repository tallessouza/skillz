---
name: rs-full-stack-criando-o-auth-layout
description: "Enforces shared layout patterns with React Router Outlet and Tailwind CSS when building authentication pages. Use when user asks to 'create a layout', 'share layout between routes', 'build sign-in page', 'center a card on screen', or 'add responsive breakpoints'. Applies reusable AuthLayout with Outlet, full-screen centering with Flexbox utilities, and Tailwind breakpoints for responsiveness. Make sure to use this skill whenever creating shared route layouts or centering content on screen with Tailwind. Not for form validation logic, authentication API calls, or backend session management."
---

# Criando o AuthLayout

> Crie layouts compartilhados entre rotas usando React Router Outlet e Tailwind CSS para centralizar e estilizar de forma responsiva.

## Rules

1. **Identifique padroes visuais repetidos entre telas** — se sign-in e sign-up compartilham fundo, card centralizado e logo, crie um layout compartilhado, porque duplicar markup viola DRY e dificulta manutencao
2. **Use Outlet do React Router para injetar rotas filhas** — o layout define a estrutura externa, o Outlet renderiza o conteudo especifico de cada rota
3. **Use w-screen e h-screen para ocupar a tela inteira** — garante que o container de fundo cubra toda a viewport
4. **Centralize com flex + justify-center + items-center** — combinacao padrao para centralizar horizontal e verticalmente
5. **Use breakpoints do Tailwind (md:, lg:) para responsividade** — aplica estilos condicionais a partir de um tamanho minimo de tela (mobile-first)
6. **Use colchetes para valores customizados** — `md:min-w-[462px]` quando nenhuma classe utilitaria padrao atende a medida exata do design

## How to write

### Layout compartilhado com Outlet

```tsx
import { Outlet } from "react-router-dom"
import logoSvg from "../assets/logo.svg"

export function AuthLayout() {
  return (
    <div className="w-screen h-screen bg-gray-400 flex flex-col justify-center items-center text-gray-100">
      <main className="bg-gray-500 p-8 rounded-md flex items-center flex-col md:min-w-[462px]">
        <img src={logoSvg} alt="Logo" className="my-8" />
        <Outlet />
      </main>
    </div>
  )
}
```

### Registrando o layout nas rotas

```tsx
import { AuthLayout } from "./components/AuthLayout"

// Layout wrapper com rotas filhas aninhadas
<Route path="/" element={<AuthLayout />}>
  <Route path="sign-in" element={<SignIn />} />
  <Route path="sign-up" element={<SignUp />} />
</Route>
```

### Breakpoints responsivos

```tsx
// mobile-first: estilo base para telas pequenas, md: para >= 768px
<main className="w-full md:min-w-[462px] md:bg-red-500">
  {/* Em telas < 768px: largura total */}
  {/* Em telas >= 768px: largura minima de 462px */}
</main>
```

## Example

**Before (layout duplicado em cada pagina):**
```tsx
// SignIn.tsx
function SignIn() {
  return (
    <div className="w-screen h-screen bg-gray-400 flex justify-center items-center">
      <main className="bg-gray-500 p-8 rounded-md">
        <img src={logo} alt="Logo" />
        <form>{/* sign-in form */}</form>
      </main>
    </div>
  )
}

// SignUp.tsx — mesma estrutura duplicada
function SignUp() {
  return (
    <div className="w-screen h-screen bg-gray-400 flex justify-center items-center">
      <main className="bg-gray-500 p-8 rounded-md">
        <img src={logo} alt="Logo" />
        <form>{/* sign-up form */}</form>
      </main>
    </div>
  )
}
```

**After (layout compartilhado via Outlet):**
```tsx
// AuthLayout.tsx
export function AuthLayout() {
  return (
    <div className="w-screen h-screen bg-gray-400 flex flex-col justify-center items-center text-gray-100">
      <main className="bg-gray-500 p-8 rounded-md flex items-center flex-col md:min-w-[462px]">
        <img src={logoSvg} alt="Logo" className="my-8" />
        <Outlet />
      </main>
    </div>
  )
}

// SignIn.tsx — apenas o formulario
function SignIn() {
  return <form>{/* sign-in form */}</form>
}

// SignUp.tsx — apenas o formulario
function SignUp() {
  return <form>{/* sign-up form */}</form>
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Duas ou mais rotas compartilham mesmo fundo/card/header | Extraia um layout com Outlet |
| Precisa centralizar um card na tela | `flex justify-center items-center` no container full-screen |
| Design tem medida exata que nao bate com classe Tailwind | Use colchetes: `min-w-[462px]` |
| Layout muda entre mobile e desktop | Use breakpoint `md:` (768px) como ponto de quebra |
| Precisa empilhar elementos verticalmente | `flex flex-col` no container |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Duplicar div de fundo + card em cada pagina | Layout compartilhado com Outlet |
| `style={{ width: '100vw', height: '100vh' }}` | `className="w-screen h-screen"` |
| Media queries manuais no CSS | Breakpoints do Tailwind (`md:`, `lg:`) |
| `margin: 0 auto` para centralizar verticalmente | `flex justify-center items-center` |
| Hardcoded px em style inline | Colchetes no Tailwind: `md:min-w-[462px]` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre layout patterns, Outlet e breakpoints
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes