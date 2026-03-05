# Code Examples: Visao Geral do Projeto AB Filmes

## Nota

Esta aula e uma visao geral do projeto — nao contem codigo implementado. Os exemplos abaixo sao estruturas esperadas baseadas nas funcionalidades demonstradas.

## Estrutura de Rotas Esperada

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'explore',
    component: ExploreComponent,
    canActivate: [authGuard]
  },
  {
    path: 'details/:uid',
    component: DetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'add',
    component: AddMovieComponent,
    canActivate: [authGuard]
  }
];
```

## Modelo de Dados Esperado

```typescript
interface Movie {
  uid: string;
  title: string;
  imageUrl: string;
  category: string;
  releaseYear: number;
  description: string;
  averageRating: number;
  totalRatings: number;
}

interface User {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}
```

## Filtros com Signals (Padrao Esperado)

```typescript
// explore.component.ts
export class ExploreComponent {
  movies = signal<Movie[]>([]);
  nameFilter = signal('');
  categoryFilter = signal('');

  filteredMovies = computed(() => {
    let result = this.movies();

    if (this.nameFilter()) {
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(this.nameFilter().toLowerCase())
      );
    }

    if (this.categoryFilter()) {
      result = result.filter(movie =>
        movie.category.toLowerCase().includes(this.categoryFilter().toLowerCase())
      );
    }

    return result;
  });

  clearFilters() {
    this.nameFilter.set('');
    this.categoryFilter.set('');
  }
}
```

## Validacao de Formulario de Cadastro (Padrao Esperado)

```typescript
// signup.component.ts
export class SignupComponent {
  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }
}
```

## Auth Guard (Padrao Esperado)

```typescript
// guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/']);
};
```

## Endpoints Esperados

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/auth/signup` | Cadastro de usuario |
| POST | `/auth/login` | Login, retorna token |
| GET | `/movies` | Lista todos os filmes |
| GET | `/movies/:uid` | Detalhes de um filme |
| POST | `/movies` | Criar filme (com imagem) |
| POST | `/movies/:uid/ratings` | Avaliar filme |
| GET | `/favorites` | Listar favoritos do usuario |
| POST | `/favorites/:movieUid` | Adicionar favorito |
| DELETE | `/favorites/:movieUid` | Remover favorito |