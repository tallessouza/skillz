---
name: rs-saas-nextjs-rbac-sheet-behavior
description: "Applies intercepted sheet/modal pattern using Next.js Interception Routes when building modals, sheets, or dialogs that use URL-based state. Use when user asks to 'create a modal', 'add a sheet', 'intercept a route', 'build a dialog without state', or 'URL-driven modal'. Ensures router.back() dismissal on ESC, outside click, and close button. Make sure to use this skill whenever implementing modals with Next.js App Router interception routes. Not for generic React modals, state-managed dialogs, or non-Next.js projects."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: frontend
  tags: [saas, nextjs, ui, tailwind]
---

# Intercepted Sheet Content — Modal via URL

> Use Interception Routes do Next.js para controlar abertura/fechamento de modais pela URL, sem estado no front-end.

## Rules

1. **Separe o componente interceptado do componente UI base** — crie `InterceptedSheetContent` fora da pasta `ui/`, porque componentes em `ui/` sao exclusivos do shadcn/ui
2. **Use `router.back()` para fechar** — nunca use estado local para controlar visibilidade do modal, porque a URL ja e a fonte de verdade
3. **Trate todos os vetores de fechamento** — `onEscapeKeyDown`, `onPointerDownOutside`, e botao de fechar, todos devem chamar a mesma funcao `onDismiss`
4. **Substitua `SheetPrimitive.Close` por botao custom** — porque o Close padrao nao executa `router.back()`, ele apenas fecha o componente visualmente sem alterar a rota
5. **Exporte utilitarios necessarios do componente base** — como `sheetVariants`, para reutilizar no componente interceptado sem duplicar codigo

## How to write

### InterceptedSheetContent component

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { SheetPortal, SheetOverlay, sheetVariants } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function InterceptedSheetContent({ children, className, side = 'right', ...props }) {
  const router = useRouter()

  function onDismiss() {
    router.back()
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <div
        className={cn(sheetVariants({ side }), className)}
        onEscapeKeyDown={onDismiss}
        onPointerDownOutside={onDismiss}
        {...props}
      >
        {children}
        <button onClick={onDismiss}>Close</button>
      </div>
    </SheetPortal>
  )
}
```

### Uso na page interceptada

```typescript
// app/(app)/org/(.)create-new/page.tsx
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet } from '@/components/ui/sheet'

export default function CreateOrgIntercepted() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        {/* formulario aqui */}
      </InterceptedSheetContent>
    </Sheet>
  )
}
```

## Example

**Before (modal com estado, nao volta na URL):**
```typescript
const [isOpen, setIsOpen] = useState(false)

<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent>
    <SheetPrimitive.Close />
    {/* conteudo */}
  </SheetContent>
</Sheet>
```

**After (modal via URL com Interception Routes):**
```typescript
// Nenhum useState necessario
// A rota interceptada abre o modal automaticamente
<Sheet defaultOpen>
  <InterceptedSheetContent>
    {/* conteudo — fechar = router.back() */}
  </InterceptedSheetContent>
</Sheet>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Modal que precisa ser compartilhavel por URL | Use Interception Routes + InterceptedSheetContent |
| Modal simples de confirmacao (delete, etc) | Use Dialog com estado local — nao precisa de rota |
| Sheet que abre de outra pagina | Use Interception Routes com `(.)` ou `(..)` |
| Fechar modal deve voltar para pagina anterior | `router.back()` na funcao onDismiss |
| shadcn/ui Close nao navega de volta | Substitua por botao custom com `onClick={onDismiss}` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useState` para controlar abertura de modal interceptado | `defaultOpen` + `router.back()` |
| `<SheetPrimitive.Close />` em modal interceptado | `<button onClick={onDismiss}>` |
| `router.push('/')` para fechar modal | `router.back()` — preserva historico de navegacao |
| Componente interceptado dentro de `ui/` | Componente separado em `components/` |
| Duplicar codigo do SheetContent | Exportar `sheetVariants` do `ui/sheet` e reutilizar |

## Troubleshooting

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
