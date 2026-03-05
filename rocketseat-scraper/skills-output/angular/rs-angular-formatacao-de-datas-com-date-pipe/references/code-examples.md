# Code Examples: Formatacao de Datas com DatePipe

## Setup do componente

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  valor: string = '';

  ngOnInit() {
    this.valor = new Date().toISOString();
    console.log(this.valor);
    // Output: "2025-11-16T01:24:00.000Z"
  }
}
```

## Setup de locales no main.ts

```typescript
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localePt);
registerLocaleData(localeFr);
```

## Provider de LOCALE_ID no app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
```

## Exemplos no template

### Formato padrao (mediumDate)
```html
<h3>{{ valor | date }}</h3>
<!-- pt-BR: "15 de nov. de 2025" -->
<!-- en-US: "Nov 15, 2025" -->
```

### shortDate
```html
<h3>{{ valor | date:'shortDate' }}</h3>
<!-- pt-BR: "15/11/2025" -->
<!-- en-US: "11/15/25" -->
```

### fullDate
```html
<h3>{{ valor | date:'fullDate' }}</h3>
<!-- pt-BR: "sabado, 15 de novembro de 2025 as 22:24:00 GMT-3" -->
```

### Formato customizado
```html
<h3>{{ valor | date:"HH:mm 'do dia' dd/MM/yyyy" }}</h3>
<!-- "22:24 do dia 15/11/2025" (com offset local aplicado) -->
```

### Forcando UTC (sem offset local)
```html
<h3>{{ valor | date:"HH:mm 'do dia' dd/MM/yyyy":'UTC' }}</h3>
<!-- "13:24 do dia 16/11/2025" (hora original UTC) -->
```

### Aplicando offset do Japao (+9)
```html
<h3>{{ valor | date:"HH:mm 'do dia' dd/MM/yyyy":'+0900' }}</h3>
<!-- "22:24 do dia 16/11/2025" (UTC+9) -->
```

### Offset do Japao + locale frances
```html
<h3>{{ valor | date:'full':'+0900':'fr-FR' }}</h3>
<!-- Formatacao em frances, hora no fuso japones -->
```

## Tipos de valor aceitos pelo DatePipe

```typescript
// Todos esses funcionam como input do DatePipe:

// 1. ISO 8601 string
valor1 = '2025-11-16T01:24:00.000Z';

// 2. Date object
valor2 = new Date();

// 3. Timestamp Unix (milliseconds)
valor3 = 1731720240000;

// 4. undefined (nao renderiza nada)
valor4 = undefined;
```

## Erro comum: locale nao registrado

```html
<!-- Se fr-FR NAO foi registrado no main.ts -->
<h3>{{ valor | date:'full':'+0900':'fr-FR' }}</h3>
<!-- Resultado: ERRO no console, nada renderizado -->
```

Solucao: registrar o locale antes de usar.