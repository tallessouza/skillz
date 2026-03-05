# Code Examples: Filtro Reativo com Signal Model e LinkedSignal

## Exemplo completo do componente filho (MoviesFilter)

```typescript
import { Component } from '@angular/core';
import { model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movies-filter',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input [(ngModel)]="title" placeholder="Pesquisar filme" />
    <input [(ngModel)]="category" placeholder="Categoria" />
  `
})
export class MoviesFilterComponent {
  title = model<string>('');
  category = model<string>('');
}
```

### Notas:
- `model<string>('')` cria um signal que funciona como input+output
- `[(ngModel)]="title"` conecta o input HTML ao model signal
- FormsModule e obrigatorio para a diretiva ngModel funcionar

## Exemplo completo do componente pai (ExploreMovies)

### Template

```html
<app-movies-filter
  [(title)]="movieTitleFilter"
  [(category)]="movieCategoryFilter"
/>

@for (movie of moviesFiltered(); track movie.id) {
  <app-movie-card [movie]="movie" />
}
```

### Classe

```typescript
import { Component, signal, linkedSignal } from '@angular/core';

@Component({ /* ... */ })
export class ExploreMoviesComponent {
  moviesResource = /* httpResource ou similar */;

  movieTitleFilter = signal<string>('');
  movieCategoryFilter = signal<string>('');

  moviesFiltered = linkedSignal(() => {
    const moviesList = this.moviesResource.value() ?? [];

    if (this.moviesResource.error()) {
      return [];
    }

    const titleSearch = this.movieTitleFilter().toLowerCase().trim();
    const categorySearch = this.movieCategoryFilter().toLowerCase().trim();

    // Se nenhum filtro ativo, retorna lista original
    if (!titleSearch && !categorySearch) {
      return moviesList;
    }

    // Filtra sem alterar a lista original
    return moviesList.filter((movie) => {
      const matchesTitle = movie.title
        .toLowerCase()
        .includes(titleSearch);
      const matchesCategory = movie.genre
        .toLowerCase()
        .includes(categorySearch);
      return matchesTitle && matchesCategory;
    });
  });
}
```

## Demonstracao do set() programatico no model

```typescript
export class MoviesFilterComponent implements OnInit {
  title = model<string>('');

  ngOnInit() {
    // Setar valor programaticamente — reflete no input automaticamente
    this.title.set('Teste');
  }
}
```

Isso mostra o two-way: o valor setado no codigo aparece no input, e o valor digitado no input aparece no signal.

## Fluxo de dados visual

```
[Input HTML]  ←→  [model() filho]  ←→  [signal() pai]  →  [linkedSignal]  →  [template]
   ngModel          title              movieTitleFilter      moviesFiltered     @for loop
```

## Variacao: filtro com campo unico

```typescript
// Se tiver apenas um campo de filtro, simplifica:
moviesFiltered = linkedSignal(() => {
  const movies = this.moviesResource.value() ?? [];
  const search = this.movieTitleFilter().toLowerCase().trim();
  if (!search) return movies;
  return movies.filter(m => m.title.toLowerCase().includes(search));
});
```

## Variacao: filtro com select (dropdown) de categoria

```html
<!-- No componente filho -->
<select [(ngModel)]="category">
  <option value="">Todas</option>
  <option value="sci-fi">Sci-Fi</option>
  <option value="adventure">Aventura</option>
</select>
```

O model() funciona identicamente com select, checkbox, ou qualquer elemento de form que suporte ngModel.