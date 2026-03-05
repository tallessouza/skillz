# Code Examples: Angular Pipes

## Configuracao de Locale

```typescript
// app.config.ts
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

export const appConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
```

## Pipes de texto

```html
<!-- UpperCasePipe -->
<p>{{ 'hello world' | uppercase }}</p>
<!-- Output: HELLO WORLD -->

<!-- LowerCasePipe -->
<p>{{ 'HELLO WORLD' | lowercase }}</p>
<!-- Output: hello world -->

<!-- TitleCasePipe -->
<p>{{ 'hello world' | titlecase }}</p>
<!-- Output: Hello World -->
```

## SlicePipe

```html
<!-- Em arrays -->
<li *ngFor="let item of items | slice:0:5">{{ item }}</li>

<!-- Em strings -->
<p>{{ 'Angular Pipes' | slice:0:7 }}</p>
<!-- Output: Angular -->
```

## CurrencyPipe

```html
<!-- Padrao (usa LOCALE_ID configurado) -->
<span>{{ 1234.5 | currency:'BRL' }}</span>
<!-- Output com pt-BR: R$ 1.234,50 -->

<!-- Com display symbol -->
<span>{{ 1234.5 | currency:'USD':'symbol' }}</span>
<!-- Output: $1,234.50 -->

<!-- Com digitos decimais -->
<span>{{ 1234.5 | currency:'BRL':'symbol':'1.2-2' }}</span>
```

## PercentPipe

```html
<!-- Basico -->
<span>{{ 0.259 | percent }}</span>
<!-- Output com pt-BR: 26% -->

<!-- Com casas decimais -->
<span>{{ 0.259 | percent:'1.0-2' }}</span>
<!-- Output com pt-BR: 25,90% -->
```

## DatePipe

```html
<!-- Formato curto -->
<span>{{ dataAtual | date:'short' }}</span>

<!-- Formato customizado -->
<span>{{ dataAtual | date:'dd/MM/yyyy HH:mm' }}</span>

<!-- Com timezone explicito -->
<span>{{ dataAtual | date:'dd/MM/yyyy':'GMT-3' }}</span>

<!-- Formato longo com locale -->
<span>{{ dataAtual | date:'fullDate' }}</span>
<!-- Output pt-BR: sexta-feira, 28 de fevereiro de 2026 -->
```

## AsyncPipe

```typescript
// component.ts
@Component({
  template: `
    <div *ngIf="users$ | async as users">
      <p *ngFor="let user of users">{{ user.name }}</p>
    </div>
  `
})
export class UsersComponent {
  users$ = this.http.get<User[]>('/api/users');
  constructor(private http: HttpClient) {}
}
```

## JsonPipe (debug)

```html
<!-- Util para debug rapido -->
<pre>{{ complexObject | json }}</pre>
```

## Pipe customizado

```typescript
// cpf-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfFormat',
  standalone: true,
  pure: true // default, explicito para clareza
})
export class CpfFormatPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}

// Uso no template:
// <span>{{ user.cpf | cpfFormat }}</span>
```

## Pipe customizado com parametro

```typescript
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 50): string {
    if (!value || value.length <= maxLength) return value;
    return value.substring(0, maxLength) + '...';
  }
}

// Uso: {{ descricao | truncate:100 }}
```

## Pipe impuro (exemplo com array mutavel)

```typescript
@Pipe({
  name: 'filterActive',
  standalone: true,
  pure: false // reexecuta a cada change detection
})
export class FilterActivePipe implements PipeTransform {
  transform(items: any[]): any[] {
    return items.filter(item => item.active);
  }
}

// Necessario quando items.push() e usado sem trocar referencia
// Prefira trocar a referencia do array para usar pipe puro
```