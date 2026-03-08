---
name: rs-full-stack-inputs-um-do-lado-do-outro
description: "Enforces Tailwind CSS flex layout patterns for placing form inputs side by side. Use when user asks to 'put inputs next to each other', 'layout form fields horizontally', 'place select and input side by side', 'create inline form fields', or 'organize form columns'. Applies wrapper div with flex and gap utilities to group adjacent form elements. Make sure to use this skill whenever arranging multiple form fields in a horizontal row with Tailwind. Not for vertical form layouts, grid-based dashboards, or non-form flex layouts."
---

# Inputs Um Do Lado Do Outro

> Para colocar inputs lado a lado, envolva-os em uma div com `flex` e `gap` — nunca use margin manual entre campos de formulário.

## Rules

1. **Envolva campos adjacentes em uma div wrapper** — aplique `flex` e `gap-4` na div pai, porque isso garante alinhamento consistente e espaçamento uniforme sem margin manual
2. **Use `gap` ao invés de margin entre campos** — `gap-4` no container flex, porque gap respeita o fluxo do layout e não causa colapso de margens
3. **Cada campo mantém sua própria label** — o wrapper agrupa apenas os campos que ficam na mesma linha, porque a legenda (label) pertence ao input individual
4. **Separe visualmente grupos de campos** — use espaçamento vertical entre linhas do formulário para criar hierarquia visual clara

## How to write

### Dois campos lado a lado

```html
<!-- Wrapper flex agrupa os campos horizontalmente -->
<div class="flex gap-4">
  <fieldset>
    <label>Categoria</label>
    <select required>
      <option>Alimentação</option>
      <option>Transporte</option>
    </select>
  </fieldset>

  <fieldset>
    <label>Valor</label>
    <input type="number" required />
  </fieldset>
</div>
```

## Example

**Before (campos empilhados sem agrupamento):**

```html
<label>Categoria</label>
<select required>...</select>

<label>Valor</label>
<input type="number" required />
```

**After (com flex wrapper):**

```html
<div class="flex gap-4">
  <div>
    <label>Categoria</label>
    <select required>...</select>
  </div>

  <div>
    <label>Valor</label>
    <input type="number" required />
  </div>
</div>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Dois campos curtos (select + input) | Agrupe em `div.flex.gap-4` |
| Campo que ocupa linha inteira (nome, descrição) | Mantenha sozinho, sem flex wrapper |
| Três ou mais campos na linha | Use `flex gap-4` com `flex-1` nos filhos para distribuir |
| Campos de tamanhos diferentes | Use `flex-1` no maior e `w-auto` ou largura fixa no menor |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `<select class="mr-4">` (margin manual) | `<div class="flex gap-4"><select>...</select><input /></div>` |
| `display: inline-block` em inputs | `flex` no wrapper pai |
| Dois inputs soltos sem wrapper | Wrapper `div` com `flex gap-4` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre layout flex em formulários
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variações de formulário