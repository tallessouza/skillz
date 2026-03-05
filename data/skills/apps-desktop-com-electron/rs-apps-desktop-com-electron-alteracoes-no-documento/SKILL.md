---
name: rs-electron-alteracoes-no-documento
description: "Applies real-time document update patterns in Electron apps using IPC between renderer and main process. Use when user asks to 'sync editor content', 'save document changes', 'update sidebar in real-time', 'parse editor HTML', or 'extract title from rich text editor'. Covers regex with named groups for HTML parsing, useMutation for persistence, and optimistic cache updates with React Query. Make sure to use this skill whenever implementing editor-to-main process communication or real-time UI sync in Electron. Not for initial document creation, file system operations, or editor setup/configuration."
---

# Alteracoes no Documento — Comunicacao Renderer-Main

> Ao implementar atualizacao de documentos em Electron, separe parsing do conteudo, persistencia e atualizacao de cache em camadas distintas.

## Rules

1. **Parse HTML do editor com regex e grupos nomeados** — use `(?<title>...)` e `(?<content>...)` ao inves de indices numericos, porque indices como `[2]` e `[3]` nao comunicam intencao para quem da manutencao
2. **Torne o segundo grupo da regex opcional** — documento pode ter apenas titulo sem conteudo, entao o grupo de conteudo precisa de `?` no final
3. **Mantenha o componente de editor puro** — o editor nao deve conter mutations ou conexoes externas; receba uma callback `onContentUpdated` como prop, porque o editor pode ser reaproveitado em outros contextos
4. **Use uma funcao intermediaria no componente pai** — crie um `handleEditorContentUpdated` entre o editor e a mutation, porque funciona como middleware para validacoes futuras
5. **Atualize o cache do React Query no onSuccess** — use `setQueryData` com `map` para atualizar apenas o campo relevante (titulo na sidebar), porque evita refetch desnecessario
6. **Forneca valor padrao para titulo vazio** — se o usuario deletar o titulo, salve como `"Untitled"`, porque titulo em branco quebra a exibicao na sidebar

## How to write

### Regex com grupos nomeados para parsing de HTML do editor

```typescript
const contentRegex = /^<h1>(?<title>.+)<\/h1>(?<content>.+)?$/
```

### Parsing do conteudo no onUpdate do editor

```typescript
onUpdate({ editor }) {
  const parsedContent = editor.getHTML().match(contentRegex)
  const title = parsedContent?.groups?.title ?? 'Untitled'
  const content = parsedContent?.groups?.content ?? ''

  onContentUpdated({ title, content })
}
```

### Interface da callback exportada do editor

```typescript
export interface OnContentUpdatedParams {
  title: string
  content: string
}

interface EditorProps {
  onContentUpdated: (params: OnContentUpdatedParams) => void
}
```

### Mutation com atualizacao otimista da sidebar

```typescript
const { mutateAsync: saveDocument } = useMutation({
  mutationFn: async ({ title, content }: OnContentUpdatedParams) => {
    await window.api.saveDocument({ id: id!, title, content })
  },
  onSuccess: (_, { title }) => {
    queryClient.setQueryData(['documents'], (documents) => {
      return documents?.map((document) => {
        if (document.id === id) {
          return { ...document, title }
        }
        return document
      })
    })
  },
})
```

## Example

**Before (mutation dentro do editor, indices numericos):**
```typescript
// Dentro do componente Editor
const { mutateAsync } = useMutation({ ... })

onUpdate({ editor }) {
  const parsed = editor.getHTML().match(/^<h1>(.+)<\/h1>(.+)?$/)
  await mutateAsync({ title: parsed[2], content: parsed[3] })
}
```

**After (editor puro, grupos nomeados, middleware no pai):**
```typescript
// Editor: componente puro
onUpdate({ editor }) {
  const parsed = editor.getHTML().match(contentRegex)
  const title = parsed?.groups?.title ?? 'Untitled'
  const content = parsed?.groups?.content ?? ''
  onContentUpdated({ title, content })
}

// Page: lida com persistencia
function handleEditorContentUpdated({ title, content }: OnContentUpdatedParams) {
  saveDocument({ title, content })
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Editor usado em multiplos contextos | Receba callback como prop, nunca mutation interna |
| Sidebar mostra apenas titulo | Atualize somente titulo no `setQueryData`, conteudo e irrelevante |
| Documento pode nao ter conteudo | Grupo de conteudo na regex com `?`, fallback para string vazia |
| ID pode ser undefined no TypeScript | Use `id!` quando logica garante que so executa com ID presente |
| Nome de import conflita com componente | Renomeie o type import (ex: `IpcDocument`) para evitar shadowing |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `parsed[2]` para titulo | `parsed?.groups?.title` com grupo nomeado |
| Mutation dentro do componente de editor | Callback `onContentUpdated` como prop |
| `getJSON()` para extrair titulo e conteudo separados | `getHTML()` com regex, porque JSON exigiria reconversao para HTML |
| Refetch completo apos salvar | `setQueryData` com map para atualizar cache local |
| Salvar titulo vazio | Fallback para `'Untitled'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
