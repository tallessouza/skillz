# Code Examples: Pub-Sub com BehaviorSubject em Angular

## Exemplo 1: Service com propriedade pública (problema)

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  products: any[] = [
    { id: '1', name: 'Produto A' },
    { id: '2', name: 'Produto B' }
  ];

  add(product: any) {
    this.products.push(product);
  }

  remove(id: string) {
    this.products = this.products.filter(p => p.id !== id);
  }
}
```

**Problema:** componente acessa `productService.products` e muta diretamente (ex: `this.productService.products = []`), corrompendo estado global.

## Exemplo 2: Tentativa com cópia manual (ainda falha)

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: any[] = [
    { id: '1', name: 'Produto A' },
    { id: '2', name: 'Produto B' }
  ];

  productsCopy: any[] = [];

  constructor() {
    this.productsCopy = structuredClone(this.products);
  }

  add(product: any) {
    this.products.push(product);
    this.productsCopy = structuredClone(this.products);
  }

  remove(id: string) {
    this.products = this.products.filter(p => p.id !== id);
    this.productsCopy = structuredClone(this.products);
  }
}
```

**Problema:** componente ainda pode manipular `productsCopy` (é uma referência de memória acessível). Além disso, não há como saber quando a lista mudou sem Change Detection do template ou polling.

## Exemplo 3: BehaviorSubject (solução completa)

### Service

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products = new BehaviorSubject<any[]>([
    { id: '1', name: 'Produto A' },
    { id: '2', name: 'Produto B' }
  ]);

  readonly products$ = this.products.asObservable().pipe(
    map(products => structuredClone(products))
  );

  add(product: any) {
    const newProductsList = [...this.products.getValue(), product];
    this.products.next(newProductsList);
  }

  remove(id: string) {
    const newProductsList = this.products.getValue().filter(p => p.id !== id);
    this.products.next(newProductsList);
  }
}
```

### Componente com async pipe (sem subscribe manual)

```typescript
// product-counter.component.ts
@Component({
  selector: 'app-product-counter',
  template: `
    <p>Total: {{ (productService.products$ | async)?.length }}</p>
  `,
  imports: [AsyncPipe]
})
export class ProductCounterComponent {
  constructor(public productService: ProductService) {}
}
```

### Componente com async pipe em loop

```typescript
// products-list.component.ts
@Component({
  selector: 'app-products-list',
  template: `
    @for (product of productService.products$ | async; track product.id) {
      <div>{{ product.name }}</div>
    }
  `,
  imports: [AsyncPipe]
})
export class ProductsListComponent {
  constructor(public productService: ProductService) {}
}
```

### Componente com subscribe manual (para lógica na classe)

```typescript
// products.component.ts
@Component({
  selector: 'app-products',
  template: `<button (click)="subscribe()">Inscrever</button>`
})
export class ProductsComponent implements OnInit {
  productsList: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.products$.subscribe(productsList => {
      this.productsList = productsList;
      console.log('ProductsComponent', productsList);
    });
    // Mesmo se fizermos this.productsList = [], não afeta o BehaviorSubject
  }
}
```

## Exemplo 4: Prova de imutabilidade

```typescript
// Dentro de um componente
ngOnInit() {
  this.productService.products$.subscribe(list => {
    this.productsList = list;
  });

  // Isso NÃO afeta o BehaviorSubject nem outros componentes:
  this.productsList = [];
  // A cópia local foi zerada, mas o estado original permanece intacto
}
```

## Padrão .next() — criando nova lista

### Adicionar item
```typescript
add(product: any) {
  const newList = [...this.products.getValue(), product];
  this.products.next(newList);
}
```

### Remover item
```typescript
remove(id: string) {
  const newList = this.products.getValue().filter(p => p.id !== id);
  this.products.next(newList);
}
```

### Atualizar item
```typescript
update(id: string, changes: Partial<Product>) {
  const newList = this.products.getValue().map(p =>
    p.id === id ? { ...p, ...changes } : p
  );
  this.products.next(newList);
}
```

## Anatomia do fluxo

```
Service (Publisher)                    Component (Subscriber)
─────────────────                      ─────────────────────
BehaviorSubject                        .subscribe() ou | async
    │                                       ▲
    │ .next(newList)                        │
    ▼                                       │
 Guarda valor ──► .asObservable() ──► pipe(map(structuredClone)) ──► cópia
 .getValue()
```