# Code Examples: Requisicoes de Favoritar Filme

## Exemplo completo do service conforme a aula

```typescript
// services/favorites-api.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IMovieToFavoriteSuccessResponse } from '../shared/models/move-to-favorite-success-response';

@Injectable({ providedIn: 'root' })
export class FavoritesApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  addMovie(movieId: number) {
    return this.httpClient.post<IMovieToFavoriteSuccessResponse>(
      `${this.baseUrl}/favorites/${movieId}`,
      {}
    );
  }

  removeMovie(movieId: number) {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/favorites/${movieId}`
    );
  }
}
```

## Interface de response

```typescript
// shared/models/move-to-favorite-success-response.ts
export interface IMovieToFavoriteSuccessResponse {
  message: string;
}
```

## Verificacao no Insomnia (contexto da aula)

O instrutor usou o Insomnia para verificar:
- **Add Movie to Favorite:** POST `http://localhost:3000/favorites/{id}` → retorna `{ "message": "..." }`
- **Remove Movie from Favorite:** DELETE `http://localhost:3000/favorites/{id}` → retorna `204 No Content` (sem body)

## Variacao: aplicando o mesmo padrao para bookmark

```typescript
@Injectable({ providedIn: 'root' })
export class BookmarksApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  addBookmark(articleId: number) {
    return this.httpClient.post<{ message: string }>(
      `${this.baseUrl}/bookmarks/${articleId}`,
      {}
    );
  }

  removeBookmark(articleId: number) {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/bookmarks/${articleId}`
    );
  }
}
```

## Variacao: quando o POST precisa de body real

```typescript
// Diferente do caso de favoritos, aqui o POST envia dados no body
addReview(movieId: number, review: { rating: number; comment: string }) {
  return this.httpClient.post<IReviewSuccessResponse>(
    `${this.baseUrl}/movies/${movieId}/reviews`,
    review  // body real, nao objeto vazio
  );
}
```

## Erro comum: esquecer o body no POST

```typescript
// ERRO DE COMPILACAO — HttpClient.post exige body
addMovie(movieId: number) {
  return this.httpClient.post<IMovieToFavoriteSuccessResponse>(
    `${this.baseUrl}/favorites/${movieId}`
    // TypeScript: Expected 2-3 arguments, but got 1
  );
}

// CORRETO — body vazio explicito
addMovie(movieId: number) {
  return this.httpClient.post<IMovieToFavoriteSuccessResponse>(
    `${this.baseUrl}/favorites/${movieId}`,
    {}
  );
}
```