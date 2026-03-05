---
name: rs-next-js-utilizando-o-revalidate-path
description: "Applies Next.js revalidatePath pattern after server action mutations to auto-refresh page data. Use when user asks to 'create a server action', 'save data and update UI', 'revalidate cache', 'refresh page after mutation', or 'close dialog after submit'. Ensures stale data never shows after create/update/delete operations. Make sure to use this skill whenever writing Next.js server actions that mutate data. Not for client-side fetching, SWR, React Query, or static page generation."
---

# RevalidatePath em Server Actions

> Apos toda mutacao em server action, chame `revalidatePath` para garantir que a pagina exiba dados atualizados sem reload manual.

## Rules

1. **Sempre revalidate apos mutacao** — chame `revalidatePath("/rota")` apos todo `create`, `update` ou `delete` no banco, porque sem isso o usuario ve dados stale ate dar F5
2. **Revalidate a rota que exibe os dados** — passe o path da pagina que lista os dados afetados, nao a rota da action, porque o Next precisa saber QUAL pagina tem cache desatualizado
3. **Coloque revalidatePath DEPOIS do sucesso** — so revalide apos confirmar que a operacao no banco funcionou (fora do catch), porque revalidar antes da mutacao nao faz sentido
4. **Feche dialogs via estado controlado** — use `useState` para controlar `open`/`onOpenChange` do Dialog e chame `setIsOpen(false)` apos o submit bem-sucedido, porque o usuario nao deve fechar manualmente
5. **Resete o formulario apos fechar** — chame `form.reset()` apos fechar o dialog, porque o proximo agendamento nao deve herdar dados do anterior

## How to write

### Server Action com revalidatePath

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function createAppointment(data: CreateAppointmentInput) {
  try {
    await prisma.appointment.create({
      data: {
        // ...campos
      },
    })

    revalidatePath("/") // revalida a rota que lista os dados
  } catch (error) {
    // handle error
  }
}
```

### Dialog controlado com fechamento automatico

```typescript
const [isOpen, setIsOpen] = useState(false)

// No Dialog:
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  {/* conteudo */}
</Dialog>

// No submit handler:
async function onSubmit(data: FormData) {
  await createAppointment(data)
  setIsOpen(false)
  form.reset()
}
```

## Example

**Before (usuario precisa dar F5):**
```typescript
export async function createAppointment(data: CreateAppointmentInput) {
  await prisma.appointment.create({ data })
  // nada acontece — pagina fica stale
}

// Dialog sem controle de estado
<Dialog>
  <form onSubmit={handleSubmit}>...</form>
</Dialog>
```

**After (atualizacao automatica + dialog fecha):**
```typescript
export async function createAppointment(data: CreateAppointmentInput) {
  await prisma.appointment.create({ data })
  revalidatePath("/") // Next busca dados frescos automaticamente
}

// Dialog controlado
const [isOpen, setIsOpen] = useState(false)

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <form onSubmit={async (data) => {
    await createAppointment(data)
    setIsOpen(false)
    form.reset()
  }}>...</form>
</Dialog>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Server action cria/edita/deleta dados | Sempre `revalidatePath` da rota que exibe esses dados |
| Dados aparecem em multiplas rotas | Chame `revalidatePath` para cada rota afetada |
| Dialog/sheet de formulario | Controle com `useState` + `open`/`onOpenChange` |
| Submit bem-sucedido | Feche dialog + reset form nessa ordem |
| Action falhou (caiu no catch) | Nao revalide, nao feche dialog — mostre erro |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `revalidatePath` dentro do catch | `revalidatePath` apos a mutacao bem-sucedida |
| `window.location.reload()` apos action | `revalidatePath("/rota")` na server action |
| Dialog sem estado controlado (usuario fecha manual) | `useState` + `setIsOpen(false)` apos submit |
| `revalidatePath` antes da mutacao | `revalidatePath` depois do `prisma.create/update/delete` |
| Esquecer `form.reset()` apos fechar | `setIsOpen(false)` seguido de `form.reset()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-utilizando-o-revalidate-path/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-utilizando-o-revalidate-path/references/code-examples.md)
