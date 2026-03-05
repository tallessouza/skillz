# Code Examples: Criando a Home Page

## Exemplo completo: page.tsx (Home)

```tsx
// src/app/page.tsx
export default function Home() {
  return (
    <section className="flex min-h-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Selecione um prompt
          </h1>
          <p className="text-gray-400">
            Escolha um prompt da lista ao lado para visualizar e editar.
          </p>
        </div>
      </div>
    </section>
  )
}
```

## Exemplo completo: layout.tsx (estrutura sidebar-ready)

```tsx
// src/app/layout.tsx — dentro do body
<body>
  <section className="flex h-screen">
    {/* Sidebar sera adicionada aqui */}
    <main className="relative flex-1 overflow-auto">
      <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
        {children}
      </div>
    </main>
  </section>
</body>
```

## Variacao: Home com icone

```tsx
import { MessageSquare } from 'lucide-react'

export default function Home() {
  return (
    <section className="flex min-h-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">
            Selecione um prompt
          </h1>
          <p className="text-gray-400">
            Escolha um prompt da lista ao lado para visualizar e editar.
          </p>
        </div>
      </div>
    </section>
  )
}
```

## Variacao: Layout com sidebar placeholder

```tsx
// Quando a sidebar for adicionada, o layout fica assim:
<section className="flex h-screen">
  <aside className="w-64 border-r border-gray-800 overflow-auto">
    {/* Sidebar content */}
  </aside>
  <main className="relative flex-1 overflow-auto">
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
      {children}
    </div>
  </main>
</section>
```

## Classes Tailwind utilizadas — referencia rapida

| Classe | Valor CSS | Proposito |
|--------|-----------|-----------|
| `flex` | `display: flex` | Layout flexbox |
| `h-screen` | `height: 100vh` | Altura total da viewport |
| `flex-1` | `flex: 1 1 0%` | Ocupa espaco restante |
| `items-center` | `align-items: center` | Centraliza verticalmente |
| `justify-center` | `justify-content: center` | Centraliza horizontalmente |
| `min-h-full` | `min-height: 100%` | Altura minima 100% do pai |
| `overflow-auto` | `overflow: auto` | Scroll quando necessario |
| `relative` | `position: relative` | Contexto de posicionamento |
| `text-2xl` | `font-size: 1.5rem` | Tamanho do titulo |
| `font-bold` | `font-weight: 700` | Peso do titulo |
| `mb-4` | `margin-bottom: 1rem` | Espaco abaixo do titulo |
| `text-gray-400` | `color: #9ca3af` | Texto secundario |
| `text-center` | `text-align: center` | Centraliza texto |
| `p-4` | `padding: 1rem` | Padding base (mobile) |
| `sm:p-6` | `padding: 1.5rem` | Padding em telas sm+ |
| `md:p-8` | `padding: 2rem` | Padding em telas md+ |
| `max-w-3xl` | `max-width: 48rem` | Largura maxima do conteudo |
| `mx-auto` | `margin: 0 auto` | Centraliza horizontalmente |