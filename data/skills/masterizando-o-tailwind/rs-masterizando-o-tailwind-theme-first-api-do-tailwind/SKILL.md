---
name: rs-masterizando-tailwind-theme-first-api
description: "Enforces Tailwind CSS Theme First API patterns when writing utility classes for spacing, colors, typography, and layout. Use when user asks to 'style a component', 'add padding', 'set font size', 'pick a color', 'create a layout', or any Tailwind CSS task. Applies spacing multiplication rule (value x 4 = pixels), default color palette usage, and consistent typography scales. Make sure to use this skill whenever generating Tailwind CSS classes, even for simple styling tasks. Not for custom CSS, CSS-in-JS, or non-Tailwind styling approaches."
---

# Theme First API do Tailwind

> Ao escrever classes Tailwind, use sempre os padroes pre-definidos do tema — nunca valores arbitrarios — porque consistencia visual vem de restricoes, nao de escolhas individuais.

## Rules

1. **Use a escala de espacamento padrao** — `p-4` nao `p-[17px]`, porque o Tailwind segue multiplos de 2, 4 e 8 pixels que garantem consistencia visual entre paginas
2. **Calcule espacamento multiplicando por 4** — `p-6` = 24px, `m-10` = 40px, porque cada unidade Tailwind equivale a 0.25rem (4px)
3. **Use cores da paleta padrao** — `bg-red-500` nao `bg-[#e53e3e]`, porque a paleta respeita logica de contraste e luminosidade feita por especialistas em design
4. **Use a escala de tipografia** — `text-lg` nao `text-[19px]`, porque tamanhos pre-definidos evitam inconsistencia entre paginas
5. **Defina padroes no inicio do projeto** — fontes, cores, espacamentos, arredondamentos, sombras e animacoes, porque Theme First significa tema antes de codigo
6. **Converta pixels do Figma dividindo por 4** — designer diz 24px, voce escreve `p-6`, porque 24 / 4 = 6

## How to write

### Espacamento (padding, margin, width, height, gap)

```html
<!-- Regra: valor Tailwind × 4 = pixels -->
<div class="p-4">16px de padding</div>
<div class="m-6">24px de margem</div>
<div class="gap-8">32px de gap</div>
<div class="w-10">40px de largura</div>
```

### Cores da paleta

```html
<!-- Use tons numerados: 50 (claro) a 950 (escuro) -->
<button class="bg-red-500 hover:bg-red-600">Deletar</button>
<div class="bg-zinc-900 text-zinc-100">Dark background</div>
<span class="text-emerald-500">Sucesso</span>
```

### Tipografia

```html
<!-- Use a escala semantica, nao valores arbitrarios -->
<h1 class="text-4xl font-bold">Titulo principal</h1>
<h2 class="text-2xl font-semibold">Subtitulo</h2>
<p class="text-base">Texto corpo</p>
<small class="text-sm text-zinc-400">Texto secundario</small>
```

## Example

**Before (valores arbitrarios, inconsistente):**

```html
<div class="p-[13px] m-[7px] text-[19px] bg-[#3b82f6]">
  <h1 class="text-[32px]">Titulo</h1>
  <p class="mt-[11px] text-[14px]">Conteudo</p>
</div>
```

**After (Theme First API aplicada):**

```html
<div class="p-3 m-2 text-lg bg-blue-500">
  <h1 class="text-3xl">Titulo</h1>
  <p class="mt-3 text-sm">Conteudo</p>
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Designer deu valor em pixels | Divida por 4 para obter a classe Tailwind |
| Precisa de um vermelho para erro | Use `red-500` para o tom padrao, `red-600` para hover |
| Espacamento menor que 16px | Suba de 2 em 2px (classes 0.5, 1, 1.5, 2, 3, 4) |
| Espacamento entre 16px e 48px | Suba de 4 em 4px (classes 4, 5, 6, 7, ..., 12) |
| Espacamento acima de 48px | Suba de 8 em 8px (classes 14, 16, 20, 24, ...) |
| Time sem designer | Use paleta e escala padrao do Tailwind como design system |
| Time com designer | Adicione cores e tokens customizados no tema, mantenha a escala |

## Anti-patterns

| Nunca escreva | Escreva em vez |
|---------------|----------------|
| `p-[17px]` | `p-4` (16px) ou `p-5` (20px) |
| `bg-[#ef4444]` | `bg-red-500` |
| `text-[20px]` | `text-xl` |
| `text-[32px] font-[700]` | `text-3xl font-bold` |
| `w-[100px]` | `w-24` (96px) ou `w-28` (112px) |
| `mt-[7px]` | `mt-2` (8px) — snap para o multiplo mais proximo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
