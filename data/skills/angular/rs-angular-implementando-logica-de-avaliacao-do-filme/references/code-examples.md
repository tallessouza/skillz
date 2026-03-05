# Code Examples: Logica de Avaliacao com RxResource Condicional

## Exemplo 1: Service method completo

```typescript
// movies-api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IMovieResponse } from '../interfaces/movie-response.interface';

@Injectable({ providedIn: 'root' })
export class MoviesApiService {
  private httpClient = inject(HttpClient);

  rateMovie(movieId: number, rating: number) {
    return this.httpClient.post<IMovieResponse>(
      `http://localhost:3000/movies/${movieId}/rate`,
      { rating }
    );
  }
}
```

**Pontos-chave:**
- `movieId` na URL, `rating` no body
- Tipagem generica `<IMovieResponse>` no post
- Retorna Observable (nao faz subscribe no service)

## Exemplo 2: RxResource SEM guard (problema)

```typescript
// movie-details.component.ts — VERSAO COM BUG
rateMovieResource = rxResource({
  params: () => ({
    id: +this.id(),
    rating: this.currentRating() ?? 0,
  }),
  stream: ({ params }) => {
    return this.moviesApi.rateMovie(params.id, params.rating);
  },
});
```

**Problema demonstrado pelo instrutor:**
- Ao carregar a pagina, `this.id()` recebe valor da rota
- `this.currentRating()` e undefined, vira 0
- Requisicao POST dispara com rating=0
- Backend retorna erro: "nota deve ser entre 1 e 5"

## Exemplo 3: RxResource COM guard (solucao final)

```typescript
// movie-details.component.ts — VERSAO CORRETA
rateMovieResource = rxResource({
  params: () => {
    const rating = this.currentRating() ?? 0;

    if (rating > 0) {
      return {
        id: +this.id(),
        rating,
      };
    }

    return undefined;
  },
  stream: ({ params }) => {
    return this.moviesApi.rateMovie(params.id, params.rating);
  },
});
```

**Comportamento verificado pelo instrutor no Network tab:**
1. Ao carregar pagina: nenhuma requisicao de rate
2. Ao clicar estrela 5: POST com rating=5, sucesso
3. Ao clicar estrela 1: POST com rating=1, sucesso
4. Ao clicar estrela 5 novamente (deselecao): nenhuma requisicao (currentRating vira 0)

## Exemplo 4: Endpoint no Insomnia (referencia)

```
POST http://localhost:3000/movies/{id}/rate

Body (JSON):
{
  "rating": 5
}

Response: IMovieResponse com dados atualizados do filme
- Quantidade de votos atualizada
- Media recalculada
```

## Exemplo 5: Variacao — aplicando o mesmo padrao para favoritar

```typescript
// Mesmo padrao aplicado a outro caso de uso
toggleFavoriteResource = rxResource({
  params: () => {
    const isFavorite = this.isFavorite();
    
    // So executa quando usuario interagiu (nao no load)
    if (isFavorite !== undefined) {
      return {
        id: +this.id(),
        favorite: isFavorite,
      };
    }

    return undefined;
  },
  stream: ({ params }) => {
    return this.moviesApi.toggleFavorite(params.id, params.favorite);
  },
});
```