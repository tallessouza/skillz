# Code Examples: Formatacao de Decimais com DecimalPipe

## Setup do componente (exemplo do instrutor)

```typescript
import { Component } from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-pipes-demo',
  standalone: true,
  imports: [DecimalPipe, PercentPipe],
  template: `
    <h2>DecimalPipe</h2>
    <p>{{ valor | number }}</p>
    <p>{{ valor | number:'1.3-3' }}</p>

    <h2>PercentPipe</h2>
    <p>{{ valor | percent }}</p>
  `
})
export class PipesDemoComponent {
  valor = 100;
}
```

## Comparacao de outputs (do video)

Com `valor = 100` e locale `pt-BR`:

| Expressao | Output | Explicacao |
|-----------|--------|-----------|
| `{{ 100 \| number }}` | `100` | Padrao `1.0-3`, sem decimais necessarios |
| `{{ 100 \| number:'1.3-3' }}` | `100,000` | Minimo 3 decimais, preenche com zeros |
| `{{ 100.678 \| number:'1.3-3' }}` | `100,678` | Ja tem 3 decimais |
| `{{ 100 \| percent }}` | `10.000%` | PercentPipe multiplica por 100 |

## Variacoes de digitsInfo

```html
<!-- Sem decimais -->
{{ 1234.56 | number:'1.0-0' }}
<!-- pt-BR: "1.235" (arredonda e sem decimais) -->

<!-- Exatamente 2 decimais (comum para precos) -->
{{ 1234.5 | number:'1.2-2' }}
<!-- pt-BR: "1.234,50" -->

<!-- Minimo 5 inteiros (zero-padding) -->
{{ 42 | number:'5.0-0' }}
<!-- "00.042" em pt-BR ou "00,042" em en-US -->

<!-- Ate 6 decimais de precisao -->
{{ 3.14159265 | number:'1.0-6' }}
<!-- pt-BR: "3,141593" (arredonda na 6a casa) -->
```

## Configuracao de locale completa

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
```

### Efeito nos separadores

```html
<!-- Com pt-BR -->
{{ 1234567.89 | number:'1.2-2' }}
<!-- Output: "1.234.567,89" -->

<!-- Com en-US (padrao, sem configurar LOCALE_ID) -->
{{ 1234567.89 | number:'1.2-2' }}
<!-- Output: "1,234,567.89" -->
```

## Uso com locale inline (override pontual)

```html
<!-- Forca en-US mesmo com pt-BR global -->
{{ 1234.56 | number:'1.2-2':'en-US' }}
<!-- Output: "1,234.56" -->
```

## Uso programatico (no TypeScript)

```typescript
import { DecimalPipe } from '@angular/common';

@Component({
  providers: [DecimalPipe]
})
export class MyComponent {
  constructor(private decimalPipe: DecimalPipe) {}

  formatarValor(valor: number): string {
    return this.decimalPipe.transform(valor, '1.2-2') ?? '';
  }
}
```