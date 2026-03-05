---
name: rs-angular-requisicoes-favoritar-filme
description: "Applies Angular HttpClient patterns for favorite/unfavorite API endpoints when building toggle-style REST operations. Use when user asks to 'add favorite endpoint', 'implement like/unlike', 'create toggle API service', 'add/remove resource via HTTP', or any Angular service with paired POST/DELETE operations. Enforces proper void typing for 204 responses, interface segregation for API responses, and empty body for POST without payload. Make sure to use this skill whenever creating paired add/remove HTTP methods in Angular services. Not for component integration, state management, or authentication flows."
---

# Requisicoes de Favoritar/Desfavoritar em Angular

> Ao implementar endpoints pareados (adicionar/remover), tipe cada resposta explicitamente e respeite o contrato HTTP — POST com body vazio quando nao ha payload, DELETE tipado como void para 204 No Content.

## Rules

1. **Tipe respostas de API com interfaces dedicadas** — `IMovieToFavoriteSuccessResponse` nao `any`, porque o contrato da API fica documentado no codigo e o compilador valida o consumo
2. **POST sem payload envia objeto vazio** — `this.httpClient.post<T>(url, {})`, porque o HttpClient exige o segundo argumento de body mesmo quando a API nao espera payload
3. **DELETE com 204 No Content tipa como void** — `this.httpClient.delete<void>(url)`, porque nao ha JSON no response body e `void` comunica isso explicitamente
4. **Interfaces de response ficam em shared/models/** — um arquivo por interface com nome descritivo, porque centraliza contratos de API e facilita reuso entre services
5. **Concatene IDs na URL com template strings** — `` `${this.baseUrl}/favorites/${movieId}` `` nao string concatenation manual, porque e mais legivel e menos propenso a erro
6. **Nomeie metodos pelo dominio** — `addMovie(movieId)` e `removeMovie(movieId)` nao `post()` ou `delete()`, porque o service abstrai o transporte HTTP

## How to write

### Service com endpoints pareados (add/remove)

```typescript
@Injectable({ providedIn: 'root' })
export class FavoritesApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  addMovie(movieId: number) {
    return this.httpClient.post<IMovieToFavoriteSuccessResponse>(
      `${this.baseUrl}/favorites/${movieId}`,
      {}
    );
  }

  removeMovie(movieId: number) {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/favorites/${movieId}`
    );
  }
}
```

### Interface de response em shared/models/

```typescript
// shared/models/move-to-favorite-success-response.ts
export interface IMovieToFavoriteSuccessResponse {
  message: string;
}
```

## Example

**Before (sem tipagem, body ignorado):**
```typescript
addMovie(movieId: number) {
  return this.httpClient.post(
    `${this.baseUrl}/favorites/${movieId}`
    // ERRO: falta segundo argumento (body)
  );
}

removeMovie(movieId: number) {
  return this.httpClient.delete(
    `${this.baseUrl}/favorites/${movieId}`
  );
  // retorno nao tipado — consumidor nao sabe que e void
}
```

**After (com esta skill aplicada):**
```typescript
addMovie(movieId: number) {
  return this.httpClient.post<IMovieToFavoriteSuccessResponse>(
    `${this.baseUrl}/favorites/${movieId}`,
    {}
  );
}

removeMovie(movieId: number) {
  return this.httpClient.delete<void>(
    `${this.baseUrl}/favorites/${movieId}`
  );
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| POST sem body real | Passe `{}` como segundo argumento |
| Response 204 No Content | Tipe como `<void>` |
| Response com JSON simples | Crie interface dedicada em shared/models/ |
| Metodos pareados (add/remove) | Mantenha no mesmo service, nomeie pelo dominio |
| URL com ID dinamico | Use template literal, nunca concatenacao com `+` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `this.httpClient.post(url)` sem body | `this.httpClient.post(url, {})` |
| `this.httpClient.delete<any>(url)` | `this.httpClient.delete<void>(url)` |
| `return this.httpClient.post<any>(...)` | `return this.httpClient.post<ISpecificResponse>(...)` |
| `url + '/favorites/' + id` | `` `${url}/favorites/${id}` `` |
| Interface inline no service | Interface exportada em shared/models/ |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
