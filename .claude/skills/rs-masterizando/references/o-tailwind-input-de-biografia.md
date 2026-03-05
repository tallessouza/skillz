---
name: rs-tailwind-input-de-biografia
description: "Applies Tailwind CSS textarea and toolbar patterns when building form bio sections, rich text editor UIs, or textarea components. Use when user asks to 'create a textarea', 'build a bio input', 'add a text editor toolbar', 'style a textarea with Tailwind', or 'create toolbar buttons'. Covers resize control, arbitrary min-height values, select defaults, icon button toolbars, and textarea component extraction. Make sure to use this skill whenever building form sections with textarea or editor-like UIs in Tailwind. Not for actual rich text editor functionality, TipTap integration, or non-Tailwind styling."
---

# Input de Biografia — Textarea com Toolbar

> Construa seções de bio com textarea estilizada, toolbar de ícones e select de modo, usando Tailwind para manter consistência visual com inputs existentes.

## Rules

1. **Reutilize classes dos inputs existentes na textarea** — `rounded-lg border border-zinc-300 px-3 py-2 shadow-sm`, porque textarea deve parecer visualmente parte do mesmo formulário
2. **Use `resize-y` para textareas** — permite redimensionamento apenas vertical, porque resize livre quebra layouts horizontais
3. **Use valores arbitrários para `min-h` quando necessário** — `min-h-[120px]` é aceitável quando os valores predefinidos (`min-h-fit`, `min-h-max`) não atendem, porque textarea precisa de altura mínima específica
4. **Passe `defaultValue` no Select para evitar placeholder desnecessário** — quando há uma opção padrão óbvia, selecione-a ao invés de mostrar placeholder vazio
5. **Ícones de toolbar: `h-4 w-4` com `strokeWidth` aumentado** — ícones Lucide padrão ficam finos demais em toolbars compactas, `strokeWidth={1}` ou maior dá peso visual adequado
6. **Extraia textarea como componente quando reutilizável** — use `ComponentProps<'textarea'>` para manter todas as props nativas, fixando apenas as classes visuais

## How to write

### Toolbar de ícones com select de modo

```tsx
<div className="grid grid-cols-2 gap-3">
  <Select defaultValue="normal">
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent className="shadow-sm">
      <SelectItem value="normal">Normal Text</SelectItem>
      <SelectItem value="md">Markdown</SelectItem>
    </SelectContent>
  </Select>

  <div className="flex items-center gap-1">
    <button type="button" className="rounded-md p-2 hover:bg-zinc-50">
      <Bold className="h-4 w-4 text-zinc-500" strokeWidth={3} />
    </button>
    <button type="button" className="rounded-md p-2 hover:bg-zinc-50">
      <Italic className="h-4 w-4 text-zinc-500" strokeWidth={3} />
    </button>
    <button type="button" className="rounded-md p-2 hover:bg-zinc-50">
      <Link className="h-4 w-4 text-zinc-500" strokeWidth={3} />
    </button>
    <button type="button" className="rounded-md p-2 hover:bg-zinc-50">
      <List className="h-4 w-4 text-zinc-500" strokeWidth={3} />
    </button>
    <button type="button" className="rounded-md p-2 hover:bg-zinc-50">
      <ListOrdered className="h-4 w-4 text-zinc-500" strokeWidth={3} />
    </button>
  </div>
</div>
```

### Textarea estilizada

```tsx
<textarea
  id="bio"
  defaultValue="I'm a product designer based in Melbourne"
  className="min-h-[120px] w-full resize-y rounded-lg border border-zinc-300 px-3 py-2 shadow-sm"
/>
```

### Componente Textarea extraído

```tsx
import { ComponentProps } from 'react'

type TextareaProps = ComponentProps<'textarea'>

export function Textarea(props: TextareaProps) {
  return (
    <textarea
      className="min-h-[120px] w-full resize-y rounded-lg border border-zinc-300 px-3 py-2 shadow-sm"
      {...props}
    />
  )
}
```

## Example

**Before (textarea sem consistência):**
```tsx
<textarea id="bio" className="border p-2" rows={5} />
```

**After (com this skill applied):**
```tsx
<div className="space-y-3">
  <div className="grid grid-cols-2 gap-3">
    <Select defaultValue="normal">
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent className="shadow-sm">
        <SelectItem value="normal">Normal Text</SelectItem>
        <SelectItem value="md">Markdown</SelectItem>
      </SelectContent>
    </Select>
    <div className="flex items-center gap-1">
      <button type="button" className="rounded-md p-2 hover:bg-zinc-50">
        <Bold className="h-4 w-4 text-zinc-500" strokeWidth={3} />
      </button>
      {/* ... mais botões */}
    </div>
  </div>
  <Textarea id="bio" defaultValue="I'm a product designer based in Melbourne" />
</div>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Textarea em formulário com inputs existentes | Copie as mesmas classes visuais dos inputs |
| Precisa de altura mínima específica | Use valor arbitrário `min-h-[Xpx]` |
| Select tem opção padrão óbvia | Use `defaultValue` ao invés de placeholder |
| Ícones parecem finos em toolbar | Aumente `strokeWidth` do Lucide |
| Textarea usada em mais de um lugar | Extraia componente com `ComponentProps<'textarea'>` |
| Dropdown sobrepõe conteúdo | Adicione `shadow-sm` no `SelectContent` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `resize` (resize livre) | `resize-y` (apenas vertical) |
| `<textarea rows={5}>` sem classes | `<textarea className="min-h-[120px] resize-y ...">` |
| `min-h-screen` em textarea | `min-h-[120px]` (valor adequado) |
| Placeholder no Select quando há default | `defaultValue="normal"` |
| Ícones `h-6 w-6` em toolbar compacta | `h-4 w-4` com `strokeWidth` maior |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-input-de-biografia/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-input-de-biografia/references/code-examples.md)
