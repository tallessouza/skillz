# Code Examples: Visualizacao Dinamica de Documentos

## 1. Configuracao da rota dinamica

```tsx
// routes.tsx — ANTES
{ path: '/document', element: <Document /> }

// routes.tsx — DEPOIS
{ path: '/documents/:id', element: <Document /> }
```

O instrutor tambem ajustou o path de `document` (singular) para `documents` (plural), mencionando preferencia pessoal pelo plural.

## 2. Sidebar com NavLink

```tsx
// components/sidebar/navigation/link.tsx
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

interface LinkProps {
  document: { id: string; title: string }
}

export function Link({ document }: LinkProps) {
  return (
    <NavLink
      to={`/documents/${document.id}`}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-2 px-3 py-1 rounded text-rotion-100',
          { 'bg-rotion-700': isActive }
        )
      }
    >
      {document.title}
    </NavLink>
  )
}
```

Pontos-chave:
- `to` usa template literal com o ID do documento
- `className` recebe funcao (feature exclusiva do NavLink)
- `clsx` aplica `bg-rotion-700` condicionalmente quando `isActive` e true
- A cor de fundo do ativo e a mesma do hover, conforme mencionado pelo instrutor

## 3. Pagina de documento completa

```tsx
// pages/document.tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Editor } from '../components/editor'

export function Document() {
  const { id } = useParams<{ id: string }>()

  const { data, isFetching } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      const response = await window.api.fetchDocument(id!)
      return response.data
    },
    enabled: !!id,
  })

  const initialContent = useMemo(() => {
    if (data) {
      return `<h1>${data.title}</h1>${data.content ?? '<p></p>'}`
    }
    return ''
  }, [data])

  return (
    <main className="flex-1 p-6">
      {!isFetching && data && (
        <Editor content={initialContent} />
      )}
    </main>
  )
}
```

## 4. Componente Editor recebendo conteudo

```tsx
// components/editor.tsx
interface EditorProps {
  content: string
}

export function Editor({ content }: EditorProps) {
  // O editor TipTap/ProseMirror recebe o HTML via prop content
  // e renderiza o titulo como h1 e o corpo como paragrafos
  return (
    <EditorProvider
      content={content}
      // ... demais configuracoes do editor
    />
  )
}
```

## 5. Estrutura dos dados no banco (store.json)

```json
{
  "documents": [
    {
      "id": "1",
      "title": "Ignite",
      "content": null
    },
    {
      "id": "2",
      "title": "Discover",
      "content": "<p>Conteudo do Discover.</p>"
    }
  ]
}
```

O instrutor demonstrou editando o JSON diretamente: adicionou titulo "Discover" e conteudo `<p>Conteudo do Discover.</p>` para testar a visualizacao dinamica.

## 6. Variacao: tipagem do useParams

```tsx
// Forma usada pelo instrutor
const { id } = useParams<{ id: string }>()
// id e do tipo string | undefined

// Alternativa com validacao explicita
const { id } = useParams<{ id: string }>()
if (!id) throw new Error('Document ID is required')
// id e string a partir daqui (narrowing)
```

## 7. Variacao: fallback de conteudo

```tsx
// Abordagem do instrutor — paragrafo vazio para UX
data.content ?? '<p></p>'

// Alternativa — string vazia (cursor cai no titulo)
data.content ?? ''

// Alternativa — placeholder
data.content ?? '<p>Comece a escrever...</p>'
```