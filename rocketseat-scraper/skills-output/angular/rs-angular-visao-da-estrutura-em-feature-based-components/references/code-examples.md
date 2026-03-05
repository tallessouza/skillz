# Code Examples: Feature Based Components — Estrutura Angular

## Estrutura completa do projeto da aula

```
src/
├── core/
│   └── layout/
│       └── header/
│           ├── header.component.ts
│           ├── header.component.html
│           └── header.component.scss
│
├── features/
│   ├── authentication/
│   │   ├── layout/
│   │   │   └── authentication-screen/
│   │   │       ├── authentication-screen.component.ts
│   │   │       ├── authentication-screen.component.html
│   │   │       └── authentication-screen.component.scss
│   │   └── pages/
│   │       ├── login/
│   │       │   ├── login.component.ts
│   │       │   ├── login.component.html
│   │       │   └── login.component.scss
│   │       └── register-user-form/
│   │           ├── register-user-form.component.ts
│   │           ├── register-user-form.component.html
│   │           └── register-user-form.component.scss
│   │
│   ├── favorites/
│   │   └── pages/
│   │       └── favorite-movies/
│   │           ├── favorite-movies.component.ts
│   │           ├── favorite-movies.component.html
│   │           └── favorite-movies.component.scss
│   │
│   └── movies/
│       └── pages/
│           ├── create-movie/
│           │   ├── create-movie.component.ts
│           │   ├── create-movie.component.html
│           │   └── create-movie.component.scss
│           ├── explore-movies/
│           │   ├── explore-movies.component.ts
│           │   ├── explore-movies.component.html
│           │   └── explore-movies.component.scss
│           └── movie-details/
│               ├── movie-details.component.ts
│               ├── movie-details.component.html
│               └── movie-details.component.scss
│
└── shared/
    └── components/
        └── movies-list/
            ├── movies-list.component.ts
            ├── movies-list.component.html
            └── movies-list.component.scss
```

## Exemplo: Page reutilizando Component da Shared

```typescript
// features/favorites/pages/favorite-movies/favorite-movies.component.ts
import { Component } from '@angular/core';
import { MoviesListComponent } from '../../../../shared/components/movies-list/movies-list.component';

@Component({
  selector: 'app-favorite-movies',
  standalone: true,
  imports: [MoviesListComponent], // Reutiliza componente da Shared
  templateUrl: './favorite-movies.component.html',
})
export class FavoriteMoviesComponent {
  // Carregado na rota /favorites
}
```

```html
<!-- favorite-movies.component.html -->
<h1>Meus Favoritos</h1>
<app-movies-list [movies]="favoriteMovies"></app-movies-list>
```

## Exemplo: Layout com router-outlet (futuro da aula)

```typescript
// features/authentication/layout/authentication-screen/authentication-screen.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authentication-screen',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './authentication-screen.component.html',
})
export class AuthenticationScreenComponent {
  // Container estruturante — segura o fundo e o logo
  // Login e Register trocam DENTRO dele via router-outlet
}
```

```html
<!-- authentication-screen.component.html -->
<div class="auth-container">
  <img src="assets/logo.svg" alt="Logo" />
  <div class="auth-form-area">
    <router-outlet></router-outlet>
    <!-- Login ou Register aparece aqui baseado na rota -->
  </div>
</div>
```

## Exemplo: Rotas espelhando a estrutura de pastas

```typescript
// Rotas da feature de authentication
const authRoutes = [
  {
    path: '',
    component: AuthenticationScreenComponent, // Layout
    children: [
      { path: 'login', component: LoginComponent },           // Page
      { path: 'register', component: RegisterUserFormComponent }, // Page
    ],
  },
];

// Rotas da feature de movies
const movieRoutes = [
  { path: 'create', component: CreateMovieComponent },     // Page
  { path: 'explore', component: ExploreMoviesComponent },   // Page
  { path: 'details/:id', component: MovieDetailsComponent }, // Page
];

// Rotas da feature de favorites
const favoriteRoutes = [
  { path: 'favorites', component: FavoriteMoviesComponent }, // Page
];
```

## Exemplo: Dependencia PROIBIDA entre Features

```typescript
// ❌ ERRADO — Feature importando de outra Feature
// features/favorites/pages/favorite-movies/favorite-movies.component.ts
import { MovieService } from '../../../movies/services/movie.service';
// MovieService pertence a feature movies, nao pode ser importado por favorites

// ✅ CORRETO — Mover service compartilhado para Shared ou Core
// shared/services/movie.service.ts  (se reutilizavel)
// core/services/movie.service.ts    (se singleton global)
import { MovieService } from '../../../../shared/services/movie.service';
```

## Exemplo: Componente da Shared (widget reutilizavel)

```typescript
// shared/components/movies-list/movies-list.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  templateUrl: './movies-list.component.html',
})
export class MoviesListComponent {
  @Input() movies: Movie[] = [];
  // Widget puro — recebe dados, renderiza lista
  // Usado em ExploreMovies E FavoriteMovies
}
```