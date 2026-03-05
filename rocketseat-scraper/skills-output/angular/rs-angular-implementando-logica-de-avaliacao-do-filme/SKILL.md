---
name: rs-angular-logica-avaliacao-filme
description: "Applies RxResource pattern for conditional HTTP requests in Angular when implementing rating, voting, or toggle features. Use when user asks to 'implement rating', 'add star rating', 'make HTTP call on signal change', 'avoid unnecessary requests', or 'use RxResource with conditions'. Enforces params-guard pattern where undefined return skips HTTP execution. Make sure to use this skill whenever building reactive HTTP calls that depend on user interaction signals in Angular. Not for static data fetching, route resolvers, or non-interactive API calls."
---

# Logica de Avaliacao com RxResource Condicional

> Ao usar RxResource para disparar requisicoes HTTP baseadas em interacao do usuario, sempre guarde o params com uma condicao que retorne undefined para evitar chamadas desnecessarias.

## Rules

1. **Crie o metodo no service primeiro** — `rateMovie(movieId: number, rating: number)` no service, separado do componente, porque mantem a logica HTTP isolada e testavel
2. **Use RxResource para reatividade** — `rxResource` com `params` e `stream` para que mudancas em signals disparem requisicoes automaticamente, porque elimina subscriptions manuais
3. **Guarde params com condicao** — retorne `undefined` no callback de params quando o valor nao for valido, porque RxResource nao executa o stream quando params e undefined
4. **Evite chamada inicial indesejada** — valide que o rating > 0 antes de retornar o objeto de params, porque signals podem ter valor inicial que dispara requisicao indevida
5. **Trate deselecao como zero** — quando usuario clica no mesmo valor ja selecionado, sete currentRating para 0, porque isso naturalmente bloqueia a requisicao via guard de params

## How to write

### Service method para rating

```typescript
// movies-api.service.ts
rateMovie(movieId: number, rating: number) {
  return this.httpClient.post<IMovieResponse>(
    `http://localhost:3000/movies/${movieId}/rate`,
    { rating }
  );
}
```

### RxResource com params condicional

```typescript
// movie-details.component.ts
rateMovieResource = rxResource({
  params: () => {
    const rating = this.currentRating() ?? 0;

    if (rating > 0) {
      return {
        id: +this.id(),
        rating,
      };
    }

    return undefined; // bloqueia execucao do stream
  },
  stream: ({ params }) => {
    return this.moviesApi.rateMovie(params.id, params.rating);
  },
});
```

## Example

**Before (chamada HTTP executa na inicializacao):**
```typescript
rateMovieResource = rxResource({
  params: () => ({
    id: +this.id(),
    rating: this.currentRating() ?? 0, // 0 dispara requisicao invalida
  }),
  stream: ({ params }) =>
    this.moviesApi.rateMovie(params.id, params.rating),
});
```

**After (guard impede chamada com rating invalido):**
```typescript
rateMovieResource = rxResource({
  params: () => {
    const rating = this.currentRating() ?? 0;
    if (rating > 0) {
      return { id: +this.id(), rating };
    }
    return undefined;
  },
  stream: ({ params }) =>
    this.moviesApi.rateMovie(params.id, params.rating),
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Signal pode ter valor inicial undefined/zero | Guard no params retornando undefined |
| Usuario clica no mesmo valor ja selecionado | Sete para 0, deixe o guard bloquear |
| Multiplos signals no params | Qualquer mudanca dispara — valide todos antes de retornar |
| Requisicao POST depende de interacao | Use rxResource com params condicional |
| Requisicao GET de dados iniciais | Use rxResource sem guard (deixe executar) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `rating: this.currentRating() ?? 0` direto no return | Extraia para const, valide com if antes de retornar |
| Subscribe manual em signal para chamar HTTP | Use rxResource que gerencia subscription automaticamente |
| Passar undefined como rating no body | Retorne undefined no params para nao executar |
| Ignorar deselecao (clicar mesmo valor) | Trate como zero, guard bloqueia naturalmente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
