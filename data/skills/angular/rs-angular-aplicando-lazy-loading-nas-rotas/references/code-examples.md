# Code Examples: Lazy Loading nas Rotas Angular

## Exemplo 1: Migrando uma rota simples para loadComponent

### Antes (import estatico)

```typescript
import { ExploreMovies } from './features/movies/pages/explore-movies/explore-movies';

export const routes: Routes = [
  { path: '', component: ExploreMovies },
];
```

### Depois (lazy loading)

```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/movies/pages/explore-movies/explore-movies')
        .then(m => m.ExploreMovies),
  },
];
```

Nota: o import estatico no topo do arquivo e removido completamente.

## Exemplo 2: Arquivo de rotas agrupadas (movies.routes.ts)

```typescript
// src/app/core/routes/movies.routes.ts
import { Routes } from '@angular/router';

export const MOVIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../features/movies/pages/explore-movies/explore-movies')
        .then(m => m.ExploreMovies),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('../../features/favorites/pages/favorite-movies/favorite-movies')
        .then(m => m.FavoriteMovies),
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('../../features/movies/pages/movie-details/movie-details')
        .then(m => m.MovieDetails),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('../../features/movies/pages/create-movie/create-movie')
        .then(m => m.CreateMovie),
  },
];
```

## Exemplo 3: Arquivo de rotas de autenticacao (auth.routes.ts)

```typescript
// src/app/core/routes/auth.routes.ts
import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../../features/authentication/pages/login-form/login-form')
        .then(m => m.LoginForm),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../../features/authentication/pages/register-user-form/register-user-form')
        .then(m => m.RegisterUserForm),
  },
];
```

## Exemplo 4: Arquivo principal de rotas usando loadChildren

```typescript
// src/app/app.routes.ts
// Nenhum import de componente — tudo e lazy

export const routes: Routes = [
  {
    path: 'movies',
    loadChildren: () =>
      import('./core/routes/movies.routes').then(m => m.MOVIES_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/routes/auth.routes').then(m => m.AUTH_ROUTES),
  },
];
```

## Exemplo 5: Como verificar que o lazy loading esta funcionando

1. Abra o DevTools (F12) > Network > All
2. Recarregue a pagina (Ctrl+F5)
3. Observe o main.js — pesquise pelo nome do componente (ex: "ExploreMovies")
4. Deve haver apenas 1 referencia (o path do chunk), nao a implementacao completa
5. Navegue para a rota — observe o novo chunk sendo carregado no Network tab
6. O chunk contem a implementacao completa do componente

## Estrutura de pastas resultante

```
src/app/
├── app.routes.ts              # Rotas principais com loadChildren
├── core/
│   └── routes/
│       ├── movies.routes.ts   # Grupo de rotas de filmes
│       └── auth.routes.ts     # Grupo de rotas de autenticacao
├── features/
│   ├── movies/
│   │   └── pages/
│   │       ├── explore-movies/
│   │       ├── movie-details/
│   │       └── create-movie/
│   ├── favorites/
│   │   └── pages/
│   │       └── favorite-movies/
│   └── authentication/
│       └── pages/
│           ├── login-form/
│           └── register-user-form/
```