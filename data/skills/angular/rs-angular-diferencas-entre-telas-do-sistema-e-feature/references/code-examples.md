# Code Examples: Feature vs Tela

## Exemplo 1: Estrutura do desafio Angular (Marketplace)

### Contexto
Sistema Marketplace com autenticação e gerenciamento de produtos.

### Identificação de domínios

```
Pergunta: "O que o negócio gerencia?"

Resposta 1: Autenticação (login/logout)     → feature/auth/
Resposta 2: Produtos (CRUD + filtro)         → feature/products/

Telas do sistema:
- Login           → feature/auth/login/
- Listagem        → feature/products/list/
- Criação         → feature/products/create/
```

### Estrutura resultante

```
app/
├── feature/
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.css
│   │   └── data/
│   │       └── auth-api.service.ts
│   │
│   └── products/
│       ├── products.component.ts        # Container opcional
│       ├── products.component.html
│       ├── products.component.css
│       ├── list/
│       │   ├── list.component.ts
│       │   ├── list.component.html
│       │   └── list.component.css
│       ├── edit/
│       │   ├── edit.component.ts
│       │   ├── edit.component.html
│       │   └── edit.component.css
│       ├── create/
│       │   ├── create.component.ts
│       │   ├── create.component.html
│       │   └── create.component.css
│       └── data/
│           └── products-api.service.ts
│
├── shared/
│   └── button/
│       ├── button.component.ts
│       ├── button.component.html
│       └── button.component.css
│
└── core/
    └── (guards, interceptors, layouts)
```

## Exemplo 2: Service dentro do domínio vs global

### Errado — service global

```typescript
// services/products.service.ts (pasta global, misturado com outros)
@Injectable({ providedIn: 'root' })
export class ProductsService {
  getProducts() { /* ... */ }
  createProduct() { /* ... */ }
  editProduct() { /* ... */ }
}
```

### Correto — service no domínio

```typescript
// feature/products/data/products-api.service.ts
@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  getProducts() { /* ... */ }
  createProduct() { /* ... */ }
  editProduct() { /* ... */ }
}
```

O service é o mesmo código, mas a **localização** comunica que ele pertence exclusivamente ao domínio de produtos.

## Exemplo 3: Componente shared vs componente de domínio

### Shared — usado por múltiplos domínios

```typescript
// shared/button/button.component.ts
// Referenciado em products/create, products/edit, auth/login
@Component({
  selector: 'app-button',
  template: `<button [class]="variant"><ng-content/></button>`
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
}
```

### Domínio — usado apenas dentro de products

```typescript
// feature/products/list/product-card/product-card.component.ts
// Usado APENAS dentro de products/list
@Component({
  selector: 'app-product-card',
  template: `<div class="card">{{ product.name }}</div>`
})
export class ProductCardComponent {
  @Input() product!: Product;
}
```

## Exemplo 4: Aplicando em um sistema maior

### Pergunta para um e-commerce completo

```
"O que o negócio gerencia?"
→ Produtos
→ Pedidos (Orders)
→ Clientes (Customers)
→ Pagamentos (Payments)
→ Autenticação (Auth)
```

### Estrutura resultante

```
app/
├── feature/
│   ├── products/
│   │   ├── list/
│   │   ├── detail/
│   │   ├── create/
│   │   ├── edit/
│   │   └── data/
│   ├── orders/
│   │   ├── list/
│   │   ├── detail/
│   │   ├── checkout/
│   │   └── data/
│   ├── customers/
│   │   ├── list/
│   │   ├── profile/
│   │   └── data/
│   ├── payments/
│   │   ├── history/
│   │   ├── methods/
│   │   └── data/
│   └── auth/
│       ├── login/
│       ├── register/
│       ├── forgot-password/
│       └── data/
├── shared/
└── core/
```

Cada domínio é autocontido com seus sub-recursos e serviços.