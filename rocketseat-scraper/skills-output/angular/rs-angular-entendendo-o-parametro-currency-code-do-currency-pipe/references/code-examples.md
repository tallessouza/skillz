# Code Examples: CurrencyPipe CurrencyCode e Locale

## Configuracao global de locale

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
```

## Template com locale global pt-BR

```html
<!-- Todos usam locale global pt-BR -->
<p>{{ 1500 | currency:'BRL' }}</p>
<!-- R$ 1.500,00 -->

<p>{{ 1500 | currency:'USD' }}</p>
<!-- US$ 1.500,00 -->

<p>{{ 1500 | currency:'JPY' }}</p>
<!-- JP¥ 1.500 -->
```

## Template com locale especifico en-US em um pipe

```html
<!-- Locale global: pt-BR -->

<p>{{ 1500 | currency:'BRL' }}</p>
<!-- R$ 1.500,00 (usa global pt-BR) -->

<p>{{ 1500 | currency:'USD':'symbol':'1.2-2':'en-US' }}</p>
<!-- $1,500.00 (usa locale especifico en-US) -->

<p>{{ 1500 | currency:'JPY' }}</p>
<!-- JP¥ 1.500 (usa global pt-BR) -->
```

## Comparacao completa: mesmo valor, locales diferentes

### Locale pt-BR (global)

| CurrencyCode | Resultado | Simbolo | Separadores |
|-------------|-----------|---------|-------------|
| `'BRL'` | `R$ 1.500,00` | `R$` | ponto milhar, virgula decimal |
| `'USD'` | `US$ 1.500,00` | `US$` | ponto milhar, virgula decimal |
| `'JPY'` | `JP¥ 1.500` | `JP¥` | ponto milhar |

### Locale en-US (global)

| CurrencyCode | Resultado | Simbolo | Separadores |
|-------------|-----------|---------|-------------|
| `'BRL'` | `R$1,500.00` | `R$` | virgula milhar, ponto decimal |
| `'USD'` | `$1,500.00` | `$` | virgula milhar, ponto decimal |
| `'JPY'` | `¥1,500` | `¥` | virgula milhar |

## Ordem completa dos parametros do CurrencyPipe

```html
{{ value | currency : currencyCode : display : digitsInfo : locale }}
```

| Parametro | Tipo | Exemplo | Descricao |
|-----------|------|---------|-----------|
| `currencyCode` | string | `'BRL'` | Codigo ISO 4217 da moeda |
| `display` | string | `'symbol'` | Como exibir o simbolo (`'code'`, `'symbol'`, `'symbol-narrow'`) |
| `digitsInfo` | string | `'1.2-2'` | Formatacao de digitos (inteiros.minDecimais-maxDecimais) |
| `locale` | string | `'pt-BR'` | Locale especifico para este pipe |

## Cenario real: app brasileira com excecao americana

```typescript
// component.ts
export class PriceDisplayComponent {
  precoReal = 1500;
  precoDolar = 1500;
  precoYen = 1500;
}
```

```html
<!-- component.html -->
<!-- App com LOCALE_ID global = 'pt-BR' -->

<!-- Moeda brasileira, formato brasileiro -->
<span>{{ precoReal | currency:'BRL' }}</span>
<!-- R$ 1.500,00 -->

<!-- Dolar, mas formato americano (excecao) -->
<span>{{ precoDolar | currency:'USD':'symbol':'1.2-2':'en-US' }}</span>
<!-- $1,500.00 -->

<!-- Yen, formato brasileiro (global) -->
<span>{{ precoYen | currency:'JPY' }}</span>
<!-- JP¥ 1.500 -->
```