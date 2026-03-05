# Code Examples: Alteracoes no Documento

## 1. Explorando as opcoes do editor (getHTML vs getJSON)

```typescript
// Opcao 1: getHTML() — retorna string HTML
onUpdate({ editor }) {
  console.log(editor.getHTML())
  // Output: "<h1>Meu Titulo</h1><p>Conteudo do paragrafo</p>"
}

// Opcao 2: getJSON() — retorna estrutura JSON
onUpdate({ editor }) {
  console.log(editor.getJSON())
  // Output: { type: "doc", content: [
  //   { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Meu Titulo" }] },
  //   { type: "paragraph", content: [{ type: "text", text: "Conteudo" }] }
  // ]}
}

// Opcao 3: getText() — retorna texto plano
onUpdate({ editor }) {
  console.log(editor.getText())
  // Output: "Meu Titulo\nConteudo do paragrafo"
}
```

**Decisao:** `getHTML()` porque a separacao titulo/conteudo e mais simples com regex do que navegar o JSON e reconverter para HTML.

## 2. Construcao da regex passo a passo

```typescript
// Passo 1: Match basico do H1
/^<h1>.+<\/h1>/

// Passo 2: Grupo para capturar titulo
/^<h1>(.+)<\/h1>/

// Passo 3: Grupo para capturar conteudo apos H1
/^<h1>(.+)<\/h1>(.+)$/

// Passo 4: Conteudo opcional (documento pode ter so titulo)
/^<h1>(.+)<\/h1>(.+)?$/

// Passo 5: Grupos nomeados para legibilidade
/^<h1>(?<title>.+)<\/h1>(?<content>.+)?$/
```

### Casos de teste da regex:

```
// Caso 1: Titulo + conteudo
"<h1>Ignite</h1><p>Testando o editor</p>"
// groups: { title: "Ignite", content: "<p>Testando o editor</p>" }

// Caso 2: Titulo sem conteudo
"<h1>Untitled</h1>"
// groups: { title: "Untitled", content: undefined }

// Caso 3: Titulo + multiplos paragrafos
"<h1>Discover</h1><p>Primeiro paragrafo</p><p>Segundo paragrafo</p>"
// groups: { title: "Discover", content: "<p>Primeiro paragrafo</p><p>Segundo paragrafo</p>" }
```

## 3. Interface exportada do editor

```typescript
// editor.tsx
export interface OnContentUpdatedParams {
  title: string
  content: string
}

interface EditorProps {
  content: string
  onContentUpdated: (params: OnContentUpdatedParams) => void
}
```

## 4. Componente Editor com onUpdate

```typescript
const editor = useEditor({
  extensions: [/* ... */],
  content: initialContent,
  onUpdate({ editor }) {
    const contentRegex = /^<h1>(?<title>.+)<\/h1>(?<content>.+)?$/
    const parsedContent = editor.getHTML().match(contentRegex)

    const title = parsedContent?.groups?.title ?? 'Untitled'
    const content = parsedContent?.groups?.content ?? ''

    onContentUpdated({ title, content })
  },
})
```

## 5. Pagina Document com mutation e atualizacao de cache

```typescript
import { OnContentUpdatedParams } from './editor'
import { Document as IpcDocument } from '@shared/types/ipc'

export function DocumentPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { mutateAsync: saveDocument } = useMutation({
    mutationFn: async ({ title, content }: OnContentUpdatedParams) => {
      await window.api.saveDocument({ id: id!, title, content })
    },
    onSuccess: (_, variables) => {
      const { title } = variables

      queryClient.setQueryData<IpcDocument[]>(['documents'], (documents) => {
        return documents?.map((document) => {
          if (document.id === id) {
            return { ...document, title }
          }
          return document
        })
      })
    },
  })

  function handleEditorContentUpdated({
    title,
    content,
  }: OnContentUpdatedParams) {
    saveDocument({ title, content })
  }

  return (
    <Editor
      content={documentData?.content}
      onContentUpdated={handleEditorContentUpdated}
    />
  )
}
```

## 6. Por que variables e nao data no onSuccess

```typescript
// saveDocument retorna void — nao ha dados de retorno
mutationFn: async (params) => {
  await window.api.saveDocument({ ...params, id: id! })
  // nao retorna nada
},

// onSuccess recebe: (data, variables, context)
// data = undefined (porque mutationFn retorna void)
// variables = { title, content } (parametros da chamada)
onSuccess: (_, variables) => {
  const { title } = variables  // pega dos parametros
}
```

## 7. Atualizacao seletiva do cache (apenas titulo)

```typescript
// Sidebar so mostra titulo — nao precisa atualizar conteudo no cache
queryClient.setQueryData<IpcDocument[]>(['documents'], (documents) => {
  return documents?.map((document) => {
    if (document.id === id) {
      return { ...document, title }  // so titulo, nao content
    }
    return document
  })
})
```