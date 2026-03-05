# Code Examples: I18nPluralPipe

## Setup completo do componente

```typescript
import { Component } from '@angular/core';
import { I18nPluralPipe } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [I18nPluralPipe],
  template: `
    <p>{{ resultsCount | i18nPlural: resultsCountMap }}</p>
  `,
})
export class ResultsComponent {
  resultsCount = 0;

  resultsCountMap: Record<string, string> = {
    '=0': 'Nenhum produto encontrado',
    '=1': 'Exibindo um produto',
    'other': 'Exibindo # produtos encontrados',
  };
}
```

## Resultados por valor

| `resultsCount` | Texto exibido |
|----------------|---------------|
| `0` | Nenhum produto encontrado |
| `1` | Exibindo um produto |
| `2` | Exibindo 2 produtos encontrados |
| `50` | Exibindo 50 produtos encontrados |

## Exemplo com chaves especificas adicionais

```typescript
resultsCountMap: Record<string, string> = {
  '=0': 'Nenhum produto encontrado',
  '=1': 'Exibindo um produto',
  '=50': 'Exibindo os primeiros 50 produtos',
  '=100': 'Limite maximo: 100 produtos',
  'other': 'Exibindo # produtos encontrados',
};
```

## Exemplo: notificacoes

```typescript
notificationMap: Record<string, string> = {
  '=0': 'Sem notificacoes',
  '=1': 'Voce tem 1 notificacao',
  'other': 'Voce tem # notificacoes',
};
```

```html
<span>{{ unreadCount | i18nPlural: notificationMap }}</span>
```

## Exemplo: carrinho de compras

```typescript
cartMap: Record<string, string> = {
  '=0': 'Carrinho vazio',
  '=1': '1 item no carrinho',
  'other': '# itens no carrinho',
};
```

```html
<span>{{ cartItemCount | i18nPlural: cartMap }}</span>
```

## Comparacao: antes e depois

### Antes (template verboso)

```html
@if (resultsCount === 0) {
  <p>Nenhum produto encontrado</p>
} @else if (resultsCount === 1) {
  <p>Exibindo um produto</p>
} @else {
  <p>Exibindo {{ resultsCount }} produtos encontrados</p>
}
```

### Depois (com pipe)

```html
<p>{{ resultsCount | i18nPlural: resultsCountMap }}</p>
```