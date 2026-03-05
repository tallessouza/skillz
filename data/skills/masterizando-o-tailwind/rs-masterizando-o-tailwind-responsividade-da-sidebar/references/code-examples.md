# Code Examples: Responsividade de Sidebar com Tailwind

## Exemplo completo da aula

### Sidebar antes (somente desktop)

```tsx
// src/components/Sidebar/index.tsx
export function Sidebar() {
  return (
    <aside className="flex flex-col gap-6 border-r px-5 py-8">
      {/* Logo */}
      {/* Navigation */}
      {/* User info */}
    </aside>
  )
}
```

### Sidebar depois (responsiva)

```tsx
// src/components/Sidebar/index.tsx
export function Sidebar() {
  return (
    <aside className="
      fixed bottom-0 left-0 right-0 top-0 z-20
      flex flex-col gap-6 border-b bg-white p-4
      lg:relative lg:right-auto lg:w-80
      lg:border-b-0 lg:border-r
      lg:px-5 lg:py-8
    ">
      {/* Logo */}
      {/* Navigation */}
      {/* User info */}
    </aside>
  )
}
```

## Propriedades aplicadas passo a passo

### Passo 1: Overlay fixo no mobile
```tsx
<aside className="fixed left-0 top-0 right-0 z-20">
```
Resultado: sidebar fixa por cima do conteudo, mas sem background (conteudo visivel atras).

### Passo 2: Background e altura total
```tsx
<aside className="fixed bottom-0 left-0 top-0 right-0 z-20 bg-white">
```
Resultado: sidebar cobre toda a tela com fundo branco.

### Passo 3: Restaurar desktop com lg:
```tsx
<aside className="
  fixed bottom-0 left-0 right-0 top-0 z-20 bg-white
  lg:relative lg:right-auto lg:w-80
">
```
Resultado: no desktop, sidebar volta a ser relativa com largura fixa de 320px.

### Passo 4: Bordas e padding por breakpoint
```tsx
<aside className="
  fixed bottom-0 left-0 right-0 top-0 z-20
  border-b bg-white p-4
  lg:relative lg:right-auto lg:w-80
  lg:border-b-0 lg:border-r lg:px-5 lg:py-8
">
```
Resultado: borda embaixo no mobile, borda direita no desktop. Padding menor no mobile.

## Breakpoints do Tailwind (referencia)

```
sm:  640px   → @media (min-width: 640px)
md:  768px   → @media (min-width: 768px)
lg:  1024px  → @media (min-width: 1024px)
xl:  1280px  → @media (min-width: 1280px)
2xl: 1536px  → @media (min-width: 1536px)
```

Todos usam `min-width`, confirmando mobile-first. Nao existe `max-width` nativo — para "somente mobile" voce define base e sobrescreve no breakpoint desejado.

## Pattern: sobrescrever propriedade no desktop

```tsx
{/* Mobile: hidden, Desktop: visible */}
<div className="hidden lg:block">Desktop only</div>

{/* Mobile: full width, Desktop: fixed width */}
<div className="w-full lg:w-96">Content</div>

{/* Mobile: column, Desktop: row */}
<div className="flex flex-col lg:flex-row">Content</div>

{/* Mobile: no gap, Desktop: gap */}
<div className="gap-0 lg:gap-6">Content</div>
```

## Pattern: sidebar com toggle (proximo passo)

```tsx
// Estrutura que o instrutor indica como proximo passo
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside className={clsx(
      'fixed bottom-0 left-0 right-0 top-0 z-20',
      'flex flex-col gap-6 border-b bg-white p-4',
      'lg:relative lg:right-auto lg:w-80',
      'lg:border-b-0 lg:border-r lg:px-5 lg:py-8',
      // Toggle visibility no mobile
      isOpen ? 'visible' : 'invisible lg:visible',
    )}>
      {/* content */}
    </aside>
  )
}
```