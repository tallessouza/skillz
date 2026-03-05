---
name: rs-angular-listando-filmes-template
description: "Applies Angular RxResource, LinkedSignal, and signal input patterns when building components that fetch and display lists. Use when user asks to 'fetch data in Angular', 'list items from API', 'pass data to child component', 'filter a list', or 'use RxResource'. Covers RxResource auto-fetch, LinkedSignal for filtered lists with error handling, and signal-based input() for parent-child communication. Make sure to use this skill whenever creating Angular components that consume HTTP data and pass it to children. Not for React, Vue, or non-Angular frameworks."
---

# Listando Dados com RxResource, LinkedSignal e Signal Input

> Ao consumir dados HTTP em Angular, use RxResource para fetch, LinkedSignal para listas derivadas/filtradas, e input() signal para comunicacao pai-filho.

## Rules

1. **Use RxResource para chamadas HTTP** — crie um resource com `params` retornando `true` para auto-fetch no carregamento do componente, porque retornar `undefined` impede a execucao inicial do stream
2. **Mantenha duas listas: original e filtrada** — a original vem do RxResource e nunca muda, a filtrada e um LinkedSignal que sera manipulada por filtros, porque isso preserva os dados originais para refiltragem
3. **Use LinkedSignal quando precisar setar valor manualmente no futuro** — se a lista filtrada so dependesse de computacao pura, `computed` bastaria, mas como futuramente voce vai setar valores na mao, LinkedSignal e a escolha correta
4. **Trate erros no LinkedSignal retornando array vazio** — verifique `resource.error()` e retorne `[]` se houver erro, porque garante consistencia de tipos (sempre array, nunca string ou undefined)
5. **Use `input()` signal ao inves de `@Input()`** — para componentes que recebem dados via signal, use `input<Type>()` com valor inicial, porque integra melhor com o sistema de signals do Angular
6. **Invoque signals no template** — signals sao funcoes, entao use `mySignal()` na interpolacao, porque sem os parenteses voce exibe a referencia da funcao, nao o valor

## How to write

### RxResource com auto-fetch

```typescript
private readonly _moviesApi = inject(MoviesApi);

moviesResource = rxResource({
  params: () => true, // true = auto-fetch ao carregar; undefined = nao executa
  stream: () => this._moviesApi.getMovies(),
});
```

### LinkedSignal para lista filtrada com tratamento de erro

```typescript
moviesFiltered = linkedSignal(() => {
  const errorOnResponse = !!this.moviesResource.error();

  if (errorOnResponse) {
    return [];
  }

  const moviesList = this.moviesResource.value();
  return moviesList ?? [];
});
```

### Signal input no componente filho

```typescript
// movies-list.component.ts
movies = input<MoviesListResponse>([]);
```

### Passando signal input no template pai

```html
<app-movies-list [movies]="moviesFiltered()" />
```

## Example

**Before (sem tratamento de erro, @Input classico):**

```typescript
// pai
@Component({...})
export class ExploreComponent implements OnInit {
  movies: Movie[] = [];

  ngOnInit() {
    this.http.get('/movies').subscribe(data => this.movies = data);
  }
}

// filho
export class MoviesListComponent {
  @Input() movies: Movie[] = [];
}
```

**After (com RxResource, LinkedSignal e signal input):**

```typescript
// pai - explore.component.ts
export class ExploreComponent {
  private readonly _moviesApi = inject(MoviesApi);

  moviesResource = rxResource({
    params: () => true,
    stream: () => this._moviesApi.getMovies(),
  });

  moviesFiltered = linkedSignal(() => {
    const errorOnResponse = !!this.moviesResource.error();
    if (errorOnResponse) return [];
    const moviesList = this.moviesResource.value();
    return moviesList ?? [];
  });
}

// pai template
<app-movies-list [movies]="moviesFiltered()" />

// filho - movies-list.component.ts
export class MoviesListComponent {
  movies = input<MoviesListResponse>([]);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Dados devem carregar automaticamente ao abrir componente | `params: () => true` no RxResource |
| Dados so carregam apos acao do usuario | `params: () => undefined` no RxResource |
| Lista derivada que sera manipulada manualmente no futuro | Use `linkedSignal` |
| Lista derivada somente leitura | Use `computed` |
| Componente filho recebe dados do pai via signal | Use `input<Type>(valorInicial)` |
| Precisa debugar lista no template | Use `{{ signal() \| json }}` com `JsonPipe` importado |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `@Input() movies: Movie[] = []` | `movies = input<MoviesListResponse>([])` |
| `ngOnInit() { this.http.get(...).subscribe() }` | `rxResource({ params: () => true, stream: () => ... })` |
| `moviesFiltered = computed(...)` quando vai setar valor | `moviesFiltered = linkedSignal(...)` |
| Retornar `null` ou `undefined` em caso de erro | Retornar `[]` para consistencia de tipos |
| `{{ moviesFiltered }}` sem invocar | `{{ moviesFiltered() }}` com parenteses |
| Usar `JsonPipe` sem importar no componente | Adicionar `JsonPipe` nos imports do componente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
