# Code Examples: DatePipe Default Options

## Exemplo 1: Configuracao basica no app.config.ts

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: {
        dateFormat: 'shortTime',
        timezone: '+0900'
      }
    }
  ]
};
```

**Resultado:** Todos os `| date` sem parametros usarao formato `shortTime` e timezone UTC+9.

## Exemplo 2: Apenas dateFormat (sem timezone)

```typescript
{
  provide: DATE_PIPE_DEFAULT_OPTIONS,
  useValue: {
    dateFormat: 'fullDate'
  }
}
```

**Resultado:** Formato sera `fullDate`, timezone continua sendo o local do sistema do usuario.

## Exemplo 3: Apenas timezone (sem dateFormat)

```typescript
{
  provide: DATE_PIPE_DEFAULT_OPTIONS,
  useValue: {
    timezone: '-0300'
  }
}
```

**Resultado:** Timezone fixo em UTC-3, formato continua sendo `mediumDate` (padrao do Angular).

## Exemplo 4: Template com e sem override

```html
<!-- Usa defaults do injection token -->
<p>Data padrao: {{ minhaData | date }}</p>

<!-- Sobrescreve formato, mantem timezone do token -->
<p>Formato custom: {{ minhaData | date:'dd/MM/yyyy' }}</p>

<!-- Sobrescreve formato E timezone -->
<p>Tudo custom: {{ minhaData | date:'dd/MM/yyyy HH:mm':'-0300' }}</p>
```

## Exemplo 5: Demonstracao do efeito do timezone

Dado uma data original em UTC: `2024-01-15T13:38:00Z`

```typescript
// Sem injection token (timezone local -0300):
// Resultado: 10:38 (13:38 - 3h)

// Com injection token timezone: '+0900':
// Resultado: 22:38 (13:38 + 9h)

// Com inline timezone: '-0300':
// Resultado: 10:38 (13:38 - 3h, ignora o token)
```

## Exemplo 6: Configuracao completa com outros providers

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: {
        dateFormat: 'dd/MM/yyyy HH:mm',
        timezone: '-0300'
      }
    }
  ]
};
```

## Formatos disponiveis para dateFormat

| Formato | Exemplo |
|---------|---------|
| `'short'` | `1/15/24, 10:38 AM` |
| `'medium'` | `Jan 15, 2024, 10:38:00 AM` |
| `'long'` | `January 15, 2024 at 10:38:00 AM GMT-3` |
| `'full'` | `Monday, January 15, 2024 at 10:38:00 AM` |
| `'shortDate'` | `1/15/24` |
| `'mediumDate'` | `Jan 15, 2024` (padrao) |
| `'longDate'` | `January 15, 2024` |
| `'fullDate'` | `Monday, January 15, 2024` |
| `'shortTime'` | `10:38 AM` |
| `'mediumTime'` | `10:38:00 AM` |
| `'dd/MM/yyyy'` | `15/01/2024` (custom) |