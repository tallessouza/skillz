---
name: rs-angular-intro-router-typescript
description: "Applies Angular Router programmatic navigation patterns when writing Angular components. Use when user asks to 'navigate programmatically', 'redirect user', 'use Angular Router in TypeScript', 'router.navigate', or 'navigateByUrl'. Enforces constructor injection, navigate vs navigateByUrl selection, and dynamic route composition. Make sure to use this skill whenever implementing navigation logic in Angular components via TypeScript. Not for template-only RouterLink usage, route configuration, or guards."
---

# Angular Router — Navegacao Programatica via TypeScript

> Usar `router.navigate()` com array de segmentos para rotas dinamicas e `router.navigateByUrl()` apenas para rotas fixas sem variaveis.

## Rules

1. **Injete o Router no constructor, nao no ngOnInit** — `constructor(private router: Router)`, porque o constructor e para injecao de servicos e inicializacao, enquanto ngOnInit e para logica apos o Angular inicializar o componente e o DOM
2. **Use `navigate()` para rotas com variaveis** — `this.router.navigate(['certificados', this.id])`, porque aceita array de segmentos e compoe a URL corretamente sem concatenacao manual
3. **Use `navigateByUrl()` apenas para rotas fixas** — `this.router.navigateByUrl('/about')`, porque recebe string fixa e nao suporta composicao dinamica de segmentos
4. **Nunca concatene strings para rotas dinamicas** — `navigate(['path', variable])` nao `` navigateByUrl(`path/${variable}`) ``, porque o navigate com array e o recurso proprio do Angular para isso
5. **Sempre use `this.` para referenciar membros do componente** — `this.router`, `this.id`, porque sem `this` voce referencia escopo local, nao o componente
6. **Declare o Router como `private`** — so o proprio componente deve acessar a navegacao

## How to write

### Injecao do Router

```typescript
import { Router } from '@angular/router';

export class MeuComponente {
  constructor(private router: Router) {}
}
```

### Navegacao com variavel (navigate)

```typescript
redirecionaCertificado() {
  this.router.navigate(['certificados', this.id]);
}
```

### Navegacao fixa (navigateByUrl)

```typescript
irParaHome() {
  this.router.navigateByUrl('/home');
}
```

### Binding no template

```html
<button (click)="redirecionaCertificado()">Ver detalhes</button>
```

## Example

**Before (concatenacao manual — anti-pattern):**

```typescript
export class ItemComponent {
  @Input() id: string = '';

  constructor(private router: Router) {}

  redirect() {
    this.router.navigateByUrl('certificados/' + this.id);
  }
}
```

**After (navigate com array — correto):**

```typescript
export class ItemComponent {
  @Input() id: string = '';

  constructor(private router: Router) {}

  redirecionaCertificado() {
    this.router.navigate(['certificados', this.id]);
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota tem parametro dinamico (id, slug) | `router.navigate(['path', variable])` |
| Rota e fixa sem variaveis | `router.navigateByUrl('/path')` |
| Precisa redirecionar apos acao (submit, click) | Crie funcao dedicada, chame via `(click)` |
| Navegacao so no template, sem logica | Use `routerLink` no template, sem Router no TS |
| Constructor vs ngOnInit | Constructor: injecao de servicos. ngOnInit: logica pos-inicializacao |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `` navigateByUrl(`certificados/${this.id}`) `` | `navigate(['certificados', this.id])` |
| `router.navigateByUrl('path/' + id)` | `router.navigate(['path', id])` |
| Injetar Router no ngOnInit | Injetar no `constructor(private router: Router)` |
| `router.navigate(...)` sem `this.` | `this.router.navigate(...)` |
| Router public no constructor | `private router: Router` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
