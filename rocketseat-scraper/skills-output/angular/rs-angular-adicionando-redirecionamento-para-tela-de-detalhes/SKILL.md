---
name: rs-angular-routerlink-redirect
description: "Applies Angular routerLink navigation pattern when user asks to 'add navigation', 'redirect on click', 'link to detail page', 'navigate to route', or 'add routerLink' in Angular components. Generates correct routerLink binding with dynamic route segments using array syntax. Make sure to use this skill whenever implementing click-based navigation in Angular templates. Not for React Router, Vue Router, or server-side redirects."
---

# RouterLink com Redirecionamento Dinâmico no Angular

> Ao navegar entre rotas no Angular via template, use a diretiva `routerLink` com array syntax para construir paths dinâmicos.

## Rules

1. **Importe `RouterLink` no componente** — adicione ao array de imports do componente, porque sem o import o Angular ignora silenciosamente a diretiva
2. **Use property binding com array** — `[routerLink]="['/path', id]"` não `routerLink="/path/{{id}}"`, porque o array concatena segmentos de forma type-safe e evita erros de interpolação
3. **Cada segmento do path é um item do array** — `['/details', movie.id]` gera `/details/123`, porque o Angular junta os itens com `/` automaticamente
4. **Coloque o routerLink no elemento clicável** — no `<button>` ou `<a>` que representa a ação, porque garante acessibilidade e semântica correta
5. **O segmento dinâmico deve corresponder ao parâmetro da rota** — se a rota é `details/:id`, passe `movie.id` como segundo item, porque mismatch gera 404

## How to write

### Import no componente

```typescript
import { RouterLink } from '@angular/router';

@Component({
  // ...
  imports: [RouterLink],
})
export class MoviesListComponent {}
```

### routerLink no template

```html
<button [routerLink]="['/details', movie.id]">
  {{ movie.title }}
</button>
```

### Rota correspondente no app.routes.ts

```typescript
export const routes: Routes = [
  { path: 'details/:id', component: MovieDetailsComponent },
];
```

## Example

**Before (sem navegação):**
```html
<button>{{ movie.title }}</button>
```

**After (com routerLink dinâmico):**
```html
<button [routerLink]="['/details', movie.id]">
  {{ movie.title }}
</button>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Navegação por clique em item de lista | `[routerLink]` com array no elemento clicável |
| Path com múltiplos segmentos dinâmicos | Adicione mais itens ao array: `['/category', catId, 'details', movieId]` |
| Navegação programática (após lógica) | Use `Router.navigate()` no componente TS, não routerLink |
| Link simples sem parâmetro dinâmico | `routerLink="/about"` (string simples, sem binding) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `routerLink="/details/{{movie.id}}"` | `[routerLink]="['/details', movie.id]"` |
| `(click)="navigate(movie.id)"` para navegação simples | `[routerLink]="['/details', movie.id]"` |
| `[routerLink]` sem importar `RouterLink` | Adicione `RouterLink` aos imports do componente |
| `href="/details/{{id}}"` | `[routerLink]` para evitar full page reload |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
