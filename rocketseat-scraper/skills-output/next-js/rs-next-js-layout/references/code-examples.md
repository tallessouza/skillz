# Code Examples: Layout no Next.js Pages Router

## Exemplo completo do instrutor

### 1. Componente Layout

```typescript
// components/Layout/Layout.tsx
import { Header } from '../Header'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col dark">
      <Header />
      <main className="flex flex-1 flex-col mb-12">
        {children}
      </main>
      {/* Footer será criado na próxima aula */}
    </div>
  )
}
```

### 2. Barrel export

```typescript
// components/Layout/index.ts
export { Layout } from './Layout'
```

### 3. Aplicação no _app.tsx

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

### 4. Página limpa (após Layout)

```typescript
// pages/index.tsx — não precisa mais importar Header
export default function Home() {
  return (
    <div>
      {/* Apenas o conteúdo específico da home */}
    </div>
  )
}
```

## Classes Tailwind usadas

| Classe | Propósito |
|--------|-----------|
| `relative` | Referência para posicionamento fixo do header |
| `flex` | Flexbox no container |
| `min-h-screen` | Altura mínima = viewport inteira |
| `flex-col` | Direção vertical (header → main → footer) |
| `dark` | Ativa modo escuro do Tailwind |
| `flex-1` | Main ocupa todo espaço disponível |
| `mb-12` | Margin-bottom de 48px no main |

## Variação: Per-page Layout (caso avançado)

Se alguma página precisar de layout diferente:

```typescript
// pages/admin.tsx
import { AdminLayout } from '../components/AdminLayout'
import type { NextPageWithLayout } from '../types'

const AdminPage: NextPageWithLayout = () => {
  return <div>Admin content</div>
}

AdminPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>

export default AdminPage
```

```typescript
// pages/_app.tsx
import type { AppPropsWithLayout } from '../types'

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)
  return getLayout(<Component {...pageProps} />)
}
```