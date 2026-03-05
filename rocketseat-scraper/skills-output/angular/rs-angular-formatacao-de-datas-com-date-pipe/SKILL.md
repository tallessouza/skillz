---
name: rs-angular-formatacao-datas-date-pipe
description: "Applies Angular DatePipe formatting patterns when displaying dates in templates. Use when user asks to 'format a date', 'show date in template', 'display date to user', 'use DatePipe', or 'format timestamp'. Covers format strings, timezone offsets, locale parameters, and custom date patterns. Make sure to use this skill whenever generating Angular template code that displays dates. Not for backend date manipulation, JavaScript Date arithmetic, or moment/dayjs/date-fns usage."
---

# Formatacao de Datas com DatePipe

> Datas sao armazenadas em UTC e formatadas no template com DatePipe para exibicao amigavel ao usuario.

## Rules

1. **Importe DatePipe do @angular/common** — adicione ao array de imports do componente standalone, porque sem isso o pipe nao sera reconhecido no template
2. **Salve datas em UTC** — use `new Date().toISOString()` ou timestamps UTC no backend, porque converter entre fusos e muito mais simples partindo de offset zero
3. **Registre locales antes de usar** — chame `registerLocaleData(localePt)` no main.ts para qualquer locale alem de en-US, porque o Angular so inclui en-US por padrao e vai lancar erro de regiao invalida
4. **Nao confunda locale com timezone** — o parametro locale muda apenas a formatacao (idioma, ordem), nao o offset da data
5. **Use formato customizado quando os predefinidos nao atendem** — combine simbolos como `HH:mm 'do dia' dd/MM/yyyy` para controle total
6. **Passe timezone como offset numerico** — DatePipe nao aceita IANA (america/sao_paulo), use `+0900` ou `-0300` ou `UTC`

## How to write

### Uso basico no template

```html
<!-- Formato padrao (mediumDate) -->
<p>{{ dataISO | date }}</p>

<!-- Formato predefinido -->
<p>{{ dataISO | date:'shortDate' }}</p>
<p>{{ dataISO | date:'fullDate' }}</p>

<!-- Formato customizado -->
<p>{{ dataISO | date:'HH:mm \'do dia\' dd/MM/yyyy' }}</p>

<!-- Com timezone explicito (UTC, sem offset local) -->
<p>{{ dataISO | date:'short':'UTC' }}</p>

<!-- Com timezone offset especifico (+9 Japao) -->
<p>{{ dataISO | date:'full':'+0900' }}</p>

<!-- Com timezone + locale especifico -->
<p>{{ dataISO | date:'full':'+0900':'fr-FR' }}</p>
```

### Registro de locale no main.ts

```typescript
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localePt);
registerLocaleData(localeFr);
```

### Configurar locale padrao da aplicacao

```typescript
// app.config.ts
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
```

## Example

**Before (data crua no template):**
```html
<p>{{ '2025-11-16T01:24:00.000Z' }}</p>
<!-- Exibe: 2025-11-16T01:24:00.000Z (ilegivel para o usuario) -->
```

**After (com DatePipe aplicado):**
```html
<p>{{ '2025-11-16T01:24:00.000Z' | date:'fullDate' }}</p>
<!-- Exibe: sabado, 15 de novembro de 2025 (com locale pt-BR) -->

<p>{{ '2025-11-16T01:24:00.000Z' | date:'HH:mm \'do dia\' dd/MM/yyyy' }}</p>
<!-- Exibe: 22:24 do dia 15/11/2025 (offset -3 aplicado automaticamente) -->
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mostrar data simples sem hora | `date:'shortDate'` ou `date:'dd/MM/yyyy'` |
| Mostrar data completa com dia da semana | `date:'fullDate'` |
| Mostrar data + hora | `date:'short'` ou formato customizado |
| Forcar exibicao em UTC | Passe `'UTC'` como segundo parametro |
| Exibir em fuso de outra regiao | Passe offset numerico como `'+0900'` |
| Formatar para idioma especifico | Passe locale como terceiro parametro e registre no main.ts |
| Backend retorna timestamp Unix | DatePipe aceita diretamente |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Mostrar ISO string direto no template | Use `\| date` com formato adequado |
| Passar IANA timezone (`america/sao_paulo`) | Passe offset numerico (`-0300`) |
| Usar locale sem registrar no main.ts | Chame `registerLocaleData()` antes |
| Confundir locale com timezone | Locale = formatacao, timezone = offset |
| Salvar data com offset no banco | Salve em UTC, aplique offset na exibicao |
| Formatar data manualmente com string interpolation | Use DatePipe que respeita locale automaticamente |

## Simbolos de formato customizado

| Simbolo | Resultado | Exemplo |
|---------|-----------|---------|
| `yyyy` | Ano 4 digitos | 2025 |
| `yy` | Ano 2 digitos | 25 |
| `MM` | Mes 2 digitos | 11 |
| `MMM` | Mes abreviado | nov |
| `dd` | Dia 2 digitos | 15 |
| `d` | Dia 1-2 digitos | 5 |
| `HH` | Hora 24h | 22 |
| `mm` | Minutos | 24 |
| `ss` | Segundos | 00 |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
