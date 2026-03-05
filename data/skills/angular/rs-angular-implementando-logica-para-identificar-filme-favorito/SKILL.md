---
name: rs-angular-logica-filme-favorito
description: "Applies Angular reactive patterns for checking item membership in lists using RxJS map operator, rxResource, and linkedSignal. Use when user asks to 'check if item is in list', 'implement favorites logic', 'use rxResource with API', 'convert observable value with map', or 'use linkedSignal in Angular'. Covers service-layer boolean derivation, find-based membership checks, and reactive UI binding. Make sure to use this skill whenever implementing favorite/bookmark/like toggle state in Angular. Not for adding/removing favorites, HTTP setup, or routing."
---

# Lógica de Identificação de Item em Lista de Favoritos (Angular)

> Derive um booleano de pertencimento a partir de uma lista remota, mantendo a lógica no service e o componente reativo via rxResource + linkedSignal.

## Rules

1. **Lógica de verificação no service, não no componente** — crie métodos como `isMovieInFavorites(id)` no service API, porque o componente não deve acumular responsabilidades de processamento de dados
2. **Use `map` do RxJS para transformar o tipo do Observable** — quando o endpoint retorna uma lista mas você precisa de um booleano, pipe com `map` para converter, porque mantém a cadeia reativa sem subscribe manual
3. **Use `find` para membership check** — `array.find(item => item.id === targetId)` retorna o item ou `undefined`, converta para booleano com `!!` ou comparação explícita
4. **rxResource para chamadas reativas a signals** — quando um signal muda (ex: ID da URL), o rxResource re-executa automaticamente o stream, porque elimina subscribes manuais
5. **linkedSignal quando o valor precisa ser reativo E editável** — use `linkedSignal` em vez de `signal` quando o valor vem de um resource MAS também será alterado manualmente (ex: toggle favorito)
6. **Trate erros no linkedSignal com early return** — verifique `resource.error()` antes de acessar `resource.value()`, retornando `false` como fallback seguro

## How to write

### Service: método que retorna Observable<boolean>

```typescript
// favorites-api.service.ts
isMovieInFavorites(movieId: number): Observable<boolean> {
  return this.getFavorites().pipe(
    map((favoritesList: MoviesListResponse) =>
      !!favoritesList.find(favoriteMovie => favoriteMovie.id === movieId)
    )
  );
}
```

### Componente: rxResource reativo ao signal de ID

```typescript
// movie-details.component.ts
private _favoritesApi = inject(FavoritesApi);

isMoveFavoriteResource = rxResource({
  params: () => this.id(),
  stream: ({ params }) =>
    this._favoritesApi.isMovieInFavorites(Number(params))
});
```

### linkedSignal com tratamento de erro

```typescript
isFavorite = linkedSignal(() => {
  const errorOnResponse = !!this.isMoveFavoriteResource.error();
  if (errorOnResponse) return false;
  return this.isMoveFavoriteResource.value() ?? false;
});
```

### Template: binding condicional

```html
@if (isFavorite()) {
  <svg><!-- coração preenchido --></svg>
} @else {
  <svg><!-- coração vazio --></svg>
}
```

## Example

**Before (lógica toda no componente, subscribe manual):**
```typescript
ngOnInit() {
  this.favoritesApi.getFavorites().subscribe(list => {
    const found = list.find(m => m.id === this.movieId);
    this.isFavorite = !!found;
  });
}
```

**After (reativo, service encapsula lógica):**
```typescript
// Service retorna Observable<boolean>
isMovieInFavorites(movieId: number) {
  return this.getFavorites().pipe(
    map(list => !!list.find(m => m.id === movieId))
  );
}

// Componente usa rxResource + linkedSignal
isMoveFavoriteResource = rxResource({
  params: () => this.id(),
  stream: ({ params }) =>
    this._favoritesApi.isMovieInFavorites(Number(params))
});

isFavorite = linkedSignal(() => {
  if (!!this.isMoveFavoriteResource.error()) return false;
  return this.isMoveFavoriteResource.value() ?? false;
});
```

## Heuristics

| Situação | Faça |
|----------|------|
| Endpoint retorna lista mas UI precisa de booleano | `pipe(map(...))` no service |
| Valor depende de signal E será editado depois | `linkedSignal` em vez de `computed` |
| Verificação de pertencimento em array | `find` + conversão para boolean |
| Componente ficando grande demais | Mova lógica de transformação para o service |
| Ideal em produção | Peça endpoint dedicado ao backend (ex: `GET /favorites/:movieId/exists`) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `subscribe` manual no componente para checar favorito | `rxResource` + `linkedSignal` |
| `computed` quando vai precisar de `.set()` depois | `linkedSignal` |
| Lógica de `find` + `map` dentro do componente | Método no service que retorna `Observable<boolean>` |
| `import { map } from 'rxjs'` (errado) | `import { map } from 'rxjs/operators'` ou `from 'rxjs'` (verificar versão) |
| Ignorar erro do resource | Early return com `false` no `linkedSignal` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
