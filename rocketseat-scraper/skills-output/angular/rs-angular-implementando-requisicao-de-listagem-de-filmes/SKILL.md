---
name: rs-angular-req-listagem-filmes
description: "Applies Angular HTTP service pattern for API data fetching when creating services, typing API responses, or organizing feature-based code. Use when user asks to 'create a service', 'fetch data from API', 'type API response', 'list items from backend', or 'organize Angular feature modules'. Enforces injectable service with HttpClient, response interfaces in shared/models, and type aliases for collections. Make sure to use this skill whenever building Angular services that consume REST APIs. Not for state management, caching strategies, or RxJS operator chaining."
---

# Servico HTTP para Listagem em Angular

> Crie servicos HTTP dentro da feature correspondente, com tipagens de resposta em shared/models e type aliases para colecoes.

## Rules

1. **Servico dentro da feature** — crie `services/` dentro da pasta da feature (`movies/services/movies-api.ts`), porque servicos especificos nao pertencem ao shared
2. **Sufixo `-api` para servicos HTTP** — nomeie `movies-api.ts` nao `movies.service.ts`, porque distingue servicos de requisicao de servicos de logica
3. **Injectable com providedIn root** — use `@Injectable({ providedIn: 'root' })`, porque tree-shaking remove servicos nao utilizados
4. **HttpClient via inject()** — use `private readonly _httpClient = inject(HttpClient)`, porque e o padrao moderno do Angular
5. **Interface singular para resposta** — nomeie `IMovieResponse` nao `IMoviesResponse`, porque a interface representa UM item, nao a lista
6. **Type alias para colecoes** — crie `type MoviesListResponse = IMovieResponse[]` em `shared/types/`, porque evita repetir `IMovieResponse[]` em multiplos lugares
7. **Prefixo `I` apenas em interfaces** — use `IMovieResponse` para interface e `MoviesListResponse` (sem I) para type alias, porque type nao e interface

## How to write

### Servico HTTP da feature

```typescript
// movies/services/movies-api.ts
@Injectable({ providedIn: 'root' })
export class MoviesApi {
  private readonly _httpClient = inject(HttpClient);

  getMovies() {
    return this._httpClient.get<MoviesListResponse>('http://localhost:3000/movies');
  }
}
```

### Interface de resposta (singular)

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

### Type alias para colecao

```typescript
// shared/types/movies-list-response.ts
export type MoviesListResponse = IMovieResponse[];
```

## Example

**Before (sem tipagem, servico mal posicionado):**

```typescript
// shared/services/movies.service.ts
@Injectable({ providedIn: 'root' })
export class MoviesService {
  private http = inject(HttpClient);
  getMovies() {
    return this.http.get('http://localhost:3000/movies'); // Observable<Object>
  }
}
```

**After (com this skill applied):**

```typescript
// movies/services/movies-api.ts
@Injectable({ providedIn: 'root' })
export class MoviesApi {
  private readonly _httpClient = inject(HttpClient);
  getMovies() {
    return this._httpClient.get<MoviesListResponse>('http://localhost:3000/movies');
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Servico faz apenas requisicoes HTTP | Sufixo `-api` no nome do arquivo |
| Endpoint nao precisa de parametros | Metodo sem argumentos, token via interceptor |
| Resposta e uma lista de objetos | Crie interface singular + type alias para array |
| Servico e especifico de uma feature | Coloque dentro de `feature/services/` |
| Nome do arquivo/interface parece plural | Corrija para singular (`movie-response` nao `movies-response`) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `this.http.get('url')` sem generic | `this._httpClient.get<MoviesListResponse>('url')` |
| `IMoviesResponse` (plural para 1 item) | `IMovieResponse` (singular) |
| `IMovieResponse[]` repetido em varios lugares | `type MoviesListResponse = IMovieResponse[]` |
| Servico HTTP em `shared/services/` | Servico em `feature/services/` |
| `constructor(private http: HttpClient)` | `private readonly _httpClient = inject(HttpClient)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
