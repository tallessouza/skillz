---
name: rs-tailwind-criando-efeitos-de-foco
description: "Applies correct focus styling patterns when writing Tailwind CSS for interactive elements. Use when user asks to 'style focus states', 'add focus ring', 'fix outline on inputs', 'accessible focus', 'keyboard navigation styling', or any Tailwind form/input styling task. Enforces focus-within for parent containers, focus-visible for clickable elements, group-focus for child styling, and ring utilities over raw outlines. Make sure to use this skill whenever styling focus states in Tailwind. Not for hover effects, animations, or non-Tailwind CSS."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: interatividade
  tags: [tailwind, flexbox]
---

# Efeitos de Foco no Tailwind

> Remova o outline padrao e substitua por focus rings estilizados, usando o seletor correto para cada situacao: `focus-within` para pais, `focus-visible` para botoes, `group-focus-visible` para filhos.

## Rules

1. **Sempre remova o outline padrao primeiro** — `outline-none` no elemento focavel, porque o outline padrao do browser e inconsistente e feio
2. **Use `focus-within` quando o foco esta num filho mas o estilo vai no pai** — uma div wrapper nao recebe foco, mas `focus-within` detecta foco em qualquer filho, porque e um seletor CSS nativo que borbulha
3. **Use `focus` direto quando o elemento focavel E o elemento estilizado** — textareas, selects sem wrapper, porque nao ha necessidade de borbulhar
4. **Use `focus-visible` em vez de `focus` para botoes e tabs** — `focus-visible` so ativa na navegacao por teclado, porque cliques em botoes nao precisam de destaque visual (o hover ja cobre)
5. **Use `group` + `group-focus-visible` para estilizar filhos de elementos focaveis** — quando o estilo vai num span dentro de um button, porque o foco esta no pai mas o ring vai no filho
6. **Combine `ring` + `border` para efeito de foco profissional** — `ring-4 ring-violet-100` (shadow externo claro) + `border-violet-300` (borda interna escura), porque cria profundidade visual

## How to write

### Input com wrapper (focus-within no pai)

```html
<!-- Root/wrapper: recebe o estilo visual -->
<div class="flex ... border ... focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100">
  <!-- Input: perde o outline, foco borbulha pro pai -->
  <input class="outline-none ..." />
  <icon />
</div>
```

### Elemento focavel direto (select, textarea)

```html
<textarea class="outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100 ..." />

<select class="outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100 ..." />
```

### Tab/botao com focus-visible (group pattern)

```html
<button class="group outline-none ...">
  <span class="group-focus-visible:ring-2 group-focus-visible:ring-violet-400 group-focus-visible:ring-offset-4 rounded ...">
    Tab text
  </span>
  <div class="motion-div ..." /> <!-- nao recebe ring -->
</button>
```

## Example

**Before (outline padrao do browser):**
```html
<div class="flex border border-zinc-300">
  <input class="flex-1" />
  <SearchIcon />
</div>
```

**After (focus ring profissional):**
```html
<div class="flex border border-zinc-300 focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100">
  <input class="flex-1 outline-none" />
  <SearchIcon />
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Input dentro de div com icone | `outline-none` no input, `focus-within:ring` na div |
| Textarea ou select sozinho | `outline-none` + `focus:ring` no proprio elemento |
| Botao ou tab clicavel | `outline-none` + `focus-visible:ring` (nao `focus`) |
| Ring no filho, foco no pai | `group` no pai, `group-focus-visible:ring` no filho |
| Ring precisa de espacamento | `ring-offset-4` para distanciar o shadow da borda |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| Deixar outline padrao do browser | `outline-none` + ring customizado |
| `focus:ring` em botao/tab | `focus-visible:ring` (so teclado) |
| `focus-within` em elemento que recebe foco direto | `focus` direto |
| `focus` num span filho de button | `group` no button + `group-focus-visible` no span |
| Ring sem cor definida | `ring-violet-100` ou cor do design system |
| Border de foco sem ring externo | Combine `border-violet-300` + `ring-4 ring-violet-100` |
## Troubleshooting

### Focus ring aparece no clique do botao
**Symptom:** Ao clicar num botao, o ring de foco aparece desnecessariamente.
**Cause:** Usando `focus:` em vez de `focus-visible:` no botao.
**Fix:** Use `focus-visible:ring` para botoes e tabs (so ativa via teclado). Reserve `focus:` para inputs.

### Focus ring nao aparece no input com wrapper
**Symptom:** Ao focar o input dentro de uma div wrapper, nenhum estilo muda na div.
**Cause:** `focus:` na div nao funciona porque divs nao recebem foco diretamente.
**Fix:** Use `focus-within:` na div wrapper para detectar foco em qualquer filho.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-criando-efeitos-de-foco/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-criando-efeitos-de-foco/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
