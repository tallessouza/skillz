---
name: rs-angular-salvar-arquivo-multipart
description: "Enforces correct MultipartFormData request patterns when writing Angular HTTP services. Use when user asks to 'upload a file', 'send an image', 'create a form with file upload', 'implement multipart request', or 'post binary data' in Angular. Applies rules: use FormData for binary+text payloads, never set Content-Type manually, type the response generic. Make sure to use this skill whenever implementing file upload or binary data submission in Angular. Not for JSON-only requests, file download, or non-Angular HTTP clients."
---

# Requisicoes MultipartFormData no Angular

> Ao enviar arquivos binarios junto com dados textuais no Angular, use FormData e deixe o framework configurar os headers automaticamente.

## Rules

1. **Use FormData para binarios + texto** — `new FormData()` e nao JSON, porque JSON nao consegue transportar arquivos binarios como imagens
2. **Nunca defina Content-Type manualmente** — o Angular detecta FormData e adiciona `multipart/form-data` com o boundary correto automaticamente; definir manualmente quebra o boundary
3. **Tipar o retorno do post com generic** — `this.httpClient.post<IMovieResponse>(...)` para manter type safety no Observable
4. **Receba FormData pronto no service** — o service recebe `FormData` ja montado; a logica de montar o FormData fica no componente
5. **Reutilize interfaces de resposta** — se o retorno do POST tem a mesma shape do GET, use a mesma interface

## How to write

### Service method para upload

```typescript
// O service recebe FormData pronto e envia via POST
createMovie(movieData: FormData): Observable<IMovieResponse> {
  return this.httpClient.post<IMovieResponse>(
    `${this.apiUrl}/movies`,
    movieData
  );
}
```

### Montagem do FormData no componente

```typescript
// O componente monta o FormData com campos texto e binario
const formData = new FormData();
formData.append('title', movie.title);
formData.append('description', movie.description);
formData.append('releaseYear', movie.releaseYear.toString());
formData.append('genre', movie.genre);
formData.append('image', imageFile); // File binario
```

## Example

**Before (erro comum — tentar enviar binario via JSON):**
```typescript
createMovie(movie: CreateMovieDTO): Observable<IMovieResponse> {
  return this.httpClient.post<IMovieResponse>(
    `${this.apiUrl}/movies`,
    movie, // objeto JS — nao transporta binarios
    { headers: { 'Content-Type': 'multipart/form-data' } } // header manual quebra o boundary
  );
}
```

**After (com esta skill aplicada):**
```typescript
createMovie(movieData: FormData): Observable<IMovieResponse> {
  return this.httpClient.post<IMovieResponse>(
    `${this.apiUrl}/movies`,
    movieData // Angular detecta FormData e configura headers automaticamente
  );
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Envio de imagem/arquivo + campos texto | Use FormData (multipart) |
| Envio apenas de dados texto/JSON | Use objeto JS normal (application/json) |
| Precisa definir Content-Type para multipart | Nao defina — Angular faz automaticamente |
| Resposta do POST tem mesma shape do GET | Reutilize a interface existente |
| Logica de montar FormData | No componente, nao no service |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `headers: { 'Content-Type': 'multipart/form-data' }` | Nenhum header — Angular configura automaticamente |
| `JSON.stringify(fileData)` para enviar binario | `formData.append('file', binaryFile)` |
| `httpClient.post(url, { image: base64String })` | `httpClient.post(url, formDataComBinario)` |
| Montar FormData dentro do service | Receber FormData pronto no parametro do service |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
