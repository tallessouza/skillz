---
name: rs-angular-pub-sub-behavior-subject
description: "Enforces BehaviorSubject state management patterns in Angular services. Use when user asks to 'create a service', 'manage state', 'share data between components', 'use BehaviorSubject', or 'create a context service'. Applies rules: private subject with public asObservable, structuredClone to prevent mutation, service-only .next calls, support methods for state changes. Make sure to use this skill whenever creating Angular services that share state across components. Not for simple component communication via @Input/@Output, or NgRx/signal-based state management."
---

# Pub-Sub — Gerenciamento de Estado com BehaviorSubject

> Services controlam o BehaviorSubject; componentes apenas consomem valores clonados via Observable.

## Rules

1. **BehaviorSubject sempre private** — `private itemsSubject = new BehaviorSubject<T[]>([])`, porque nenhum componente deve acessar `.next()` diretamente
2. **Exponha apenas o Observable** — `items$ = this.itemsSubject.pipe(map(v => structuredClone(v)))`, porque limita componentes a `.pipe()` e `.subscribe()` apenas
3. **Clone com structuredClone no pipe** — use `map(items => structuredClone(items))` antes de entregar ao componente, porque referências compartilhadas causam mutações cruzadas entre componentes
4. **Métodos de apoio no service** — `addItem()`, `removeItem()`, `getValue()` encapsulam toda mutação do subject, porque centraliza controle e facilita debugging
5. **getValue também clona** — `return structuredClone(this.itemsSubject.value)`, porque acesso direto ao `.value` expõe a mesma referência de memória
6. **Gere nova lista no .next** — `this.itemsSubject.next([...currentList, newItem])`, porque spread cria novo array e o subject armazena + emite a lista atualizada

## How to write

### Service com BehaviorSubject protegido

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ContextService {
  private itemsSubject = new BehaviorSubject<Item[]>([]);

  items$ = this.itemsSubject.pipe(
    map(items => structuredClone(items))
  );

  addItem(item: Item): void {
    const currentList = this.itemsSubject.value;
    this.itemsSubject.next([...currentList, item]);
  }

  getValue(): Item[] {
    return structuredClone(this.itemsSubject.value);
  }
}
```

### Componente consumindo o service

```typescript
export class MyComponent implements OnInit {
  private readonly contextService = inject(ContextService);

  ngOnInit(): void {
    this.contextService.items$.subscribe(value => {
      console.log('Valor:', value);
    });
  }

  onAdd(): void {
    this.contextService.addItem({ name: 'Teste', price: 123 });
  }
}
```

## Example

**Before (componente gerenciando subject diretamente):**
```typescript
// Service — subject público
export class ContextService {
  itemsSubject = new BehaviorSubject<Item[]>([]);
}

// Componente — acesso total ao subject
this.contextService.itemsSubject.next([]);
this.contextService.itemsSubject.value.push(newItem);
```

**After (service controla, componente consome):**
```typescript
// Service — subject privado, observable clonado
export class ContextService {
  private itemsSubject = new BehaviorSubject<Item[]>([]);
  items$ = this.itemsSubject.pipe(map(items => structuredClone(items)));

  addItem(item: Item): void {
    this.itemsSubject.next([...this.itemsSubject.value, item]);
  }
}

// Componente — apenas consome e chama métodos
this.contextService.items$.subscribe(items => this.items = items);
this.contextService.addItem({ name: 'Teste', price: 123 });
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Estado compartilhado entre 2+ componentes | Criar service com BehaviorSubject privado |
| Componente só precisa do valor atual (sem reatividade) | Usar método `getValue()` que retorna clone |
| Componente precisa reagir a mudanças | Subscrever no Observable público (`items$`) |
| Navegador não suporta structuredClone | Usar `lodash/cloneDeep` como fallback |
| Convenção de nome para Observable público | Sufixo `$`: `items$`, `user$`, `config$` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `itemsSubject = new BehaviorSubject(...)` (público) | `private itemsSubject = new BehaviorSubject(...)` |
| `this.service.itemsSubject.next(...)` no componente | `this.service.addItem(...)` via método de apoio |
| `items$ = this.itemsSubject.asObservable()` sem clone | `items$ = this.itemsSubject.pipe(map(v => structuredClone(v)))` |
| `return this.itemsSubject.value` direto | `return structuredClone(this.itemsSubject.value)` |
| `this.itemsSubject.value.push(item)` mutação direta | `this.itemsSubject.next([...this.itemsSubject.value, item])` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
