# Code Examples: Arquivos Especiais e Client Components

## 1. Root Layout (obrigatorio)

O layout que o instrutor mostrou na raiz da pasta app:

```typescript
// app/layout.tsx
import { Layout } from '@/components/layout'
import './globals.css'

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

O componente `Layout` importado ja continha header, main, call-to-action e footer — elementos comuns a todas as paginas.

## 2. Nested Layout — Dashboard

O instrutor criou essa estrutura para demonstrar layouts aninhados:

```
app/
├── layout.tsx          ← root layout (com <html> e <body>)
├── page.tsx            ← landing page
└── dashboard/
    ├── layout.tsx      ← nested layout (SEM <html> e <body>)
    └── page.tsx        ← rota /dashboard
```

### Nested layout — versao com ERRO

```typescript
// app/dashboard/layout.tsx — ERRADO: duplica <html>
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
// Erro: <html> nao pode ser aninhado dentro de outro <html>
```

### Nested layout — versao CORRETA

```typescript
// app/dashboard/layout.tsx — CORRETO: usa <div>
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen min-w-full bg-gray-300 mt-20">
      {children}
    </div>
  )
}
```

### Page do dashboard

```typescript
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="bg-gray-400">
      <h2>Dashboard</h2>
    </div>
  )
}
```

O instrutor mostrou que o cinza-400 da page aparecia dentro do cinza-300 do layout, comprovando visualmente o aninhamento.

## 3. Client Component — Erro ao adicionar onClick em server component

### O problema

```typescript
// components/header.tsx — server component por default
export function Header() {
  return (
    <header>
      <nav>...</nav>
      {/* ERRO: onClick em server component */}
      <button onClick={() => console.log('click')}>Menu</button>
    </header>
  )
}
```

Resultado: erro do Next.js informando que event handlers nao funcionam em server components.

### Solucao ERRADA (funciona mas e anti-pattern)

```typescript
// components/header.tsx — header INTEIRO vira client
"use client"

export function Header() {
  return (
    <header>
      <nav>...</nav>
      <button onClick={() => console.log('click')}>Menu</button>
    </header>
  )
}
```

Problema: todo o HTML estatico do header agora faz parte do client bundle.

### Solucao CORRETA (Composition Pattern)

```typescript
// components/header.tsx — continua server component
import { MenuButton } from './menu-button'

export function Header() {
  return (
    <header>
      <nav>...</nav>
      <MenuButton />
    </header>
  )
}
```

```typescript
// components/menu-button.tsx — apenas o botao e client
"use client"

export function MenuButton() {
  return <button onClick={() => console.log('click')}>Menu</button>
}
```

## 4. Regra de importacao — direcionalidade

```typescript
// ✅ Server component importando client component
// components/header.tsx (server)
import { MenuButton } from './menu-button' // client component
// Funciona perfeitamente

// ❌ Client component importando server component
// components/menu-button.tsx (client)
"use client"
import { ServerOnlyWidget } from './server-widget' // server component
// NAO FUNCIONA — server components nao podem ser executados no browser
```

### Alternativa para passar server content para client: children

```typescript
// ✅ Passando server content como children
// page.tsx (server)
import { ClientWrapper } from './client-wrapper'
import { ServerContent } from './server-content'

export default function Page() {
  return (
    <ClientWrapper>
      <ServerContent />  {/* renderizado no server, passado como children */}
    </ClientWrapper>
  )
}
```

```typescript
// client-wrapper.tsx
"use client"
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return <div>{open && children}</div>
}
```

## 5. Special Files — Referencia rapida com exemplos

### loading.tsx

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Carregando dashboard...</div>
}
```

Automaticamente envolve a page com React Suspense.

### error.tsx

```typescript
// app/dashboard/error.tsx
"use client" // error.tsx DEVE ser client component

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Algo deu errado!</h2>
      <button onClick={() => reset()}>Tentar novamente</button>
    </div>
  )
}
```

### not-found.tsx

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>Pagina nao encontrada</p>
    </div>
  )
}
```