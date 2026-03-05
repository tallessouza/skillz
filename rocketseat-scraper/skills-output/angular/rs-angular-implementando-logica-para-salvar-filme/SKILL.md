---
name: rs-angular-salvar-filme-formdata
description: "Applies FormData multipart upload pattern with RxResource in Angular when building forms that submit files and data. Use when user asks to 'create a form', 'upload file', 'send multipart', 'save with image', or 'use RxResource for POST'. Enforces correct FormData population, signal-driven request triggering, and field naming aligned with backend. Make sure to use this skill whenever implementing file upload or multipart form submission in Angular. Not for GET requests, simple JSON posts without files, or non-Angular frameworks."
---

# FormData com RxResource no Angular

> Popule um FormData com campos nomeados conforme o backend espera e use um signal como gatilho do RxResource para disparar a requisição apenas quando os dados estiverem prontos.

## Rules

1. **Crie um signal tipado como `FormData | undefined` iniciando em `undefined`** — porque `undefined` impede o RxResource de executar o observable antes da hora
2. **Nomeie os campos do FormData exatamente como o backend espera** — confira no Insomnia/Swagger os nomes aceitos (`title`, `description`, `anoLancamento`, `image`, etc.)
3. **Converta números para string com `.toString()` antes de append** — porque FormData só aceita `string | Blob`
4. **Use fallback para string vazia em campos opcionais** — o backend trata e retorna erro adequado, evitando exceções no client
5. **Remova console.logs antes de finalizar** — código de debug não vai para produção
6. **Injete o service com `inject()` e use `private readonly`** — padrão Angular moderno sem decorators no construtor

## How to write

### Signal como gatilho de requisição

```typescript
// Signal começa undefined = RxResource NÃO executa inicialmente
movieFormData = signal<FormData | undefined>(undefined);

createMovieResource = rxResource({
  params: () => this.movieFormData(),
  stream: ({ params }) => this.moviesApi.createMovie(params),
});
```

### Popular FormData com campos do formulário

```typescript
save() {
  const formData = new FormData();
  formData.append('title', this.title);
  formData.append('description', this.description);
  formData.append('anoLancamento', this.year?.toString() ?? '');
  formData.append('category', this.category);
  formData.append('image', this.selectedFile ?? '');

  // Setar o signal dispara o RxResource automaticamente
  this.movieFormData.set(formData);
}
```

## Example

**Before (enviando JSON direto, sem suporte a arquivo):**

```typescript
save() {
  this.http.post('/api/movies', {
    title: this.title,
    description: this.description,
    year: this.year,
    image: this.imageUrl, // string URL, não o arquivo
  }).subscribe();
}
```

**After (FormData multipart com RxResource):**

```typescript
movieFormData = signal<FormData | undefined>(undefined);

createMovieResource = rxResource({
  params: () => this.movieFormData(),
  stream: ({ params }) => this.moviesApi.createMovie(params),
});

save() {
  const formData = new FormData();
  formData.append('title', this.title);
  formData.append('description', this.description);
  formData.append('anoLancamento', this.year?.toString() ?? '');
  formData.append('category', this.category);
  formData.append('image', this.selectedFile ?? '');
  this.movieFormData.set(formData);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Formulário envia arquivo (imagem, PDF) | Use FormData, nunca JSON |
| Campo numérico no FormData | `.toString()` com fallback `?? ''` |
| Requisição POST precisa ser reativa | Signal `undefined` inicial + RxResource |
| Nomes dos campos do form | Confira no backend/Insomnia antes de codar |
| Angular moderno (v17+) | `inject()` ao invés de constructor injection |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `formData.append('year', this.year)` (number) | `formData.append('anoLancamento', this.year?.toString() ?? '')` |
| `http.post(url, formData)` direto no save | `rxResource` com signal como gatilho |
| Signal iniciando com `new FormData()` | Signal iniciando com `undefined` |
| `Content-Type: multipart/form-data` manual | Deixe o Angular setar automaticamente |
| Nomes de campo inventados | Nomes exatos do backend |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
