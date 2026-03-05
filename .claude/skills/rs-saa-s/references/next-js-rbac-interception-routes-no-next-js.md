---
name: rs-saas-nextjs-rbac-interception-routes
description: "Applies Next.js Interception Routes pattern when building navigation that shows different UI depending on how the user arrives at a route. Use when user asks to 'create a modal route', 'intercept navigation', 'show page in modal', 'sheet on navigation', 'different UI for direct vs navigated access', or implements social-feed-style modals. Combines with Parallel Routes for modal/sheet/drawer overlays. Make sure to use this skill whenever implementing route interception or modal-based navigation in Next.js App Router. Not for regular page routing, API routes, or server actions."
---

# Interception Routes no Next.js

> Intercepte a navegacao do usuario para uma rota e mostre conteudo alternativo (modal, sheet, drawer) quando ele navega internamente, mantendo a pagina original para acesso direto via URL.

## Rules

1. **Use a convencao de ponto no nome da pasta** — `(.)createOrganization` para interceptar rota no mesmo nivel, `(..)photo` para nivel acima, porque o ponto funciona como `cd ..` indicando onde esta a rota original
2. **Sempre combine com Parallel Routes** — Interception Routes sozinhas nao fazem sentido visual, o slot do Parallel Route e onde o conteudo interceptado aparece no layout
3. **Mantenha o arquivo default.tsx retornando null** — nao basta deletar o default, ele deve existir retornando `null` para que nada apareca quando a rota nao esta ativa
4. **Reinicie o servidor apos criar Interception Routes** — o Next.js perde o cache de rotas e nao detecta as novas interception routes sem restart
5. **A rota original deve existir separadamente** — a pagina completa (acesso direto/F5) vive na rota normal, a versao interceptada vive na pasta com ponto
6. **Use componentes overlay (Sheet, Modal, Drawer) na rota interceptada** — porque o objetivo e dar uma experiencia de sobreposicao na navegacao interna, nao substituir a pagina

## How to write

### Estrutura de diretorios (mesmo nivel)

```
app/
├── layout.tsx              # Renderiza {children} e {test}
├── page.tsx                # Pagina principal
├── @test/                  # Parallel Route slot
│   ├── default.tsx         # Retorna null
│   └── (.)createOrganization/
│       └── page.tsx        # Versao interceptada (sheet/modal)
└── create-organization/
    └── page.tsx            # Pagina original (acesso direto)
```

### Estrutura de diretorios (nivel acima)

```
app/
├── feed/
│   ├── page.tsx
│   └── @modal/
│       ├── default.tsx     # Retorna null
│       └── (..)photo/[id]/
│           └── page.tsx    # Intercepta /photo/[id] a partir de /feed
└── photo/[id]/
    └── page.tsx            # Pagina original do photo
```

### Default retornando null

```typescript
// app/@slotName/default.tsx
export default function Default() {
  return null
}
```

### Pagina interceptada com Sheet

```typescript
// app/@test/(.)createOrganization/page.tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { OrganizationForm } from '../../../create-organization/organization-form'

export default function CreateOrganizationIntercepted() {
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

## Example

**Antes (navegacao normal — usuario sempre vai para pagina completa):**
```
Clica em "Criar Organizacao" → Redireciona para /create-organization (pagina inteira)
```

**Depois (com Interception Route — experiencia diferenciada):**
```
Clica em "Criar Organizacao" → Abre Sheet lateral com o formulario (mesma pagina)
Acessa /create-organization direto (F5 ou link) → Pagina completa normal
```

## Heuristics

| Situacao | Do |
|----------|-----|
| Rota interceptada no mesmo diretorio | Use `(.)` — um ponto |
| Rota interceptada um nivel acima | Use `(..)` — dois pontos |
| Rota interceptada dois niveis acima | Use `(..)(..)` — repita |
| Rota interceptada desde a raiz | Use `(...)` — tres pontos |
| Mudancas nas interception routes nao refletem | Reinicie o servidor Next.js |
| Sheet/Modal fecha mas URL permanece | Implemente navegacao programatica no onClose (router.back) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Deletar o arquivo default.tsx do slot | Manter default.tsx retornando `null` |
| Criar interception route sem parallel route | Sempre usar `@slot` + `(.)rota` juntos |
| Usar interception route para paginas sem versao alternativa | Usar apenas quando ha UI diferente para navegacao interna vs direta |
| Esquecer de reiniciar o Next apos criar a rota | Sempre `Ctrl+C` e `npm run dev` novamente |
| Controlar estado open/close do modal manualmente | Usar `defaultOpen` e `router.back()` para fechar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-interception-routes-no-next-js/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-interception-routes-no-next-js/references/code-examples.md)
