# Code Examples: Empty State para Listas em Angular

## Exemplo completo do componente

### explore-movies.component.ts (simplificado)

```typescript
import { Component, computed, signal } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MoviesListComponent } from '../../components/movies-list/movies-list.component';

@Component({
  selector: 'app-explore-movies',
  standalone: true,
  imports: [MoviesListComponent],
  template: `
    @if (moviesFiltered().length === 0) {
      <p>Nenhum filme encontrado.</p>
    } @else {
      <app-movies-list [movies]="moviesFiltered()" />
    }
  `
})
export class ExploreMoviesComponent {
  // Sinal interno — NÃO usado diretamente no template
  private movies = signal<Movie[]>([]);

  // Sinal derivado — ÚNICO ponto de contato com o template
  moviesFiltered = computed(() => {
    // Aqui entram as regras de filtro
    return this.movies().filter(movie => /* criterios */);
  });
}
```

## Variacao: Empty state com acao

```html
@if (moviesFiltered().length === 0) {
  <div class="empty-state">
    <p>Nenhum filme encontrado.</p>
    <button (click)="clearFilters()">Limpar filtros</button>
  </div>
} @else {
  <app-movies-list [movies]="moviesFiltered()" />
}
```

## Variacao: Empty state com contexto de busca

```html
@if (moviesFiltered().length === 0) {
  <p>Nenhum filme encontrado para "{{ searchTerm() }}".</p>
} @else {
  <app-movies-list [movies]="moviesFiltered()" />
}
```

## Evolucao do codigo na aula

### ANTES (usava sinal original):
```html
<app-movies-list [movies]="movies()" />
```

### DEPOIS (usa sinal filtrado + empty state):
```html
@if (moviesFiltered().length === 0) {
  <p>Nenhum filme encontrado.</p>
} @else {
  <app-movies-list [movies]="moviesFiltered()" />
}
```

### Limpeza no componente:
```typescript
// REMOVIDO do uso no template:
// movies = signal<Movie[]>([]);  ← ainda existe internamente, mas não no template

// MANTIDO como fonte única do template:
moviesFiltered = computed(() => { /* ... */ });
```