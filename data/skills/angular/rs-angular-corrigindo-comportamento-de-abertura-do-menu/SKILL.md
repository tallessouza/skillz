---
name: rs-angular-linked-signal-menu
description: "Applies Angular linkedSignal pattern when building reactive UI state that needs both computed reactivity and manual updates. Use when user asks to 'close menu on navigate', 'toggle sidebar', 'sync UI state with router', 'use linkedSignal', or 'convert observable to signal'. Covers toSignal, linkedSignal with source/computation, and router.events filtering. Make sure to use this skill whenever implementing reactive UI toggles in Angular that depend on navigation events. Not for RxJS-only solutions, simple signals without computed dependencies, or non-Angular frameworks."
---

# LinkedSignal para Estado Reativo com Controle Manual

> Use linkedSignal quando precisar de um signal que reage a mudancas de outro signal (como computed) MAS que tambem aceita .update() e .set() manual.

## Rules

1. **Use linkedSignal em vez de computed quando precisar setar valor manualmente** — computed e read-only, linkedSignal permite .update() e .set() apos a computacao, porque toggles de UI precisam de ambos: reatividade automatica E controle manual
2. **Converta observables para signals com toSignal** — `toSignal(observable)` vem de `@angular/core/rxjs-interop`, porque signals integram melhor com o template e com linkedSignal
3. **Filtre router.events para NavigationEnd** — use `filter(event => event instanceof NavigationEnd)` no pipe, porque router.events emite muitos tipos de evento e voce so quer saber quando a navegacao completou
4. **linkedSignal recebe objeto com source e computation** — source e o signal que dispara a recomputacao, computation e o callback que retorna o novo valor
5. **Invoque signals no template com ()** — `isMenuOpen()` nao `isMenuOpen`, porque signals sao funcoes

## How to write

### Converter Observable de navegacao para Signal

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

private router = inject(Router);

private navigationEnd = toSignal(
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  )
);
```

### linkedSignal com source e computation

```typescript
import { linkedSignal } from '@angular/core';

isMenuOpen = linkedSignal({
  source: this.navigationEnd,
  computation: () => false,
});
```

### Toggle manual com .update()

```typescript
toggleMenu() {
  this.isMenuOpen.update(current => !current);
}
```

## Example

**Before (menu nao fecha ao navegar):**
```typescript
isMenuOpen = false;

toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
}
```
```html
<div *ngIf="isMenuOpen">...</div>
```

**After (linkedSignal fecha menu ao navegar + toggle manual):**
```typescript
private navigationEnd = toSignal(
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  )
);

isMenuOpen = linkedSignal({
  source: this.navigationEnd,
  computation: () => false,
});

toggleMenu() {
  this.isMenuOpen.update(current => !current);
}
```
```html
@if (isMenuOpen()) {
  <!-- menu content -->
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estado depende de outro signal E precisa de set/update manual | linkedSignal |
| Estado depende de outro signal mas NUNCA precisa de set manual | computed |
| Estado simples sem dependencia reativa | signal() |
| Observable precisa virar signal para usar em linkedSignal/computed | toSignal() |
| Componente persiste entre rotas (header, sidebar) | Ideal para ouvir router.events |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `ngOnInit` + `subscribe` manual para router.events | `toSignal(router.events.pipe(...))` |
| `computed()` quando precisa de `.set()` depois | `linkedSignal({ source, computation })` |
| `isMenuOpen` sem `()` no template | `isMenuOpen()` — signal e funcao |
| Filtrar NavigationEnd com `if` dentro do subscribe | `filter(e => e instanceof NavigationEnd)` no pipe |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
