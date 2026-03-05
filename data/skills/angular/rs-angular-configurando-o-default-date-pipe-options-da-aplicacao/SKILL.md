---
name: rs-angular-default-date-pipe-options
description: "Applies Angular DatePipe global configuration via DATE_PIPE_DEFAULT_OPTIONS injection token when user asks to 'configure date format', 'set timezone globally', 'customize DatePipe defaults', or 'setup date pipe options' in Angular apps. Enforces provider-based configuration in app.config.ts with dateFormat and timezone properties. Make sure to use this skill whenever configuring global date formatting or timezone in Angular. Not for moment.js, date-fns, or non-Angular date formatting."
---

# Configurando DatePipe Default Options no Angular

> Configure formatacao e timezone globais do DatePipe via injection token para evitar repeticao em cada uso do pipe.

## Rules

1. **Use DATE_PIPE_DEFAULT_OPTIONS como provider** — configure em `app.config.ts` na secao `providers`, porque centraliza a configuracao e evita reescrita em cada template
2. **Import de `@angular/common`** — o token `DATE_PIPE_DEFAULT_OPTIONS` vem de `@angular/common`, nao de `@angular/core`
3. **Dois parametros disponiveis: dateFormat e timezone** — se nao configurar dateFormat, o padrao e `mediumDate`; se nao configurar timezone, usa o timezone local do sistema do usuario
4. **Parametros inline sobrescrevem o token** — se passar formato ou timezone diretamente no pipe no template, esses valores tem prioridade sobre o injection token
5. **Timezone usa formato offset** — exemplo: `'+0900'` para Japao, `'-0300'` para Brasil, porque o DatePipe espera string de offset UTC

## How to configure

### Provider no app.config.ts

```typescript
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... outros providers
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

### Uso no template (sem especificar nada)

```html
<!-- Usa dateFormat e timezone do injection token -->
<p>{{ minhaData | date }}</p>

<!-- Sobrescreve com parametros inline -->
<p>{{ minhaData | date:'fullDate':'-0300' }}</p>
```

## Example

**Before (repetindo timezone em cada uso):**

```html
<p>{{ createdAt | date:'short':'-0300' }}</p>
<p>{{ updatedAt | date:'short':'-0300' }}</p>
<p>{{ deletedAt | date:'short':'-0300' }}</p>
```

**After (com injection token configurado):**

```typescript
// app.config.ts
{
  provide: DATE_PIPE_DEFAULT_OPTIONS,
  useValue: { dateFormat: 'short', timezone: '-0300' }
}
```

```html
<!-- Sem repeticao, usa os defaults -->
<p>{{ createdAt | date }}</p>
<p>{{ updatedAt | date }}</p>
<p>{{ deletedAt | date }}</p>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App inteira usa mesmo timezone | Configure timezone no injection token |
| Formato de data padrao diferente de `mediumDate` | Configure dateFormat no token |
| Uma data especifica precisa de formato diferente | Passe inline no template, o token e sobrescrito |
| Precisa de ambos dateFormat e timezone | Passe as duas propriedades no useValue |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Repetir timezone em cada `\| date` no template | Configure uma vez no injection token |
| Importar `DATE_PIPE_DEFAULT_OPTIONS` de `@angular/core` | Importe de `@angular/common` |
| Configurar timezone como numero (`9` ou `-3`) | Use string offset: `'+0900'`, `'-0300'` |
| Criar service customizado so para formatar datas | Use o injection token nativo do Angular |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
