# Code Examples: Controle de Fluxo e Variáveis no Template Angular

## @if / @else if / @else — Condicional completa

```typescript
// component.ts
@Component({ ... })
export class UserProfileComponent {
  userAge = 25;
  isVerified = true;
}
```

```html
<!-- component.html -->
@if (isVerified && userAge >= 18) {
  <p>Acesso completo liberado.</p>
} @else if (userAge >= 18) {
  <p>Verifique sua conta para acesso completo.</p>
} @else {
  <p>Acesso restrito para menores de 18 anos.</p>
}
```

## @switch — Multiplas condicoes

```typescript
@Component({ ... })
export class OrderStatusComponent {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' = 'pending';
}
```

```html
@switch (status) {
  @case ('pending') {
    <span class="badge yellow">Aguardando</span>
  }
  @case ('processing') {
    <span class="badge blue">Processando</span>
  }
  @case ('shipped') {
    <span class="badge orange">Enviado</span>
  }
  @case ('delivered') {
    <span class="badge green">Entregue</span>
  }
  @default {
    <span class="badge gray">Desconhecido</span>
  }
}
```

## @for — Loop com track e @empty

```typescript
@Component({ ... })
export class ProductListComponent {
  products: Product[] = [
    { id: 1, name: 'Notebook', price: 3500 },
    { id: 2, name: 'Mouse', price: 120 },
    { id: 3, name: 'Teclado', price: 250 },
  ];
}
```

```html
<ul>
  @for (product of products; track product.id) {
    <li>
      <strong>{{ product.name }}</strong> — R$ {{ product.price }}
    </li>
  } @empty {
    <li>Nenhum produto cadastrado.</li>
  }
</ul>
```

## @let — Variavel local no template

```typescript
@Component({ ... })
export class InvoiceComponent {
  invoice = {
    items: [
      { name: 'Item A', quantity: 2, unitPrice: 50 },
      { name: 'Item B', quantity: 1, unitPrice: 150 },
    ]
  };

  get total() {
    return this.invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice, 0
    );
  }
}
```

```html
@let invoiceTotal = total;
@let itemCount = invoice.items.length;

<p>{{ itemCount }} itens — Total: R$ {{ invoiceTotal }}</p>

@if (invoiceTotal > 200) {
  <p class="discount">Frete gratis!</p>
}
```

## Combinando construcoes

```html
@let hasProducts = products.length > 0;

@if (hasProducts) {
  <h2>Produtos ({{ products.length }})</h2>
  @for (product of products; track product.id) {
    @switch (product.category) {
      @case ('electronics') {
        <app-electronics-card [product]="product" />
      }
      @case ('clothing') {
        <app-clothing-card [product]="product" />
      }
      @default {
        <app-generic-card [product]="product" />
      }
    }
  }
} @else {
  <app-empty-state message="Nenhum produto encontrado" />
}
```