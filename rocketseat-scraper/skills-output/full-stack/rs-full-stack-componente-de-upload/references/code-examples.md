# Code Examples: Componente de Upload

## Exemplo 1: Componente completo conforme a aula

```tsx
import uploadSvg from '../assets/upload.svg'
import { ComponentProps } from 'react'

type UploadProps = ComponentProps<'input'> & {
  fileName?: string | null
}

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
          className="flex h-12 px-4 items-center bg-green-100 rounded-lg text-white cursor-pointer hover:bg-green-200 transition ease-linear disabled:opacity-50"
        >
          <img src={uploadSvg} alt="Ícone de upload" className="w-6 h-6" />
        </label>
      </div>
    </div>
  )
}
```

## Exemplo 2: Uso do componente em uma pagina

```tsx
import { Upload } from '../components/upload'

export function Refund() {
  return (
    <div>
      {/* outros campos do formulario */}
      <Upload fileName="rodrigo.png" />
    </div>
  )
}
```

## Exemplo 3: Sem filename (estado inicial)

```tsx
<Upload />
// Renderiza: "Selecione o arquivo" no span
```

## Exemplo 4: Com filename definido

```tsx
<Upload fileName="comprovante-2024.pdf" />
// Renderiza: "comprovante-2024.pdf" no span
```

## Exemplo 5: Com props nativas repassadas

```tsx
<Upload
  fileName={selectedFile?.name}
  accept="image/*,.pdf"
  onChange={(e) => {
    const file = e.target.files?.[0]
    setSelectedFile(file ?? null)
  }}
/>
```

## Exemplo 6: Upload desabilitado

```tsx
<Upload fileName={null} disabled />
// O label fica com opacity-50 e o input nao responde a cliques
```

## Variacao: Legend como prop

Se quiser tornar o titulo dinamico em vez de fixo:

```tsx
type UploadProps = ComponentProps<'input'> & {
  fileName?: string | null
  label?: string
}

export function Upload({ fileName = null, label = 'Comprovante', ...rest }: UploadProps) {
  return (
    <div>
      <legend className="uppercase text-xxs text-gray-200 mb-2">
        {label}
      </legend>
      {/* resto do componente */}
    </div>
  )
}
```

## Variacao: ID unico para multiplos uploads

Quando ha mais de um Upload na mesma pagina, o `id="upload"` fixo causa conflito. Use `useId`:

```tsx
import { useId } from 'react'

export function Upload({ fileName = null, ...rest }: UploadProps) {
  const inputId = useId()

  return (
    <div>
      <legend className="uppercase text-xxs text-gray-200 mb-2">
        Comprovante
      </legend>
      <div className="w-full h-12 flex items-center rounded-lg border border-gray-300 text-sm text-gray-100 bg-transparent outline-none">
        <input type="file" id={inputId} className="hidden" {...rest} />
        <span className="text-xs text-gray-100 flex-1 pl-4">
          {fileName ?? 'Selecione o arquivo'}
        </span>
        <label
          htmlFor={inputId}
          className="flex h-12 px-4 items-center bg-green-100 rounded-lg cursor-pointer hover:bg-green-200 transition ease-linear disabled:opacity-50"
        >
          <img src={uploadSvg} alt="Ícone de upload" className="w-6 h-6" />
        </label>
      </div>
    </div>
  )
}
```

## Anatomia das classes Tailwind utilizadas

| Elemento | Classes | Proposito |
|----------|---------|-----------|
| legend | `uppercase text-xxs text-gray-200 mb-2` | Rotulo pequeno e discreto acima do campo |
| div container | `w-full h-12 flex items-center rounded-lg border border-gray-300 text-sm text-gray-100 bg-transparent outline-none` | Container que imita visual dos outros inputs |
| input | `hidden` | Oculta input nativo completamente |
| span | `text-xs text-gray-100 flex-1 pl-4` | Exibe filename, ocupa espaco restante |
| label | `flex h-12 px-4 items-center bg-green-100 rounded-lg cursor-pointer hover:bg-green-200 transition ease-linear disabled:opacity-50` | Botao visual de upload |
| img | `w-6 h-6` | Icone de 24x24px |