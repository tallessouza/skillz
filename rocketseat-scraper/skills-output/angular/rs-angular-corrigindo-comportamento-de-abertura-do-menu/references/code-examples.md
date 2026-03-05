# Code Examples: LinkedSignal para Estado Reativo

## Exemplo completo do componente Header

```typescript
import { Component, inject, linkedSignal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  template: `
    <header>
      <button (click)="toggleMenu()">Menu</button>

      @if (isMenuOpen()) {
        <nav class="mobile-menu">
          <a routerLink="/explorar">Explorar</a>
          <a routerLink="/favoritos">Meus Favoritos</a>
        </nav>
      }
    </header>
  `,
})
export class HeaderComponent {
  private router = inject(Router);

  // Step 1: Converter Observable de navegacao para Signal
  private navigationEnd = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
  );

  // Step 2: linkedSignal — fecha menu quando navegacao termina
  isMenuOpen = linkedSignal({
    source: this.navigationEnd,
    computation: () => false,
  });

  // Step 3: Toggle manual — abre/fecha com botao
  toggleMenu() {
    this.isMenuOpen.update(currentValue => !currentValue);
  }
}
```

## Abordagem ANTES (subscribe manual — o que o instrutor descartou)

```typescript
// O instrutor mostrou isso como alternativa mas preferiu signals
ngOnInit() {
  this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      tap(() => {
        this.isMenuOpen = false; // propriedade simples
      })
    )
    .subscribe();
}
```

Problemas desta abordagem:
- Precisa de `ngOnInit`
- Precisa gerenciar unsubscribe (OnDestroy ou takeUntilDestroyed)
- `isMenuOpen` e uma propriedade simples, nao reativa

## Comparacao: signal vs computed vs linkedSignal

```typescript
// signal — valor manual, sem reatividade automatica
const count = signal(0);
count.set(5);      // OK
count.update(v => v + 1); // OK

// computed — reativo, mas read-only
const double = computed(() => count() * 2);
// double.set(10); // ERRO — computed e read-only

// linkedSignal — reativo E com controle manual
const derived = linkedSignal({
  source: count,
  computation: () => count() > 3,
});
derived.set(true);  // OK — pode setar manualmente
derived.update(v => !v); // OK — pode atualizar manualmente
```

## Variacao: sidebar que fecha ao navegar

```typescript
@Component({ /* ... */ })
export class SidebarComponent {
  private router = inject(Router);

  private navigationEnd = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
  );

  isSidebarExpanded = linkedSignal({
    source: this.navigationEnd,
    computation: () => false,
  });

  toggleSidebar() {
    this.isSidebarExpanded.update(current => !current);
  }
}
```

## Variacao: dropdown que fecha ao navegar mas mantem estado do item selecionado

```typescript
isDropdownOpen = linkedSignal({
  source: this.navigationEnd,
  computation: () => false,
});

// O item selecionado NAO reseta — signal normal
selectedItem = signal<string | null>(null);

selectItem(item: string) {
  this.selectedItem.set(item);
  this.isDropdownOpen.set(false);
}
```