---
name: rs-tailwind-seletores-e-estados
description: "Applies Tailwind CSS pseudo-selectors and state modifiers when styling components. Use when user asks to 'add hover effect', 'style before/after', 'handle disabled state', 'add pseudo-element', or any Tailwind interactive styling task. Covers before:/after: pseudo-elements, hover:/disabled:/enabled: states, and modifier stacking like enabled:hover:. Make sure to use this skill whenever generating Tailwind classes for interactive or stateful elements. Not for Tailwind layout, spacing, or color theory outside of state-based styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: interatividade
  tags: [tailwind, flexbox]
---

# Seletores e Estados no Tailwind

> Usar prefixos de pseudo-seletores e estados para estilizar elementos interativos sem sair das classes utilitarias do Tailwind.

## Rules

1. **Repita o prefixo em cada classe** — `before:w-2 before:h-8 before:bg-sky-500`, porque cada classe utilitaria precisa do seu proprio prefixo de pseudo-seletor
2. **Pseudo-elementos precisam de display** — `before:block` ou `before:flex`, porque por padrao o `::before` e inline e nao respeita width/height
3. **Use `enabled:hover:` para hover condicional** — nao aplique hover em botoes que podem estar desabilitados sem o guard `enabled:`, porque o hover continuaria ativo mesmo com `disabled:opacity-60`
4. **Empilhe modificadores da esquerda para a direita** — `enabled:hover:bg-sky-600` le-se como "quando enabled E hover, aplique bg-sky-600", porque a ordem e da condicao mais externa para a mais interna
5. **Use `disabled:cursor-not-allowed`** — sempre que desabilitar um botao, sinalize visualmente com cursor e opacidade reduzida, porque feedback visual de estado e essencial para UX
6. **Valores de spacing sao multiplicados por 4** — `w-1` = 4px, `p-2` = 8px, `gap-3` = 12px, porque o sistema de spacing do Tailwind usa base 4

## How to write

### Pseudo-elemento before como decoracao

```html
<h1 class="flex items-center gap-3">
  <span class="before:block before:w-0.5 before:h-8 before:bg-sky-500"></span>
  Hello World
</h1>
<!-- Alternativa mais idiomatica: usar o before diretamente no h1 -->
<h1 class="flex items-center gap-3 before:block before:w-0.5 before:h-8 before:bg-sky-500">
  Hello World
</h1>
```

### Botao com estados hover e disabled

```html
<button
  class="bg-sky-500 px-4 py-2 rounded-md font-medium text-white
         enabled:hover:bg-sky-600
         disabled:opacity-60 disabled:cursor-not-allowed"
>
  Sign in
</button>
```

## Example

**Before (hover sem guard de enabled):**
```html
<button class="bg-sky-500 px-4 py-2 rounded-md
               hover:bg-sky-600
               disabled:opacity-60">
  Sign in
</button>
<!-- Bug: hover escurece o fundo mesmo quando disabled -->
```

**After (com enabled guard):**
```html
<button class="bg-sky-500 px-4 py-2 rounded-md
               enabled:hover:bg-sky-600
               disabled:opacity-60 disabled:cursor-not-allowed">
  Sign in
</button>
<!-- Hover so ativa quando o botao esta enabled -->
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Decoracao visual (tracinhos, bullets) | `before:` ou `after:` com display block/flex |
| Botao interativo | `enabled:hover:` + `disabled:opacity-60` + `disabled:cursor-not-allowed` |
| Estilizar placeholder de input | `placeholder:text-gray-400 placeholder:italic` |
| Primeiro/ultimo item de lista | `first:` e `last:` prefixos |
| Texto selecionado pelo usuario | `selection:bg-sky-200 selection:text-sky-900` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `hover:bg-sky-600` em botao desabilitavel | `enabled:hover:bg-sky-600` |
| `before:w-2` sem display definido | `before:block before:w-2` |
| `before:w-2 h-4` (misturando com/sem prefixo) | `before:w-2 before:h-4` |
| `disabled:opacity-60` sem cursor feedback | `disabled:opacity-60 disabled:cursor-not-allowed` |

## Pseudo-seletores disponiveis

| Prefixo | CSS equivalente | Uso comum |
|---------|----------------|-----------|
| `before:` | `::before` | Decoracoes, icones |
| `after:` | `::after` | Badges, indicadores |
| `hover:` | `:hover` | Feedback de mouse |
| `disabled:` | `:disabled` | Botoes inativos |
| `enabled:` | `:enabled` | Guard para hover |
| `first:` | `:first-child` | Primeiro item |
| `last:` | `:last-child` | Ultimo item |
| `placeholder:` | `::placeholder` | Texto de input |
| `selection:` | `::selection` | Texto selecionado |
| `focus:` | `:focus` | Acessibilidade |
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

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-seletores-e-estados/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-seletores-e-estados/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
