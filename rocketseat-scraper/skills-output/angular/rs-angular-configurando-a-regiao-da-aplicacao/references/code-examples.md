# Code Examples: Configurando a Região da Aplicação Angular

## Exemplo 1: Configuração completa pt-BR

### main.ts

```typescript
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');
```

### app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
```

### app.component.html

```html
<!-- Usa locale global pt-BR automaticamente -->
<h3>BR: {{ valor | percent: '1.2-2' }}</h3>
<!-- Resultado: 50,00% -->

<!-- Sobrescreve pontualmente para en-US -->
<h3>US: {{ valor | percent: '1.2-2': 'en-US' }}</h3>
<!-- Resultado: 50.00% -->
```

## Exemplo 2: Múltiplos locales (Brasil + Suíça francesa)

### main.ts

```typescript
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localePt, 'pt-BR');
registerLocaleData(localeFr, 'fr-CH');
```

### Template

```html
<h3>BR: {{ valor | percent: '1.2-2' }}</h3>
<!-- Resultado: 50,00% (padrão global pt-BR) -->

<h3>Suíça: {{ valor | percent: '1.2-2': 'fr-CH' }}</h3>
<!-- Resultado: 50,00 % (francês suíço usa espaço antes do %) -->

<h3>US: {{ valor | percent: '1.2-2': 'en-US' }}</h3>
<!-- Resultado: 50.00% -->
```

## Exemplo 3: Aplicação com DatePipe e DecimalPipe

A mesma configuração afeta todos os pipes de formatação:

```html
<!-- DatePipe -->
<p>{{ dataHoje | date: 'fullDate' }}</p>
<!-- pt-BR: sexta-feira, 28 de fevereiro de 2026 -->
<!-- en-US: Friday, February 28, 2026 -->

<!-- DecimalPipe -->
<p>{{ 1234567.89 | number: '1.2-2' }}</p>
<!-- pt-BR: 1.234.567,89 -->
<!-- en-US: 1,234,567.89 -->

<!-- PercentPipe -->
<p>{{ 0.856 | percent: '1.1-1' }}</p>
<!-- pt-BR: 85,6% -->
<!-- en-US: 85.6% -->
```

## Exemplo 4: Erro ao usar locale não registrado

```typescript
// main.ts — NÃO registrou es-MX
// Apenas registrou pt-BR
registerLocaleData(localePt, 'pt-BR');
```

```html
<!-- Template tenta usar es-MX -->
<p>{{ valor | percent: '1.2-2': 'es-MX' }}</p>
```

**Resultado:** Erro em runtime:
```
Error: Missing locale data for the locale "es-MX".
```

**Correção:** Registrar o locale antes de usar:

```typescript
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es-MX');
```