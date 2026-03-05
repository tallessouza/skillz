---
name: rs-angular-retornando-detalhes-do-filme
description: "Applies Angular pattern for fetching entity details by route ID using Signal Input and rxResource. Use when user asks to 'get details by id', 'fetch item from route param', 'use rxResource with route params', 'signal input from URL', or 'detail page in Angular'. Enforces withComponentInputBinding config, Signal Input for route params, and rxResource for reactive fetching. Make sure to use this skill whenever building detail/show pages in Angular that read IDs from URLs. Not for list pages, form handling, or non-Angular frameworks."
---

# Retornando Detalhes por ID da URL com Signal Input + rxResource

> Capture o ID da rota via Signal Input e dispare a requisição reativa com rxResource — sem ActivatedRoute manual.

## Rules

1. **Use Signal Input para capturar params da URL** — `id = input.required<string>()`, porque elimina boilerplate do ActivatedRoute e integra nativamente com rxResource
2. **O nome do input DEVE ser igual ao param da rota** — se a rota é `:id`, o input chama `id`, porque o Angular faz o binding pelo nome exato
3. **Configure withComponentInputBinding no app config** — sem isso o Angular não injeta params da URL nos inputs do componente
4. **Converta string para number com operador unário `+`** — `+params` em vez de `parseInt()`, porque é conciso e idiomático em TypeScript
5. **Coloque o endpoint de detalhes no serviço da entidade** — `getMovieDetails` fica em `MoviesApiService`, porque mantém coesão por domínio
6. **Referencie o Signal Input nos params do rxResource** — isso garante reatividade automática: novo ID → nova requisição

## How to write

### Serviço de API — método de detalhes

```typescript
// movies-api.service.ts
getMovieDetails(id: number) {
  return this.httpClient.get<IMovieResponse>(
    `http://localhost:3000/movies/${id}`
  );
}
```

### Componente de detalhes — Signal Input + rxResource

```typescript
// movie-details.component.ts
id = input.required<string>();

private readonly _moviesApi = inject(MoviesApiService);

movieDetailsResource = rxResource({
  params: () => this.id(),
  stream: ({ params }) => this._moviesApi.getMovieDetails(+params),
});
```

### Configuração obrigatória no app config

```typescript
// app.config.ts
provideRouter(routes, withComponentInputBinding())
```

## Example

**Before (ActivatedRoute manual — verboso):**

```typescript
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private moviesApi = inject(MoviesApiService);
  movie: IMovieResponse | null = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.moviesApi.getMovieDetails(+params['id']).subscribe(data => {
        this.movie = data;
      });
    });
  }
}
```

**After (Signal Input + rxResource — reativo e limpo):**

```typescript
export class MovieDetailsComponent {
  id = input.required<string>();

  private readonly _moviesApi = inject(MoviesApiService);

  movieDetailsResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this._moviesApi.getMovieDetails(+params),
  });
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Pagina de detalhe com ID na URL | Signal Input + rxResource |
| Multiplos params na URL (ex: `:categoryId/:productId`) | Um `input.required<string>()` para cada param |
| ID opcional na rota | `input<string>()` (sem required) com fallback |
| Precisa do ID em ngOnInit | Signal Input ja esta disponivel — use `effect()` se precisar side effect |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `this.route.params.subscribe(...)` para pegar ID | `id = input.required<string>()` |
| `parseInt(params['id'])` | `+params` (operador unario) |
| Esquecer `withComponentInputBinding()` | Adicionar no `provideRouter` do app config |
| Criar Signal manualmente com `signal('')` para ID da rota | Usar `input.required<string>()` que o Angular popula |
| Subscribe aninhado para buscar detalhes | rxResource com params reativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
