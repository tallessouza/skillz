# Code Examples: Rotas de Area Autenticada com Main Layout

## 1. Geracao do componente via CLI

```bash
# Abrir terminal na pasta core/layout
cd src/app/core/layout

# Gerar componente sem arquivo de testes
ng generate component main-layout --skip-tests=true
```

Arquivos gerados:
- `main-layout.component.ts`
- `main-layout.component.html`
- `main-layout.component.css`

## 2. Configuracao completa das rotas

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { ExploreMoviesComponent } from './features/explore-movies/explore-movies.component';
import { FavoriteMoviesComponent } from './features/favorite-movies/favorite-movies.component';
import { MovieDetailsComponent } from './features/movie-details/movie-details.component';
import { CreateMovieComponent } from './features/create-movie/create-movie.component';

export const routes: Routes = [
  // Rotas publicas (login, registro) ficariam aqui

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'explore', pathMatch: 'full' },
      { path: 'explore', component: ExploreMoviesComponent },
      { path: 'favorites', component: FavoriteMoviesComponent },
      { path: 'details/:id', component: MovieDetailsComponent },
      { path: 'create', component: CreateMovieComponent },
    ]
  }
];
```

## 3. MainLayout Component completo

```typescript
// core/layout/main-layout/main-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {}
```

```html
<!-- core/layout/main-layout/main-layout.component.html -->
<app-header />
<router-outlet />
```

## 4. AppComponent (apenas router-outlet)

```html
<!-- app.component.html -->
<router-outlet />
```

O AppComponent nao tem header — apenas o outlet raiz que renderiza ou as rotas publicas (login/registro) ou o MainLayout (area autenticada).

## 5. Testando as rotas no navegador

| URL | Componente carregado |
|-----|---------------------|
| `localhost:4200` | Redireciona para `/explore` |
| `localhost:4200/explore` | ExploreMoviesComponent (dentro do MainLayout) |
| `localhost:4200/favorites` | FavoriteMoviesComponent (dentro do MainLayout) |
| `localhost:4200/details/1` | MovieDetailsComponent com id=1 (dentro do MainLayout) |
| `localhost:4200/details/42` | MovieDetailsComponent com id=42 (dentro do MainLayout) |
| `localhost:4200/create` | CreateMovieComponent (dentro do MainLayout) |

## 6. Cuidado com import do RouterOutlet

O instrutor mostrou um erro comum: o auto-import do Angular pode importar `RouterOutlet` de um local errado.

```typescript
// ERRADO — import de local incorreto (auto-import bugado)
import { RouterOutlet } from 'algum/local/errado';

// CORRETO — sempre de @angular/router
import { RouterOutlet } from '@angular/router';
```

## 7. Padrao aplicavel a outros dominios

O mesmo padrao funciona para qualquer area com layout diferente:

```typescript
// Area administrativa com sidebar
{
  path: 'admin',
  component: AdminLayoutComponent, // sidebar + router-outlet
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UsersComponent },
    { path: 'settings', component: SettingsComponent },
  ]
}

// Area publica com footer diferente
{
  path: '',
  component: PublicLayoutComponent, // navbar simples + footer + router-outlet
  children: [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
  ]
}
```