# Code Examples: Listando Filmes no Template

## Exemplo completo: ExploreMoviesComponent

```typescript
// explore-movies.component.ts
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { linkedSignal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MoviesApi } from '../../services/movies-api.service';
import { MoviesListComponent } from './movies-list/movies-list.component';

@Component({
  selector: 'app-explore-movies',
  standalone: true,
  imports: [JsonPipe, MoviesListComponent],
  templateUrl: './explore-movies.component.html',
})
export class ExploreMoviesComponent {
  private readonly _moviesApi = inject(MoviesApi);

  // Resource que faz auto-fetch ao carregar o componente
  moviesResource = rxResource({
    params: () => true, // true = executa imediatamente
    stream: () => this._moviesApi.getMovies(),
  });

  // Lista filtrada com tratamento de erro
  moviesFiltered = linkedSignal(() => {
    const errorOnResponse = !!this.moviesResource.error();

    if (errorOnResponse) {
      return []; // Erro na requisicao → lista vazia
    }

    const moviesList = this.moviesResource.value();
    return moviesList ?? []; // Garantia: nunca undefined
  });
}
```

## Template do componente pai

```html
<!-- explore-movies.component.html -->

<!-- Debug (remover depois) -->
<p class="text-white">{{ moviesFiltered() | json }}</p>

<!-- Componente filho recebendo a lista via signal input -->
<app-movies-list [movies]="moviesFiltered()" />
```

## Componente filho: MoviesListComponent

```typescript
// movies-list.component.ts
import { Component, input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MoviesListResponse } from '../../../models/movies.model';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './movies-list.component.html',
})
export class MoviesListComponent {
  // Signal input com valor inicial vazio
  movies = input<MoviesListResponse>([]);
}
```

```html
<!-- movies-list.component.html -->
<p class="text-red-400">{{ movies() | json }}</p>
```

## Servico MoviesApi (referencia)

```typescript
// movies-api.service.ts
@Injectable({ providedIn: 'root' })
export class MoviesApi {
  private readonly _http = inject(HttpClient);

  getMovies() {
    return this._http.get<MoviesListResponse>('/movies');
  }
}
```

## Variacao: RxResource sem auto-fetch

```typescript
// So executa quando o usuario clica em um botao
moviesResource = rxResource({
  params: () => undefined, // NAO executa automaticamente
  stream: () => this._moviesApi.getMovies(),
});

// Para disparar manualmente:
loadMovies() {
  this.moviesResource.reload();
}
```

## Variacao: LinkedSignal com source/computation

```typescript
// Forma alternativa (usada no header do curso)
moviesFiltered = linkedSignal({
  source: () => this.moviesResource.value(),
  computation: (moviesList) => {
    if (!moviesList) return [];
    return moviesList;
  },
});
```

## Testando erro na requisicao

Para testar o tratamento de erro, altere temporariamente a URL no servico:

```typescript
getMovies() {
  // URL invalida para forcar erro
  return this._http.get<MoviesListResponse>('/moviess'); // 's' extra
}
```

Resultado esperado: `moviesFiltered()` retorna `[]`, e ambos componente pai e filho exibem lista vazia.