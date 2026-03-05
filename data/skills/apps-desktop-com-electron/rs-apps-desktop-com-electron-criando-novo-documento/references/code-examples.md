# Code Examples: React Query Mutations com Cache Otimizado

## Exemplo completo do componente CreatePage

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Document } from '@shared/types/ipc'

export function CreatePage() {
  const queryClient = useQueryClient()

  const { mutateAsync: createDocument, isLoading: isCreatingNewDocument } =
    useMutation({
      mutationFn: async () => {
        const response = await window.api.createDocument()
        return response.data
      },
      onSuccess: (data) => {
        queryClient.setQueryData(
          ['documents'],
          (documents: Document[] | undefined) => {
            if (documents && documents.length >= 0) {
              return [...documents, data]
            }
            return [data]
          },
        )
      },
    })

  return (
    <button
      onClick={() => createDocument()}
      disabled={isCreatingNewDocument}
      className="disabled:opacity-60"
    >
      Novo documento
    </button>
  )
}
```

## Sidebar com useQuery (query que e atualizada pelo setQueryData)

```typescript
import { useQuery } from '@tanstack/react-query'

export function Sidebar() {
  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await window.api.fetchDocuments()
      console.log('feito do zero') // so aparece no fetch real, nao no setQueryData
      return response.data
    },
  })

  return (
    <nav>
      {documents?.map((doc) => (
        <div key={doc.id}>{doc.title}</div>
      ))}
    </nav>
  )
}
```

## Versao com invalidateQueries (para comparacao)

```typescript
// Esta versao funciona, mas gera uma requisicao extra
const { mutateAsync: createDocument } = useMutation({
  mutationFn: async () => {
    const response = await window.api.createDocument()
    return response.data
  },
  onSuccess: () => {
    // Isso marca a query 'documents' como invalida
    // React Query refaz a query automaticamente
    queryClient.invalidateQueries({ queryKey: ['documents'] })
  },
})
```

## Variacao: mutation de delete com setQueryData

```typescript
const { mutateAsync: deleteDocument, isLoading: isDeletingDocument } =
  useMutation({
    mutationFn: async (documentId: string) => {
      await window.api.deleteDocument(documentId)
    },
    onSuccess: (_, documentId) => {
      queryClient.setQueryData(
        ['documents'],
        (documents: Document[] | undefined) => {
          if (!documents) return []
          return documents.filter((doc) => doc.id !== documentId)
        },
      )
    },
  })

// Uso no onClick:
<button onClick={() => deleteDocument(doc.id)} disabled={isDeletingDocument}>
  Excluir
</button>
```

## Variacao: mutation de update com setQueryData

```typescript
const { mutateAsync: updateDocument, isLoading: isUpdatingDocument } =
  useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const response = await window.api.updateDocument({ id, title })
      return response.data
    },
    onSuccess: (updatedDoc) => {
      queryClient.setQueryData(
        ['documents'],
        (documents: Document[] | undefined) => {
          if (!documents) return [updatedDoc]
          return documents.map((doc) =>
            doc.id === updatedDoc.id ? updatedDoc : doc,
          )
        },
      )
    },
  })
```

## Prova de que setQueryData nao refaz a query

```typescript
// Na sidebar, adicione um console.log dentro do queryFn:
const { data: documents } = useQuery({
  queryKey: ['documents'],
  queryFn: async () => {
    const response = await window.api.fetchDocuments()
    console.log('feito do zero') // PROVA: so aparece com F5 ou invalidate
    return response.data
  },
})

// Com invalidateQueries: "feito do zero" aparece a cada criacao
// Com setQueryData: "feito do zero" NAO aparece — cache atualizado diretamente
```