---
name: rs-next-js-delecao-agendamento
description: "Applies the Next.js Server Action delete pattern with Alert Dialog confirmation when implementing delete functionality in Next.js apps. Use when user asks to 'delete a record', 'remove an item', 'add delete button', 'implement exclusion', or 'create delete confirmation dialog'. Enforces revalidatePath after mutation, loading states, error handling with toast, and Alert Dialog UX. Make sure to use this skill whenever adding delete operations to Next.js Server Components or Client Components. Not for GET requests, read-only pages, or non-Next.js frameworks."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: delete-operations
  tags: [next-js, server-actions, delete, alert-dialog, revalidatePath, loading-state, toast]
---

# Funcionalidade de Delecao com Server Actions e Alert Dialog

> Toda operacao de delecao em Next.js segue: Server Action com try/catch → Alert Dialog de confirmacao → loading state → toast feedback → revalidatePath.

## Rules

1. **Server Action de delete recebe apenas o id** — `deleteAppointments(id: string)`, porque delecao nao precisa de payload complexo
2. **Sempre use revalidatePath apos mutacao** — sem revalidate, a UI nao atualiza e o usuario precisa dar F5, porque Next.js cacheia Server Components
3. **Use Alert Dialog, nao Dialog comum** — delecao e irreversivel, o usuario precisa de confirmacao explicita com mensagem clara
4. **Componente com estado vira Client Component** — adicione `"use client"` quando usar useState para loading states, porque Server Components nao suportam hooks
5. **Trate erro na Action, nao no componente** — try/catch na Server Action retorna `{ error: string }`, o componente apenas exibe via toast
6. **Loading state no botao de confirmacao** — desabilite o botao e mostre spinner durante a requisicao, porque evita duplo clique e delecao duplicada

## How to write

### Server Action de delete

```typescript
// actions.ts
"use server"

export async function deleteAppointments(id: string) {
  try {
    await prisma.appointments.delete({
      where: { id }
    })
    revalidatePath("/appointments")
  } catch (error) {
    console.error(error)
    return { error: "Erro ao remover agendamento" }
  }
}
```

### Alert Dialog com confirmacao

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="remove" size="icon">
      <Trash2 size={16} />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Remover agendamento</AlertDialogTitle>
      <AlertDialogDescription>
        Tem certeza que deseja remover este agendamento? Esta acao nao pode ser desfeita.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Confirmar
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Handler com loading state

```tsx
"use client"

const [isDeleting, setIsDeleting] = useState(false)

async function handleDelete() {
  setIsDeleting(true)
  const result = await deleteAppointments(appointmentId)
  if (result?.error) {
    toast.error(result.error)
    setIsDeleting(false)
    return
  }
  toast.success("Agendamento removido com sucesso")
  setIsDeleting(false)
}
```

## Example

**Before (delete sem confirmacao nem feedback):**
```tsx
<button onClick={() => deleteAppointments(id)}>Deletar</button>
```

**After (com Alert Dialog, loading e toast):**
```tsx
"use client"
// Estado + handler + AlertDialog completo conforme patterns acima
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Delecao de qualquer registro | Alert Dialog com mensagem de irreversibilidade |
| Server Action que muta dados | revalidatePath no final do try |
| Componente precisa de useState | Adicionar "use client" no topo |
| Action retorna erro | Retornar objeto `{ error }`, nao lancar excecao |
| Botao de acao destrutiva | variant="remove" ou "destructive" |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `throw new Error()` na Action | `return { error: "mensagem" }` |
| Delete sem revalidatePath | Delete + `revalidatePath("/path")` |
| Dialog comum para delecao | AlertDialog com descricao de irreversibilidade |
| Delete sem loading state | useState + disabled + spinner |
| window.confirm() | AlertDialog do shadcn/ui |
| Catch vazio na Action | Catch com console.error + return error |

## Troubleshooting

### Dados cacheados nao atualizam apos mutacao
**Symptom:** Apos criar/editar/deletar, a listagem mostra dados antigos
**Cause:** Cache do Next.js serve a versao antiga da pagina
**Fix:** Usar `revalidatePath('/caminho')` ou `revalidateTag('tag')` na server action apos a mutacao. Verificar que o path passado corresponde exatamente a rota da listagem

### fetch retorna dados stale em producao
**Symptom:** Dados frescos em desenvolvimento mas desatualizados em producao
**Cause:** Em producao, Next.js aplica cache agressivo por padrao em fetch requests
**Fix:** Adicionar `{ cache: 'no-store' }` ao fetch para desabilitar cache, ou usar `{ next: { revalidate: N } }` para ISR

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-criando-a-funcionalidade-de-delecao-de-um-agendamento/references/deep-explanation.md) — O instrutor destaca que a funcao `deleteAppointments` recebe apenas um `id: string` — nao precisa de
- [code-examples.md](../../../data/skills/next-js/rs-next-js-criando-a-funcionalidade-de-delecao-de-um-agendamento/references/code-examples.md) — // app/actions.ts (ou arquivo de actions do modulo)
