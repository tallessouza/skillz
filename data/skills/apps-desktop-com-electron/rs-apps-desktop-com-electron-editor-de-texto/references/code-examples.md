# Code Examples: Editor de Texto com TipTap

## 1. Instalacao dos pacotes

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-document @tiptap/extension-placeholder @tiptap/extension-typography @tiptap/extension-highlight
npm install @tailwindcss/typography
```

## 2. Configuracao do Tailwind com Typography

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

## 3. Componente Editor passo a passo

### Passo 1: Editor minimo (so StarterKit)

```tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<h1>Backend</h1><p>Esse é um documento que explica sobre Backend.</p>',
  })

  return <EditorContent className="w-[65ch]" editor={editor} />
}
```

Nesse ponto, o editor funciona mas **nao tem estilizacao** — H1 e paragrafos ficam com o mesmo visual.

### Passo 2: Adicionando Tailwind Typography

Apos configurar o plugin no tailwind.config.js, adicione as classes via `editorProps`:

```tsx
const editor = useEditor({
  extensions: [StarterKit],
  content: '<h1>Backend</h1><p>Esse é um documento que explica sobre Backend.</p>',
  editorProps: {
    attributes: {
      class: 'prose prose-invert',
    },
  },
})
```

Agora H1, blockquotes, listas e formatacao ficam estilizados automaticamente.

### Passo 3: Removendo outline e customizando headings

```tsx
editorProps: {
  attributes: {
    class: 'prose prose-invert prose-headings:mt-0 focus:outline-none',
  },
},
```

### Passo 4: Adicionando extensoes extras

```tsx
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

const editor = useEditor({
  extensions: [
    StarterKit,
    Highlight,
    Typography,
  ],
  // ...
})
```

- **Highlight**: detecta sintaxe markdown (hashtags para H1/H2) e converte para tags HTML
- **Typography**: correcoes tipograficas automaticas

### Passo 5: Placeholder

```tsx
import Placeholder from '@tiptap/extension-placeholder'

const editor = useEditor({
  extensions: [
    StarterKit,
    Highlight,
    Typography,
    Placeholder.configure({
      placeholder: 'Digite algum texto',
      emptyEditorClass:
        'before:content-[attr(data-placeholder)] before:text-gray-500 before:h-0 before:float-left before:pointer-events-none',
    }),
  ],
  // ...
})
```

### Passo 6: Estrutura de documento com titulo obrigatorio

```tsx
import Document from '@tiptap/extension-document'

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      document: false, // desabilita Document do StarterKit
    }),
    Document.extend({
      content: 'heading block*', // primeiro elemento = heading, depois qualquer bloco
    }),
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
```

## 4. Uso do componente na pagina

```tsx
// src/pages/document.tsx
import { Editor } from '../components/editor'

export function Document() {
  return (
    <main>
      <Editor />
    </main>
  )
}
```

## 5. Variacoes uteis

### Customizando prose para tags especificas

```html
<!-- Remover margin-top dos headings -->
<div class="prose prose-invert prose-headings:mt-0">

<!-- Customizar cor dos links -->
<div class="prose prose-invert prose-a:text-blue-400">

<!-- Customizar blockquotes -->
<div class="prose prose-invert prose-blockquote:border-l-blue-500">
```

### Configurando placeholder com funcao dinamica

```tsx
Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === 'heading') {
      return 'Untitled'
    }
    return 'Escreva algo...'
  },
  // ...
})
```

Isso permite placeholders diferentes para o heading e para paragrafos normais.