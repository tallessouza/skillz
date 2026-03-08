---
name: rs-full-stack-componente-de-upload
description: "Enforces React file upload component patterns with Tailwind CSS styling when building custom upload inputs, file selectors, or drag-and-drop areas. Use when user asks to 'create upload component', 'build file input', 'style file picker', 'custom file selector', or 'hide native input'. Applies hidden native input with label trigger, conditional filename display, cursor-pointer on label, and hover/disabled states. Make sure to use this skill whenever implementing file upload UI in React with Tailwind. Not for drag-and-drop upload logic, server-side file handling, or multipart form submission."
---

# Componente de Upload com React e Tailwind CSS

> Oculte o input nativo de arquivo e use um label como gatilho visual, mantendo acessibilidade e feedback de estado.

## Rules

1. **Oculte o input nativo com `hidden`** — o texto padrão do input ("Escolher arquivo") varia por idioma do navegador e quebra o design, porque nao ha como estilizar o texto interno do input file
2. **Conecte label ao input via `htmlFor` + `id`** — isso permite que o clique no label abra o seletor de arquivos, porque e o mecanismo nativo do HTML para inputs ocultos
3. **Exiba o filename condicionalmente** — mostre o nome do arquivo quando selecionado, ou um placeholder como "Selecione o arquivo", porque o usuario precisa de feedback visual
4. **Use `cursor-pointer` no label** — indica interatividade ao usuario, porque sem ele o label parece texto estatico
5. **Estenda de `ComponentProps<'input'>`** — permite repassar props nativas como `accept`, `disabled`, `onChange` via rest spread, porque o componente deve ser tao flexivel quanto um input nativo
6. **Adicione estados `disabled` e `hover`** — use `disabled:opacity-50` e `hover:bg-{color}` com transicao, porque estados visuais comunicam disponibilidade

## How to write

### Tipagem do componente

```tsx
import { ComponentProps } from 'react'

type UploadProps = ComponentProps<'input'> & {
  fileName?: string | null
}
```

### Estrutura com input oculto e label trigger

```tsx
export function Upload({ fileName = null, ...rest }: UploadProps) {
  return (
    <div>
      <legend className="uppercase text-xxs text-gray-200 mb-2">
        Comprovante
      </legend>

      <div className="w-full h-12 flex items-center rounded-lg border border-gray-300 text-sm text-gray-100 bg-transparent outline-none">
        <input type="file" id="upload" className="hidden" {...rest} />

        <span className="text-xs text-gray-100 flex-1 pl-4">
          {fileName ?? 'Selecione o arquivo'}
        </span>

        <label
          htmlFor="upload"
          className="flex h-12 px-4 items-center bg-green-100 rounded-lg cursor-pointer hover:bg-green-200 transition ease-linear disabled:opacity-50"
        >
          <img src={uploadSvg} alt="Ícone de upload" className="w-6 h-6" />
        </label>
      </div>
    </div>
  )
}
```

## Example

**Before (input file nativo exposto):**
```tsx
function Upload() {
  return <input type="file" />
}
```

**After (com esta skill aplicada):**
```tsx
function Upload({ fileName = null, ...rest }: UploadProps) {
  return (
    <div>
      <legend className="uppercase text-xxs text-gray-200 mb-2">
        Comprovante
      </legend>
      <div className="w-full h-12 flex items-center rounded-lg border border-gray-300 text-sm text-gray-100 bg-transparent outline-none">
        <input type="file" id="upload" className="hidden" {...rest} />
        <span className="text-xs text-gray-100 flex-1 pl-4">
          {fileName ?? 'Selecione o arquivo'}
        </span>
        <label
          htmlFor="upload"
          className="flex h-12 px-4 items-center bg-green-100 rounded-lg cursor-pointer hover:bg-green-200 transition ease-linear"
        >
          <img src={uploadSvg} alt="Ícone de upload" className="w-6 h-6" />
        </label>
      </div>
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Input file precisa de visual customizado | Oculte com `hidden`, use label como trigger |
| Filename pode ser nulo inicialmente | Use `fileName ?? 'Selecione o arquivo'` com nullish coalescing |
| Componente precisa aceitar props extras | Estenda `ComponentProps<'input'>` e use rest spread |
| Botao de upload precisa de feedback hover | `hover:bg-{color}` + `transition ease-linear` |
| Upload pode estar desabilitado | `disabled:opacity-50` no label |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `<input type="file" />` exposto | `<input type="file" className="hidden" />` + label |
| `onClick={() => inputRef.current.click()}` | `<label htmlFor="upload">` (mecanismo nativo) |
| `{fileName ? fileName : 'Selecione'}` | `{fileName ?? 'Selecione o arquivo'}` (nullish coalescing) |
| Props hardcoded no input | `ComponentProps<'input'>` + rest spread |
| Label sem `cursor-pointer` | Sempre adicione `cursor-pointer` em labels clicaveis |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a tecnica de ocultar input nativo e usar label
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes