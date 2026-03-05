# Code Examples: Limpagem de Filtro com Angular Signals

## Exemplo completo: ExploreMovies component

### Template (explore-movies.component.html)

```html
<!-- Secao exibida quando nenhum filme e encontrado -->
@if (moviesFiltered().length === 0) {
  <div class="no-results">
    <p>Nenhum filme encontrado</p>
    <button (click)="clearFilter()" class="cursor-pointer">
      <svg><!-- icone de limpar --></svg>
      Limpar Filtro
    </button>
  </div>
}
```

### Component (explore-movies.component.ts)

```typescript
// Signals de filtro (criados na aula anterior)
movieTitleFilter = signal('');
movieCategoryFilter = signal('');

// linkedSignal que recomputa a lista filtrada
moviesFiltered = linkedSignal(() => {
  const title = this.movieTitleFilter();
  const category = this.movieCategoryFilter();

  if (!title && !category) {
    return this.movies(); // retorna lista original
  }

  return this.movies().filter(movie => {
    const matchTitle = !title || movie.title.toLowerCase().includes(title.toLowerCase());
    const matchCategory = !category || movie.category === category;
    return matchTitle && matchCategory;
  });
});

// Metodo de limpeza
clearFilter(): void {
  this.movieTitleFilter.set('');
  this.movieCategoryFilter.set('');
}
```

## Exemplo completo: MoviesFilter component

### Template (movies-filter.component.html)

```html
<div class="filter-container">
  <input [(ngModel)]="title" placeholder="Titulo do filme" />

  <select [(ngModel)]="category">
    <option value="">Todas as categorias</option>
    <!-- opcoes -->
  </select>

  <button (click)="clearFilter()" class="cursor-pointer">
    Limpar
  </button>
</div>
```

### Component (movies-filter.component.ts)

```typescript
// Signals locais vinculados ao pai via model signals
title = signal('');
category = signal('');

clearFilter(): void {
  this.title.set('');
  this.category.set('');
}
```

## Fluxo de dados visualizado

```
[Usuario clica "Limpar"]
        |
        v
clearFilter() {
  this.movieTitleFilter.set('');   // signal → ''
  this.movieCategoryFilter.set(''); // signal → ''
}
        |
        v
[Template-driven forms detectam mudanca]
  → inputs ficam vazios visualmente
        |
        v
[linkedSignal recomputa]
  → title === '' && category === ''
  → retorna this.movies() (lista completa)
        |
        v
[UI atualiza com lista original]
```

## Ajuste visual: cursor-pointer

```html
<!-- ANTES: sem feedback visual de clique -->
<button>Limpar</button>

<!-- DEPOIS: com cursor pointer -->
<button (click)="clearFilter()" class="cursor-pointer">Limpar</button>
```