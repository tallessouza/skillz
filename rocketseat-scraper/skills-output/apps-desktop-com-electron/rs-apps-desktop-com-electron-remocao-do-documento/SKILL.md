---
name: rs-electron-remocao-documento
description: "Applies delete mutation pattern with optimistic UI update in React/Electron apps. Use when user asks to 'delete an item', 'remove from list', 'implement delete functionality', or 'update list after deletion'. Covers useMutation for delete, setQueryData with filter, post-delete navigation, and conditional UI rendering. Make sure to use this skill whenever implementing delete operations with React Query/TanStack Query. Not for server-side deletion logic, database operations, or bulk delete patterns."
---

# Remocao de Documento com Mutation

> Ao implementar delete, atualize a UI imediatamente com setQueryData + filter, navegue para rota segura, e esconda controles irrelevantes.

## Rules

1. **Use useMutation para operacoes de delete** — nunca chame a API de delete diretamente no onClick, porque useMutation gerencia loading, erro e sucesso automaticamente
2. **Atualize a lista com setQueryData + filter** — remova o item deletado do cache local em vez de refetch, porque isso da feedback instantaneo ao usuario
3. **Navegue apos deletar** — redirecione para rota raiz/segura no onSuccess, porque o usuario nao deve ficar vendo conteudo de algo que foi deletado
4. **Esconda controles quando nao aplicaveis** — renderize botao de apagar apenas quando houver item selecionado (ID existe), porque botoes sem contexto confundem o usuario
5. **Desabilite o botao durante a mutation** — use isPending/isLoading para disabled + opacidade reduzida, porque previne duplo-click e da feedback visual
6. **Cuidado com conflitos de tipos** — importe explicitamente seus tipos (ex: Document) quando conflitam com tipos globais do browser, porque TypeScript usara o tipo errado silenciosamente

## How to write

### Delete mutation com atualizacao otimista

```typescript
const queryClient = useQueryClient()
const { id } = useParams<{ id: string }>()
const navigate = useNavigate()

const { mutateAsync: deleteDocument, isPending: isDeletingDocument } = useMutation({
  mutationFn: async () => {
    await window.api.deleteDocument(id!)
  },
  onSuccess: () => {
    queryClient.setQueryData<Document[]>(['documents'], (documents) => {
      return documents?.filter(doc => doc.id !== id)
    })
    navigate('/')
  }
})
```

### Botao com estado de loading

```tsx
<button
  onClick={async () => await deleteDocument()}
  disabled={isDeletingDocument}
  className="disabled:opacity-60"
>
  Apagar
</button>
```

### Renderizacao condicional de controles

```tsx
{id && (
  <>
    <Breadcrumbs />
    <button onClick={() => deleteDocument()}>Apagar</button>
  </>
)}
```

## Example

**Before (delete sem atualizacao de UI):**
```typescript
// Usuario clica apagar, item some do banco mas lista nao atualiza
// Precisa F5 para ver a mudanca
const handleDelete = async () => {
  await window.api.deleteDocument(id)
}
```

**After (com esta skill aplicada):**
```typescript
const queryClient = useQueryClient()
const navigate = useNavigate()
const { id } = useParams<{ id: string }>()

const { mutateAsync: deleteDocument, isPending } = useMutation({
  mutationFn: () => window.api.deleteDocument(id!),
  onSuccess: () => {
    queryClient.setQueryData<Document[]>(['documents'], (docs) =>
      docs?.filter(doc => doc.id !== id)
    )
    navigate('/')
  }
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Delete de item em lista | setQueryData com filter para remover do cache |
| Pagina mostra item deletado | Navegue para rota raiz no onSuccess |
| Botao de acao depende de selecao | Renderize condicionalmente com `{id && ...}` |
| Tipo Document conflita com DOM | Importe explicitamente do seu modulo shared |
| Header muda de tamanho com/sem botoes | Fixe altura minima (ex: h-14) |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `await api.delete(); refetch()` | `setQueryData` com filter no onSuccess |
| Deixar usuario na pagina do item deletado | `navigate('/')` apos deletar |
| Mostrar botao apagar sem item selecionado | `{id && <DeleteButton />}` |
| Chamar API direto no onClick sem mutation | Usar `useMutation` com mutateAsync |
| Ignorar estado de loading no delete | `disabled={isPending}` + opacidade reduzida |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
