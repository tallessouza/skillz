# Code Examples: Toggle de Favorito com RxResource e Signals

## 1. Toggle method no FavoritesAPI Service

```typescript
// favorites-api.service.ts

toggleMovieFavorite(
  isMovieCurrentFavorite: boolean,
  movieId: number
): Observable<void | IMovieToFavoriteSuccessResponse> {
  const removeMovie = isMovieCurrentFavorite;

  if (removeMovie) {
    return this.removeMovieFromFavorites(movieId);
  }

  return this.addMovieToFavorites(movieId);
}
```

**Logica:** Se `isMovieCurrentFavorite` e `true`, o filme JA esta nos favoritos, logo o usuario quer REMOVER. Se `false`, quer ADICIONAR.

## 2. Signal de params no MovieDetails Component

```typescript
// movie-details.component.ts

// Signal que controla quando o RxResource dispara
// undefined = nao dispara (estado inicial)
// true = filme esta favoritado, usuario quer remover
// false = filme nao esta favoritado, usuario quer adicionar
toggleFavoriteParams = signal<boolean | undefined>(undefined);
```

## 3. RxResource completo para o toggle

```typescript
// movie-details.component.ts

toggleMovieFavoriteResource = rxResource({
  params: () => {
    const status = this.toggleFavoriteParams();

    // Guard: nao dispara se undefined (estado inicial)
    if (status === undefined) {
      return undefined;
    }

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
          // Apos sucesso, inverte o estado para que:
          // 1. A UI atualize o coracao (preenchido/vazio)
          // 2. O proximo click tenha um valor diferente para o signal disparar
          this.isFavorite.update(cv => !cv);
        })
      );
  },
});
```

## 4. Metodo chamado pelo template no click do coracao

```typescript
// movie-details.component.ts

toggleFavorite() {
  // Passa o valor ATUAL do isFavorite
  // O service decide se adiciona ou remove
  this.toggleFavoriteParams.set(this.isFavorite());
}
```

## 5. Demonstracao do bug sem o tap

```typescript
// SEM o tap — BUG: segundo click nao funciona

stream: ({ params }) => {
  return this.favoriteApi
    .toggleMovieFavorite(params.currentFavoriteStatus, params.movieId);
  // isFavorite nao e atualizado
  // proximo set() passa o mesmo valor
  // signal nao detecta mudanca
  // RxResource nao re-executa
},
```

```typescript
// COM o tap — CORRETO: funciona em todos os clicks

stream: ({ params }) => {
  return this.favoriteApi
    .toggleMovieFavorite(params.currentFavoriteStatus, params.movieId)
    .pipe(
      tap(() => {
        this.isFavorite.update(cv => !cv);
      })
    );
},
```

## 6. Fluxo de dados completo (sequencia de clicks)

```
Estado inicial:
  isFavorite = false (filme nao favoritado)
  toggleFavoriteParams = undefined (nao dispara)

Click 1 (adicionar):
  toggleFavorite() → set(false)
  params: { currentFavoriteStatus: false, movieId: 123 }
  service: false → addMovieToFavorites(123)
  API: POST → 201 Created
  tap: isFavorite.update(false → true)
  UI: coracao preenchido

Click 2 (remover):
  toggleFavorite() → set(true)  // diferente de false anterior → dispara!
  params: { currentFavoriteStatus: true, movieId: 123 }
  service: true → removeMovieFromFavorites(123)
  API: DELETE → 204 No Content
  tap: isFavorite.update(true → false)
  UI: coracao vazio

Click 3 (adicionar de novo):
  toggleFavorite() → set(false)  // diferente de true anterior → dispara!
  // ... ciclo continua
```