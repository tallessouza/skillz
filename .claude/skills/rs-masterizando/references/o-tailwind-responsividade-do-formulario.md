---
name: rs-tailwind-responsividade-formulario
description: "Applies Tailwind CSS mobile-first responsive patterns when building form layouts. Use when user asks to 'make responsive', 'add breakpoints', 'mobile layout', 'responsive form', or 'tailwind responsive'. Enforces mobile-first with flex-col default flipping to lg:flex-row, grid only at lg breakpoint, and minimal breakpoint strategy (mobile + lg). Make sure to use this skill whenever creating or adjusting responsive layouts with Tailwind CSS. Not for CSS-in-JS, media queries in plain CSS, or non-Tailwind responsive design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: responsividade
  tags: [tailwind, react, responsive, css-grid, flexbox, forms]
---

# Responsividade de Formularios com Tailwind

> Defina o layout mobile como padrao (flex-col) e adicione breakpoints apenas no lg para desktop.

## Rules

1. **Mobile-first sempre** — use `flex flex-col` como padrao e `lg:flex-row` para desktop, porque o Tailwind e mobile-first e o layout mobile e o caso base
2. **Grid apenas no desktop** — substitua `grid grid-cols-form` por `flex flex-col` no mobile e `lg:grid lg:grid-cols-form` no desktop, porque grids complexos quebram em telas pequenas
3. **Minimo de breakpoints** — use apenas mobile e `lg:` (dois breakpoints), porque mais breakpoints aumentam complexidade de manutencao sem beneficio real na maioria dos casos
4. **Items stretch no mobile, items-start no desktop** — use `lg:items-start` quando o alinhamento padrao (stretch) funciona melhor no mobile, porque inputs devem ocupar largura total no celular
5. **Gap funciona em ambos** — mantenha `gap-*` sem prefixo de breakpoint quando o espacamento serve para mobile e desktop igualmente
6. **Labels ocultas com sr-only** — adicione labels extras para acessibilidade com `sr-only` no desktop e visiveis no mobile via wrapper condicional

## How to write

### Header com botoes que empilham no mobile

```tsx
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
  <div>
    <h1>Settings</h1>
    <p>Manage your account</p>
  </div>
  <div className="flex gap-2">
    <button>Cancel</button>
    <button>Save</button>
  </div>
</div>
```

### Form section que colapsa no mobile

```tsx
<div className="flex flex-col gap-3 lg:grid lg:grid-cols-form">
  <label htmlFor="firstName">First name</label>
  <input id="firstName" />
</div>
```

### Label visivel apenas no mobile (acessibilidade)

```tsx
<div className="flex flex-col gap-3 lg:block">
  <label htmlFor="lastName" className="lg:sr-only">Last name</label>
  <input id="lastName" />
</div>
```

## Example

**Before (quebrado no mobile):**
```tsx
<div className="grid grid-cols-form gap-3 items-start">
  <label>Email</label>
  <input />
</div>
```

**After (responsivo):**
```tsx
<div className="flex flex-col gap-3 lg:grid lg:grid-cols-form lg:items-start">
  <label>Email</label>
  <input />
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Layout lado-a-lado no desktop | `flex flex-col` + `lg:flex-row` |
| Grid de formulario | `flex flex-col` + `lg:grid lg:grid-cols-form` |
| Botoes de acao no header | Empilhar no mobile com `flex-col`, lado a lado no `lg:` |
| Label que so faz sentido no desktop | Wrapper com `flex flex-col gap-3 lg:block` + `lg:sr-only` |
| Duvida sobre breakpoint intermediario (md) | Nao adicione — mobile + lg cobre 95% dos casos |
| Textarea/biografia com controles | Mesmo padrao: `flex flex-col` + `lg:grid` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `grid grid-cols-form` (sem breakpoint) | `flex flex-col lg:grid lg:grid-cols-form` |
| `flex-row` como padrao em forms | `flex-col` (mobile) + `lg:flex-row` |
| `hidden` para labels de acessibilidade | `sr-only` ou `lg:sr-only` |
| `md:` + `lg:` + `xl:` em tudo | Apenas `lg:` na maioria dos casos |
| `items-center` fixo em form rows | `lg:items-center` (stretch no mobile) |
## Troubleshooting

### Layout quebrando no mobile
**Symptom:** Elementos ficam fora da tela ou empilhados de forma inesperada no mobile.
**Cause:** Grid com colunas fixas nao se adapta a telas pequenas sem breakpoints.
**Fix:** Use `flex flex-col` como base mobile e `lg:grid lg:grid-cols-*` apenas no desktop.

### Espacamento inconsistente entre secoes
**Symptom:** Alguns elementos tem mais espaco que outros apesar de usar o mesmo gap.
**Cause:** Mistura de `space-y` e `gap` no mesmo container, ou margins conflitando.
**Fix:** Escolha `gap` (com flex/grid) ou `space-y` (com flow layout), nunca ambos no mesmo container.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-responsividade-do-formulario/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-responsividade-do-formulario/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
