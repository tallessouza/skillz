# Code Examples: Criando Botão de Deleção

## Teste inicial (fase Red do TDD)

```typescript
it('should open the delete confirmation dialog', async () => {
  const user = userEvent.setup()
  makeSut({ prompt })

  const deleteButton = screen.getByRole('button', { name: /remover prompt/i })
  await user.click(deleteButton)

  expect(screen.getByText(/remover prompt/i)).toBeInTheDocument()
})
```

Pontos importantes:
- `userEvent.setup()` e necessario antes de simular interacoes
- `getByRole('button', { name: ... })` e mais semantico que `getByTestId`
- O teste e **assincrono** porque `user.click` retorna uma Promise

## Implementacao minima (fase Green)

```tsx
'use client'

import { useState } from 'react'

export function PromptCard({ prompt }: PromptCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* ... link existente ... */}
      <button onClick={() => setIsOpen(true)}>Delete</button>
      {isOpen && <p>Remover prompt</p>}
    </>
  )
}
```

Este codigo e **intencionalmente ruim**. O objetivo e apenas fazer o teste passar.

## Refatoracao com AlertDialog (fase Refactor)

### Instalacao do componente shadcn/ui

```bash
npx shadcn-ui@latest add alert-dialog
```

### Componente refatorado completo

```tsx
'use client'

import { useState } from 'react'
import { Trash, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const DeleteIcon = Trash
const LoadingIcon = Loader2

export function PromptCard({ prompt }: PromptCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    // logica de delecao sera implementada na proxima aula
  }

  return (
    <header>
      {/* ... link existente ... */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="icon"
            size="icon"
            title="Remover prompt"
            aria-label="Remover prompt"
          >
            <DeleteIcon className="w-3 h-3" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover prompt</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este prompt? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && (
                <LoadingIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}
```

## Estrutura do AlertDialog

```
AlertDialog
├── AlertDialogTrigger (asChild)
│   └── Button (icone de lixeira)
└── AlertDialogContent
    ├── AlertDialogHeader
    │   ├── AlertDialogTitle
    │   └── AlertDialogDescription
    └── AlertDialogFooter
        ├── AlertDialogCancel
        └── AlertDialogAction (com loading state)
```

## Icones utilizados

```typescript
import { Trash, Loader2 } from 'lucide-react'

// Trash — icone de lixeira para o botao de delete
// Loader2 — icone de loading com animate-spin para feedback visual
```

## Variacoes do padrao para outros contextos

### Delete de item em lista
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="ghost" size="sm" aria-label={`Remover ${item.name}`}>
      <Trash className="w-4 h-4" />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Remover {item.name}?</AlertDialogTitle>
    <AlertDialogDescription>
      Esta ação não pode ser desfeita.
    </AlertDialogDescription>
    {/* ... footer ... */}
  </AlertDialogContent>
</AlertDialog>
```

### Teste verificando que dialog NAO abre sem clique
```typescript
it('should not show delete dialog initially', () => {
  makeSut({ prompt })
  expect(screen.queryByText(/remover prompt/i)).not.toBeInTheDocument()
})
```