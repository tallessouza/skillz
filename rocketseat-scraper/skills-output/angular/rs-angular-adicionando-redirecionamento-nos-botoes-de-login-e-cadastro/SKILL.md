---
name: rs-angular-routerlink-active
description: "Applies Angular RouterLink and RouterLinkActive patterns when implementing navigation in Angular templates. Use when user asks to 'add navigation', 'redirect on click', 'highlight active route', 'create login/register buttons', or any Angular routing in templates. Enforces template-based routing with routerLink instead of injecting Router, and dynamic active-state styling with RouterLinkActive. Make sure to use this skill whenever building Angular navigation components or route-aware UI elements. Not for programmatic navigation in TypeScript services, route guards, or lazy loading configuration."
---

# RouterLink e RouterLinkActive no Angular

> Use `routerLink` para navegacao no template e `routerLinkActive` para classes dinamicas baseadas na rota ativa.

## Rules

1. **Prefira routerLink no template ao invés de injetar Router** — `routerLink="/login"` direto no elemento, porque evita inject desnecessario e mantem a navegacao declarativa no HTML
2. **Importe RouterLink e RouterLinkActive do @angular/router** — ambos precisam estar nos `imports` do componente standalone, porque sem importacao o Angular ignora silenciosamente
3. **Separe classes fixas e dinamicas** — classes base ficam em `class`, classes de estado ativo ficam em `routerLinkActive`, porque misturar causa conflitos de especificidade
4. **routerLinkActive recebe string com todas as classes** — `routerLinkActive="bg-purple-500 font-medium shadow"`, porque ele aplica/remove o conjunto inteiro

## How to write

### Navegacao com routerLink no template

```html
<!-- Botao que redireciona para /login sem injetar Router no TS -->
<button routerLink="/login" class="flex-1 py-2 text-sm text-gray-400 cursor-pointer transition">
  Login
</button>
```

### Destaque de rota ativa com RouterLinkActive

```html
<button
  routerLink="/login"
  routerLinkActive="bg-[#2C2C30] rounded font-medium text-purple-800 shadow"
  class="flex-1 py-2 text-sm text-gray-400 cursor-pointer transition">
  Login
</button>
```

### Imports no componente standalone

```typescript
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  // ...
})
export class AuthLayoutComponent {}
```

## Example

**Before (sem navegacao nem feedback visual):**
```html
<div class="flex gap-2">
  <button class="flex-1 py-2 text-sm bg-[#2C2C30] rounded font-medium text-purple-800 shadow">
    Login
  </button>
  <button class="flex-1 py-2 text-sm text-gray-400">
    Cadastro
  </button>
</div>
```

**After (com routerLink e routerLinkActive):**
```html
<div class="flex gap-2">
  <button
    routerLink="/login"
    routerLinkActive="bg-[#2C2C30] rounded font-medium text-purple-800 shadow"
    class="flex-1 py-2 text-sm text-gray-400 hover:text-white transition cursor-pointer">
    Login
  </button>
  <button
    routerLink="/register"
    routerLinkActive="bg-[#2C2C30] rounded font-medium text-purple-800 shadow"
    class="flex-1 py-2 text-sm text-gray-400 hover:text-white transition cursor-pointer">
    Cadastro
  </button>
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Navegacao simples por clique | `routerLink` no template |
| Navegacao com logica condicional (guards, params dinamicos) | Injete `Router` no TypeScript |
| Destacar botao/link da rota atual | `routerLinkActive` com classes de estado |
| Multiplos niveis de rota ativa (parent + child) | Use `[routerLinkActiveOptions]="{ exact: true }"` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Injetar Router so para navegacao por clique | `routerLink="/path"` no template |
| Colocar classes de estado ativo fixas no `class` | Usar `routerLinkActive` para classes dinamicas |
| Importar `RouterLinkWithHref` | Importar `RouterLink` (o correto desde Angular 15+) |
| Usar `[ngClass]` manual para detectar rota ativa | Usar `routerLinkActive` que faz isso automaticamente |
| Esquecer de importar no array `imports` | Sempre adicionar `RouterLink, RouterLinkActive` nos imports |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
