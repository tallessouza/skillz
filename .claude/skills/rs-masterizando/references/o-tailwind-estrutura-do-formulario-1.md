---
name: rs-tailwind-estrutura-formulario
description: "Applies Tailwind CSS form structure patterns when building settings pages, admin panels, or form layouts. Use when user asks to 'create a form', 'build a settings page', 'structure a form layout', or 'add form header with buttons'. Enforces flex layout hierarchy, HTML form attribute for detached submit buttons, consistent border patterns, and button styling separation. Make sure to use this skill whenever creating form-based layouts with Tailwind. Not for form validation, state management, or form libraries like React Hook Form."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: layout
  tags: [tailwind, react, flexbox, forms]
---

# Estrutura de Formulario com Tailwind

> Estruture formularios separando cabecalho (titulo + botoes) do conteudo, usando flex layout hierarquico e o atributo HTML `form` para conectar botoes ao formulario sem aninhamento.

## Rules

1. **Separe cabecalho e formulario com uma div wrapper** — use `mt-6 flex flex-col` na div externa, porque cabecalho (titulo + botoes) e form sao blocos independentes que precisam de separacao visual
2. **Use o atributo HTML `form` no botao submit** — `<button type="submit" form="settings">` conecta o botao ao form sem precisar aninhar, porque isso permite layouts flexiveis onde o botao fica no cabecalho e o form embaixo
3. **Compartilhe classes base entre botoes, diferencie com variantes** — classes estruturais (`rounded-lg px-4 py-2 text-sm font-semibold shadow-sm`) sao identicas, apenas cor/borda mudam, porque reduz repeticao e prepara para componentizacao futura
4. **Form HTML nao ocupa largura total por padrao** — sempre adicione `w-full` no elemento `<form>`, porque diferente de divs, forms nao tem display block implicito
5. **Reutilize padroes de borda** — se voce ja tem `border-b border-zinc-200` em tabs, use a mesma combinacao no cabecalho do form, porque consistencia visual vem de repetir os mesmos tokens
6. **Use padding-bottom antes de bordas** — `pb-5` antes de `border-b` evita que o conteudo fique colado na borda

## How to write

### Layout hierarquico do formulario

```tsx
{/* Wrapper externo: separa cabecalho do form */}
<div className="mt-6 flex flex-col">
  {/* Cabecalho: titulo a esquerda, botoes a direita */}
  <div className="flex items-center justify-between border-b border-zinc-200 pb-5">
    <div className="space-y-1">
      <h2 className="text-lg font-medium text-zinc-900">Personal info</h2>
      <span className="text-sm text-zinc-500">
        Update your photo and personal details here.
      </span>
    </div>
    <div className="flex items-center gap-2">
      <button type="button" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
        Cancel
      </button>
      <button type="submit" form="settings" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700">
        Save
      </button>
    </div>
  </div>

  {/* Formulario separado, conectado via id */}
  <form id="settings" className="mt-6 flex w-full flex-col">
    {/* Campos do formulario aqui */}
  </form>
</div>
```

## Example

**Before (botao aninhado no form):**
```tsx
<form>
  <div className="flex justify-between">
    <h2>Settings</h2>
    <button type="submit">Save</button>
  </div>
  {/* campos */}
</form>
```

**After (botao conectado via atributo form):**
```tsx
<div className="mt-6 flex flex-col">
  <div className="flex items-center justify-between border-b border-zinc-200 pb-5">
    <h2 className="text-lg font-medium text-zinc-900">Settings</h2>
    <button type="submit" form="settings" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700">
      Save
    </button>
  </div>
  <form id="settings" className="mt-6 flex w-full flex-col">
    {/* campos */}
  </form>
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Botao submit fora do form | Use atributo `form="id-do-form"` — HTML puro, sem JS |
| Botoes com estilos parecidos | Extraia classes base compartilhadas, varie apenas cor/borda |
| Form nao ocupa largura total | Adicione `w-full` ao elemento form |
| Borda entre secoes | Reutilize o mesmo token `border-b border-zinc-200` do projeto |
| Conteudo colado na borda | Adicione `pb-5` (ou similar) antes da borda |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<form>` wrapping header + fields to keep submit inside | `<button form="id">` with separate `<form id="id">` |
| `<form>` without width class | `<form className="w-full">` |
| Bordas com cores diferentes entre secoes | Mesma combinacao `border-zinc-200` em todo o layout |
| Conteudo direto antes de `border-b` sem padding | `pb-5 border-b border-zinc-200` |
## Troubleshooting

### Input nao ocupa largura total
**Symptom:** Input aparece com largura menor que o container.
**Cause:** Input HTML tem largura intrinseca menor que o container.
**Fix:** Adicione `w-full` no input ou `flex-1` se estiver dentro de flex container.

### Estilos do input aparecem duplicados
**Symptom:** Borda dupla ou sombra duplicada no input com wrapper.
**Cause:** Tanto o wrapper quanto o input tem estilos de borda.
**Fix:** Estilize apenas o wrapper (div fake input) e use `border-0 bg-transparent p-0 outline-none` no input real.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-estrutura-do-formulario-1/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-estrutura-do-formulario-1/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
