# Code Examples: CurrencyPipe Display Parameter

## Setup: Registrando localidades

```typescript
// app.config.ts ou main.ts
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localePt);
registerLocaleData(localeFr);
```

## Exemplo 1: Display 'code' com varias moedas

```html
<!-- Locale: fr-FR (simbolo vai ao final) -->
<p>{{ valor | currency:'BRL':'code' }}</p>    <!-- 1 234,56 BRL -->
<p>{{ valor | currency:'USD':'code' }}</p>    <!-- 1 234,56 USD -->
<p>{{ valor | currency:'CAD':'code' }}</p>    <!-- 1 234,56 CAD -->
<p>{{ valor | currency:'JPY':'code' }}</p>    <!-- 1 235 JPY -->
```

```html
<!-- Locale: pt-BR (simbolo vai ao inicio) -->
<p>{{ valor | currency:'BRL':'code' }}</p>    <!-- BRL 1.234,56 -->
<p>{{ valor | currency:'USD':'code' }}</p>    <!-- USD 1.234,56 -->
```

## Exemplo 2: Display 'symbol' (default)

```html
<!-- Todas as formas abaixo sao equivalentes -->
<p>{{ valor | currency:'BRL' }}</p>
<p>{{ valor | currency:'BRL':'symbol' }}</p>

<!-- Locale pt-BR -->
<!-- R$ 1.234,56 -->

<!-- Locale fr-CA -->
<!-- Resultado muda: simbolo diferente + posicao diferente -->
```

### Variacao de simbolo por locale

```html
<!-- USD em diferentes locales -->
<!-- pt-BR: US$ 1.234,56 -->
<!-- en-US: $1,234.56 -->
<!-- fr-FR: 1 234,56 $US -->
```

## Exemplo 3: Display 'symbol-narrow'

```html
<p>{{ valor | currency:'BRL':'symbol-narrow' }}</p>
<p>{{ valor | currency:'USD':'symbol-narrow' }}</p>
<p>{{ valor | currency:'CAD':'symbol-narrow' }}</p>
<p>{{ valor | currency:'JPY':'symbol-narrow' }}</p>
```

### Problema de ambiguidade demonstrado

```html
<!-- USD e CAD com symbol-narrow no mesmo template -->
<p>Americano: {{ 100 | currency:'USD':'symbol-narrow' }}</p>  <!-- $ 100.00 -->
<p>Canadense: {{ 100 | currency:'CAD':'symbol-narrow' }}</p>  <!-- $ 100.00 -->
<!-- IDENTICOS! Usuario nao consegue distinguir -->
```

### Uso correto do symbol-narrow (app single-currency)

```html
<!-- App que so opera com dolar americano, publico americano -->
<p>{{ product.price | currency:'USD':'symbol-narrow' }}</p>  <!-- $99.99 -->
<!-- Proximo da experiencia do usuario no dia-a-dia -->
```

## Exemplo 4: String customizada

```html
<p>{{ valor | currency:'BRL':'Reais' }}</p>        <!-- Reais 1.234,56 -->
<p>{{ valor | currency:'USD':'Dolares' }}</p>       <!-- Dolares 1,234.56 -->
<p>{{ valor | currency:'JPY':'Skillz' }}</p>    <!-- Skillz 1,235 -->
```

A formatacao numerica (separadores, casas decimais) continua sendo controlada pelo currency code e pela localidade. Apenas o texto do simbolo/codigo e substituido.

## Exemplo completo: Componente com multiplas moedas

```typescript
@Component({
  selector: 'app-price-list',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <table>
      @for (item of items; track item.currency) {
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.price | currency:item.currency:'code' }}</td>
        </tr>
      }
    </table>
  `
})
export class PriceListComponent {
  items = [
    { name: 'Produto A', price: 99.90, currency: 'BRL' },
    { name: 'Product B', price: 49.99, currency: 'USD' },
    { name: 'Produit C', price: 64.50, currency: 'CAD' },
  ];
}
```

## Sintaxe completa do CurrencyPipe

```
{{ valor | currency : currencyCode : display : digitsInfo : locale }}
```

O parametro `display` e o segundo argumento (apos `currencyCode`), separado por `:`.