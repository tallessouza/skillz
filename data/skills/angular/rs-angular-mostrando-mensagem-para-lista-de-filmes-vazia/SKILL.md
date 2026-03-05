---
name: rs-angular-empty-list-message
description: "Enforces empty state handling for lists in Angular components. Use when user asks to 'show a list', 'display items', 'render filtered results', 'handle empty state', or 'show no results message'. Applies @if conditional rendering on the filtered/derived signal, not the original source. Make sure to use this skill whenever rendering any list that could be empty. Not for error handling, loading states, or skeleton screens."
---

# Empty State para Listas em Angular

> Sempre renderize condicionalmente listas que podem estar vazias, usando o sinal derivado (filtrado), nunca o original.

## Rules

1. **Use `@if` com `.length === 0` no sinal filtrado** — porque o usuario ve o resultado filtrado, nao a fonte original
2. **Renderize a mensagem vazia no bloco principal, lista no `@else`** — porque a condicao "vazio" e o caso excepcional que merece destaque
3. **Use o sinal derivado (filtered/computed) como fonte unica** — remova referencias ao sinal original no template, porque evita inconsistencias entre o que o usuario ve e o dado real
4. **Prepare o empty state para acoes futuras** — como "limpar filtros", porque o usuario precisa de um caminho de saida

## How to write

### Condicional de lista vazia com @if

```typescript
// No template do componente
@if (moviesFiltered().length === 0) {
  <p>Nenhum filme encontrado.</p>
} @else {
  <app-movies-list [movies]="moviesFiltered()" />
}
```

### Remover sinal original do template

```typescript
// ANTES: dois sinais no componente
movies = signal<Movie[]>([]);
moviesFiltered = computed(() => /* filtra movies() */);

// DEPOIS: template usa APENAS moviesFiltered
// movies continua existindo internamente, mas o template nao o referencia
```

## Example

**Before (sem empty state):**
```html
<app-movies-list [movies]="movies()" />
```

**After (com empty state no sinal filtrado):**
```html
@if (moviesFiltered().length === 0) {
  <p>Nenhum filme encontrado.</p>
} @else {
  <app-movies-list [movies]="moviesFiltered()" />
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Lista vem de um filtro/busca | Sempre adicionar empty state |
| Lista e estatica e garantidamente populada | Empty state opcional |
| Empty state precisa de acao (limpar filtro) | Adicionar botao no bloco vazio |
| Multiplas listas na mesma pagina | Cada uma com seu proprio empty state |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `@if (movies().length > 0) { <list> }` (sem else) | `@if (filtered().length === 0) { <msg> } @else { <list> }` |
| Usar sinal original no template quando existe filtrado | Usar apenas o sinal derivado/filtrado |
| Empty state generico "Nenhum item" | Mensagem contextual "Nenhum filme encontrado" |
| Esconder a lista silenciosamente | Mostrar mensagem explicativa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
