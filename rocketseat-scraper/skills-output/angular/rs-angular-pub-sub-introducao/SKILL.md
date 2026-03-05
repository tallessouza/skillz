---
name: rs-angular-pub-sub-introducao
description: "Enforces BehaviorSubject-based state management pattern in Angular services. Use when user asks to 'create a service', 'share state between components', 'manage component communication', 'implement pub-sub', or 'fix mutation problems'. Applies rules: private BehaviorSubject, public observable copy via pipe+map+structuredClone, .next() for emissions, async pipe in templates. Make sure to use this skill whenever creating Angular services that hold shared state. Not for HTTP services, simple utility services, or standalone component logic."
---

# Pub-Sub com BehaviorSubject em Angular

> Services que guardam estado compartilhado devem usar BehaviorSubject privado + observable público que emite cópias, garantindo imutabilidade e reatividade.

## Rules

1. **BehaviorSubject sempre private** — `private products = new BehaviorSubject<any[]>([])`, porque componentes não devem emitir valores diretamente
2. **Exponha apenas observable com cópia** — use `.asObservable().pipe(map(v => structuredClone(v)))`, porque evita mutação da referência original
3. **Atualize via .next()** — nunca manipule o array interno diretamente; crie nova lista e publique com `.next(newList)`, porque garante que assinantes recebam o valor atualizado
4. **Use .getValue() para ler estado atual** — dentro do service, `this.subject.getValue()` retorna o último valor para compor a nova lista
5. **Prefira async pipe no template** — quando a lista só é usada no template, use `| async` ao invés de subscribe manual, porque gerencia inscrição/desinscrição automaticamente
6. **Marque observable público como readonly** — `readonly products$ = ...`, porque impede reassinação acidental

## How to write

### Service com BehaviorSubject

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products = new BehaviorSubject<Product[]>([
    { id: '1', name: 'Produto inicial' }
  ]);

  readonly products$ = this.products.asObservable().pipe(
    map(products => structuredClone(products))
  );

  add(product: Product) {
    const newList = [...this.products.getValue(), product];
    this.products.next(newList);
  }

  remove(id: string) {
    const newList = this.products.getValue().filter(p => p.id !== id);
    this.products.next(newList);
  }
}
```

### Consumo no template com async pipe

```html
@for (product of productService.products$ | async; track product.id) {
  <div>{{ product.name }}</div>
}
```

### Consumo na classe com subscribe

```typescript
export class ProductsComponent implements OnInit {
  productsList: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.products$.subscribe(list => {
      this.productsList = list;
    });
  }
}
```

## Example

**Before (service com mutação):**
```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  products: any[] = []; // público, qualquer componente muta

  add(product: any) {
    this.products.push(product);
  }
}
// Componente acessa productService.products e muta diretamente
```

**After (BehaviorSubject imutável):**
```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private products = new BehaviorSubject<any[]>([]);

  readonly products$ = this.products.asObservable().pipe(
    map(products => structuredClone(products))
  );

  add(product: any) {
    const newList = [...this.products.getValue(), product];
    this.products.next(newList);
  }
}
// Componente recebe cópia, mutação local não afeta o estado original
```

## Heuristics

| Situação | Faça |
|----------|------|
| Estado compartilhado entre componentes | BehaviorSubject no service |
| Lista só usada no template | `observable$ \| async` |
| Precisa reagir a mudanças na classe | `.subscribe()` no `ngOnInit` |
| Service faz chamada HTTP simples | Não precisa de BehaviorSubject, retorne o Observable direto |
| Valor simples sem reatividade | Propriedade pública normal no service é suficiente |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `products: any[] = []` (público no service) | `private products = new BehaviorSubject<any[]>([])` |
| `this.products.push(item)` | `this.products.next([...this.products.getValue(), item])` |
| Expor BehaviorSubject diretamente | `.asObservable().pipe(map(v => structuredClone(v)))` |
| `setInterval` para detectar mudanças | `.subscribe()` no observable |
| `productsCopy = structuredClone(...)` manual | pipe + map no observable |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
