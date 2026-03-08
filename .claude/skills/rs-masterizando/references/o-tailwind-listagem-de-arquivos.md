---
name: rs-tailwind-listagem-de-arquivos
description: "Applies Tailwind CSS patterns for building file upload list components with progress indicators. Use when user asks to 'create a file list', 'build upload UI', 'show uploaded files', 'file upload component', or 'progress bar with Tailwind'. Enforces icon badge styling, progress bar structure, and file metadata display patterns. Make sure to use this skill whenever building file upload interfaces or file listing UIs with Tailwind CSS. Not for drag-and-drop logic, actual upload APIs, or server-side file handling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: tailwind-css
  tags: [tailwind, react, flexbox]
---

# Listagem de Arquivos com Tailwind CSS

> Construa listas de arquivos enviados usando composicao de componentes, badges de icone, barras de progresso e formatacao de tamanho.

## Rules

1. **Use composicao de componentes** — `FileList` e um componente separado dentro de `FileInput`, re-exportado via index, porque mantem cada peca focada e reutilizavel
2. **Use `group` no container do item** — permite hover states coordenados entre icone, texto e botao de deletar
3. **Icones em badge circular** — `rounded-full border-4 border-{color}-100 bg-{color}-200 p-2 text-{color}-600`, porque cria hierarquia visual clara
4. **Barra de progresso com duas divs** — div externa (`h-2 flex-1 rounded-full bg-zinc-100`) e div interna (`h-2 rounded-full bg-violet-600 w-[80%]`), porque e o padrao mais flexivel com Tailwind
5. **Formate bytes com funcao utilitaria** — crie `formatBytes()` em `utils/`, nunca exiba bytes crus ao usuario
6. **Suporte multiple corretamente** — quando `multiple`, concatene arquivos novos com existentes; quando nao, sobrescreva

## How to write

### Container da lista

```tsx
<div className="mt-4 flex flex-col gap-3">
  {files.map(file => (
    <FileItem key={file.name} file={file} />
  ))}
</div>
```

### Item de arquivo completo

```tsx
<div className="group flex items-start gap-4 rounded-lg border border-zinc-200 px-4 py-3">
  {/* Badge do icone */}
  <div className="rounded-full border-4 border-violet-100 bg-violet-200 p-2 text-violet-600">
    <UploadCloud className="h-4 w-4" />
  </div>

  {/* Info + progresso */}
  <div className="flex flex-1 flex-col items-start gap-1">
    <div className="flex flex-col">
      <span className="text-sm font-medium text-zinc-700">{file.name}</span>
      <span className="text-sm text-zinc-500">{formatBytes(file.size)}</span>
    </div>

    {/* Barra de progresso */}
    <div className="flex w-full items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-zinc-100">
        <div className="h-2 rounded-full bg-violet-600" style={{ width: '80%' }} />
      </div>
      <span className="text-sm font-medium text-zinc-700">80%</span>
    </div>
  </div>

  {/* Botao deletar */}
  <button type="button" className="ml-auto rounded-md p-2 hover:bg-zinc-50">
    <Trash2 className="h-5 w-5 text-zinc-500" />
  </button>
</div>
```

### Funcao formatBytes

```typescript
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let value = bytes

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`
}
```

## Example

**Before (sem estrutura):**
```tsx
{files.map(f => <p>{f.name} - {f.size} bytes</p>)}
```

**After (com esta skill):**
```tsx
{files.map(file => (
  <div key={file.name} className="group flex items-start gap-4 rounded-lg border border-zinc-200 px-4 py-3">
    <div className="rounded-full border-4 border-violet-100 bg-violet-200 p-2 text-violet-600">
      <UploadCloud className="h-4 w-4" />
    </div>
    <div className="flex flex-1 flex-col items-start gap-1">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-700">{file.name}</span>
        <span className="text-sm text-zinc-500">{formatBytes(file.size)}</span>
      </div>
      <div className="flex w-full items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-zinc-100">
          <div className="h-2 rounded-full bg-violet-600" style={{ width: '80%' }} />
        </div>
        <span className="text-sm font-medium text-zinc-700">80%</span>
      </div>
    </div>
    <button type="button" className="ml-auto rounded-md p-2 hover:bg-zinc-50">
      <Trash2 className="h-5 w-5 text-zinc-500" />
    </button>
  </div>
))}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Icone precisa de destaque visual | Badge circular: `rounded-full border-4 border-{cor}-100 bg-{cor}-200 p-2` |
| Barra de progresso | Duas divs aninhadas, externa com `bg-zinc-100`, interna com `bg-violet-600` |
| Tamanho de arquivo | Sempre use `formatBytes()`, nunca exiba bytes crus |
| `items-start` vs `items-center` | Use `items-start` quando icone deve alinhar ao topo |
| Multiple file upload | Concatene com spread: `setFiles(prev => [...prev, ...newFiles])` |
| Single file upload | Sobrescreva: `setFiles(newFiles)` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `{file.size} bytes` | `{formatBytes(file.size)}` |
| `<div className="bg-violet-600 h-2" style={{width:'80%'}}>` sem container | Div externa `bg-zinc-100 rounded-full` + div interna `bg-violet-600` |
| `items-center` para lista com icone e texto multi-linha | `items-start` para alinhar ao topo |
| `setFiles(newFiles)` sempre | Checar `multiple` para decidir concatenar ou sobrescrever |
| Icone solto sem badge | Sempre envolva em div com `rounded-full border-4 p-2` |
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

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-listagem-de-arquivos/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-listagem-de-arquivos/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
