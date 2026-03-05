---
name: rs-angular-binding-detalhes-filme
description: "Applies Angular template binding patterns when displaying detail views with signals, interpolation, property binding, and pipes. Use when user asks to 'bind data to template', 'display details', 'show movie info', 'use Angular signals in template', or 'format numbers in Angular'. Covers linked signals, DecimalPipe with pt-BR locale, and image URL concatenation. Make sure to use this skill whenever building detail/show pages in Angular that consume HTTP resource data. Not for list views, routing setup, or HTTP request configuration."
---

# Binding de Detalhes com Signals e Pipes no Angular

> Ao exibir dados de detalhe no template Angular, use linked signals para estado mutavel, interpolacao para texto, property binding para atributos, e pipes para formatacao.

## Rules

1. **Use linkedSignal para dados que serao atualizados** — `linkedSignal` em vez de `signal` simples, porque permite atualizacao futura (ex: rating do usuario) sem refatorar
2. **Trate erro no callback do linkedSignal** — verifique `resource.error` antes de retornar `resource.value`, retornando `undefined` em caso de erro, porque evita exibir dados parciais/corrompidos
3. **Separe a base URL como propriedade readonly** — `readonly baseUrl = 'http://localhost:3000'`, porque centraliza a configuracao e facilita troca de ambiente
4. **Use property binding para imagens** — `[src]="baseUrl + movieDetails().imagePath"`, porque concatenacao dinamica exige binding, nao interpolacao em atributos
5. **Invoque signals com parenteses no template** — `movieDetails()` nao `movieDetails`, porque signal sem invocacao retorna o objeto Signal, nao o valor
6. **Formate numeros com DecimalPipe e locale** — `{{ value | number:'1.0-1':'pt-BR' }}`, porque garante formatacao brasileira (virgula decimal) sem logica manual

## How to write

### LinkedSignal com tratamento de erro

```typescript
movieDetails = linkedSignal(() => {
  const errorOnResponse = !!this.movieDetailsResource.error();
  if (errorOnResponse) {
    return undefined;
  }
  return this.movieDetailsResource.value();
});
```

### Property binding para imagem com URL base

```typescript
// No componente
readonly baseUrl = 'http://localhost:3000';
```

```html
<!-- No template -->
<img [src]="baseUrl + movieDetails()?.imagePath" />
```

### Interpolacao com DecimalPipe

```html
<p class="text-lg text-grey-400">
  Média de avaliações:
  <span class="text-white font-medium">
    {{ movieDetails()?.voteAverage | number:'1.0-1':'pt-BR' }}
  </span>
  <span class="text-sm text-grey-500">
    ({{ movieDetails()?.voteCount }} avaliações)
  </span>
</p>
```

## Example

**Before (valores chumbados no template):**

```html
<img src="/images/matrix.jpg" />
<h1>Matrix</h1>
<p>Sci-Fi</p>
<p>2021</p>
<p>Média de avaliações: 4,5</p>
<p>(40 avaliações)</p>
<p>Descrição do filme aqui...</p>
```

**After (com binding e pipes):**

```html
<img [src]="baseUrl + movieDetails()?.imagePath" />
<h1>{{ movieDetails()?.title }}</h1>
<p>{{ movieDetails()?.genre }}</p>
<p>{{ movieDetails()?.releaseYear }}</p>
<p>
  Média de avaliações:
  <span class="text-white font-medium">
    {{ movieDetails()?.voteAverage | number:'1.0-1':'pt-BR' }}
  </span>
  <span class="text-sm text-grey-500">
    ({{ movieDetails()?.voteCount }} avaliações)
  </span>
</p>
<p>{{ movieDetails()?.description }}</p>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dado vem de resource HTTP | Use `linkedSignal` com verificacao de erro |
| Atributo HTML precisa de valor dinamico | Property binding `[attr]="expr"` |
| Texto inline no template | Interpolacao `{{ expr }}` |
| Numero com decimais para usuario BR | `number:'1.0-1':'pt-BR'` |
| URL composta (base + path) | Concatene no property binding, nao no template literal |
| Signal no template | Sempre invoque com `()` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `movieDetails.title` (sem invocar signal) | `movieDetails()?.title` |
| `src="{{ baseUrl + path }}"` (interpolacao em atributo) | `[src]="baseUrl + path"` |
| `{{ voteAverage.toFixed(1) }}` (formatacao manual) | `{{ voteAverage \| number:'1.0-1':'pt-BR' }}` |
| `signal(resource.value())` (signal simples para dado mutavel) | `linkedSignal(() => resource.value())` |
| URL hardcoded em cada template | `readonly baseUrl` centralizado no componente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
