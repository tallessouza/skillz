---
name: rs-angular-services-injecao-dependencia
description: "Enforces Angular service creation and dependency injection patterns when writing Angular code. Use when user asks to 'create a service', 'inject a dependency', 'manage state in Angular', 'share data between components', or any Angular service task. Applies rules: @Injectable providedIn root, naming convention .service.ts, inject() function, readonly injection, never expose mutable state directly. Make sure to use this skill whenever generating Angular services or injecting dependencies. Not for RxJS observables, signals, or state management libraries."
---

# Services e Injecao de Dependencia no Angular

> Crie services com @Injectable para gerenciar logica de negocio fora dos componentes, injetando-os via inject() com readonly.

## Rules

1. **Nomeie arquivos como `nome.service.ts`** — a classe `NomeService` deve espelhar o nome do arquivo, porque manter nomenclatura consistente entre arquivo e classe evita bagunca no projeto
2. **Use `@Injectable({ providedIn: 'root' })`** — isso garante singleton automatico (mesma instancia em toda a aplicacao), porque cobre 99% dos casos de uso de services
3. **Injete com `inject()` do `@angular/core`** — nao use constructor injection legado, porque `inject()` e a abordagem moderna do Angular 19+
4. **Marque a propriedade de injecao como `readonly`** — porque o service injetado nunca deve ser reassinado; a propriedade deve manter apenas a instancia do service
5. **Nunca exponha propriedades mutaveis diretamente** — componentes nao devem modificar a referencia de memoria de listas/objetos do service, porque causa mutacao descontrolada em todos os consumidores
6. **Mantenha logica de negocio no service, nao no componente** — o componente chama metodos do service e renderiza; o service gerencia dados, porque isso permite reutilizacao em multiplos componentes

## How to write

### Estrutura do Service

```typescript
// products.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  products = [
    { id: 1, name: 'Mouse', price: 100 },
    { id: 2, name: 'Monitor', price: 1000 },
  ];

  addProduct(id: number, name: string, price: number) {
    this.products.push({ id, name, price });
  }

  removeProduct(id: number) {
    this.products = this.products.filter(product => product.id !== id);
  }
}
```

### Injecao no Componente

```typescript
// products.component.ts
import { Component, inject } from '@angular/core';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  readonly _productsService = inject(ProductsService);

  createProduct() {
    this._productsService.addProduct(3, 'Microfone', 300);
  }

  removeProduct() {
    this._productsService.removeProduct(1);
  }
}
```

### Template consumindo o Service

```html
@for (product of _productsService.products; track product.id) {
  <div>
    <p>{{ product.id }} - {{ product.name }} - {{ product.price }}</p>
  </div>
}
<button (click)="createProduct()">Criar produto</button>
<button (click)="removeProduct()">Remover produto</button>
```

## Example

**Before (logica no componente, sem service):**
```typescript
@Component({ ... })
export class ProductsComponent {
  products = [
    { id: 1, name: 'Mouse', price: 100 },
  ];

  add() {
    this.products.push({ id: 2, name: 'Monitor', price: 1000 });
  }
}
```

**After (logica no service, componente apenas consome):**
```typescript
// products.service.ts
@Injectable({ providedIn: 'root' })
export class ProductsService {
  products = [{ id: 1, name: 'Mouse', price: 100 }];

  addProduct(id: number, name: string, price: number) {
    this.products.push({ id, name, price });
  }
}

// products.component.ts
export class ProductsComponent {
  readonly _productsService = inject(ProductsService);

  add() {
    this._productsService.addProduct(2, 'Monitor', 1000);
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados compartilhados entre componentes | Crie um service com `providedIn: 'root'` |
| CRUD em uma lista | Metodos no service (add, remove, update), componente apenas chama |
| Propriedade do service no template | Acesse via `_service.property` no `@for` / interpolacao |
| Precisa de instancia separada por componente | Use `providers: [Service]` no componente (caso raro, avancado) |
| Lista exposta diretamente causa mutacao | Futuramente use Subject/BehaviorSubject para emitir clones |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `this._service.products = []` no componente | Crie `clearProducts()` no service |
| `constructor(private svc: Service)` | `readonly _svc = inject(Service)` |
| Logica de filtragem/adicao no componente | Mova para metodos do service |
| Arquivo `prodService.ts` | Arquivo `products.service.ts` (nomenclatura padrao) |
| Classe `ProdSvc` | Classe `ProductsService` (nome espelha arquivo) |
| Injecao sem `readonly` | `readonly _service = inject(Service)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
