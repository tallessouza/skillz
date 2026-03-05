# Code Examples: I18nSelectPipe

## Exemplo 1: Mapeamento de genero para convite

### Setup do componente

```typescript
import { Component } from '@angular/core';
import { I18nSelectPipe } from '@angular/common';

@Component({
  selector: 'app-invite',
  standalone: true,
  imports: [I18nSelectPipe],
  template: `
    <p>{{ gender | i18nSelect: inviteMapping }}</p>
  `,
})
export class InviteComponent {
  gender = 'female';

  inviteMapping: Record<string, string> = {
    male: 'convidá-lo',
    female: 'convidá-la',
    other: 'convidar',
  };
}
```

### Resultados por valor de `gender`

| `gender` | Output |
|----------|--------|
| `'female'` | convidá-la |
| `'male'` | convidá-lo |
| `'teste'` | convidar (fallback `other`) |
| `''` | convidar (fallback `other`) |

## Exemplo 2: Status de pedido

```typescript
import { Component } from '@angular/core';
import { I18nSelectPipe } from '@angular/common';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [I18nSelectPipe],
  template: `
    <p>{{ orderStatus | i18nSelect: orderStatusMapping }}</p>
  `,
})
export class OrderStatusComponent {
  orderStatus = 'shipping';

  orderStatusMapping: Record<string, string> = {
    created: 'Pedido criado',
    shipping: 'Saiu para entrega',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
    other: 'Status desconhecido',
  };
}
```

### Resultados

| `orderStatus` | Output |
|----------------|--------|
| `'shipping'` | Saiu para entrega |
| `'created'` | Pedido criado |
| `'qualquercoisa'` | Status desconhecido |

## Exemplo 3: Status de usuario

```typescript
userStatus = 'active';

userStatusMapping: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  suspended: 'Suspenso',
  other: 'Desconhecido',
};
```

```html
<p>{{ userStatus | i18nSelect: userStatusMapping }}</p>
```

## Exemplo 4: Quando migrar para pipe customizado

Se o mapping de status de pedido aparece em multiplos componentes, crie um pipe:

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus',
  standalone: true,
})
export class OrderStatusPipe implements PipeTransform {
  private readonly mapping: Record<string, string> = {
    created: 'Pedido criado',
    shipping: 'Saiu para entrega',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  transform(value: string): string {
    return this.mapping[value] ?? 'Status desconhecido';
  }
}
```

Uso simplificado em qualquer template:

```html
<p>{{ orderStatus | orderStatus }}</p>
```

Vantagens:
- Mapping centralizado em um unico arquivo
- Mudanca em 1 lugar reflete em todos os componentes
- Template mais limpo (sem passar objeto de mapping)