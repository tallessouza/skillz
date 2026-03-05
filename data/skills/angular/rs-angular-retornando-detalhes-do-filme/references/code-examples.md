# Code Examples: Retornando Detalhes do Filme

## Exemplo completo do servico

```typescript
// movies-api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IMovieResponse } from '../interfaces/movie-response.interface';

@Injectable({ providedIn: 'root' })
export class MoviesApiService {
  private readonly httpClient = inject(HttpClient);

  // Endpoint de listagem (ja existente)
  getMovies() {
    return this.httpClient.get<IMovieResponse[]>(
      'http://localhost:3000/movies'
    );
  }

  // Endpoint de detalhes (adicionado nesta aula)
  getMovieDetails(id: number) {
    return this.httpClient.get<IMovieResponse>(
      `http://localhost:3000/movies/${id}`
    );
  }
}
```

## Exemplo completo do componente

```typescript
// movie-details.component.ts
import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MoviesApiService } from '../../services/movies-api.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
})
export class MovieDetailsComponent {
  // Signal Input — nome DEVE ser igual ao param da rota (:id)
  id = input.required<string>();

  // Injecao do servico
  private readonly _moviesApi = inject(MoviesApiService);

  // Resource reativo — dispara quando id muda
  movieDetailsResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this._moviesApi.getMovieDetails(+params),
  });
}
```

## Configuracao de rotas

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'details/:id', component: MovieDetailsComponent },
];
```

## Configuracao do app config

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
  ],
};
```

## Variacao: multiplos params na rota

```typescript
// Rota: /category/:categoryId/product/:productId
// Componente:
categoryId = input.required<string>();
productId = input.required<string>();

productResource = rxResource({
  params: () => ({
    categoryId: this.categoryId(),
    productId: this.productId(),
  }),
  stream: ({ params }) =>
    this.productsApi.getProduct(+params.categoryId, +params.productId),
});
```

## Variacao: param opcional

```typescript
// Rota: /search ou /search/:query
query = input<string>(); // sem required

searchResource = rxResource({
  params: () => this.query() ?? '',
  stream: ({ params }) =>
    params ? this.searchApi.search(params) : of([]),
});
```

## Usando os dados no template

```html
<!-- movie-details.component.html -->
@if (movieDetailsResource.value(); as movie) {
  <h1>{{ movie.title }}</h1>
  <p>{{ movie.overview }}</p>
  <img [src]="movie.poster_path" [alt]="movie.title" />
} @else if (movieDetailsResource.isLoading()) {
  <p>Carregando...</p>
} @else if (movieDetailsResource.error()) {
  <p>Erro ao carregar detalhes do filme.</p>
}
```