# Code Examples: Lógica de Identificação de Filme Favorito

## 1. Service completo — FavoritesApi

```typescript
// favorites-api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MoviesListResponse } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class FavoritesApi {
  private _http = inject(HttpClient);

  getFavorites(): Observable<MoviesListResponse> {
    return this._http.get<MoviesListResponse>('/api/favorites');
  }

  // Método que encapsula a lógica de verificação
  isMovieInFavorites(movieId: number): Observable<boolean> {
    return this.getFavorites().pipe(
      map((favoritesListResponse: MoviesListResponse) =>
        !!favoritesListResponse.find(
          favoriteMovie => favoriteMovie.id === movieId
        )
      )
    );
  }
}
```

## 2. Componente completo — MovieDetails

```typescript
// movie-details.component.ts
import { Component, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FavoritesApi } from '../../services/favorites-api.service';

@Component({ /* ... */ })
export class MovieDetailsComponent {
  private _favoritesApi = inject(FavoritesApi);

  // Signal do ID vindo da URL (já existente)
  id = input.required<string>();

  // Resource reativo: re-executa quando id() muda
  isMoveFavoriteResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) =>
      this._favoritesApi.isMovieInFavorites(Number(params))
  });

  // linkedSignal: derivado do resource MAS editável para toggle futuro
  isFavorite = linkedSignal(() => {
    const errorOnResponse = !!this.isMoveFavoriteResource.error();
    if (errorOnResponse) return false;
    return this.isMoveFavoriteResource.value() ?? false;
  });

  // Método futuro para toggle (spoiler do instrutor)
  toggleFavorite() {
    // Vai usar isFavorite.set() ou isFavorite.update()
    // Possível porque é linkedSignal, não computed
  }
}
```

## 3. Template — binding condicional do coração

```html
<!-- movie-details.component.html -->
@if (isFavorite()) {
  <svg class="heart filled">
    <!-- SVG do coração preenchido -->
  </svg>
} @else {
  <svg class="heart empty">
    <!-- SVG do coração vazio -->
  </svg>
}
```

## 4. Variação: usando `some` em vez de `find`

```typescript
// Alternativa mais semântica — retorna boolean diretamente
isMovieInFavorites(movieId: number): Observable<boolean> {
  return this.getFavorites().pipe(
    map(favorites =>
      favorites.some(movie => movie.id === movieId)
    )
  );
}
```

## 5. Variação: endpoint dedicado no backend (recomendação de produção)

```typescript
// O instrutor recomenda que em produção o backend tenha isso:
isMovieInFavorites(movieId: number): Observable<boolean> {
  return this._http.get<{ isFavorite: boolean }>(
    `/api/favorites/${movieId}/exists`
  ).pipe(
    map(response => response.isFavorite)
  );
}
```

## 6. Padrão rxResource + linkedSignal (reutilizável)

```typescript
// Padrão genérico para qualquer verificação reativa com edição futura
someResource = rxResource({
  params: () => this.someSignal(),
  stream: ({ params }) => this.someService.checkSomething(params)
});

derivedButEditable = linkedSignal(() => {
  if (!!this.someResource.error()) return defaultValue;
  return this.someResource.value() ?? defaultValue;
});
```