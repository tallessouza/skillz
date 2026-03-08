# Code Examples: Criar o Header com Tailwind CSS

## Exemplo 1: Header básico completo (da aula)

```tsx
// components/header.tsx
import logoSVG from "../assets/logo.svg"
import logoutIcon from "../assets/logout.svg"

export function Header() {
  return (
    <header className="w-full flex justify-between">
      <img src={logoSVG} alt="Logo" className="my-8" />

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-200">
          Olá, Rodrigo
        </span>
        <img
          src={logoutIcon}
          alt="Ícone de sair"
          className="my-8 cursor-pointer hover:opacity-75 transition ease-linear"
        />
      </div>
    </header>
  )
}
```

## Exemplo 2: Integração no App Layout

```tsx
// layouts/app-layout.tsx
import { Outlet } from "react-router-dom"
import { Header } from "../components/header"

export function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
```

## Exemplo 3: Variação com nome dinâmico

```tsx
interface HeaderProps {
  userName: string
}

export function Header({ userName }: HeaderProps) {
  return (
    <header className="w-full flex justify-between">
      <img src={logoSVG} alt="Logo" className="my-8" />

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-200">
          Olá, {userName}
        </span>
        <img
          src={logoutIcon}
          alt="Ícone de sair"
          className="my-8 cursor-pointer hover:opacity-75 transition ease-linear"
        />
      </div>
    </header>
  )
}
```

## Exemplo 4: Variação com botão de logout acessível

```tsx
export function Header({ userName }: HeaderProps) {
  return (
    <header className="w-full flex justify-between">
      <img src={logoSVG} alt="Logo" className="my-8" />

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-200">
          Olá, {userName}
        </span>
        <button
          type="button"
          className="my-8 cursor-pointer hover:opacity-75 transition ease-linear"
          aria-label="Sair da aplicação"
        >
          <img src={logoutIcon} alt="" />
        </button>
      </div>
    </header>
  )
}
```

## Exemplo 5: Classes Tailwind usadas — referência rápida

| Classe | O que faz | Valor CSS |
|--------|-----------|-----------|
| `w-full` | Largura 100% | `width: 100%` |
| `flex` | Display flexbox | `display: flex` |
| `justify-between` | Espaço entre filhos | `justify-content: space-between` |
| `items-center` | Centraliza verticalmente | `align-items: center` |
| `gap-3` | Espaçamento entre filhos | `gap: 0.75rem` |
| `my-8` | Margem vertical | `margin-top: 2rem; margin-bottom: 2rem` |
| `text-sm` | Fonte pequena | `font-size: 0.875rem` |
| `font-semibold` | Peso semi-negrito | `font-weight: 600` |
| `text-gray-200` | Cor cinza claro | `color: rgb(229 231 235)` |
| `cursor-pointer` | Cursor de mão | `cursor: pointer` |
| `hover:opacity-75` | Opacidade no hover | `opacity: 0.75` on hover |
| `transition` | Ativa transição CSS | `transition-property: all` |
| `ease-linear` | Curva linear | `transition-timing-function: linear` |

## Exemplo 6: Padrão de header com padding container

```tsx
// Variação com container centralizado
export function Header() {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 flex justify-between">
      <img src={logoSVG} alt="Logo" className="my-8" />

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-200">
          Olá, Rodrigo
        </span>
        <img
          src={logoutIcon}
          alt="Ícone de sair"
          className="my-8 cursor-pointer hover:opacity-75 transition ease-linear"
        />
      </div>
    </header>
  )
}
```