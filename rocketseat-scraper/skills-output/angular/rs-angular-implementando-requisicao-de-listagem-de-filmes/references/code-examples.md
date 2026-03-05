# Code Examples: Servico HTTP para Listagem em Angular

## Exemplo completo do servico

```typescript
// movies/services/movies-api.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MoviesListResponse } from '../../shared/types/movies-list-response';

@Injectable({ providedIn: 'root' })
export class MoviesApi {
  private readonly _httpClient = inject(HttpClient);

  getMovies() {
    return this._httpClient.get<MoviesListResponse>('http://localhost:3000/movies');
  }
}
```

## Interface de resposta baseada no endpoint

O instrutor verificou no Insomnia que o endpoint `/movies` retorna:

```json
[
  {
    "id": 1,
    "title": "Filme Exemplo",
    "description": "Descricao do filme",
    "genre": "Acao",
    "image_path": "/images/filme.jpg",
    "release_year": 2024,
    "votes_count": 150,
    "votes_average": 8.5
  }
]
```

Interface correspondente:

```typescript
// shared/models/movie-response.ts
export interface IMovieResponse {
  id: number;
  title: string;
  description: string;
  genre: string;
  image_path: string;
  release_year: number;
  votes_count: number;
  votes_average: number;
}
```

## Type alias para colecao

```typescript
// shared/types/movies-list-response.ts
import { IMovieResponse } from '../models/movie-response';

export type MoviesListResponse = IMovieResponse[];
```

## Variacao: servico com multiplos endpoints

Seguindo o mesmo padrao para outros endpoints da feature:

```typescript
@Injectable({ providedIn: 'root' })
export class MoviesApi {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  getMovies() {
    return this._httpClient.get<MoviesListResponse>(`${this.baseUrl}/movies`);
  }

  getMovieById(id: number) {
    return this._httpClient.get<IMovieResponse>(`${this.baseUrl}/movies/${id}`);
  }
}
```

## Variacao: usando environment para base URL

```typescript
@Injectable({ providedIn: 'root' })
export class MoviesApi {
  private readonly _httpClient = inject(HttpClient);

  getMovies() {
    return this._httpClient.get<MoviesListResponse>(`${environment.apiUrl}/movies`);
  }
}
```

## Sem tipagem vs com tipagem (comparacao)

```typescript
// Sem tipagem — retorna Observable<Object>, sem autocomplete
getMovies() {
  return this._httpClient.get('http://localhost:3000/movies');
}

// Com tipagem — retorna Observable<MoviesListResponse>, autocomplete completo
getMovies() {
  return this._httpClient.get<MoviesListResponse>('http://localhost:3000/movies');
}
```