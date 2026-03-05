# Code Examples: Interception Routes no Next.js

## Exemplo 1: Estrutura completa do projeto da aula

### Layout com Parallel Route

```typescript
// app/layout.tsx (ou app/(app)/layout.tsx)
export default function Layout({
  children,
  sheet, // nome do parallel route slot
}: {
  children: React.ReactNode
  sheet: React.ReactNode
}) {
  return (
    <>
      {children}
      {sheet}
    </>
  )
}
```

### Default do slot (retorna null)

```typescript
// app/@sheet/default.tsx
export default function SheetDefault() {
  return null
}
```

### Pagina interceptada com Sheet

```typescript
// app/@sheet/(.)create-organization/page.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { OrganizationForm } from '../../create-organization/organization-form'

export default function CreateOrganizationSheet() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Organization</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <OrganizationForm />
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

### Pagina original (acesso direto)

```typescript
// app/create-organization/page.tsx
import { OrganizationForm } from './organization-form'

export default function CreateOrganizationPage() {
  return (
    <div>
      <h1>Create Organization</h1>
      <OrganizationForm />
    </div>
  )
}
```

## Exemplo 2: Feed de fotos (da documentacao do Next.js)

### Estrutura de diretorios

```
app/
├── feed/
│   ├── page.tsx                    # Feed com lista de fotos
│   └── @modal/
│       ├── default.tsx             # null
│       └── (..)photo/[id]/
│           └── page.tsx            # Modal com foto
├── photo/[id]/
│   └── page.tsx                    # Pagina completa da foto
└── layout.tsx
```

### Feed page

```typescript
// app/feed/page.tsx
import Link from 'next/link'

const photos = [
  { id: '1', src: '/photo1.jpg', alt: 'Photo 1' },
  { id: '2', src: '/photo2.jpg', alt: 'Photo 2' },
]

export default function FeedPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map((photo) => (
        <Link key={photo.id} href={`/photo/${photo.id}`}>
          <img src={photo.src} alt={photo.alt} />
        </Link>
      ))}
    </div>
  )
}
```

### Feed layout com modal slot

```typescript
// app/feed/layout.tsx
export default function FeedLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
```

### Foto interceptada (modal)

```typescript
// app/feed/@modal/(..)photo/[id]/page.tsx
// Note: (..) porque photo/ esta um nivel acima de feed/
import { Modal } from '@/components/modal'

export default function PhotoModal({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <img src={`/photos/${params.id}.jpg`} alt="" className="w-full" />
    </Modal>
  )
}
```

### Foto original (acesso direto)

```typescript
// app/photo/[id]/page.tsx
export default function PhotoPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto">
      <img src={`/photos/${params.id}.jpg`} alt="" className="w-full" />
      <div className="mt-4">
        <h1>Photo {params.id}</h1>
        <p>Full photo page with comments, likes, etc.</p>
      </div>
    </div>
  )
}
```

## Exemplo 3: Instalando o Sheet do shadcn/ui

```bash
# Instalar o componente Sheet do shadcn/ui
npx shadcn-ui@latest add sheet
```

## Exemplo 4: Comportamento de navegacao

```
# Navegacao interna (Interception Route ativa)
Pagina inicial → clica "Criar Organizacao" → Sheet abre (URL muda para /create-organization)

# Acesso direto (pagina original)
Digita /create-organization no browser → Pagina completa carrega
F5 em /create-organization → Pagina completa carrega

# Compartilhamento de link
Copia URL /create-organization → Envia para outra pessoa → Pessoa ve pagina completa
```