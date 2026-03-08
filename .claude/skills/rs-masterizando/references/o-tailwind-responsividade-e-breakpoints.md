---
name: rs-tailwind-responsividade-breakpoints
description: "Enforces Tailwind CSS Mobile First responsive patterns when writing responsive layouts. Use when user asks to 'make responsive', 'add breakpoints', 'mobile first', 'adapt for screen sizes', or any Tailwind responsive styling task. Applies rules: no-prefix means mobile, progressive enhancement sm/md/lg/xl/2xl, never desktop-first. Make sure to use this skill whenever generating Tailwind responsive code. Not for CSS media queries outside Tailwind, or non-responsive styling tasks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: responsividade
  tags: [tailwind, responsive, css-grid]
---

# Responsividade e Breakpoints no Tailwind

> Estilos sem prefixo sao para mobile; adicione prefixos de breakpoint apenas para telas maiores (Mobile First).

## Rules

1. **Sem prefixo = mobile** — `text-3xl` aplica em todas as telas comecando pelo mobile, porque o Tailwind e Mobile First por design
2. **Sempre progressivo** — va de menor para maior: sem prefixo → `sm:` → `md:` → `lg:` → `xl:` → `2xl:`, porque o inverso (desktop-first) quebra a logica do Tailwind
3. **Nunca faca desktop-first** — nao comece pelo tamanho grande e tente reduzir para mobile, porque voce tera que sobrescrever mais estilos e o codigo fica confuso
4. **Use apenas os breakpoints necessarios** — nao precisa usar todos (sm, md, lg, xl, 2xl) em cada elemento, porque a maioria das aplicacoes precisa de 2-3 breakpoints no maximo
5. **Breakpoint significa "daqui para cima"** — `lg:text-6xl` significa 1024px E ACIMA, nao exatamente 1024px, porque breakpoints sao min-width

## Breakpoints pre-configurados

| Prefixo | Min-width | Cenario tipico |
|---------|-----------|----------------|
| (nenhum) | 0px | Mobile |
| `sm:` | 640px | Mobile grande |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Notebook |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Monitor grande |

## How to write

### Texto responsivo (progressivo)

```html
<!-- Mobile: 3xl → Small: 5xl → Large: 6xl -->
<h1 class="text-3xl sm:text-5xl lg:text-6xl">
  Hello Tailwind
</h1>
```

### Layout responsivo

```html
<!-- Mobile: coluna unica → Medium: 2 colunas → Large: 3 colunas -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Visibilidade por breakpoint

```html
<!-- Sidebar visivel apenas em telas lg+ -->
<aside class="hidden lg:block w-64">
  Sidebar content
</aside>
```

## Example

**Before (desktop-first — ERRADO):**
```html
<h1 class="text-6xl sm:text-3xl">
  Titulo
</h1>
```

**After (mobile-first — CORRETO):**
```html
<h1 class="text-3xl sm:text-5xl lg:text-6xl">
  Titulo
</h1>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estilo vale para todas as telas | Sem prefixo |
| Precisa crescer em tela maior | Adicione `sm:`, `md:`, `lg:` progressivamente |
| Elemento so aparece em desktop | `hidden lg:block` |
| Elemento so aparece em mobile | `block lg:hidden` |
| Duvida sobre qual breakpoint | `md:` para tablet, `lg:` para desktop cobre 90% dos casos |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `text-6xl sm:text-3xl` (desktop-first) | `text-3xl sm:text-6xl` (mobile-first) |
| `sm:text-3xl md:text-3xl lg:text-3xl` (redundante) | `text-3xl` (sem prefixo ja cobre tudo) |
| `w-full sm:w-full md:w-full lg:w-1/2` (redundante) | `w-full lg:w-1/2` |
| Todos os 5 breakpoints em cada classe | 2-3 breakpoints no maximo |
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

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-responsividade-e-breakpoints/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-responsividade-e-breakpoints/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
