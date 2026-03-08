---
name: rs-tailwind-tema-dark-sidebar
description: "Applies Tailwind CSS dark theme patterns when styling components with dark mode support. Use when user asks to 'add dark mode', 'create dark theme', 'style for dark mode', 'add dark: prefix', or any Tailwind dark variant work. Enforces systematic dark theme application: background hierarchy, border contrast, text readability, hover states, and focus rings with opacity. Make sure to use this skill whenever generating Tailwind CSS that needs dark mode variants. Not for light-only styling, CSS-in-JS theming, or non-Tailwind dark mode implementations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: dark-mode
  tags: [tailwind, react, dark-mode, flexbox]
---

# Tema Dark com Tailwind CSS

> Aplique variantes dark: sistematicamente, seguindo hierarquia de contraste e agrupando classes por estado.

## Rules

1. **Prefixe com `dark:`** — toda classe de cor precisa de uma variante dark correspondente, porque o Tailwind usa `prefers-color-scheme` por padrao
2. **Siga hierarquia de cinzas** — backgrounds: zinc-900 (base) > zinc-800 (elevado) > zinc-700 (bordas), porque cria profundidade visual sem cores arbitrarias
3. **Agrupe classes por estado** — separe classes base, focus/hover e dark em linhas distintas usando `twMerge`, porque facilita leitura e manutencao
4. **Texto segue contraste inverso** — titulos: zinc-100, secundario: zinc-400, terciario: zinc-600, porque garante legibilidade em fundo escuro
5. **Hover no dark clareia** — ao inves de escurecer como no light, use tons mais claros no hover, porque o comportamento de destaque e inverso
6. **Focus rings com opacidade** — use `dark:focus-within:ring-{color}/10` para rings sutis, porque rings solidos ficam agressivos em fundo escuro

## How to write

### Container base com dark

```tsx
<aside className="border-r border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
  {children}
</aside>
```

### Input com twMerge e dark agrupado

```tsx
import { twMerge } from 'tailwind-merge'

<input className={twMerge(
  'border border-zinc-300 bg-transparent text-zinc-900 placeholder-zinc-600',
  'focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100',
  'dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400',
  'dark:focus-within:border-violet-500 dark:focus-within:ring-violet-500/10',
  props.className,
)} />
```

### Nav item com hover invertido

```tsx
<a className={twMerge(
  'flex items-center gap-3 rounded px-3 py-2 text-zinc-700 hover:bg-zinc-100',
  'dark:text-zinc-100 dark:hover:bg-zinc-800',
  'group-hover:text-violet-500 dark:group-hover:text-violet-300',
)}>
```

## Example

**Before (light only):**
```tsx
<div className="bg-white border-r border-zinc-200">
  <h2 className="text-zinc-900">Title</h2>
  <p className="text-zinc-600">Subtitle</p>
  <button className="hover:bg-zinc-50 text-zinc-500">Action</button>
</div>
```

**After (with dark theme):**
```tsx
<div className="bg-white border-r border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
  <h2 className="text-zinc-900 dark:text-zinc-100">Title</h2>
  <p className="text-zinc-600 dark:text-zinc-400">Subtitle</p>
  <button className="hover:bg-zinc-50 text-zinc-500 dark:hover:bg-zinc-800 dark:text-zinc-400">
    Action
  </button>
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Background principal (page/sidebar) | `dark:bg-zinc-900` |
| Background elevado (card/widget/input) | `dark:bg-zinc-800` |
| Bordas | `dark:border-zinc-700` ou `dark:border-zinc-800` |
| Texto principal | `dark:text-zinc-100` |
| Texto secundario | `dark:text-zinc-400` |
| Icones | `dark:text-zinc-600` |
| Accent color no dark | Use tom mais claro (violet-300 ao inves de violet-500) |
| Hover no dark | Clareia (`dark:hover:bg-zinc-800`, `dark:hover:text-zinc-100`) |
| Focus ring no dark | Adicione opacidade (`dark:ring-violet-500/10`) |
| Classe ficou longa demais | Use `twMerge()` com linhas separadas por estado |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Classes dark misturadas com base | Agrupe dark em linha separada via `twMerge` |
| `dark:hover:bg-zinc-900` (escurecer no dark) | `dark:hover:bg-zinc-800` (clarear no dark) |
| `dark:ring-violet-500` (ring solido) | `dark:ring-violet-500/10` (ring com opacidade) |
| `dark:text-zinc-900` (texto escuro em fundo escuro) | `dark:text-zinc-100` (texto claro) |
| Mesma accent color no light e dark | Clarear accent no dark (violet-500 → violet-300) |
| Ignorar placeholder no dark | `dark:placeholder-zinc-400` sempre |
## Troubleshooting

### Dark mode nao ativa
**Symptom:** Classes `dark:` nao tem efeito mesmo com tema escuro no SO.
**Cause:** Se `darkMode: 'class'` esta configurado, o Tailwind ignora `prefers-color-scheme` e espera a classe `dark` no `<html>`.
**Fix:** Se quer resposta automatica ao SO, use `darkMode: 'media'` (padrao). Se quer toggle manual, adicione classe `dark` no `<html>`.

### Contraste insuficiente no dark mode
**Symptom:** Texto dificil de ler em fundo escuro.
**Cause:** Texto claro demais (`dark:text-zinc-600`) ou fundo muito proximo do texto.
**Fix:** Use `dark:text-zinc-100` para texto primario e `dark:text-zinc-400` para secundario em fundo `dark:bg-zinc-900`.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-tema-dark-da-sidebar/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-tema-dark-da-sidebar/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
