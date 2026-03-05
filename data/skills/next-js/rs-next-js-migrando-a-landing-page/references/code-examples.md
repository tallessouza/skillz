# Code Examples: Migrando de Pages Router para App Router

## Exemplo 1: Estrutura de diretórios — antes e depois

### Pages Router (antes)
```
src/
├── pages/
│   ├── _app.tsx          # Layout global + providers
│   ├── _document.tsx     # HTML customizado
│   ├── index.tsx         # Rota /
│   └── blog/
│       └── index.tsx     # Rota /blog
├── components/
│   ├── Layout.tsx
│   └── ActiveLink.tsx
└── styles/
    └── globals.css
```

### App Router (depois)
```
src/
├── app/
│   ├── layout.tsx        # Substitui _app + _document
│   ├── page.tsx          # Rota /
│   └── blog/
│       └── page.tsx      # Rota /blog
├── components/
│   ├── Layout.tsx
│   └── ActiveLink.tsx    # Agora com "use client"
└── styles/
    └── globals.css
```

## Exemplo 2: Criando a primeira rota na App Router

```tsx
// app/page.tsx
export default function Homepage() {
  return (
    <h2>Homepage</h2>
  )
}
```

Requisitos:
- O arquivo **deve** se chamar `page.tsx` (não `index.tsx`)
- A função **deve** ser exportada como `default`

## Exemplo 3: Layout raiz completo

```tsx
// app/layout.tsx (gerado automaticamente pelo Next, customizado depois)
import { Layout } from '../components/Layout'
import '../styles/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
```

Este layout:
- Importa o CSS global (que antes ficava no `_app.tsx`)
- Envolve tudo com `<html>` e `<body>` (que antes ficava no `_document.tsx`)
- Importa o componente Layout existente (reutilização!)

## Exemplo 4: Migrando ActiveLink com usePathname

### Antes (Pages Router)
```tsx
// components/ActiveLink.tsx
import { useRouter } from 'next/router'
import Link from 'next/link'

export function ActiveLink({ href, children, ...rest }) {
  const { asPath } = useRouter()
  const isCurrentPath = asPath === href

  return (
    <Link href={href} className={isCurrentPath ? 'active' : ''} {...rest}>
      {children}
    </Link>
  )
}
```

### Depois (App Router)
```tsx
// components/ActiveLink.tsx
"use client"

import { usePathname } from 'next/navigation'
import Link, { LinkProps } from 'next/link'
import { ReactNode } from 'react'

interface ActiveLinkProps extends LinkProps {
  children: ReactNode
  className?: string
}

export function ActiveLink({ href, children, ...rest }: ActiveLinkProps) {
  const pathName = usePathname()

  // href pode ser string ou objeto URL
  const linkPath = typeof href === 'string'
    ? href
    : (href.pathname ?? '')

  // Match exato OU match por prefixo (para sub-rotas como /blog/post-1)
  const isActive =
    pathName === linkPath ||
    pathName.startsWith(`${linkPath}/`)

  return (
    <Link href={href} className={isActive ? 'active' : ''} {...rest}>
      {children}
    </Link>
  )
}
```

Mudanças chave:
1. Adicionou `"use client"` — obrigatório porque usa hook de navegação
2. Trocou `useRouter` de `next/router` por `usePathname` de `next/navigation`
3. Tratou `href` como string ou URL object
4. Adicionou lógica de `startsWith` para sub-rotas

## Exemplo 5: Evitando conflito de rotas durante migração

```tsx
// ERRADO: pages/index.tsx e app/page.tsx existem ao mesmo tempo
// O Next vai dar erro: "Conflicting app and page file was found"

// CORRETO: renomeie o arquivo na Pages Router
// pages/index.tsx → pages/landing-page.tsx (deixa de ser rota)
// Agora app/page.tsx é a única rota /
```

## Exemplo 6: Importando componentes existentes na App Router

```tsx
// app/page.tsx
// Componentes criados fora de app/ podem ser importados normalmente
// Se não usam hooks/interatividade, continuam como Server Components
import { LandingPage } from '../templates/LandingPage'

export default function Homepage() {
  return <LandingPage />
}
```

Os componentes que já existiam em `templates/` ou `components/` podem ser reutilizados diretamente — essa é uma das vantagens da migração incremental. Só precisam de `"use client"` se usarem interatividade.