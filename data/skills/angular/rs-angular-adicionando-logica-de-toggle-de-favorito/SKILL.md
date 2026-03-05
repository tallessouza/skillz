---
name: rs-angular-toggle-favorito-rxresource
description: "Applies the toggle pattern with Angular RxResource and Signals for add/remove operations. Use when user asks to 'implement favorite toggle', 'add remove with rxresource', 'toggle state with signals', or 'create add/remove logic in Angular'. Enforces: service-level toggle method, signal-driven params, undefined initial state to prevent initial fire, pipe+tap for post-request state sync. Make sure to use this skill whenever implementing binary state toggles (favorite, like, bookmark) with RxResource in Angular. Not for simple button clicks without API calls, or non-Angular frameworks."
---

# Toggle com RxResource e Signals no Angular

> Encapsule a decisao add/remove no service e dispare via signal params no component, usando undefined como valor inicial para evitar request automatico.

## Rules

1. **Crie o metodo toggle no service, nao no component** — o service decide se chama add ou remove baseado no boolean recebido, porque evita dois RxResource separados no component e mantem o component enxuto
2. **Use undefined como valor inicial do signal de params** — `signal<boolean | undefined>(undefined)` porque signals dependentes nao disparam quando o valor e undefined, evitando request no carregamento
3. **Retorne undefined no params quando status e undefined** — `if (status === undefined) return undefined` porque isso impede o RxResource de disparar o observable
4. **Atualize o estado local no tap apos sucesso** — use `.pipe(tap(() => ...))` para inverter o signal de estado, porque o signal precisa mudar para que o proximo click funcione e a UI reflita o novo estado
5. **Use linkedSignal.update() para inverter booleano** — `this.isFavorite.update(cv => !cv)` porque linked signals suportam update e isso garante que o valor sempre inverta corretamente

## How to write

### Toggle method no Service

```typescript
// Service encapsula a decisao: o component so passa o estado atual
toggleMovieFavorite(isMovieCurrentFavorite: boolean, movieId: number): Observable<void | IMovieToFavoriteSuccessResponse> {
  const removeMovie = isMovieCurrentFavorite;

  if (removeMovie) {
    return this.removeMovieFromFavorites(movieId);
  }

  return this.addMovieToFavorites(movieId);
}
```

### Signal de params com undefined inicial

```typescript
// undefined impede disparo inicial do RxResource
toggleFavoriteParams = signal<boolean | undefined>(undefined);
```

### RxResource com toggle

```typescript
toggleMovieFavoriteResource = rxResource({
  params: () => {
    const status = this.toggleFavoriteParams();

    if (status === undefined) return undefined;

    return {
      currentFavoriteStatus: status,
      movieId: Number(this.id),
    };
  },
  stream: ({ params }) => {
    return this.favoriteApi
      .toggleMovieFavorite(params.currentFavoriteStatus, params.movieId)
      .pipe(
        tap(() => {
          this.isFavorite.update(cv => !cv);
        })
      );
  },
});
```

### Disparando o toggle no click

```typescript
toggleFavorite() {
  this.toggleFavoriteParams.set(this.isFavorite());
}
```

## Example

**Before (dois resources separados, component inchado):**
```typescript
// Component com logica duplicada
addResource = rxResource({ /* ... addToFavorites ... */ });
removeResource = rxResource({ /* ... removeFromFavorites ... */ });

toggleFavorite() {
  if (this.isFavorite()) {
    this.removeParams.set(this.movieId);
  } else {
    this.addParams.set(this.movieId);
  }
}
```

**After (toggle unificado via service):**
```typescript
// Service decide add/remove
toggleFavoriteParams = signal<boolean | undefined>(undefined);

toggleResource = rxResource({
  params: () => {
    const status = this.toggleFavoriteParams();
    if (status === undefined) return undefined;
    return { currentFavoriteStatus: status, movieId: Number(this.id) };
  },
  stream: ({ params }) =>
    this.favoriteApi.toggleMovieFavorite(params.currentFavoriteStatus, params.movieId)
      .pipe(tap(() => this.isFavorite.update(cv => !cv))),
});

toggleFavorite() {
  this.toggleFavoriteParams.set(this.isFavorite());
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Operacao binaria (add/remove, like/unlike) | Toggle method no service |
| RxResource nao deve disparar no init | Signal com undefined inicial + guard no params |
| Estado local precisa refletir resultado da API | pipe + tap para atualizar signal apos sucesso |
| Signal nao dispara porque valor e o mesmo | Inverta o estado no tap para que o proximo set seja diferente |
| Component ficando grande com logica de decisao | Mova a decisao para o service |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| Dois RxResource (add + remove) no component | Um toggle method no service + um RxResource |
| `signal<boolean>(false)` para params de toggle | `signal<boolean \| undefined>(undefined)` |
| Logica if/else add/remove no component | Toggle method no service que recebe o estado atual |
| Atualizar isFavorite no click antes do request | Atualizar no tap apos sucesso do request |
| `this.toggleParams.set(!this.isFavorite())` | `this.toggleParams.set(this.isFavorite())` — o service decide |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
