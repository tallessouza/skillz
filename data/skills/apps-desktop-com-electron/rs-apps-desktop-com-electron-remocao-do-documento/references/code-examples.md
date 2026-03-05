# Code Examples: Remocao de Documento

## Exemplo completo do Header com delete

```typescript
// src/renderer/components/Header.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { Document } from '@shared/types' // Importacao explicita — evita conflito com Document do DOM

export function Header() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutateAsync: deleteDocument, isPending: isDeletingDocument } = useMutation({
    mutationFn: async () => {
      await window.api.deleteDocument(id!)
    },
    onSuccess: () => {
      // Remove o documento do cache local (sem refetch)
      queryClient.setQueryData<Document[]>(['documents'], (documents) => {
        return documents?.filter(doc => doc.id !== id)
      })

      // Navega para rota raiz (sai da pagina do documento deletado)
      navigate('/')
    }
  })

  return (
    <div className="h-14 flex items-center justify-between">
      {/* Draggable region, titulo, etc */}

      {id && (
        <>
          {/* Breadcrumbs */}
          <div>{/* ... */}</div>

          {/* Botao de apagar */}
          <button
            onClick={async () => await deleteDocument()}
            disabled={isDeletingDocument}
            className="disabled:opacity-60"
          >
            Apagar
          </button>
        </>
      )}
    </div>
  )
}
```

## Comparacao: Create vs Delete mutation

### Create (adiciona ao cache)
```typescript
const { mutateAsync: createDocument } = useMutation({
  mutationFn: async () => {
    const doc = await window.api.createDocument()
    return doc
  },
  onSuccess: (newDoc) => {
    queryClient.setQueryData<Document[]>(['documents'], (documents) => {
      return [...(documents ?? []), newDoc]
    })
    navigate(`/documents/${newDoc.id}`)
  }
})
```

### Delete (remove do cache)
```typescript
const { mutateAsync: deleteDocument } = useMutation({
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

## Evolucao do codigo na aula

### Passo 1: Mutation basica (sem feedback visual)
```typescript
// Funciona mas nao atualiza a lista — precisa F5
const { mutateAsync: deleteDocument } = useMutation({
  mutationFn: async () => {
    await window.api.deleteDocument(id!)
  }
})
```

### Passo 2: Adiciona atualizacao do cache
```typescript
// Lista atualiza instantaneamente, mas usuario fica na pagina do doc deletado
const { mutateAsync: deleteDocument } = useMutation({
  mutationFn: async () => {
    await window.api.deleteDocument(id!)
  },
  onSuccess: () => {
    queryClient.setQueryData<Document[]>(['documents'], (docs) =>
      docs?.filter(doc => doc.id !== id)
    )
  }
})
```

### Passo 3: Adiciona navegacao
```typescript
// Apos deletar, volta pra home
onSuccess: () => {
  queryClient.setQueryData<Document[]>(['documents'], (docs) =>
    docs?.filter(doc => doc.id !== id)
  )
  navigate('/')
}
```

### Passo 4: Renderizacao condicional + altura fixa
```tsx
// Header com altura fixa e controles condicionais
<div className="h-14">
  {id && (
    <>
      <Breadcrumbs />
      <button
        onClick={() => deleteDocument()}
        disabled={isDeletingDocument}
        className="disabled:opacity-60"
      >
        Apagar
      </button>
    </>
  )}
</div>
```

## Armadilha do tipo Document

```typescript
// ERRADO — TypeScript resolve para Document do DOM
queryClient.setQueryData<Document[]>(['documents'], (documents) => {
  return documents?.filter(doc => doc.id !== id)
  //                              ^^^^^^ Error: 'id' does not exist on type 'Document'
})

// CORRETO — Importar tipo explicito
import { Document } from '@shared/types'
// Agora Document refere ao tipo da aplicacao, que tem .id
```