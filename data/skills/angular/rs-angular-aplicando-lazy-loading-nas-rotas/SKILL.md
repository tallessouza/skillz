---
name: rs-angular-lazy-loading-rotas
description: "Applies Angular lazy loading patterns with loadComponent and loadChildren when writing route configurations. Use when user asks to 'create routes', 'configure routing', 'optimize bundle', 'add lazy loading', or 'improve performance' in Angular projects. Ensures each route uses dynamic imports to split code into separate chunks. Make sure to use this skill whenever generating Angular route files, even if the user doesn't mention lazy loading. Not for React/Next.js routing, HTTP interceptors, or Angular guards configuration."
---

# Lazy Loading nas Rotas Angular

> Carregue componentes apenas quando a rota for acessada, nunca no bundle inicial.

## Rules

1. **Nunca importe componentes diretamente no arquivo de rotas** — use `loadComponent` com import dinamico, porque imports estaticos incluem o componente no bundle inicial mesmo que o usuario nunca acesse aquela rota
2. **Agrupe rotas relacionadas em arquivos separados** — `movies.routes.ts`, `auth.routes.ts` na pasta `core/routes/`, porque facilita manutencao e evita arquivos de rotas espalhados
3. **Use `loadChildren` para carregar grupos de rotas filhas** — porque o grupo inteiro vira um chunk separado, carregado sob demanda
4. **Dentro de `loadChildren`, use `loadComponent` em cada rota filha** — porque senao ao carregar o grupo todos os componentes filhos vem juntos, eliminando o beneficio do lazy loading individual
5. **Remova imports estaticos dos componentes ao migrar para lazy loading** — imports orfaos no topo do arquivo fazem o bundler incluir o codigo no bundle inicial mesmo sem uso direto

## How to write

### Rota individual com loadComponent

```typescript
{
  path: '',
  loadComponent: () =>
    import('./features/movies/pages/explore-movies/explore-movies')
      .then(m => m.ExploreMovies),
}
```

### Arquivo de rotas agrupadas (movies.routes.ts)

```typescript
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
];
```

### Carregando grupo de rotas com loadChildren

```typescript
{
  path: 'movies',
  loadChildren: () =>
    import('./core/routes/movies.routes')
      .then(m => m.MOVIES_ROUTES),
}
```

## Example

**Before (tudo no bundle inicial):**

```typescript
import { ExploreMovies } from './features/movies/pages/explore-movies/explore-movies';
import { FavoriteMovies } from './features/favorites/pages/favorite-movies/favorite-movies';
import { LoginForm } from './features/authentication/pages/login-form/login-form';

export const routes: Routes = [
  {
    path: 'movies',
    children: [
      { path: '', component: ExploreMovies },
      { path: 'favorites', component: FavoriteMovies },
    ],
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginForm },
    ],
  },
];
```

**After (lazy loading com chunks separados):**

```typescript
// Nenhum import de componente no topo

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

## Heuristics

| Situacao | Acao |
|----------|------|
| Componente acessado apenas apos navegacao | Sempre `loadComponent` |
| Grupo de rotas filhas relacionadas | Extrair para arquivo separado + `loadChildren` |
| Rota de login/registro | Lazy loading, porque usuario logado nunca acessa |
| Componente muito leve (< 20 linhas) | Lazy loading mesmo assim, o custo e minimo e o padrao fica consistente |
| Usuario pode ja estar logado | Rotas de auth devem ser lazy, serao carregadas apenas se necessario |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `import { Comp } from '...'` + `component: Comp` em rotas | `loadComponent: () => import('...').then(m => m.Comp)` |
| `children: [...]` com components inline | `loadChildren: () => import('...').then(m => m.ROUTES)` |
| `loadChildren` com `component` nas rotas filhas | `loadChildren` com `loadComponent` em cada rota filha |
| Imports estaticos de componentes que migraram para lazy | Remover o import completamente |
| Arquivos de rotas dentro de cada feature | Centralizar em `core/routes/` para facilitar manutencao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
