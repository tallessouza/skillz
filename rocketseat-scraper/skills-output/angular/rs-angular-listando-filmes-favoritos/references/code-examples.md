# Code Examples: Listando Filmes Favoritos

## Exemplo completo do servico

```typescript
// shared/services/favorites-api.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MoviesListResponse } from '../types/movie.types';

@Injectable({ providedIn: 'root' })
export class FavoritesApi {
  private readonly _httpClient = inject(HttpClient);

  getFavorites() {
    return this._httpClient.get<MoviesListResponse>('http://localhost:3000/favorites');
  }

  // Implementados em aulas futuras
  addMovieToFavorites(movieId: string) {
    // POST /favorites
  }

  removeMovieFromFavorites(movieId: string) {
    // DELETE /favorites/:id
  }
}
```

## Exemplo completo do componente

```typescript
// features/favorites/favorites-movies.component.ts
import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FavoritesApi } from '../../shared/services/favorites-api';
import { MoviesListComponent } from '../../shared/components/movies-list/movies-list.component';

@Component({
  selector: 'app-favorites-movies',
  standalone: true,
  imports: [MoviesListComponent],
  templateUrl: './favorites-movies.component.html',
})
export class FavoritesMoviesComponent {
  private readonly _favoritesApi = inject(FavoritesApi);

  // RxResource com params true = auto-fetch no init
  favoritesResource = rxResource({
    params: () => true,
    stream: () => this._favoritesApi.getFavorites(),
  });

  // Computed signal com tratativa de erro
  favoritesList = computed(() => {
    const errorOnResponse = !!this.favoritesResource.error();
    if (errorOnResponse) {
      return [];
    }
    return this.favoritesResource.value() ?? [];
  });
}
```

## Template do componente

```html
<!-- features/favorites/favorites-movies.component.html -->
<app-movies-list [movies]="favoritesList()" />
```

## Estrutura de pastas resultante

```
src/app/
├── shared/
│   ├── services/
│   │   └── favorites-api.ts       ← Servico compartilhado
│   ├── components/
│   │   └── movies-list/
│   └── types/
│       └── movie.types.ts
├── features/
│   ├── favorites/
│   │   └── favorites-movies/
│   │       ├── favorites-movies.component.ts   ← Injeta FavoritesApi
│   │       └── favorites-movies.component.html
│   └── movies/
│       └── ...                    ← Tambem injetara FavoritesApi (futuro)
```

## Response do endpoint /favorites

```json
[
  {
    "id": "abc123",
    "title": "Interstellar",
    "poster_path": "/path.jpg",
    "vote_average": 8.7
  },
  {
    "id": "def456",
    "title": "The Matrix",
    "poster_path": "/path2.jpg",
    "vote_average": 8.7
  }
]
```

## Variacao: RxResource com parametro reativo

```typescript
// Se o fetch dependesse de um parametro (ex: userId)
userIdSignal = signal<string | undefined>(undefined);

favoritesResource = rxResource({
  params: () => this.userIdSignal(),  // Re-executa quando userId muda
  stream: ({ params: userId }) =>
    this._favoritesApi.getFavoritesByUser(userId),
});
```

## Variacao: Multiplos resources no mesmo componente

```typescript
export class DashboardComponent {
  private readonly _favoritesApi = inject(FavoritesApi);
  private readonly _moviesApi = inject(MoviesApi);

  favoritesResource = rxResource({
    params: () => true,
    stream: () => this._favoritesApi.getFavorites(),
  });

  allMoviesResource = rxResource({
    params: () => true,
    stream: () => this._moviesApi.getAllMovies(),
  });

  favoritesList = computed(() => {
    if (!!this.favoritesResource.error()) return [];
    return this.favoritesResource.value() ?? [];
  });

  moviesList = computed(() => {
    if (!!this.allMoviesResource.error()) return [];
    return this.allMoviesResource.value() ?? [];
  });
}
```