# Code Examples: Estrutura do Layout

## Exemplo completo do layout.tsx

```tsx
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen grid grid-cols-app">
          <aside className="border-r border-zinc-200 px-5 py-8">
            Sidebar
          </aside>
          <main className="px-4 pb-12 pt-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
```

## Configuracao do tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // ...
  theme: {
    extend: {
      gridTemplateColumns: {
        app: 'minmax(18rem, 20rem) 1fr',
      },
    },
  },
}
```

## Evolucao passo a passo

### Passo 1: Container com min-h-screen

```tsx
<div className="min-h-screen">
  {children}
</div>
```

Resultado: a div ocupa pelo menos 100vh de altura.

### Passo 2: Grid com duas colunas iguais

```tsx
<div className="min-h-screen grid grid-cols-2">
  <aside>Sidebar</aside>
  <main>{children}</main>
</div>
```

Resultado: sidebar e conteudo lado a lado, 50%/50%. Nao ideal — sidebar nao precisa de metade da tela.

### Passo 3: Valor arbitrario (funciona, mas nao ideal)

```tsx
<div className="min-h-screen grid grid-cols-[250px_1fr]">
  <aside>Sidebar</aside>
  <main>{children}</main>
</div>
```

Resultado: sidebar fixa em 250px, conteudo ocupa o resto. Funciona, mas dificil de ler.

### Passo 4: Config estendido com minmax (solucao final)

```tsx
// tailwind.config.js
gridTemplateColumns: {
  app: 'minmax(18rem, 20rem) 1fr',
}

// layout.tsx
<div className="min-h-screen grid grid-cols-app">
  <aside className="border-r border-zinc-200 px-5 py-8">
    Sidebar
  </aside>
  <main className="px-4 pb-12 pt-8">
    {children}
  </main>
</div>
```

Resultado: sidebar flexivel entre 288px-320px, conteudo ocupa o resto, codigo limpo e legivel.

## Demonstracao de centralizacao com min-h-screen

```tsx
// Sem min-h-screen: NAO centraliza (div so ocupa altura do conteudo)
<div className="flex items-center">
  <p>Nao vai para o centro da tela</p>
</div>

// Com min-h-screen: centraliza corretamente
<div className="min-h-screen flex items-center">
  <p>Agora sim, centro da tela</p>
</div>
```

## Valores de spacing usados na aula

| Classe | CSS gerado | Onde usado |
|--------|-----------|------------|
| `px-4` | `padding-left: 1rem; padding-right: 1rem` | Main (laterais) |
| `px-5` | `padding-left: 1.25rem; padding-right: 1.25rem` | Sidebar (laterais) |
| `pb-12` | `padding-bottom: 3rem` | Main (inferior) |
| `pt-8` | `padding-top: 2rem` | Main (superior) |
| `py-8` | `padding-top: 2rem; padding-bottom: 2rem` | Sidebar (vertical) |

## Nota sobre underline em valores arbitrarios

```tsx
// ERRADO: Tailwind interpreta como duas classes separadas
grid-cols-[250px 1fr]

// CORRETO: underline substitui espaco
grid-cols-[250px_1fr]
```