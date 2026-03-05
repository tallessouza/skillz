---
name: rs-angular-implementando-filtro-de-filmes
description: "Applies Angular signal-based filtering patterns when building list filters with Signal Model, LinkedSignal, and Template Driven Forms. Use when user asks to 'filter a list', 'implement search', 'connect parent-child signals', 'use ngModel with signals', or 'create reactive filters in Angular'. Ensures immutable filtering, two-way binding with model(), and LinkedSignal recomputation. Make sure to use this skill whenever implementing filtering logic in Angular 19+ with signals. Not for backend filtering, pagination, or RxJS-based reactive forms."
---

# Filtro Reativo com Signal Model e LinkedSignal

> Conecte inputs de filtro em componentes filhos ao LinkedSignal do componente pai usando model() para two-way data binding automatico entre signals.

## Rules

1. **Use model() para inputs de filtro em componentes filhos** — `title = model<string>('')` nao `signal('')`, porque model() faz input+output simultaneamente, permitindo two-way binding com o componente pai
2. **Importe FormsModule para usar ngModel** — `import { FormsModule } from '@angular/forms'`, porque a diretiva ngModel vem desse modulo
3. **Nunca altere a lista original ao filtrar** — use `.filter()` que retorna novo array, porque perder a lista original quebra filtros subsequentes
4. **Normalize antes de comparar** — `.toLowerCase().trim()` em ambos os lados (input e dado), porque evita falsos negativos por case ou espacos
5. **Retorne a lista original quando filtros estiverem vazios** — `if (!titleSearch && !categorySearch) return moviesList`, porque filtrar com string vazia e processamento desnecessario
6. **LinkedSignal recomputa automaticamente** — qualquer signal referenciado dentro do linkedSignal dispara recomputacao, entao basta referenciar os signals de filtro dentro dele

## How to write

### Signal Model no componente filho (MoviesFilter)

```typescript
import { model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  template: `
    <input [(ngModel)]="title" placeholder="Pesquisar filme" />
    <input [(ngModel)]="category" placeholder="Categoria" />
  `
})
export class MoviesFilterComponent {
  title = model<string>('');
  category = model<string>('');
}
```

### Two-way binding no componente pai (ExploreMovies)

```typescript
// Template do pai — "banana in the box" syntax
<app-movies-filter
  [(title)]="movieTitleFilter"
  [(category)]="movieCategoryFilter"
/>
```

```typescript
// Classe do pai
movieTitleFilter = signal<string>('');
movieCategoryFilter = signal<string>('');
```

### LinkedSignal com logica de filtro

```typescript
moviesFiltered = linkedSignal(() => {
  const moviesList = this.moviesResource.value() ?? [];

  if (this.moviesResource.error()) return [];

  const titleSearch = this.movieTitleFilter().toLowerCase().trim();
  const categorySearch = this.movieCategoryFilter().toLowerCase().trim();

  if (!titleSearch && !categorySearch) return moviesList;

  return moviesList.filter((movie) => {
    const matchesTitle = movie.title.toLowerCase().includes(titleSearch);
    const matchesCategory = movie.genre.toLowerCase().includes(categorySearch);
    return matchesTitle && matchesCategory;
  });
});
```

## Example

**Before (filtragem imperativa com subscribe):**
```typescript
// Componente filho emite eventos manualmente
@Output() titleChange = new EventEmitter<string>();
onInput(event: Event) {
  this.titleChange.emit((event.target as HTMLInputElement).value);
}

// Componente pai recebe e filtra manualmente
onTitleChange(title: string) {
  this.filteredMovies = this.movies.filter(m =>
    m.title.includes(title)
  );
}
```

**After (com Signal Model + LinkedSignal):**
```typescript
// Componente filho — model() faz tudo
title = model<string>('');

// Template filho
<input [(ngModel)]="title" />

// Componente pai — binding direto + recomputacao automatica
movieTitleFilter = signal<string>('');

// Template pai
<app-movies-filter [(title)]="movieTitleFilter" />

// LinkedSignal recomputa sozinho
moviesFiltered = linkedSignal(() => {
  const movies = this.moviesResource.value() ?? [];
  const search = this.movieTitleFilter().toLowerCase().trim();
  if (!search) return movies;
  return movies.filter(m => m.title.toLowerCase().includes(search));
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Input de filtro em componente filho | Use `model<string>('')` + `[(ngModel)]` |
| Conectar filho ao pai | Use banana-in-the-box `[(prop)]="signalDoPai"` no template do pai |
| Filtro com multiplos campos | Combine com `&&` dentro do `.filter()` callback |
| Lista vazia apos filtro | Verifique se `.toLowerCase().trim()` esta em ambos os lados |
| Filtros vazios | Retorne lista original sem processar `.filter()` |
| Precisa de set() programatico | model() suporta `.set()`, signal() nao faz two-way binding |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `this.movies = this.movies.filter(...)` | `return moviesList.filter(...)` (novo array) |
| `@Output() + EventEmitter` para binding simples | `model<string>('')` com `[(ngModel)]` |
| Comparar sem normalizar case | `.toLowerCase().trim()` em ambos os lados |
| Filtrar quando inputs estao vazios | `if (!search) return originalList` |
| signal() quando precisa de two-way com template | `model()` do `@angular/core` |
| Reactive Forms so para binding simples | Template Driven Forms + model() e suficiente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
