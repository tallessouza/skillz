---
name: rs-angular-para-que-servem-os-services
description: "Enforces proper use of Angular Services for state management and HTTP calls. Use when user asks to 'create a component', 'manage state', 'make HTTP request', 'share data between components', or 'refactor Angular code'. Applies rules: components handle only presentation logic, services manage shared state via single instance, HTTP calls always go through services, never store application state in components. Make sure to use this skill whenever writing Angular components or services. Not for React, Vue, or non-Angular frameworks."
---

# Angular Services — Responsabilidades e Uso Correto

> Componentes gerenciam apresentacao e interacao do usuario; Services gerenciam estado e chamadas HTTP.

## Rules

1. **Nunca armazene estado da aplicacao em componentes** — listas de produtos, dados do usuario logado, carrinho de compras pertencem a Services, porque estado em componentes acopla dados a uma arvore de componentes especifica e quebra ao mudar rotas
2. **Nunca faca chamadas HTTP diretamente no componente** — injete um Service que encapsula o HttpClient, porque o componente deve focar em gerenciar elementos da tela, nao em comunicacao com servidor
3. **Use Services como fonte unica de verdade** — apenas o Service altera a lista internamente, componentes consomem e pedem alteracoes via metodos, porque isso centraliza a logica e facilita debugging
4. **Services tem instancia unica por padrao** — todos os componentes que injetam o mesmo Service compartilham a mesma instancia, mesmas propriedades e mesmas referencias de memoria
5. **Input/Output ainda tem seu lugar** — use para Dumb Components que apenas recebem dados e fazem display, com poucas funcionalidades, porque nesses casos o acoplamento e minimo e desejavel
6. **Services especificos de componente sao validos** — quando um componente e complexo demais, crie um Service de contexto exclusivo para ele gerenciar estado local, porque evita que a classe do componente vire um monstro

## How to write

### Service de estado compartilhado

```typescript
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private products: Product[] = [];

  addProduct(product: Product): void { /* altera lista internamente */ }
  removeProduct(productId: string): void { /* altera lista internamente */ }
  updateProduct(productId: string, changes: Partial<Product>): void { /* altera lista internamente */ }
  getProducts(): Product[] { return [...this.products]; }
}
```

### Service de chamada HTTP

```typescript
@Injectable({ providedIn: 'root' })
export class ProductsHttpService {
  private httpClient = inject(HttpClient);

  fetchProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('/api/products');
  }
}
```

### Componente consumindo Service

```typescript
@Component({ /* ... */ })
export class ProductListComponent {
  private productsService = inject(ProductsService);

  products = this.productsService.getProducts();

  onRemove(productId: string): void {
    this.productsService.removeProduct(productId);
  }
}
```

## Example

**Before (estado e HTTP no componente):**

```typescript
@Component({ /* ... */ })
export class ProductsContainerComponent {
  products: Product[] = [];

  ngOnInit() {
    // HTTP direto no componente — errado
    this.http.get<Product[]>('/api/products').subscribe(data => this.products = data);
  }

  // Estado gerenciado pelo componente — errado
  removeProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id);
  }
}
```

**After (Service como intermediador):**

```typescript
// Service gerencia estado e HTTP
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private httpClient = inject(HttpClient);
  private products: Product[] = [];

  loadProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('/api/products').pipe(
      tap(products => this.products = products)
    );
  }

  removeProduct(id: string): void {
    this.products = this.products.filter(p => p.id !== id);
  }

  getProducts(): Product[] {
    return [...this.products];
  }
}

// Componente so consome
@Component({ /* ... */ })
export class ProductsContainerComponent {
  private productsService = inject(ProductsService);
  products: Product[] = [];

  ngOnInit() {
    this.productsService.loadProducts().subscribe(products => this.products = products);
  }

  onRemove(id: string): void {
    this.productsService.removeProduct(id);
    this.products = this.productsService.getProducts();
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dado compartilhado entre componentes irmaos | Service com instancia unica (providedIn: root) |
| Dado precisa sobreviver a mudanca de rota | Service com instancia unica |
| Componente apenas exibe dados recebidos (dumb) | Input/Output — nao precisa de Service |
| Componente complexo com muito estado interno | Service de contexto exclusivo para ele |
| Chamada HTTP para qualquer endpoint | Service dedicado com HttpClient injetado |
| Debugging de estado inconsistente | Olhe o Service — ele e a unica fonte de alteracao |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `this.http.get()` direto no componente | `this.productsService.fetchProducts()` |
| Lista de estado como propriedade do componente | Lista como propriedade privada do Service |
| Cadeia de Input/Output atravessando 3+ niveis | Service compartilhado entre os componentes |
| Componente alterando array diretamente | Service com metodos `add`, `remove`, `update` |
| Componente fazendo logica de negocio + display + HTTP | Separar: componente = display, Service = logica e HTTP |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
