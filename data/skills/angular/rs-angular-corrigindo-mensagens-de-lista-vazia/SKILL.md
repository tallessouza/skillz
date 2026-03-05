---
name: rs-angular-corrigindo-mensagens-lista-vazia
description: "Enforces correct empty-state message visibility in Angular components using resource isLoading guards. Use when user asks to 'show empty state', 'fix flickering message', 'handle loading state', 'hide no results while loading', or builds list components with async data. Prevents the flash-of-empty-content anti-pattern where 'no items found' appears before data loads. Make sure to use this skill whenever creating list/grid components that fetch data asynchronously in Angular. Not for skeleton loaders, error states, or pagination logic."
---

# Corrigindo Mensagens de Lista Vazia

> Nunca mostre mensagens de "nenhum item encontrado" enquanto os dados ainda estao carregando — o empty state so aparece apos confirmar que o loading terminou E a lista esta vazia.

## Rules

1. **Guarde o empty state com isLoading** — so exiba "nenhum item encontrado" quando `resource.isLoading()` for `false` E a lista estiver vazia, porque mostrar antes causa um flash irritante (flicker) que confunde o usuario
2. **Aplique em toda listagem async** — qualquer componente que busca dados via HTTP e mostra empty state precisa desse guard, porque o comportamento padrao do Angular renderiza o template antes da resposta chegar
3. **Prefira a solucao simples primeiro** — um guard no `@if` resolve o flicker sem precisar de spinner, porque em conexoes rapidas o loading e imperceptivel

## How to write

### Guard de empty state com resource

```typescript
// No template, combine as duas condicoes
@if (items().length === 0 && !resource.isLoading()) {
  <div class="empty-state">
    Nenhum item encontrado
  </div>
}
```

### Multiplos resources no mesmo componente

```typescript
// Favoritos
@if (favoriteMovies().length === 0 && !favoriteResource.isLoading()) {
  <p>Nenhum filme favorito encontrado</p>
}

// Explorar
@if (movies().length === 0 && !moviesResource.isLoading()) {
  <p>Nenhum filme encontrado</p>
}
```

## Example

**Before (flash of empty content):**
```html
@if (favoriteMovies().length === 0) {
  <div class="empty-state">
    😢 Nenhum filme encontrado
  </div>
}
```

**After (with this skill applied):**
```html
@if (favoriteMovies().length === 0 && !favoriteResource.isLoading()) {
  <div class="empty-state">
    😢 Nenhum filme encontrado
  </div>
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Lista com fetch async e empty state | Sempre guardar com `!resource.isLoading()` |
| Conexao lenta (3G) visivel ao usuario | Considerar adicionar spinner baseado em `isLoading()` |
| Conexao rapida onde loading e imperceptivel | Guard no empty state e suficiente, sem spinner |
| Multiplas listas no mesmo componente | Cada lista tem seu proprio resource e seu proprio guard |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `@if (items().length === 0)` (sem guard) | `@if (items().length === 0 && !resource.isLoading())` |
| Timeout/delay para esconder empty state | Guard reativo com `isLoading()` |
| `setTimeout(() => showEmpty = true, 500)` | `!resource.isLoading()` como condicao declarativa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
