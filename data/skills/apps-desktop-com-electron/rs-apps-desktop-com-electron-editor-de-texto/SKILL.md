---
name: rs-electron-editor-de-texto
description: "Applies TipTap editor setup patterns when building rich text editors in Electron or React apps. Use when user asks to 'add a text editor', 'setup TipTap', 'configure rich text', 'add markdown editor', or 'create a document editor'. Covers TipTap extensions, Tailwind Typography plugin integration, placeholder configuration, and document structure enforcement. Make sure to use this skill whenever integrating TipTap or building editable content areas. Not for plain textarea inputs, form fields, or code-only editors like Monaco/CodeMirror."
---

# Editor de Texto com TipTap

> Configure o TipTap como editor rich text com extensoes essenciais, Tailwind Typography para estilizacao automatica e estrutura de documento com titulo obrigatorio.

## Rules

1. **Use StarterKit como base** — importar extensoes individuais basicas e desnecessario porque o StarterKit ja inclui markdown, listas, blockquotes e formatacao essencial
2. **Estilize com Tailwind Typography plugin** — adicione a classe `prose prose-invert` no editor ao inves de estilizar cada tag manualmente, porque o plugin resolve H1-H6, blockquotes, listas e negrito automaticamente
3. **Placeholder via CSS before, nao texto real** — o editor e uma div editavel (nao input/textarea), entao placeholder nativo nao existe; use `before:content-[attr(data-placeholder)]` com `before:h-0 before:float-left before:pointer-events-none` para que nao seja clicavel nem ocupe espaco
4. **Force estrutura do documento** — use `Document.extend({ content: 'heading block*' })` para garantir que o primeiro elemento sempre seja um titulo, como o Notion faz
5. **Remova outline do focus** — aplique `focus:outline-none` no EditorContent para remover o contorno azul padrao do navegador
6. **Use editorProps.attributes para classes internas** — o EditorContent renderiza multiplas divs; className vai na div externa, mas `editorProps.attributes.class` vai na div interna onde o conteudo realmente esta

## How to write

### Componente Editor basico

```tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'

export function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: false,
      }),
      Document.extend({
        content: 'heading block*',
      }),
      Highlight,
      Typography,
      Placeholder.configure({
        placeholder: 'Untitled',
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-gray-500 before:h-0 before:float-left before:pointer-events-none',
      }),
    ],
    content: '<h1>Titulo</h1><p>Conteudo aqui</p>',
    autofocus: 'end',
    editorProps: {
      attributes: {
        class: 'prose prose-invert focus:outline-none',
      },
    },
  })

  return <EditorContent className="w-[65ch]" editor={editor} />
}
```

### Tailwind config com Typography plugin

```js
// tailwind.config.js
module.exports = {
  plugins: [require('@tailwindcss/typography')],
}
```

## Example

**Before (sem Typography, sem estrutura):**
```tsx
const editor = useEditor({
  extensions: [StarterKit],
  content: '<p>Texto</p>',
})
return <EditorContent editor={editor} />
// H1, H2, blockquotes, listas — tudo com mesmo CSS
```

**After (com this skill applied):**
```tsx
const editor = useEditor({
  extensions: [
    StarterKit.configure({ document: false }),
    Document.extend({ content: 'heading block*' }),
    Highlight,
    Typography,
    Placeholder.configure({
      placeholder: 'Untitled',
      emptyEditorClass:
        'before:content-[attr(data-placeholder)] before:text-gray-500 before:h-0 before:float-left before:pointer-events-none',
    }),
  ],
  content: '<h1></h1>',
  autofocus: 'end',
  editorProps: {
    attributes: {
      class: 'prose prose-invert prose-headings:mt-0 focus:outline-none',
    },
  },
})
return <EditorContent className="w-[65ch]" editor={editor} />
// Estilizacao automatica, titulo obrigatorio, placeholder funcional
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa customizar spacing dos headings | Use `prose-headings:mt-0` ou variantes do Tailwind Typography |
| Quer extensoes adicionais (mentions, tables) | Instale separadamente e adicione ao array de extensions |
| StarterKit ja inclui uma extensao que voce quer customizar | Passe `false` na config do StarterKit e importe a extensao separada |
| Conteudo inicial do editor | Use HTML valido na prop `content` |
| Dark mode | Adicione `prose-invert` junto com `prose` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<textarea>` para rich text | TipTap `EditorContent` com `useEditor` |
| CSS manual para cada tag HTML | `prose prose-invert` via Tailwind Typography |
| Placeholder como texto real no editor | CSS `before:content-[attr(data-placeholder)]` |
| Todas extensoes importadas individualmente | `StarterKit` + apenas extensoes extras |
| `className` para estilizar conteudo interno | `editorProps.attributes.class` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
