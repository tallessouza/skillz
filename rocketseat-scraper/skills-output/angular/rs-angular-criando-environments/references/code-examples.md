# Code Examples: Angular Environments

## 1. Gerando a estrutura

```bash
ng generate environments
```

Resultado:
- Cria `src/environments/environment.ts`
- Cria `src/environments/environment.development.ts`
- Modifica `angular.json` com file replacement na configuração development

## 2. Configuração no angular.json (gerado automaticamente)

```json
{
  "configurations": {
    "production": {
      "budgets": [],
      "outputHashing": "all"
    },
    "development": {
      "optimization": false,
      "extractLicenses": false,
      "sourceMap": true,
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.development.ts"
        }
      ]
    }
  },
  "defaultConfiguration": "development"
}
```

Note: `production` não tem `fileReplacements` — usa `environment.ts` diretamente.

## 3. Arquivos de environment

```typescript
// src/environments/environment.ts (PRODUÇÃO)
export const environment = {
  baseUrl: 'https://minhaurlprod.com',
};

// src/environments/environment.development.ts
export const environment = {
  baseUrl: 'http://localhost:3000',
};
```

## 4. User API Service — substituição completa

```typescript
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);

  validateToken() {
    return this.http.get(`${environment.baseUrl}/users/validate-token`);
  }

  login(body: LoginRequest) {
    return this.http.post(`${environment.baseUrl}/users/login`, body);
  }

  register(body: RegisterRequest) {
    return this.http.post(`${environment.baseUrl}/users`, body);
  }
}
```

## 5. Favorites API Service

```typescript
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class FavoritesApiService {
  private http = inject(HttpClient);

  getFavorites() {
    return this.http.get<Favorite[]>(`${environment.baseUrl}/favorites`);
  }

  addFavorite(movieId: string) {
    return this.http.post(`${environment.baseUrl}/favorites`, { movieId });
  }
}
```

## 6. Movies API Service

```typescript
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class MoviesApiService {
  private http = inject(HttpClient);

  getMovies() {
    return this.http.get<Movie[]>(`${environment.baseUrl}/movies`);
  }

  getMovieDetails(id: string) {
    return this.http.get<Movie>(`${environment.baseUrl}/movies/${id}`);
  }

  rateMovie(id: string, rating: number) {
    return this.http.post(`${environment.baseUrl}/movies/${id}/rate`, { rating });
  }

  createMovie(body: CreateMovieRequest) {
    return this.http.post(`${environment.baseUrl}/movies`, body);
  }
}
```

## 7. BasePath para imagens (sem barra)

```typescript
import { environment } from '@environments/environment';

export class MoviesListComponent {
  // Sem barra no final da baseUrl porque o path da imagem já começa com /
  basePath = environment.baseUrl;
}
```

## 8. Comandos de teste

```bash
# Serve com configuração development (padrão)
ng serve

# Serve simulando produção
ng serve --configuration=production

# Build de produção (usa environment.ts diretamente)
ng build
```