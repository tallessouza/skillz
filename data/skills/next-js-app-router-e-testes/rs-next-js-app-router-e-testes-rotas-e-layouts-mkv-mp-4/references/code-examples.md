# Code Examples: Rotas e Layouts no Next.js App Router

## Exemplo 1: Pagina inicial (root)

```tsx
// app/page.tsx
export default function Home() {
  return <h1>Hello World</h1>
}
```

Acessivel em: `localhost:3000/`

## Exemplo 2: Rota simples — Catalog

Estrutura:
```
app/
└── catalog/
    └── page.tsx
```

```tsx
// app/catalog/page.tsx
export default function Catalog() {
  return <h1>Catálogo</h1>
}
```

Acessivel em: `localhost:3000/catalog`

## Exemplo 3: Rota aninhada — Product dentro de Catalog

Estrutura:
```
app/
└── catalog/
    ├── page.tsx
    └── product/
        └── page.tsx
```

```tsx
// app/catalog/product/page.tsx
export default function Product() {
  return <h1>Product</h1>
}
```

Acessivel em: `localhost:3000/catalog/product`

## Exemplo 4: Root Layout com cabecalho

```tsx
// app/layout.tsx
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header>Cabeçalho</header>
        {children}
      </body>
    </html>
  )
}
```

O `<header>Cabeçalho</header>` aparece em **todas** as paginas da aplicacao.

## Exemplo 5: Layout especifico para Admin

Estrutura:
```
app/
├── layout.tsx              ← root layout
└── admin/
    ├── layout.tsx          ← layout do admin
    ├── page.tsx            ← /admin
    └── login/
        └── page.tsx        ← /admin/login
```

```tsx
// app/admin/layout.tsx
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <p>Painel de administração</p>
    </div>
  )
}
```

```tsx
// app/admin/page.tsx
export default function Admin() {
  return <h1>Admin</h1>
}
```

```tsx
// app/admin/login/page.tsx
export default function AdminLogin() {
  return <h1>Login</h1>
}
```

Resultado:
- `/admin` → mostra "Admin" + "Painel de administração" + "Cabeçalho"
- `/admin/login` → mostra "Login" + "Painel de administração" + "Cabeçalho"
- `/catalog` → mostra "Catálogo" + "Cabeçalho" (SEM "Painel de administração")

## Exemplo 6: Estrutura completa da aula

```
app/
├── layout.tsx              ← root layout (html, body, header)
├── page.tsx                ← / (Home - Hello World)
├── catalog/
│   ├── page.tsx            ← /catalog (Catálogo)
│   └── product/
│       └── page.tsx        ← /catalog/product (Product)
└── admin/
    ├── layout.tsx          ← layout exclusivo do admin
    ├── page.tsx            ← /admin (Admin)
    └── login/
        └── page.tsx        ← /admin/login (Login)
```

## Hierarquia de renderizacao

Quando o usuario acessa `/admin/login`:

```
RootLayout (app/layout.tsx)
├── <html>
│   └── <body>
│       ├── <header>Cabeçalho</header>
│       └── AdminLayout (app/admin/layout.tsx)
│           ├── AdminLoginPage (app/admin/login/page.tsx)
│           │   └── <h1>Login</h1>
│           └── <p>Painel de administração</p>
```

Quando o usuario acessa `/catalog`:

```
RootLayout (app/layout.tsx)
├── <html>
│   └── <body>
│       ├── <header>Cabeçalho</header>
│       └── CatalogPage (app/catalog/page.tsx)
│           └── <h1>Catálogo</h1>
```