---
name: rs-angular-listando-filmes-favoritos
description: "Applies Angular RxResource + Computed signal pattern for loading and displaying API data on component init. Use when user asks to 'load data on component init', 'fetch list from API in Angular', 'use rxResource', 'create a computed signal from resource', or 'shared service between features'. Ensures correct service placement in shared folder, RxResource with params true for auto-fetch, and computed signal for error handling. Make sure to use this skill whenever implementing data fetching with Angular signals and resources. Not for state management libraries, NgRx, or non-Angular frameworks."
---

# RxResource + Computed Signal para Carregamento de Dados

> Ao carregar dados de uma API em um componente Angular, use RxResource para o fetch automatico e computed signal para tratativa de erro, nunca subscribe manual.

## Rules

1. **Servicos compartilhados entre features vao em `shared/services/`** — nunca coloque um servico dentro de uma feature se ele sera injetado por outra feature, porque features nao devem depender umas das outras
2. **Use RxResource com `params: () => true` para fetch automatico** — quando o endpoint deve ser chamado assim que o componente carrega, `true` dispara imediatamente; `undefined` nao executa
3. **Use `computed` ao inves de `linkedSignal` quando nao precisa setar valor manualmente** — computed recalcula automaticamente quando os signals dependentes mudam, sem necessidade de setter
4. **Trate erros retornando lista vazia no computed** — verifique `resource.error()` e retorne `[]` em caso de erro, garantindo que o template sempre receba um array valido
5. **Reutilize interfaces de tipagem existentes** — se o response da API tem a mesma estrutura de outra interface ja criada, reutilize ao inves de criar uma nova

## How to write

### Service em shared/services/

```typescript
// shared/services/favorites-api.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FavoritesApi {
  private readonly _httpClient = inject(HttpClient);

  getFavorites() {
    return this._httpClient.get<MoviesListResponse>('http://localhost:3000/favorites');
  }

  // Metodos futuros compartilhados entre features
  addMovieToFavorites(movieId: string) { /* ... */ }
  removeMovieFromFavorites(movieId: string) { /* ... */ }
}
```

### Component com RxResource + Computed

```typescript
// features/favorites/favorites-movies.component.ts
import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FavoritesApi } from '../../shared/services/favorites-api';

@Component({ /* ... */ })
export class FavoritesMoviesComponent {
  private readonly _favoritesApi = inject(FavoritesApi);

  // RxResource: params true = executa no init do componente
  favoritesResource = rxResource({
    params: () => true,
    stream: () => this._favoritesApi.getFavorites(),
  });

  // Computed: tratativa de erro + valor seguro
  favoritesList = computed(() => {
    const errorOnResponse = !!this.favoritesResource.error();
    if (errorOnResponse) return [];
    return this.favoritesResource.value() ?? [];
  });
}
```

### Template passando dados via input

```html
<app-movies-list [movies]="favoritesList()" />
```

## Example

**Before (subscribe manual, sem tratativa de erro):**
```typescript
export class FavoritesMoviesComponent implements OnInit {
  favorites: IMovieResponse[] = [];

  ngOnInit() {
    this.favoritesApi.getFavorites().subscribe({
      next: (data) => this.favorites = data,
      error: () => this.favorites = [],
    });
  }
}
```

**After (RxResource + Computed):**
```typescript
export class FavoritesMoviesComponent {
  private readonly _favoritesApi = inject(FavoritesApi);

  favoritesResource = rxResource({
    params: () => true,
    stream: () => this._favoritesApi.getFavorites(),
  });

  favoritesList = computed(() => {
    if (!!this.favoritesResource.error()) return [];
    return this.favoritesResource.value() ?? [];
  });
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Servico usado por 2+ features | Mover para `shared/services/` |
| Fetch deve executar no init | `params: () => true` no rxResource |
| Fetch depende de parametro reativo | `params: () => signal()` no rxResource |
| Nao precisa setar valor do signal | Use `computed`, nao `linkedSignal` |
| Response identico a interface existente | Reutilize a interface, nao crie nova |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `ngOnInit() { this.service.get().subscribe(...) }` | `rxResource({ params: () => true, stream: () => ... })` |
| Servico de favorites dentro de `features/favorites/` quando usado em `features/movies/` | Servico em `shared/services/favorites-api.ts` |
| `linkedSignal` para lista read-only derivada de resource | `computed(() => ...)` |
| `this.favorites = response` sem tratativa de erro | `if (!!resource.error()) return []` |
| Criar `IFavoriteMovieResponse` identica a `IMovieResponse` | Reutilizar `IMovieResponse` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
