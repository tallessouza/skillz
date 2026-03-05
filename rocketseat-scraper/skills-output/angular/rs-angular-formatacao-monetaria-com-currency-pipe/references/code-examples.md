# Code Examples: Formatacao Monetaria com CurrencyPipe

## Exemplo da aula — Componente com multiplas moedas

### app.component.ts

```typescript
import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <p>BRL: {{ valor | currency:'BRL' }}</p>
    <p>USD: {{ valor | currency:'USD' }}</p>
    <p>CAD: {{ valor | currency:'CAD' }}</p>
    <p>JPY: {{ valor | currency:'JPY' }}</p>
  `
})
export class AppComponent {
  valor = 1234.5;
}
```

### Resultado (com locale padrao en-US)

```
BRL: R$1,234.50
USD: $1,234.50
CAD: CA$1,234.50
JPY: ¥1,235
```

Observacoes do instrutor:
- Cada moeda trouxe o **simbolo correto** automaticamente
- A **separacao de virgula e ponto** segue o locale en-US (padrao)
- O JPY arredondou para inteiro porque o iene nao usa casas decimais

## Variacoes do parametro display

```html
<!-- Symbol (padrao) -->
{{ 1234.5 | currency:'BRL':'symbol' }}
<!-- R$1,234.50 -->

<!-- Code -->
{{ 1234.5 | currency:'BRL':'code' }}
<!-- BRL1,234.50 -->
```

## Controle de casas decimais com digitsInfo

```html
<!-- Forcar 2 casas decimais -->
{{ 1234.5 | currency:'BRL':'symbol':'1.2-2' }}
<!-- R$1,234.50 -->

<!-- Sem casas decimais (util para JPY) -->
{{ 1234.5 | currency:'JPY':'symbol':'1.0-0' }}
<!-- ¥1,235 -->

<!-- Ate 4 casas decimais -->
{{ 1234.56789 | currency:'BRL':'symbol':'1.2-4' }}
<!-- R$1,234.5679 -->
```

## Uso programatico (no TypeScript)

```typescript
import { CurrencyPipe } from '@angular/common';

@Component({
  // ...
  providers: [CurrencyPipe]
})
export class PrecoService {
  constructor(private currencyPipe: CurrencyPipe) {}

  formatarPreco(valor: number): string {
    return this.currencyPipe.transform(valor, 'BRL', 'symbol', '1.2-2') ?? '';
  }
}
```

## Codigos ISO 4217 comuns

| Codigo | Moeda | Simbolo |
|--------|-------|---------|
| BRL | Real brasileiro | R$ |
| USD | Dolar americano | $ |
| EUR | Euro | € |
| GBP | Libra esterlina | £ |
| JPY | Iene japones | ¥ |
| CAD | Dolar canadense | CA$ |
| ARS | Peso argentino | ARS$ |