# Code Examples: Binding de Informacoes em Templates Angular

## Exemplo completo do componente MoviesList

### movies-list.component.ts

```typescript
import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './movies-list.component.html',
})
export class MoviesListComponent {
  movies = input<Movie[]>([]);
  basePath = 'http://localhost:3000';
}
```

### movies-list.component.html

```html
@for (movie of movies(); track movie.id) {
  <button class="movie-card">
    <img [src]="basePath + '/upload/' + movie.imagem" [alt]="movie.titulo" />
    <span class="rating">⭐ {{ movie.mediaVotos | number:'1.0-1':'pt-BR' }}</span>
    <h3>{{ movie.titulo }}</h3>
    <p>{{ movie.genero }} - {{ movie.anoLancamento }}</p>
  </button>
}
```

## Registro de locale no app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';

import { routes } from './app.routes';

// Registrar locale brasileiro ANTES de usar pt-BR em pipes
registerLocaleData(pt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
};
```

## DecimalPipe: variacoes de formato

```html
<!-- Formato '1.0-1': min 1 inteiro, min 0 decimais, max 1 decimal -->
{{ 3.3486 | number:'1.0-1':'pt-BR' }}
<!-- Resultado: 3,3 -->

{{ 4.8 | number:'1.0-1':'pt-BR' }}
<!-- Resultado: 4,8 -->

{{ 5 | number:'1.0-1':'pt-BR' }}
<!-- Resultado: 5 (zero decimais quando inteiro) -->

<!-- Formato '1.2-2': sempre 2 casas decimais -->
{{ 3.3486 | number:'1.2-2':'pt-BR' }}
<!-- Resultado: 3,35 -->

<!-- Sem locale: usa padrao americano (ponto) -->
{{ 3.3486 | number:'1.0-1' }}
<!-- Resultado: 3.3 -->
```

## Evolucao: de lista chumbada para dinamica

### Antes (HTML estatico com filmes fixos)

```html
<button class="movie-card">
  <img src="/assets/matrix.jpg" alt="Matrix" />
  <span>⭐ 4.5</span>
  <h3>Matrix</h3>
  <p>Acao - 1999</p>
</button>
<button class="movie-card">
  <img src="/assets/interstellar.jpg" alt="Interestelar" />
  <span>⭐ 4.8</span>
  <h3>Interestelar</h3>
  <p>Ficcao - 2014</p>
</button>
<!-- Repetido para cada filme... -->
```

### Depois (template dinamico com @for)

```html
@for (movie of movies(); track movie.id) {
  <button class="movie-card">
    <img [src]="basePath + '/upload/' + movie.imagem" [alt]="movie.titulo" />
    <span>⭐ {{ movie.mediaVotos | number:'1.0-1':'pt-BR' }}</span>
    <h3>{{ movie.titulo }}</h3>
    <p>{{ movie.genero }} - {{ movie.anoLancamento }}</p>
  </button>
}
```

## Componente pai passando dados

### explore-movies.component.html

```html
<app-movies-list [movies]="moviesList()" />
```

### explore-movies.component.ts

```typescript
import { Component, signal } from '@angular/core';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-explore-movies',
  standalone: true,
  imports: [MoviesListComponent],
  templateUrl: './explore-movies.component.html',
})
export class ExploreMoviesComponent {
  moviesList = signal<Movie[]>([]);

  constructor(private moviesService: MoviesService) {
    this.moviesService.getMovies().subscribe((movies) => {
      this.moviesList.set(movies);
    });
  }
}
```