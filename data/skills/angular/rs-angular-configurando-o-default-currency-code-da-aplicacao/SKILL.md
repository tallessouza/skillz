---
name: rs-angular-default-currency-code
description: "Applies Angular DEFAULT_CURRENCY_CODE injection token configuration when setting up currency formatting. Use when user asks to 'configure currency', 'format money in Angular', 'set default currency', 'use CurrencyPipe', or 'setup app.config providers'. Ensures the application uses a consistent currency code without repeating it in every pipe usage. Make sure to use this skill whenever configuring Angular currency formatting or adding CurrencyPipe to templates. Not for general i18n/locale setup, date formatting, or non-Angular currency handling."
---

# Configurando o Default Currency Code no Angular

> Defina o currency code padrao uma unica vez no app.config.ts para que o CurrencyPipe use automaticamente em toda a aplicacao.

## Rules

1. **Configure DEFAULT_CURRENCY_CODE nos providers** — adicione no `app.config.ts` junto aos outros providers, porque sem isso o Angular assume USD como padrao
2. **Importe de `@angular/core`** — `DEFAULT_CURRENCY_CODE` vem do core, nao de outro pacote
3. **Use `useValue` com o codigo ISO 4217** — `'BRL'`, `'USD'`, `'EUR'`, porque o CurrencyPipe espera codigos ISO validos
4. **Nao repita o currency code em cada pipe** — apos configurar o token, use apenas `| currency` sem parametros, porque o token ja fornece o padrao
5. **Especifique o code apenas quando diferir do padrao** — se a aplicacao usa BRL mas um campo precisa de USD, passe explicitamente `| currency:'USD'`

## How to write

### Configuracao no app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { DEFAULT_CURRENCY_CODE } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... outros providers (LOCALE_ID, etc.)
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    }
  ]
};
```

### Uso no template (sem parametro)

```html
<!-- Automaticamente formata como Real brasileiro -->
{{ produto.preco | currency }}

<!-- Quando precisar de outra moeda, especifique -->
{{ produto.precoInternacional | currency:'USD' }}
```

## Example

**Before (repetindo BRL em todo lugar):**

```html
{{ valor1 | currency:'BRL' }}
{{ valor2 | currency:'BRL' }}
{{ valor3 | currency:'BRL' }}
```

**After (com DEFAULT_CURRENCY_CODE configurado):**

```html
{{ valor1 | currency }}
{{ valor2 | currency }}
{{ valor3 | currency }}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao mostra apenas uma moeda | Configure DEFAULT_CURRENCY_CODE e use `| currency` sem parametros |
| Aplicacao mostra multiplas moedas | Configure a moeda principal como default, passe as outras explicitamente |
| Ja configurou LOCALE_ID | Adicione DEFAULT_CURRENCY_CODE no mesmo array de providers |
| Sem configuracao nenhuma | Angular assume USD — configure se sua moeda for diferente |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `{{ v \| currency:'BRL' }}` repetido em 20 templates | Configure o token e use `{{ v \| currency }}` |
| `DEFAULT_CURRENCY_CODE` importado de pacote errado | Importe de `@angular/core` |
| Criar um pipe customizado so para mudar a moeda padrao | Use o injection token nativo do Angular |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
