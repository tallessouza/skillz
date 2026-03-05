# Code Examples: Parallel Routes no Next.js

## Exemplo completo da aula

### Estrutura de pastas criada

```
app/
├── layout.tsx
├── page.tsx                        # "Select an organization"
├── @teste/
│   ├── default.tsx                 # "Testando Parallel Routes"
│   └── create-organization/
│       └── page.tsx                # "Create Organization" (slot version)
├── org/
│   └── [slug]/
│       ├── page.tsx                # Projetos (com Header)
│       └── create-organization/
│           └── page.tsx            # Form de criar org (com Header)
```

### Layout principal recebendo o slot

```typescript
// app/layout.tsx
export default function AppLayout({
  children,
  teste,
}: {
  children: React.ReactNode
  teste: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {teste}
      </body>
    </html>
  )
}
```

### Default do slot (fallback)

```typescript
// app/@teste/default.tsx
export default function TesteDefault() {
  return <h1>Testando Parallel Routes</h1>
}
```

### Rota específica dentro do slot

```typescript
// app/@teste/create-organization/page.tsx
export default function CreateOrganizationSlot() {
  return <p>Create Organization (parallel slot)</p>
}
```

## Padrão corrigido: Header fora do layout

O instrutor mostrou que colocar o Header no layout causa problema de não recarregar.

### Antes (problemático)

```typescript
// app/org/[slug]/layout.tsx
import { Header } from '@/components/header'

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}
```

Problema: ao trocar de `/org/admin` para `/org/member`, o Header continua mostrando "admin".

### Depois (correto)

```typescript
// app/org/[slug]/layout.tsx
export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

```typescript
// app/org/[slug]/page.tsx
import { Header } from '@/components/header'

export default function OrgPage() {
  return (
    <>
      <Header />
      <div className="space-y-4">
        <p>Projects</p>
      </div>
    </>
  )
}
```

```typescript
// app/org/[slug]/create-organization/page.tsx
import { Header } from '@/components/header'
import { OrganizationForm } from '@/components/organization-form'

export default function CreateOrganizationPage() {
  return (
    <>
      <Header />
      <div className="space-y-4">
        <OrganizationForm />
      </div>
    </>
  )
}
```

## Página home sem organização selecionada

```typescript
// app/page.tsx
export default function HomePage() {
  return (
    <>
      <Header />
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select an organization
        </p>
      </div>
    </>
  )
}
```

## Múltiplos slots (padrão avançado)

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  notifications: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <main className="col-span-2">{children}</main>
      <aside>
        {analytics}
        {notifications}
      </aside>
    </div>
  )
}
```

Estrutura correspondente:

```
app/dashboard/
├── layout.tsx
├── page.tsx
├── @analytics/
│   └── default.tsx
├── @notifications/
│   └── default.tsx
```