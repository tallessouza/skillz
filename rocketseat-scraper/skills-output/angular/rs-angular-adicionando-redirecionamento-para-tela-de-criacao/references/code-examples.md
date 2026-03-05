# Code Examples: Redirecionamento com RouterLink

## Exemplo completo da aula

### explore-movies.component.ts

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-explore-movies',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './explore-movies.component.html',
  styleUrls: ['./explore-movies.component.scss'],
})
export class ExploreMoviesComponent {
  // logica do componente
}
```

### explore-movies.component.html (trecho relevante)

```html
<button routerLink="/create">Adicionar Filme</button>
```

## Variacoes comuns

### RouterLink em elemento `<a>`

```html
<a routerLink="/movies/123">Ver detalhes</a>
```

### RouterLink com binding dinamico

```html
<!-- Quando a rota depende de uma variavel -->
<a [routerLink]="['/movies', movie.id]">{{ movie.title }}</a>
```

### RouterLink com queryParams

```html
<a routerLink="/movies" [queryParams]="{ genre: 'action' }">Filmes de Acao</a>
```

### Multiplos imports de routing no componente

```typescript
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="/explore" routerLinkActive="active">Explorar</a>
      <a routerLink="/create" routerLinkActive="active">Criar</a>
    </nav>
  `,
})
export class NavComponent {}
```

### Comparacao: RouterLink vs Router.navigate()

```typescript
// DECLARATIVO (RouterLink) — para navegacao estatica no template
// explore-movies.component.html
// <button routerLink="/create">Adicionar Filme</button>

// PROGRAMATICO (Router.navigate) — para navegacao condicional no TS
import { Router } from '@angular/router';

export class CreateMovieComponent {
  constructor(private router: Router) {}

  onSave() {
    // salva o filme...
    this.router.navigate(['/explore']);
  }
}
```