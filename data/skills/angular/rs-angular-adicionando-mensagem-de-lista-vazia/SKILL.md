---
name: rs-angular-mensagem-lista-vazia
description: "Applies empty state messaging patterns when building Angular components with lists or collections. Use when user asks to 'show empty state', 'handle empty list', 'add empty message', 'create favorites page', or any Angular template with conditional rendering of lists. Ensures proper @if/@else flow control for zero-length checks and user-friendly empty state UI. Make sure to use this skill whenever generating Angular templates that display dynamic lists. Not for error handling, loading states, or skeleton screens."
---

# Mensagem de Lista Vazia em Angular

> Toda lista dinamica deve ter um estado vazio visivel e informativo — nunca deixe a tela em branco.

## Rules

1. **Sempre valide o length antes de renderizar listas** — use `@if (list.length === 0)` com `@else`, porque uma tela em branco confunde o usuario e parece bug
2. **Reutilize estruturas de empty state existentes** — copie e adapte de componentes similares no projeto, porque manter consistencia visual e menos codigo
3. **Remova acoes irrelevantes no contexto** — se o empty state foi copiado de outro lugar, remova botoes que nao fazem sentido (ex: "limpar filtro" em favoritos), porque botoes sem funcao confundem o usuario
4. **Personalize a mensagem pelo contexto** — nao use mensagem generica, diga exatamente o que esta vazio e por que, porque ajuda o usuario a entender o proximo passo

## How to write

### Empty state com @if/@else

```typescript
// No template Angular, envolva a lista com verificacao de length
@if (favoriteList().length === 0) {
  <div class="empty-state">
    <h3>Nenhum filme encontrado</h3>
    <p>Voce nao possui nenhum filme na lista de favoritos.</p>
  </div>
} @else {
  <app-movies-list [movies]="favoriteList()" />
}
```

### Estrutura da div de empty state

```html
<div class="empty-state">
  <h3>Nenhum {{ itemName }} encontrado</h3>
  <p>{{ contextualMessage }}</p>
  <!-- Apenas inclua acoes se fizerem sentido no contexto -->
</div>
```

## Example

**Before (tela em branco quando lista vazia):**
```html
<app-movies-list [movies]="favoriteList()" />
```

**After (com empty state informativo):**
```html
@if (favoriteList().length === 0) {
  <div class="empty-state">
    <h3>Nenhum filme encontrado</h3>
    <p>Voce nao possui nenhum filme na lista de favoritos.</p>
  </div>
} @else {
  <app-movies-list [movies]="favoriteList()" />
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Lista de favoritos vazia | Mensagem personalizada: "voce nao possui nenhum filme na lista de favoritos" |
| Lista de busca vazia | Mensagem + botao para limpar filtro |
| Lista generica vazia | Mensagem descritiva sem acoes extras |
| Componente reutilizado de outro contexto | Remova botoes/acoes que nao se aplicam |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Lista sem `@if` para estado vazio | `@if (list().length === 0) { ... } @else { ... }` |
| Mensagem generica "Nada aqui" | Mensagem contextual explicando o que esta vazio |
| Copiar empty state com botoes irrelevantes | Remover acoes que nao fazem sentido no novo contexto |
| `*ngIf` em projetos Angular 17+ | `@if` (novo flow control syntax) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
