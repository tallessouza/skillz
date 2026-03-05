---
name: rs-angular-atualizando-dados-avaliacao
description: "Applies RxJS tap operator pattern to update Angular signal state after successful HTTP requests. Use when user asks to 'update UI after API call', 'refresh data after mutation', 'sync state after POST/PUT', or 'use tap operator in Angular'. Ensures linkedSignal or signal values are updated inline via tap instead of separate subscription logic. Make sure to use this skill whenever handling side-effect state updates after HTTP mutations in Angular. Not for error handling, retry logic, or initial data fetching."
---

# Atualizando Estado via TAP apos Mutacao HTTP

> Ao receber resposta de uma mutacao HTTP, use o operador `tap` do RxJS para atualizar o signal inline, mantendo o fluxo declarativo e legivel.

## Rules

1. **Use `tap` para side-effects de atualizacao** — `pipe(tap(...))` no Observable da mutacao, porque mantem o fluxo em um unico lugar sem logica espalhada
2. **`tap` so executa em sucesso** — ele nao dispara em caso de erro, entao e seguro para atualizar estado otimisticamente apos confirmacao do backend
3. **Prefira `tap` sobre logica adicional no linkedSignal** — porque fica mais simples de ler e entender do que adicionar logica condicional dentro da definicao do signal
4. **Quando o response da mutacao tem a mesma estrutura do detalhe, reutilize direto** — faca `.set(movieUpdated)` sem transformacao, porque a API ja retorna o objeto completo atualizado
5. **Use `.set()` em linkedSignal para atualizar valor posterior** — linkedSignals permitem set manual alem da derivacao automatica

## How to write

### Padrao: tap para atualizar signal apos mutacao

```typescript
// No resource/service que faz a mutacao HTTP
rateMovie(movieId: number, rating: number) {
  return this.http.post<MovieDetails>(`/api/movies/${movieId}/rate`, { rating })
    .pipe(
      tap((movieUpdated) => {
        this.movieDetails.set(movieUpdated);
      })
    );
}
```

### Padrao: linkedSignal com set posterior

```typescript
// movieDetails e um linkedSignal derivado do fetch inicial
// mas aceita .set() para atualizacoes posteriores
movieDetails = linkedSignal(() => this.fetchMovieDetails());

// Apos mutacao, o tap faz o set
tap((movieUpdated) => {
  this.movieDetails.set(movieUpdated);
})
```

## Example

**Before (logica separada, verbose):**
```typescript
rateMovie(movieId: number, rating: number) {
  return this.http.post<MovieDetails>(`/api/movies/${movieId}/rate`, { rating });
}

// No componente, subscribe manual e logica separada
this.rateMovieResource.rateMovie(id, rating).subscribe((result) => {
  this.movieDetails.set(result);
});
```

**After (tap inline, declarativo):**
```typescript
rateMovie(movieId: number, rating: number) {
  return this.http.post<MovieDetails>(`/api/movies/${movieId}/rate`, { rating })
    .pipe(
      tap((movieUpdated) => {
        this.movieDetails.set(movieUpdated);
      })
    );
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Response da mutacao tem mesma estrutura do detalhe | `.set(response)` direto, sem transformacao |
| Response da mutacao retorna apenas status | Faca novo fetch ou atualize campos individuais |
| Precisa atualizar multiplos signals | Coloque todos os `.set()` dentro do mesmo `tap` |
| Precisa de logica condicional apos mutacao | `tap` ainda e o lugar, use if/else dentro dele |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Subscribe separado so para atualizar state | `pipe(tap(...))` inline no Observable |
| Logica complexa no linkedSignal para reagir a mutacoes | `tap` + `.set()` apos a mutacao HTTP |
| `map` para side-effects de atualizacao | `tap` — map e para transformacao, tap e para side-effects |
| Ignorar o response quando ele traz dados atualizados | Usar o response para atualizar o signal |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
