---
name: rs-angular-service-instancia-unica-multiplas-di
description: "Enforces Angular shared service pattern with single instance injected across multiple components. Use when user asks to 'share data between components', 'inject service in Angular', 'avoid input output coupling', 'communicate between components', or 'use dependency injection'. Applies rules: inject same service in multiple components, avoid excessive input/output coupling, protect service state with copies, use service methods for mutations. Make sure to use this skill whenever creating Angular services shared across components. Not for HTTP services, route guards, or interceptors."
---

# Service com Instância Única e Múltiplas Injeções de Dependência

> Compartilhe estado entre componentes via injeção do mesmo service, nunca via cascata de inputs/outputs.

## Rules

1. **Injete o service em cada componente que precisa dos dados** — use `inject(MyService)` em cada componente, porque isso elimina acoplamento via input/output entre componentes
2. **Nunca passe dados entre componentes via input/output em cascata** — inputs/outputs criam acoplamento excessivo entre componentes, services desacoplam porque cada componente acessa o estado independentemente
3. **Nunca permita componentes alterarem diretamente propriedades do service** — componentes que modificam a referência de memória original afetam todos os outros consumidores, porque todos compartilham a mesma instância
4. **Use métodos do service para mutações** — o service deve expor métodos como `addProduct()`, `removeProduct()`, porque centraliza a lógica de modificação e protege o estado
5. **Consumidores devem receber cópias, não a referência original** — retorne cópias da lista para componentes consumidores, porque alterações acidentais em um componente não propagam para outros
6. **Cuidado com imports do Angular** — use `inject` de `@angular/core`, nunca de `@angular/core/testing`, porque o erro é silencioso e difícil de debugar

## How to write

### Injeção em múltiplos componentes

```typescript
// Service compartilhado (providedIn: 'root' = instância única)
@Injectable({ providedIn: 'root' })
export class ProductsService {
  products: Product[] = [];

  addProduct(product: Product) { this.products.push(product); }
  removeProduct(id: string) { this.products = this.products.filter(p => p.id !== id); }
}

// Componente container — injeta e usa métodos de mutação
export class ProductsComponent {
  private productsService = inject(ProductsService);

  create() { this.productsService.addProduct(newProduct); }
  remove(id: string) { this.productsService.removeProduct(id); }
}

// Componente de listagem — injeta e apenas lê
export class ProductsListComponent {
  private productsService = inject(ProductsService);
  // Renderiza productsService.products no template
}

// Componente contador — injeta e apenas lê
export class ProductsCounterComponent {
  private productsService = inject(ProductsService);
  // Usa productsService.products.length no template
}
```

### Estrutura de pastas recomendada

```
exemplo/
├── services/
│   └── products.service.ts
└── components/
    ├── products/           # Container (botões, ações)
    ├── products-list/      # Renderiza a lista
    └── products-counter/   # Mostra contagem
```

## Example

**Before (acoplamento via input/output):**
```typescript
// Container passa dados manualmente para cada filho
@Component({
  template: `
    <app-products-list [products]="products"></app-products-list>
    <app-products-counter [count]="products.length"></app-products-counter>
  `
})
export class ProductsComponent {
  products: Product[] = [];
}
```

**After (service compartilhado):**
```typescript
// Container apenas orquestra ações
@Component({
  template: `
    <app-products-list></app-products-list>
    <app-products-counter></app-products-counter>
    <button (click)="create()">Criar</button>
  `
})
export class ProductsComponent {
  private productsService = inject(ProductsService);
  create() { this.productsService.addProduct(newProduct); }
}

// Filhos acessam dados diretamente via service
export class ProductsListComponent {
  private productsService = inject(ProductsService);
}

export class ProductsCounterComponent {
  private productsService = inject(ProductsService);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| 2+ componentes precisam dos mesmos dados | Crie um service compartilhado |
| Componente pai passa input que filho só repassa | Substitua por service |
| Dados mudam em um componente e outros precisam reagir | Injete o mesmo service em todos |
| Componente só lê dados do service | Injete e acesse diretamente, sem métodos extras |
| Componente precisa modificar estado | Chame método do service, nunca altere propriedade diretamente |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `[products]="products"` em 3+ níveis de cascata | `inject(ProductsService)` em cada componente |
| `this.productsService.products = []` no componente | `this.productsService.clearProducts()` via método |
| `import { inject } from '@angular/core/testing'` | `import { inject } from '@angular/core'` |
| Um componente pai como intermediário de dados | Cada componente busca do service diretamente |
| `@Output() onProductAdded = new EventEmitter()` em cadeia | Service centraliza mutações |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
