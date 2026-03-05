---
name: rs-angular-implementando-botao-de-cancelar
description: "Enforces template-driven navigation pattern in Angular using routerLink instead of component methods for simple redirects. Use when user asks to 'add a cancel button', 'navigate back', 'redirect to another page', 'implement back button', or 'remove unnecessary methods'. Applies rule: use routerLink in template instead of click handlers that only call router.navigate(). Make sure to use this skill whenever implementing navigation buttons in Angular templates. Not for complex navigation with guards, query params, or conditional routing logic."
---

# Navegacao via Template com routerLink

> Para redirecionamentos simples, use routerLink no template em vez de metodos no componente.

## Rules

1. **Use routerLink para navegacao simples** — `[routerLink]="['/explorar']"` no template, nao `(click)="cancelar()"` no componente, porque elimina codigo desnecessario e usa o mecanismo nativo do Angular
2. **Remova metodos que apenas redirecionam** — se o metodo so faz `this.router.navigate(['/rota'])`, delete-o e use routerLink, porque metodos triviais poluem o componente
3. **Importe RouterLink no componente** — adicione `RouterLink` nos imports do componente standalone para que a diretiva funcione no template

## How to write

### Botao de cancelar com routerLink

```typescript
// No componente: importe RouterLink
import { RouterLink } from '@angular/router';

@Component({
  // ...
  imports: [RouterLink, /* outros */],
})
export class CriarFilmeComponent {
  // Nenhum metodo cancelar() necessario
}
```

```html
<!-- No template: routerLink direto no botao -->
<button [routerLink]="['/explorar']">Cancelar</button>
```

## Example

**Before (metodo desnecessario no componente):**

```typescript
// componente
cancelar() {
  this.router.navigate(['/explorar']);
}
```

```html
<!-- template -->
<button (click)="cancelar()">Cancelar</button>
```

**After (routerLink no template):**

```typescript
// componente: sem metodo cancelar, apenas import do RouterLink
imports: [RouterLink]
```

```html
<!-- template -->
<button [routerLink]="['/explorar']">Cancelar</button>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Botao so redireciona para rota fixa | routerLink no template |
| Navegacao precisa de logica antes (salvar, validar) | Metodo no componente com router.navigate() |
| Link em texto ou ancora | Use `<a routerLink="...">` |
| Navegacao condicional baseada em estado | Metodo no componente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `(click)="cancelar()"` com metodo que so navega | `[routerLink]="['/rota']"` |
| Metodo `cancelar() { this.router.navigate(['/x']) }` | Remova e use routerLink |
| Esquecer de importar RouterLink no componente standalone | `imports: [RouterLink]` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
