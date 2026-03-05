# Code Examples: Default Currency Code

## Configuracao basica completa

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';

registerLocaleData(localePtBr);

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    }
  ]
};
```

## Uso no template — antes e depois

### Sem DEFAULT_CURRENCY_CODE (repetitivo)

```html
<p>{{ 12500 | currency:'BRL' }}</p>        <!-- R$12.500,00 -->
<p>{{ 89.90 | currency:'BRL' }}</p>         <!-- R$89,90 -->
<p>{{ 1500.50 | currency:'BRL' }}</p>       <!-- R$1.500,50 -->
```

### Com DEFAULT_CURRENCY_CODE configurado

```html
<p>{{ 12500 | currency }}</p>               <!-- R$12.500,00 (automatico) -->
<p>{{ 89.90 | currency }}</p>                <!-- R$89,90 (automatico) -->
<p>{{ 1500.50 | currency }}</p>              <!-- R$1.500,50 (automatico) -->

<!-- Quando precisar de outra moeda, especifique -->
<p>{{ 99.99 | currency:'USD' }}</p>          <!-- US$99,99 (override explicito) -->
```

## Cenario: aplicacao multi-moeda

```typescript
// app.config.ts — defina a moeda principal
{
  provide: DEFAULT_CURRENCY_CODE,
  useValue: 'BRL'  // moeda predominante
}
```

```html
<!-- Maioria dos valores: sem parametro -->
<p>Preco: {{ produto.preco | currency }}</p>

<!-- Valores internacionais: parametro explicito -->
<p>Preco USD: {{ produto.precoUsd | currency:'USD' }}</p>
<p>Preco EUR: {{ produto.precoEur | currency:'EUR' }}</p>
```

## Sem nenhuma configuracao (comportamento padrao do Angular)

```html
<!-- Angular assume USD quando nada e configurado -->
<p>{{ 12500 | currency }}</p>  <!-- $12,500.00 (dolar americano) -->
```