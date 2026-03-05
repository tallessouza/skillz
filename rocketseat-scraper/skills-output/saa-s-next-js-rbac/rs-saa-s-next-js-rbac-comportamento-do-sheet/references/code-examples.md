# Code Examples: Comportamento do Sheet

## 1. Exportando sheetVariants do componente base

No arquivo `ui/sheet.tsx`, adicione o export do `sheetVariants`:

```typescript
// components/ui/sheet.tsx
// ... codigo existente do shadcn/ui ...

// Adicionar export para reutilizar no InterceptedSheetContent
export { sheetVariants }
```

## 2. Componente InterceptedSheetContent completo

```typescript
// components/intercepted-sheet-content.tsx
'use client'

import { useRouter } from 'next/navigation'
import { ComponentProps } from 'react'
import { X } from 'lucide-react'

import * as SheetPrimitive from '@radix-ui/react-dialog'
import { SheetPortal, SheetOverlay, sheetVariants } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// Se sua versao do shadcn usa forwardRef:
const InterceptedSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> &
    VariantProps<typeof sheetVariants>
>(({ side = 'right', className, children, ...props }, ref) => {
  const router = useRouter()

  function onDismiss() {
    router.back()
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        onEscapeKeyDown={onDismiss}
        onPointerDownOutside={onDismiss}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <button
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
})
InterceptedSheetContent.displayName = 'InterceptedSheetContent'

export { InterceptedSheetContent }
```

## 3. Se sua versao do shadcn NAO usa forwardRef (React 19+)

```typescript
// components/intercepted-sheet-content.tsx
'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

import * as SheetPrimitive from '@radix-ui/react-dialog'
import { SheetPortal, SheetOverlay, sheetVariants } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function InterceptedSheetContent({
  side = 'right',
  className,
  children,
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> & { side?: 'top' | 'bottom' | 'left' | 'right' }) {
  const router = useRouter()

  function onDismiss() {
    router.back()
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        onEscapeKeyDown={onDismiss}
        onPointerDownOutside={onDismiss}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <button
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}
```

## 4. Pagina interceptada usando o componente

```typescript
// app/(app)/org/(.)create-new/page.tsx
import { Sheet } from '@/components/ui/sheet'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'

export default function CreateOrganization() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <h2>Create New Organization</h2>
        {/* formulario de criacao */}
      </InterceptedSheetContent>
    </Sheet>
  )
}
```

## 5. Estrutura de pastas para Interception Routes

```
app/
├── (app)/
│   ├── org/
│   │   ├── (.)create-new/        # Rota interceptada (modal)
│   │   │   └── page.tsx          # Usa InterceptedSheetContent
│   │   └── create-new/           # Rota real (pagina completa)
│   │       └── page.tsx          # Usa layout completo
```

## 6. Debug: testando os vetores de fechamento

O instrutor usou `console.log` para validar que cada vetor funciona:

```typescript
function onDismiss() {
  console.log('onDismiss called') // debug temporario
  router.back()
}
```

Vetores testados:
- Clicar fora do sheet → `onPointerDownOutside` → funciona
- Apertar ESC → `onEscapeKeyDown` → funciona
- Clicar botao fechar → `onClick` → funciona (apos substituir SheetPrimitive.Close)