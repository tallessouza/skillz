---
name: rs-tailwind-context-preview-imagem
description: "Applies React Context pattern for compound components with shared state, useId for stable IDs, and useMemo for image preview. Use when user asks to 'create file input', 'compound component', 'image preview', 'share state between components', or 'connect label to input'. Make sure to use this skill whenever building compound components that need shared state or file upload with preview. Not for global state management, Redux, or server-side data fetching."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: tailwind-css
  tags: [tailwind, react, nextjs]
---

# Context e Preview da Imagem

> Compound components compartilham estado via React Context, com IDs estáveis via useId e previews memorizados via useMemo.

## Rules

1. **Use useId para IDs de componentes compostos** — `useId()` não `crypto.randomUUID()`, porque randomUUID gera um novo valor a cada re-render, quebrando a associação label/input
2. **Armazene estado compartilhado no Context do root** — arquivos selecionados, IDs e callbacks vivem no componente raiz, porque todos os filhos precisam acessar essas informações
3. **Não exponha setState diretamente no Context** — crie uma função wrapper como `onFilesSelected` com tipagem limpa, porque `Dispatch<SetStateAction<T>>` é complexo demais para consumidores
4. **Use useMemo para computações derivadas de arquivos** — `URL.createObjectURL` é custoso e só deve recalcular quando files mudar
5. **Converta FileList para Array** — `Array.from(e.target.files)` antes de armazenar, porque FileList não é um array real
6. **Marque componentes com 'use client'** — qualquer componente que use hooks (useContext, useState, useMemo) precisa da diretiva no Next.js

## How to write

### Context do compound component

```typescript
'use client'

import { createContext, useContext, useId, useState } from 'react'

interface FileInputContextType {
  id: string
  files: File[]
  onFilesSelected: (files: File[]) => void
}

const FileInputContext = createContext({} as FileInputContextType)

export function Root({ children }: { children: React.ReactNode }) {
  const id = useId()
  const [files, setFiles] = useState<File[]>([])

  return (
    <FileInputContext.Provider value={{ id, files, onFilesSelected: setFiles }}>
      <div>{children}</div>
    </FileInputContext.Provider>
  )
}

export function useFileInput() {
  return useContext(FileInputContext)
}
```

### Control com onChange tipado

```typescript
'use client'

export function Control() {
  const { id, onFilesSelected } = useFileInput()

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) return

    const files = Array.from(event.target.files)
    onFilesSelected(files)
  }

  return <input type="file" id={id} onChange={handleFilesSelected} />
}
```

### Image preview com useMemo

```typescript
'use client'

export function ImagePreview() {
  const { files } = useFileInput()

  const previewURL = useMemo(() => {
    if (files.length === 0) return null
    return URL.createObjectURL(files[0])
  }, [files])

  if (!previewURL) {
    return <div className="h-16 w-16 rounded-full bg-zinc-100" />
  }

  return (
    <img
      src={previewURL}
      alt=""
      className="h-16 w-16 rounded-full object-cover"
    />
  )
}
```

## Example

**Before (IDs hardcoded, sem compartilhamento):**
```typescript
function FileInput() {
  const id = crypto.randomUUID() // muda a cada render
  return (
    <div>
      <label htmlFor={id}>Upload</label>
      <input type="file" id={id} />
      {/* ImagePreview não tem acesso ao arquivo */}
    </div>
  )
}
```

**After (Context + useId + useMemo):**
```typescript
<FileInput.Root>
  <FileInput.ImagePreview />
  <FileInput.Trigger />
  <FileInput.Control />
</FileInput.Root>
// Todos os filhos acessam id, files e onFilesSelected via Context
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de ID único estável entre renders | `useId()` |
| Precisa compartilhar estado entre partes de compound component | React Context no root |
| FileList retornada do input | `Array.from()` antes de armazenar |
| Computação derivada de estado (URL, preview) | `useMemo` com dependência explícita |
| Componente usa hooks no Next.js App Router | Adicionar `'use client'` |
| setState seria exposta no context | Criar wrapper com tipagem limpa |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const id = crypto.randomUUID()` dentro de componente | `const id = useId()` |
| `<Context.Provider value={{ setFiles }}>` | `<Context.Provider value={{ onFilesSelected: setFiles }}>` |
| `event.target.files` direto no estado | `Array.from(event.target.files)` |
| Preview URL recalculada a cada render | `useMemo(() => URL.createObjectURL(...), [files])` |
| Componente com useContext sem 'use client' no Next.js | Adicionar diretiva no topo do arquivo |
## Troubleshooting

### Classes Tailwind nao aplicam
**Symptom:** Classe adicionada mas sem efeito visual.
**Cause:** O arquivo nao esta incluido no `content` do tailwind.config, ou a classe esta sendo sobrescrita por especificidade.
**Fix:** Verifique que o path do arquivo esta em `content: ['./src/**/*.tsx']` no tailwind.config. Use DevTools para inspecionar se outra classe sobrescreve.

### Autocomplete do Tailwind nao funciona
**Symptom:** VS Code nao sugere classes Tailwind.
**Cause:** Extensao Tailwind CSS IntelliSense nao instalada ou configurada.
**Fix:** Instale a extensao "Tailwind CSS IntelliSense" no VS Code e recarregue a janela.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-context-e-preview-da-imagem/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-context-e-preview-da-imagem/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
