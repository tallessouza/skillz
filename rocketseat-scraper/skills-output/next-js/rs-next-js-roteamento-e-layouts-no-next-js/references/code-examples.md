# Code Examples: Roteamento e Layouts no Next.js App Router

## Exemplo 1: Estrutura basica de roteamento

```
app/
├── page.tsx          # URL: /
├── contato/
│   └── page.tsx      # URL: /contato
└── contato/
    └── faq/
        └── page.tsx  # URL: /contato/faq
```

A rota e determinada pela hierarquia de pastas. Cada `page.tsx` exporta um componente React que se torna a pagina daquela rota.

## Exemplo 2: Layout root com providers

```tsx
// app/layout.tsx
import { AuthProvider } from '@/components/auth-provider'
import { QueryProvider } from '@/components/query-provider'

export const metadata = {
  title: 'Minha App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

O layout root e o unico que tem `<html>` e `<body>`. Providers globais ficam aqui.

## Exemplo 3: Route groups com layouts distintos

```
app/
├── layout.tsx                    # Root layout (providers)
├── (auth)/
│   ├── layout.tsx                # Layout minimalista
│   ├── sign-in/
│   │   └── page.tsx              # URL: /sign-in
│   └── sign-up/
│       └── page.tsx              # URL: /sign-up
└── (dashboard)/
    ├── layout.tsx                # Layout com sidebar
    ├── page.tsx                  # URL: /
    └── users/
        └── page.tsx              # URL: /users
```

### Layout de autenticacao (minimalista):

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
```

### Layout do dashboard (com sidebar e header):

```tsx
// app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
```

## Exemplo 4: Demonstracao do Diego — Board com route group

O Diego moveu a pagina do board para um route group:

```tsx
// app/(board)/layout.tsx
export default function BoardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <header>Header do Board</header>
      <main>{children}</main>
    </div>
  )
}
```

```tsx
// app/(board)/page.tsx — URL continua sendo /
export default function BoardPage() {
  return <div>Conteudo do board</div>
}
```

```tsx
// app/(board)/test/page.tsx — URL: /test (sem "board" na URL)
export default function TestPage() {
  return <h1>Teste</h1>
}
```

Ambas as paginas compartilham o header definido no layout, mas a URL nao contem "board".

## Exemplo 5: Encadeamento visual de layouts

```
Resultado renderizado para /users:

┌─────────────────────────────┐
│ RootLayout (providers)      │
│ ┌─────────────────────────┐ │
│ │ DashboardLayout         │ │
│ │ ┌───────┬─────────────┐ │ │
│ │ │Sidebar│ Header      │ │ │
│ │ │       │─────────────│ │ │
│ │ │       │ UsersPage   │ │ │
│ │ │       │ (children)  │ │ │
│ │ └───────┴─────────────┘ │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

Cada layout adiciona sua camada. O Next compoe automaticamente.