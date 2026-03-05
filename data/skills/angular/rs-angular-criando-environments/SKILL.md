---
name: rs-angular-criando-environments
description: "Applies Angular environment file configuration when setting up API URLs, build configurations, or multi-environment deployments. Use when user asks to 'configure environments', 'setup production URL', 'replace hardcoded URLs', 'create environment files', or 'configure ng build for different environments'. Ensures proper file replacement strategy in angular.json and consistent environment properties. Make sure to use this skill whenever generating Angular services with API URLs or configuring build pipelines. Not for backend environment variables, .env files, or non-Angular frameworks."
---

# Angular Environments

> Nunca use URLs fixas em services Angular — use arquivos de environment para cada ambiente (development, production, homologation).

## Rules

1. **Gere environments via CLI** — execute `ng generate environments` para criar a estrutura correta e configurar o `angular.json` automaticamente, porque configurar manualmente o file replacement é propenso a erro
2. **Importe sempre de `environment.ts`** — nunca importe `environment.development.ts` diretamente, porque o Angular faz o replacement automaticamente baseado na configuração de build
3. **Mantenha propriedades consistentes** — todos os arquivos de environment devem ter exatamente as mesmas propriedades, porque propriedades faltando causam erros em runtime em ambientes específicos
4. **`environment.ts` é produção** — no Angular moderno, o arquivo base sem sufixo é o de produção, porque o `ng build` usa a configuração `production` por padrão sem file replacement
5. **Remova barras finais da baseUrl** — não inclua `/` no final da baseUrl do environment, porque paths de imagem já começam com `/` e causam concatenação incorreta
6. **Nunca commite URLs de localhost em `environment.ts`** — o arquivo de produção nunca deve conter `localhost`, porque esse é o arquivo usado no build de distribuição

## How to write

### Gerando environments

```bash
ng generate environments
```

Isso cria:
- `src/environments/environment.ts` (produção)
- `src/environments/environment.development.ts` (desenvolvimento)
- Configuração de file replacement no `angular.json`

### Arquivos de environment

```typescript
// environment.ts (PRODUÇÃO)
export const environment = {
  baseUrl: 'https://api.meusite.com',
};

// environment.development.ts (DESENVOLVIMENTO)
export const environment = {
  baseUrl: 'http://localhost:3000',
};
```

### Consumindo no service

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
}
```

### Testando com configuração de produção

```bash
# Development (padrão do ng serve)
ng serve

# Produção (simula build de produção)
ng serve --configuration=production
```

## Example

**Before (URL hardcoded):**
```typescript
export class UserApiService {
  validateToken() {
    return this.http.get('http://localhost:3000/users/validate-token');
  }
  login(body: LoginRequest) {
    return this.http.post('http://localhost:3000/users/login', body);
  }
}
```

**After (com environment):**
```typescript
import { environment } from '@environments/environment';

export class UserApiService {
  validateToken() {
    return this.http.get(`${environment.baseUrl}/users/validate-token`);
  }
  login(body: LoginRequest) {
    return this.http.post(`${environment.baseUrl}/users/login`, body);
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova URL de API em service | Use `environment.baseUrl` + path |
| Precisa de novo ambiente (homologação) | Crie `environment.homol.ts` e configure file replacement no `angular.json` |
| Path de imagem começa com `/` | Não coloque `/` no final da baseUrl |
| Quer testar configuração de produção localmente | `ng serve --configuration=production` |
| `ng build` sem flags | Usa `production` por padrão |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `http.get('http://localhost:3000/movies')` | `http.get(\`${environment.baseUrl}/movies\`)` |
| `import { environment } from './environment.development'` | `import { environment } from '@environments/environment'` |
| `baseUrl: 'http://localhost:3000/'` (com barra final) | `baseUrl: 'http://localhost:3000'` (sem barra) |
| `baseUrl: 'http://localhost:3000'` em `environment.ts` | `baseUrl: 'https://api.prod.com'` em `environment.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
