# Code Examples: Atualizando Dados via TAP

## Exemplo principal da aula

### RateMovieResource com tap

```typescript
// rate-movie.resource.ts
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RateMovieResource {
  private http = inject(HttpClient);
  
  // movieDetails e o linkedSignal que contem os detalhes do filme
  movieDetails = linkedSignal(() => this.fetchMovieDetails());

  rateMovie(movieId: number, rating: number) {
    return this.http.post<MovieDetails>(
      `https://api.themoviedb.org/3/movie/${movieId}/rating`,
      { value: rating }
    ).pipe(
      tap((movieUpdated) => {
        // movieUpdated tem a mesma estrutura do response de detalhes
        // entao podemos fazer set direto
        this.movieDetails.set(movieUpdated);
      })
    );
  }
}
```

### O que acontece passo a passo

```typescript
// 1. Usuario clica para avaliar com nota 5
// 2. HTTP POST e enviado para /rate
// 3. API retorna o filme com dados atualizados:
//    { id: 123, title: "Matrix", vote_average: 4.9, vote_count: 198, ... }
// 4. tap() recebe esse response como movieUpdated
// 5. this.movieDetails.set(movieUpdated) atualiza o signal
// 6. UI reage automaticamente — media e contagem de votos mudam na tela
```

## Variacoes do padrao

### Quando o response NAO tem a mesma estrutura

```typescript
// Se o endpoint retorna apenas { success: true, new_average: 4.9, new_count: 198 }
rateMovie(movieId: number, rating: number) {
  return this.http.post<RateResponse>(`/api/movies/${movieId}/rate`, { value: rating })
    .pipe(
      tap((response) => {
        // Atualiza apenas os campos relevantes
        const current = this.movieDetails();
        if (current) {
          this.movieDetails.set({
            ...current,
            vote_average: response.new_average,
            vote_count: response.new_count,
          });
        }
      })
    );
}
```

### Multiplos signals atualizados no mesmo tap

```typescript
rateMovie(movieId: number, rating: number) {
  return this.http.post<MovieDetails>(`/api/movies/${movieId}/rate`, { value: rating })
    .pipe(
      tap((movieUpdated) => {
        this.movieDetails.set(movieUpdated);
        this.userRatingCount.update(count => count + 1);
        this.lastRatedMovieId.set(movieId);
      })
    );
}
```

### tap vs map — quando usar cada um

```typescript
// tap: side-effects (atualizar state, logging, analytics)
.pipe(
  tap((data) => this.movieDetails.set(data)),      // side-effect
  tap((data) => console.log('Rated:', data.title)), // logging
)

// map: transformacao de dados (retornar valor diferente)
.pipe(
  map((data) => data.vote_average), // transforma MovieDetails em number
)
```