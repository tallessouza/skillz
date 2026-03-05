---
name: rs-angular-decimal-pipe
description: "Applies Angular DecimalPipe formatting rules when working with number display in templates. Use when user asks to 'format numbers', 'display decimals', 'use DecimalPipe', 'format currency values', or 'configure number pipes' in Angular. Enforces correct digitsInfo syntax, locale-aware separators, and pipe name ('number' not 'decimal'). Make sure to use this skill whenever formatting numeric output in Angular templates. Not for PercentPipe, CurrencyPipe, or non-Angular number formatting."
---

# Formatacao de Decimais com DecimalPipe

> Usar o DecimalPipe (chamado `number` no template) para formatar numeros com controle preciso de inteiros e decimais, respeitando a localidade configurada.

## Rules

1. **Use `number` no template, nunca `decimal`** — o pipe se chama DecimalPipe na classe, mas no template o nome e `number`, porque confundir causa erro silencioso
2. **digitsInfo padrao e `1.0-3`** — minimo 1 inteiro, minimo 0 decimais, maximo 3 decimais. Conheca o padrao antes de customizar
3. **Formato do digitsInfo: `{minInteiros}.{minDecimais}-{maxDecimais}`** — separado por ponto, sem espacos, porque qualquer erro de sintaxe quebra a formatacao
4. **Separadores dependem do locale** — com `pt-BR` usa virgula para decimais e ponto para milhares. Com `en-US` (padrao) inverte. Configure `LOCALE_ID` no providers
5. **Nao confunda com PercentPipe** — DecimalPipe formata o numero como esta. PercentPipe multiplica por 100 e adiciona `%`

## How to write

### Uso basico no template

```html
<!-- Padrao 1.0-3: mostra "100" -->
{{ 100 | number }}

<!-- Com digitsInfo customizado: mostra "100,000" (pt-BR) -->
{{ 100 | number:'1.3-3' }}

<!-- Numero quebrado: mostra "100,678" (pt-BR) -->
{{ 100.678 | number:'1.3-3' }}
```

### Configuracao de locale

```typescript
// app.config.ts ou app.module.ts
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

// No providers:
{ provide: LOCALE_ID, useValue: 'pt-BR' }
```

### Import no componente standalone

```typescript
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [DecimalPipe],
  template: `{{ valor | number:'1.2-2' }}`
})
```

## Example

**Before (erro comum):**
```html
<!-- ERRADO: nome do pipe incorreto -->
{{ preco | decimal:'1.2-2' }}

<!-- ERRADO: sem formatacao, mostra 1234.5 cru -->
{{ preco }}
```

**After (com esta skill aplicada):**
```html
<!-- CORRETO: usa 'number', nao 'decimal' -->
{{ preco | number:'1.2-2' }}
<!-- Com pt-BR: "1.234,50" -->
```

## Heuristics

| Situacao | Do |
|----------|-----|
| Exibir preco sem CurrencyPipe | `number:'1.2-2'` para sempre 2 casas decimais |
| Exibir quantidade inteira | `number:'1.0-0'` para zero decimais |
| Exibir medicao com precisao | `number:'1.3-3'` para exatamente 3 casas |
| Separadores aparecendo errados | Verificar `LOCALE_ID` nos providers |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `{{ val \| decimal }}` | `{{ val \| number }}` |
| `{{ val \| number:'1.3' }}` (falta max) | `{{ val \| number:'1.3-3' }}` |
| `{{ val * 100 \| number }}%` para percentual | `{{ val \| percent }}` |
| Formatacao manual com `.toFixed()` no TS | `{{ val \| number:'1.2-2' }}` no template |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
