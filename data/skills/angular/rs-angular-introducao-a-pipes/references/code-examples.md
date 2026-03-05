# Code Examples: Angular Pipes

## Sintaxe basica de Pipes

```typescript
// No template Angular, pipes sao aplicados com o operador |
{{ valor | pipeName }}
{{ valor | pipeName:arg1:arg2 }}
```

## Pipes de texto

```html
<!-- lowercase -->
<p>{{ 'HELLO WORLD' | lowercase }}</p>
<!-- output: hello world -->

<!-- uppercase -->
<p>{{ 'hello world' | uppercase }}</p>
<!-- output: HELLO WORLD -->

<!-- titlecase -->
<p>{{ 'hello world angular' | titlecase }}</p>
<!-- output: Hello World Angular -->
```

## SlicePipe — Arrays e Strings

```html
<!-- Fatiar string -->
<p>{{ 'Angular Pipes' | slice:0:7 }}</p>
<!-- output: Angular -->

<!-- Fatiar array -->
<ul>
  <li *ngFor="let item of items | slice:0:5">{{ item }}</li>
</ul>
<!-- Mostra apenas os 5 primeiros items -->
```

## JsonPipe — Debug

```html
<!-- Debug de objeto no template -->
<pre>{{ usuario | json }}</pre>
<!--
output:
{
  "nome": "João",
  "email": "joao@email.com",
  "ativo": true
}
-->
```

## PercentPipe

```html
<!-- Formatacao basica -->
<p>{{ 0.505 | percent }}</p>
<!-- output (en-US): 51% -->
<!-- output (pt-BR): 51% -->

<!-- Com casas decimais: 'minIntDigits.minFracDigits-maxFracDigits' -->
<p>{{ 0.505 | percent:'1.0-2' }}</p>
<!-- output: 50.5% -->
```

## CurrencyPipe

```html
<!-- Moeda brasileira -->
<p>{{ 1500.5 | currency:'BRL':'symbol' }}</p>
<!-- output (pt-BR): R$ 1.500,50 -->

<!-- Dolar americano -->
<p>{{ 1500.5 | currency:'USD':'symbol' }}</p>
<!-- output (en-US): $1,500.50 -->
```

## DatePipe

```html
<!-- Formato curto -->
<p>{{ dataAtual | date:'short' }}</p>

<!-- Formato customizado -->
<p>{{ dataAtual | date:'dd/MM/yyyy HH:mm' }}</p>
<!-- output: 28/02/2026 14:30 -->

<!-- Com timezone -->
<p>{{ dataAtual | date:'dd/MM/yyyy':'GMT-3' }}</p>
```

## KeyValuePipe

```html
<!-- Iterar sobre objeto -->
<div *ngFor="let item of objeto | keyvalue">
  {{ item.key }}: {{ item.value }}
</div>
```

## AsyncPipe

```html
<!-- Resolver Observable diretamente no template -->
<p>{{ usuarios$ | async | json }}</p>

<!-- Com ngIf -->
<div *ngIf="usuario$ | async as usuario">
  <p>{{ usuario.nome }}</p>
</div>
```

## Configuracao de Locale

```typescript
// app.config.ts ou app.module.ts
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

// No providers:
providers: [
  { provide: LOCALE_ID, useValue: 'pt-BR' }
]
```

## Pipe customizado

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true // default, cacheia resultado
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    if (value.length <= limit) return value;
    return value.substring(0, limit) + '...';
  }
}
```

```html
<p>{{ textoLongo | truncate:100 }}</p>
```

## Pipe puro vs impuro

```typescript
// PURO (default) — so re-executa quando referencia muda
@Pipe({ name: 'meuPipe', pure: true })

// IMPURO — re-executa a cada change detection cycle
@Pipe({ name: 'meuPipe', pure: false })
```

## Metodo no template vs Pipe (performance)

```html
<!-- RUIM: re-executa a cada change detection -->
<p>{{ formatarPreco(produto.preco) }}</p>

<!-- BOM: cacheia resultado ate input mudar -->
<p>{{ produto.preco | currency:'BRL' }}</p>
```