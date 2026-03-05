---
name: rs-angular-redirecionamento-routerlink
description: "Applies Angular RouterLink directive for in-app navigation when writing Angular templates. Use when user asks to 'add navigation', 'redirect to page', 'link to route', 'navigate on button click', or 'add routerLink' in Angular components. Ensures RouterLink is imported in component imports array and used declaratively in templates. Make sure to use this skill whenever adding navigation between Angular routes. Not for programmatic navigation with Router.navigate(), external links, or React/Vue routing."
---

# Redirecionamento com RouterLink no Angular

> Use RouterLink no template para navegacao declarativa entre rotas — nunca href para rotas internas.

## Rules

1. **Importe RouterLink no array de imports do componente** — `imports: [RouterLink]` no decorator `@Component`, porque sem isso o Angular nao reconhece a diretiva no template
2. **Use RouterLink no template, nao no TS** — navegacao declarativa pertence ao template, porque mantem o componente limpo e o comportamento visivel no HTML
3. **Use barra inicial na rota** — `routerLink="/create"` nao `routerLink="create"`, porque caminhos relativos dependem da rota ativa e causam bugs silenciosos
4. **Prefira RouterLink a Router.navigate() para links estaticos** — RouterLink e declarativo e acessivel (gera `<a>` com href), porque Router.navigate() e para navegacao programatica condicional

## How to write

### Importar RouterLink no componente

```typescript
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-explore-movies',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './explore-movies.component.html',
})
export class ExploreMoviesComponent {}
```

### Usar RouterLink no template

```html
<button routerLink="/create">Adicionar Filme</button>
```

## Example

**Before (botao sem navegacao):**

```html
<!-- Template -->
<button>Adicionar Filme</button>
```

```typescript
// Component — sem RouterLink nos imports
@Component({
  standalone: true,
  imports: [],
})
export class ExploreMoviesComponent {}
```

**After (com RouterLink aplicado):**

```html
<!-- Template -->
<button routerLink="/create">Adicionar Filme</button>
```

```typescript
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
})
export class ExploreMoviesComponent {}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Link estatico para outra rota | `routerLink="/path"` no template |
| Navegacao condicional (apos salvar, apos login) | `Router.navigate()` no TS |
| Link externo (URL completa) | `href="https://..."` normal |
| Botao que navega | `routerLink` direto no `<button>` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `<button (click)="goToCreate()">` com `router.navigate` para link simples | `<button routerLink="/create">` |
| `<a href="/create">` para rota interna | `<a routerLink="/create">` |
| `routerLink="create"` (relativo) | `routerLink="/create"` (absoluto) |
| Esquecer de importar RouterLink no component | `imports: [RouterLink]` no decorator |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
