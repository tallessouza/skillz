# Code Examples: RouterLink com Redirecionamento Dinâmico

## Exemplo completo do componente MoviesListComponent

### movies-list.component.ts

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './movies-list.component.html',
})
export class MoviesListComponent {
  movies = [
    { id: 1, title: 'Interestelar' },
    { id: 2, title: 'Filme de Teste' },
  ];
}
```

### movies-list.component.html

```html
@for (movie of movies; track movie.id) {
  <button [routerLink]="['/details', movie.id]">
    {{ movie.title }}
  </button>
}
```

## Definição de rotas correspondente

### app.routes.ts

```typescript
import { Routes } from '@angular/router';
import { MovieDetailsComponent } from './movie-details/movie-details.component';

export const routes: Routes = [
  { path: 'details/:id', component: MovieDetailsComponent },
];
```

## Variações

### Com múltiplos segmentos dinâmicos

```html
<!-- Rota: category/:categoryId/details/:id -->
<button [routerLink]="['/category', movie.categoryId, 'details', movie.id]">
  {{ movie.title }}
</button>
```

### Com queryParams (caso precise passar filtros)

```html
<button
  [routerLink]="['/details', movie.id]"
  [queryParams]="{ source: 'explore' }">
  {{ movie.title }}
</button>
<!-- Gera: /details/42?source=explore -->
```

### Navegação programática equivalente (para casos com lógica prévia)

```typescript
import { Router } from '@angular/router';

export class MoviesListComponent {
  constructor(private router: Router) {}

  goToDetails(movieId: number) {
    // Só use isso quando há lógica antes da navegação
    this.router.navigate(['/details', movieId]);
  }
}
```

## Lendo o parâmetro no componente de destino

```typescript
import { ActivatedRoute } from '@angular/router';

export class MovieDetailsComponent {
  movieId: string;

  constructor(private route: ActivatedRoute) {
    this.movieId = this.route.snapshot.params['id'];
  }
}
```