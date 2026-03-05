# Code Examples: KeyValuePipe

## Exemplo 1: Iterando sobre objeto simples

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [KeyValuePipe],
  template: `
    @for (item of user | keyvalue; track item.key) {
      <p>{{ item.key }}: {{ item.value }}</p>
    }
  `
})
export class AppComponent {
  user = {
    name: 'Felipe',
    role: 'Instrutor',
    id: 1
  };
}
```

**Output no browser (ordenado alfabeticamente):**
```
id: 1
name: Felipe
role: Instrutor
```

## Exemplo 2: Preservando ordem original com compareFn

```typescript
@Component({
  selector: 'app-root',
  imports: [KeyValuePipe],
  template: `
    @for (item of user | keyvalue: keepOriginalOrder; track item.key) {
      <p>{{ item.key }}: {{ item.value }}</p>
    }
  `
})
export class AppComponent {
  user = {
    name: 'Felipe',
    role: 'Instrutor',
    id: 1
  };

  keepOriginalOrder = () => 0;
}
```

**Output no browser (ordem original preservada):**
```
name: Felipe
role: Instrutor
id: 1
```

## Exemplo 3: Iterando sobre Map com CurrencyPipe

```typescript
import { Component } from '@angular/core';
import { KeyValuePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [KeyValuePipe, CurrencyPipe],
  template: `
    @for (item of cardapio | keyvalue: keepOriginalOrder; track item.key) {
      <p>{{ item.key }}: {{ item.value | currency }}</p>
    }
  `
})
export class AppComponent {
  cardapio = new Map<string, number>([
    ['X-Bacon', 25],
    ['Batata Frita', 15],
    ['Coca-Cola', 8],
  ]);

  keepOriginalOrder = () => 0;
}
```

**Output (com locale pt-BR e currency BRL configurados no AppConfig):**
```
X-Bacon: R$25,00
Batata Frita: R$15,00
Coca-Cola: R$8,00
```

**Configuracao de locale necessaria no app.config.ts:**
```typescript
import { ApplicationConfig } from '@angular/core';
import { DEFAULT_CURRENCY_CODE } from '@angular/core';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localePtBr);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
  ]
};
```

## Exemplo 4: Pipe simples instanciado diretamente (sem providers)

```typescript
import { UpperCasePipe } from '@angular/common';

@Component({ ... })
export class AppComponent {
  constructor() {
    const upperPipe = new UpperCasePipe();
    console.log(upperPipe.transform('felipe')); // 'FELIPE'
  }
}
```

## Exemplo 5: KeyValuePipe injetado na classe do componente

```typescript
import { Component, inject } from '@angular/core';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [KeyValuePipe],
  providers: [KeyValuePipe], // Obrigatorio para inject()
  template: `...`
})
export class AppComponent {
  private keyValuePipe = inject(KeyValuePipe);

  user = {
    name: 'Felipe',
    role: 'Instrutor',
    id: 1
  };

  constructor() {
    const entries = this.keyValuePipe.transform(this.user);
    console.log(entries);
    // [
    //   { key: 'id', value: 1 },
    //   { key: 'name', value: 'Felipe' },
    //   { key: 'role', value: 'Instrutor' }
    // ]
  }
}
```

## Exemplo 6: Erro ao tentar injetar sem providers

```typescript
// ERRO — KeyValuePipe nao e injetavel por padrao
@Component({
  imports: [KeyValuePipe],
  // providers: [KeyValuePipe],  // SEM ISSO = ERRO
})
export class AppComponent {
  private keyValuePipe = inject(KeyValuePipe);
  // NullInjectorError: No provider for KeyValuePipe!
}
```

**Fix:** adicionar `providers: [KeyValuePipe]` no decorator do componente.

## Variacao: Usando KeyValuePipe para filtrar propriedades na classe

```typescript
@Component({
  providers: [KeyValuePipe],
  imports: [KeyValuePipe],
  template: `
    @for (item of filteredEntries | keyvalue; track item.key) {
      <p>{{ item.key }}: {{ item.value }}</p>
    }
  `
})
export class AppComponent {
  private keyValuePipe = inject(KeyValuePipe);

  user = { name: 'Felipe', role: 'Instrutor', id: 1, email: 'felipe@test.com' };

  // Reutiliza o pipe para filtrar na classe
  filteredEntries = Object.fromEntries(
    this.keyValuePipe
      .transform(this.user)
      .filter(entry => entry.key !== 'id')
      .map(entry => [entry.key, entry.value])
  );
}
```