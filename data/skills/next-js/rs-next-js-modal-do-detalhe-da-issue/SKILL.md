---
name: rs-next-js-modal-do-detalhe-da-issue
description: "Applies Next.js modal pattern using Radix UI Dialog with intercepting routes when building detail views, sheets, or drawers. Use when user asks to 'create a modal', 'build a detail view', 'add a sheet component', 'implement intercepting routes', or 'parallel routes modal'. Enforces: Radix Dialog for accessibility, router.back for close, sr-only title, server components for data loading inside modals. Make sure to use this skill whenever building overlay UI that uses Next.js routing. Not for static modals without routing, or alert/confirm dialogs."
---

# Modal com Radix UI e Intercepting Routes no Next.js

> Modais de detalhe usam Radix UI Dialog para acessibilidade e Next.js intercepting routes para gerenciar abertura/fechamento via roteamento.

## Rules

1. **Use Radix UI Dialog como base** — `@radix-ui/react-dialog` fornece acessibilidade automatica (focus trap, aria, esc), porque reimplementar isso manualmente gera bugs de acessibilidade
2. **Modal abre com `defaultOpen`** — quando o modal e controlado por rota (intercepting route), ele ja deve estar aberto ao renderizar, porque o usuario nao clica para abrir, a navegacao ja o exibe
3. **Feche com `router.back()`** — no `onOpenChange`, se `open === false`, chame `router.back()` para remover a rota interceptada, porque isso mantem o historico de navegacao consistente
4. **Sempre inclua `Dialog.Title` com `sr-only`** — Radix exige um titulo para acessibilidade, use `className="sr-only"` para esconder visualmente sem quebrar screen readers
5. **Separe dados em Server Components** — o modal wrapper e `use client`, mas o conteudo com fetch de dados deve ser um Server Component separado, porque permite async/await e carregamento no servidor
6. **Use `twMerge` para className extensivel** — permita que consumers do modal passem classes customizadas sem conflito com as classes base

## How to write

### Estrutura do Modal (Client Component)

```typescript
"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { ComponentProps } from "react"

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

### Botao de Voltar (Client Component)

```typescript
"use client"

import { useRouter } from "next/navigation"
import { MoveLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.back()} className="cursor-pointer">
      <MoveLeft />
    </button>
  )
}
```

### Pagina do Modal (com Server Component para dados)

```typescript
// app/@modal/(.)issues/[id]/page.tsx
import { Modal } from "@/components/modal"
import { BackButton } from "@/components/back-button"
import * as Dialog from "@radix-ui/react-dialog"
import { IssueDetails } from "./issue-details"

interface Props {
  params: Promise<{ id: string }>
}

export default async function IssueModal({ params }: Props) {
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

### Conteudo com dados (Server Component)

```typescript
// app/@modal/(.)issues/[id]/issue-details.tsx
interface IssueDetailsProps {
  issueId: string
}

export async function IssueDetails({ issueId }: IssueDetailsProps) {
  const issue = await fetchIssue(issueId)

  return (
    <>
      <h2>{issue.title}</h2>
      <p>{issue.description}</p>
      {/* Componentes de detalhe */}
    </>
  )
}
```

## Example

**Before (modal sem acessibilidade, sem roteamento):**
```typescript
"use client"
import { useState } from "react"

export function IssueModal({ issue, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50" onClick={onClose}>
      <div className="fixed right-0 top-0 h-full w-96 bg-white">
        <button onClick={onClose}>X</button>
        <h2>{issue.title}</h2>
      </div>
    </div>
  )
}
```

**After (com Radix, roteamento, acessibilidade):**
```typescript
// Modal wrapper reutilizavel (client)
"use client"
import * as Dialog from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"

export function Modal({ children, className, ...props }) {
  const router = useRouter()

  return (
    <Dialog.Root defaultOpen onOpenChange={(open) => !open && router.back()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed right-0 top-0 z-60 h-full w-full max-w-[540px] bg-nav-950" {...props}>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// Pagina usando intercepting route (server)
export default async function IssueModal({ params }) {
  const { id } = await params
  return (
    <Modal>
      <BackButton />
      <Dialog.Title className="sr-only">Issue Details</Dialog.Title>
      <IssueDetails issueId={id} />
    </Modal>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Modal controlado por rota | `defaultOpen` + `router.back()` no close |
| Modal controlado por estado | `open` + `onOpenChange` com useState |
| Conteudo precisa de fetch | Server Component separado dentro do modal |
| Radix reclama de titulo | `Dialog.Title` com `sr-only` |
| Classes CSS conflitam | `twMerge` para combinar classes base com props |
| Overlay precisa fechar modal | Radix ja faz isso automaticamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<div onClick={onClose}>` como overlay | `<Dialog.Overlay>` do Radix |
| `window.history.back()` | `router.back()` do Next.js |
| Modal sem titulo acessivel | `<Dialog.Title className="sr-only">` |
| Fetch de dados no client component do modal | Server Component separado para dados |
| `useState` para abrir modal de rota | `defaultOpen` com intercepting route |
| `position: absolute` no modal | `fixed` com `inset-0` ou `right-0 top-0` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
