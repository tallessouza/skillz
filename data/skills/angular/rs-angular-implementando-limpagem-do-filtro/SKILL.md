---
name: rs-angular-implementando-limpagem-do-filtro
description: "Applies Angular signal-based filter clearing patterns when building search/filter UIs with Angular signals and template-driven forms. Use when user asks to 'clear filters', 'reset form fields', 'implement filter reset', 'clean search inputs', or builds any filtering UI with Angular signals. Ensures proper signal .set() to empty values triggering reactive recomputation via linkedSignal. Make sure to use this skill whenever implementing filter/search clear functionality in Angular. Not for RxJS-based filtering, NgRx state management, or reactive forms."
---

# Limpagem de Filtro com Angular Signals

> Limpar filtros significa resetar os signals de modelo para valores vazios, deixando a reatividade do linkedSignal recomputar a lista automaticamente.

## Rules

1. **Limpe via .set('') nos signals de modelo** — nunca manipule o DOM ou o formulario diretamente, porque os signals propagam a mudanca automaticamente para template-driven forms via two-way binding
2. **Confie no linkedSignal para recomputar** — ao setar signals vazios, o computed/linkedSignal re-executa a logica de filtro e retorna a lista original, porque a condicao de "vazio" cai no if que retorna todos os itens
3. **Adicione o evento de clique em TODOS os botoes de limpar** — cada local que exibe um botao "limpar filtro" precisa do seu proprio handler, porque componentes diferentes possuem signals proprios
4. **Use cursor-pointer no botao de limpar** — adicione `cursor-pointer` na classe do botao, porque sem ele o usuario nao percebe que e clicavel

## How to write

### Clear filter no componente pai (ExploreMovies)

```typescript
// O metodo reseta os signals que alimentam o linkedSignal
clearFilter(): void {
  this.movieTitleFilter.set('');
  this.movieCategoryFilter.set('');
}
```

### Clear filter no componente de filtro (MoviesFilter)

```typescript
// Mesma logica — signals locais propagam para o pai via model signals
clearFilter(): void {
  this.title.set('');
  this.category.set('');
}
```

### Bind no template

```html
<!-- Botao dentro da mensagem "nenhum filme encontrado" -->
<button (click)="clearFilter()" class="cursor-pointer">
  <svg>...</svg>
  Limpar Filtro
</button>

<!-- Botao no componente de filtro -->
<button (click)="clearFilter()" class="cursor-pointer">
  Limpar
</button>
```

## Example

**Before (botao sem acao):**
```html
<button>
  <svg>...</svg>
  Limpar Filtro
</button>
```

**After (com clear filter funcional):**
```html
<button (click)="clearFilter()" class="cursor-pointer">
  <svg>...</svg>
  Limpar Filtro
</button>
```

```typescript
clearFilter(): void {
  this.movieTitleFilter.set('');
  this.movieCategoryFilter.set('');
  // linkedSignal recomputa automaticamente → lista original retorna
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Multiplos campos de filtro | Resete todos os signals no mesmo metodo |
| Botao de limpar sem cursor pointer | Adicione classe `cursor-pointer` |
| Componente filho tem signals proprios | Crie clearFilter() no filho tambem |
| linkedSignal com condicao de vazio | Retorne lista original quando ambos signals estao vazios |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Manipular DOM para limpar inputs | `this.signal.set('')` e deixar o binding propagar |
| Recarregar a lista do servidor ao limpar | Confiar no linkedSignal para recomputar localmente |
| Um unico clearFilter global para componentes diferentes | Cada componente com seus proprios signals tem seu proprio clearFilter |
| Esquecer cursor-pointer em botoes de acao | Sempre adicionar `cursor-pointer` em botoes clicaveis |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
