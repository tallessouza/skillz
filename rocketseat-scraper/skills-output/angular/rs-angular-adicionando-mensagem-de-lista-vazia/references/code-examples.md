# Code Examples: Mensagem de Lista Vazia

## Codigo do favoritos (favorites-movies.html)

### Antes da mudanca

```html
<!-- favorites-movies.component.html -->
<app-movies-list [movies]="favoriteList()" />
```

Problema: se `favoriteList()` estiver vazio, a tela fica em branco.

### Depois da mudanca

```html
<!-- favorites-movies.component.html -->
@if (favoriteList().length === 0) {
  <div class="empty-state">
    <h3>Nenhum filme encontrado</h3>
    <p>Voce nao possui nenhum filme na lista de favoritos.</p>
  </div>
} @else {
  <app-movies-list [movies]="favoriteList()" />
}
```

## Codigo original do explore (referencia)

```html
<!-- explore-movies.component.html (linha 37+) -->
@if (moviesList().length === 0) {
  <div class="empty-state">
    <h3>Nenhum filme encontrado</h3>
    <p>Tente ajustar seus filtros para encontrar filmes.</p>
    <button (click)="clearFilters()">Limpar filtro</button>
  </div>
} @else {
  <app-movies-list [movies]="moviesList()" />
}
```

Note as diferencas entre explore e favoritos:
- **Explore**: tem botao "limpar filtro" (faz sentido porque ha filtros)
- **Favoritos**: sem botao (nao ha filtro para limpar)
- **Explore**: mensagem sobre filtros
- **Favoritos**: mensagem sobre lista de favoritos vazia

## Variacao: empty state com acao

```html
<!-- Quando faz sentido ter uma acao no empty state -->
@if (favoriteList().length === 0) {
  <div class="empty-state">
    <h3>Nenhum filme encontrado</h3>
    <p>Voce nao possui nenhum filme na lista de favoritos.</p>
    <a routerLink="/explore">Explorar filmes</a>
  </div>
} @else {
  <app-movies-list [movies]="favoriteList()" />
}
```

## Variacao: empty state reutilizavel como componente

```typescript
// empty-state.component.ts
@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      <ng-content />
    </div>
  `
})
export class EmptyStateComponent {
  title = input.required<string>();
  message = input.required<string>();
}
```

```html
<!-- Uso no favorites -->
@if (favoriteList().length === 0) {
  <app-empty-state
    title="Nenhum filme encontrado"
    message="Voce nao possui nenhum filme na lista de favoritos."
  />
} @else {
  <app-movies-list [movies]="favoriteList()" />
}
```