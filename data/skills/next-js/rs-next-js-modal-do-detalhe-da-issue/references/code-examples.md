# Code Examples: Modal com Radix UI e Intercepting Routes

## Instalacao

```bash
npm install @radix-ui/react-dialog
```

## Componente Modal completo

```typescript
// components/modal.tsx
"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { type ComponentProps } from "react"

interface ModalProps extends ComponentProps<typeof Dialog.Content> {}

export function Modal({ children, className, ...props }: ModalProps) {
  const router = useRouter()

  function handleOpenChange(open: boolean) {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog.Root defaultOpen onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content
          className={twMerge(
            "fixed right-0 top-0 z-60 h-full w-full max-w-[540px] overflow-y-auto bg-nav-950 border-l border-nav-800",
            className,
          )}
          {...props}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

## Back Button

```typescript
// components/back-button.tsx
"use client"

import { useRouter } from "next/navigation"
import { MoveLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="cursor-pointer"
    >
      <MoveLeft />
    </button>
  )
}
```

## Pagina do modal (intercepting route)

```typescript
// app/@modal/(.)issues/[id]/page.tsx
import { Modal } from "@/components/modal"
import { BackButton } from "@/components/back-button"
import * as Dialog from "@radix-ui/react-dialog"
import { IssueDetails } from "./issue-details"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function IssueModalPage({ params }: PageProps) {
  const { id } = await params

  return (
    <Modal>
      <div className="flex flex-col gap-4 p-6">
        <BackButton />
        <Dialog.Title className="sr-only">Issue Details</Dialog.Title>
        <IssueDetails issueId={id} />
      </div>
    </Modal>
  )
}
```

## Server Component de detalhes

```typescript
// app/@modal/(.)issues/[id]/issue-details.tsx
import { http } from "@/lib/http"
import { headers } from "next/headers"

interface IssueDetailsProps {
  issueId: string
}

const statusLabels = {
  open: "Open",
  closed: "Closed",
  in_progress: "In Progress",
}

export async function IssueDetails({ issueId }: IssueDetailsProps) {
  const issue = await http(`/issues/${issueId}`, {
    headers: await headers(),
  })

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm text-nav-400">
          {statusLabels[issue.status]}
        </span>
      </div>
      <h2 className="text-xl font-bold">{issue.title}</h2>
      <p className="text-nav-300">{issue.description}</p>
      {/* Componentes adicionais: comentarios, acoes, etc. */}
    </>
  )
}
```

## Layout com parallel route slot

```typescript
// app/layout.tsx (ou app/(app)/layout.tsx)
export default function Layout({
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

## Estrutura de pastas

```
app/
├── (app)/
│   ├── layout.tsx           # Layout com slot @modal
│   ├── board/
│   │   └── page.tsx         # Pagina do board
│   ├── issues/
│   │   └── [id]/
│   │       └── page.tsx     # Pagina completa da issue (F5)
│   └── @modal/
│       ├── default.tsx      # Retorna null (quando nao ha modal)
│       └── (.)issues/
│           └── [id]/
│               ├── page.tsx          # Modal da issue
│               └── issue-details.tsx # Server component com dados
```

## default.tsx do slot modal

```typescript
// app/@modal/default.tsx
export default function Default() {
  return null
}
```

Esse arquivo e necessario para que o slot `@modal` nao renderize nada quando nenhuma rota e interceptada.

## Variacao: Modal com animacao

```typescript
// Se quiser adicionar animacao de entrada/saida
<Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut" />
<Dialog.Content
  className={twMerge(
    "fixed right-0 top-0 z-60 h-full w-full max-w-[540px] overflow-y-auto bg-nav-950 border-l border-nav-800 data-[state=open]:animate-slideInRight data-[state=closed]:animate-slideOutRight",
    className,
  )}
  {...props}
>
```

## Variacao: Modal centralizado (nao drawer)

```typescript
// Para um modal centralizado ao inves de drawer lateral
<Dialog.Content
  className={twMerge(
    "fixed left-1/2 top-1/2 z-60 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg bg-nav-950 p-6",
    className,
  )}
  {...props}
>
```