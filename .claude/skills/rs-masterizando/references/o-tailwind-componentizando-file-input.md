---
name: rs-tailwind-componentizando-file-input
description: "Applies the composition pattern to build flexible file input components in React when user asks to 'create upload component', 'build file input', 'componentize input', or 'make reusable upload'. Splits monolithic file inputs into Root, Trigger, ImagePreview, and Control subcomponents for maximum reusability. Make sure to use this skill whenever building file upload UI or refactoring existing upload components. Not for styling individual inputs, form validation, or server-side file handling."
---

# Componentizando File Input com Composition Pattern

> Componentes de upload devem ser compostos por partes menores e independentes (Root, Trigger, ImagePreview, Control), nunca monoliticos.

## Rules

1. **Sempre use composition pattern para file inputs** — separe em Root, Trigger, ImagePreview e Control, porque partes diferentes do upload sao reutilizadas em contextos diferentes (com preview, sem preview, single vs multiple)
2. **Root e uma div wrapper invisivel** — aceita className e repassa todas as props, porque permite customizar layout (flex, gap) sem alterar componentes internos
3. **Trigger e a label clicavel** — contem o visual do botao de upload, porque o HTML label com htmlFor conecta ao input hidden
4. **Control e o input type=file** — estende ComponentProps de input e repassa props, porque permite customizar accept, multiple, id por contexto
5. **ImagePreview e opcional** — inclua apenas onde preview faz sentido, porque nem todo file input precisa de preview (ex: upload de PDF)
6. **Exporte via barrel file (index.ts)** — importe cada subcomponente e re-exporte nomeado, porque permite uso como `FileInput.Root`, `FileInput.Trigger`

## How to write

### Estrutura de pasta

```
components/Form/FileInput/
├── Root.tsx
├── Trigger.tsx
├── ImagePreview.tsx
├── Control.tsx
└── index.ts
```

### Root

```tsx
import { ComponentProps } from 'react'

type RootProps = ComponentProps<'div'>

export function Root(props: RootProps) {
  return <div {...props} />
}
```

### Trigger

```tsx
import { UploadCloud } from 'lucide-react'

export function Trigger() {
  return (
    <label
      htmlFor="photo"
      className="group flex flex-1 cursor-pointer flex-col items-center gap-3 rounded-lg border border-zinc-300 px-6 py-4 text-center text-zinc-500 shadow-sm hover:border-violet-200 hover:bg-violet-25 hover:text-violet-500"
    >
      <div className="rounded-full border-6 border-zinc-50 bg-zinc-100 p-2 group-hover:border-violet-50 group-hover:bg-violet-100">
        <UploadCloud className="h-5 w-5 text-zinc-600 group-hover:text-violet-600" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm">
          <span className="font-semibold text-violet-700">Click to upload</span> or drag and drop
        </span>
        <span className="text-xs">SVG, PNG, JPG or GIF (max. 800x400px)</span>
      </div>
    </label>
  )
}
```

### Control

```tsx
import { ComponentProps } from 'react'

type ControlProps = ComponentProps<'input'>

export function Control({ ...props }: ControlProps) {
  return <input type="file" className="sr-only" {...props} />
}
```

### Barrel export (index.ts)

```ts
import { Control } from './Control'
import { ImagePreview } from './ImagePreview'
import { Root } from './Root'
import { Trigger } from './Trigger'

export { Control, ImagePreview, Root, Trigger }
```

## Example

**Before (monolitico):**
```tsx
<div className="flex items-start gap-5">
  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
    <User className="h-8 w-8 text-violet-500" />
  </div>
  <label htmlFor="photo" className="...styles...">
    <UploadCloud />
    <span>Click to upload</span>
  </label>
  <input type="file" id="photo" className="sr-only" />
</div>
```

**After (composition pattern):**
```tsx
import * as FileInput from './components/Form/FileInput'

{/* Com preview (avatar upload) */}
<FileInput.Root className="flex items-start gap-5">
  <FileInput.ImagePreview />
  <FileInput.Trigger />
  <FileInput.Control id="photo" />
</FileInput.Root>

{/* Sem preview (portfolio upload, multiple files) */}
<FileInput.Root>
  <FileInput.Trigger />
  <FileInput.Control id="documents" multiple />
</FileInput.Root>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Upload de imagem com preview | Use Root + ImagePreview + Trigger + Control |
| Upload de documentos sem preview | Use Root + Trigger + Control (sem ImagePreview) |
| Aceitar apenas imagens | Passe `accept="image/*"` no Control |
| Aceitar multiplos arquivos | Passe `multiple` no Control |
| Dois file inputs na mesma pagina | Use `id` diferente no Control e `htmlFor` correspondente no Trigger |
| Componente pequeno (poucas variacoes) | Mantenha tudo em um arquivo so |
| Componente com partes reutilizaveis | Crie pasta com subcomponentes |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| File input monolitico com props condicionais (showPreview, isMultiple) | Composition pattern com subcomponentes opcionais |
| htmlFor hardcoded igual em dois file inputs | id unico por Control, htmlFor correspondente |
| Duplicar componente inteiro para variacao sem preview | Omitir ImagePreview na composicao |
| Estilizar layout no componente interno | Passar className no Root |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-componentizando-file-input/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-componentizando-file-input/references/code-examples.md)
