---
name: rs-angular-currency-code-pipe
description: "Applies Angular CurrencyPipe currencyCode and locale configuration when formatting monetary values in templates. Use when user asks to 'format currency', 'display money', 'show price', 'configure CurrencyPipe', or 'set locale for money'. Enforces correct ISO 4217 codes, locale-aware symbol and separator formatting, and global vs specific locale strategy. Make sure to use this skill whenever generating Angular templates with monetary values. Not for number formatting without currency, PercentPipe, or DecimalPipe usage."
---

# CurrencyPipe — CurrencyCode e Locale

> Ao formatar valores monetarios em Angular, configure o currencyCode (ISO 4217) e a localidade para garantir simbolo, separador de milhar e decimal corretos para a regiao do usuario.

## Rules

1. **Sempre informe o currencyCode** — use o codigo ISO 4217 em maiusculo (`'BRL'`, `'USD'`, `'EUR'`, `'JPY'`), porque e parametro obrigatorio do CurrencyPipe
2. **Configure locale globalmente para aplicacoes single-region** — use o injection token `LOCALE_ID` nos providers, porque evita repetir locale em cada pipe
3. **Use locale especifico no pipe apenas para excecoes** — passe o parametro locale diretamente no pipe quando UMA moeda precisa de formatacao diferente da global
4. **Entenda que currencyCode afeta dois aspectos** — o simbolo da moeda E a formatacao de digitsInfo (milhar/decimal), porque cada moeda tem sua configuracao padrao
5. **Locale muda o simbolo da mesma moeda** — `USD` com locale `pt-BR` exibe `US$`, com `en-US` exibe apenas `$`, porque cada localidade tem sua representacao visual
6. **Locale muda separadores** — `pt-BR` usa ponto para milhar e virgula para decimal; `en-US` usa virgula para milhar e ponto para decimal

## How to write

### Configuracao global de locale

```typescript
// app.config.ts — configurar uma vez para toda a aplicacao
import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
```

### CurrencyPipe no template

```html
<!-- Usa locale global (pt-BR configurado acima) -->
{{ preco | currency:'BRL' }}
<!-- Resultado: R$ 1.500,00 -->

<!-- Locale especifico apenas para esta moeda -->
{{ priceUsd | currency:'USD':'symbol':'1.2-2':'en-US' }}
<!-- Resultado: $1,500.00 -->
```

### Ordem dos parametros do CurrencyPipe

```html
{{ value | currency: currencyCode : display : digitsInfo : locale }}
<!--                  'BRL'        'symbol'  '1.2-2'      'pt-BR' -->
```

## Example

**Before (sem locale, formatacao inconsistente):**
```html
{{ valor | currency:'BRL' }}
<!-- Com locale default en-US: BRL1,500.00 — confuso para brasileiro -->
```

**After (com locale global pt-BR):**
```html
{{ valor | currency:'BRL' }}
<!-- R$ 1.500,00 — formato que brasileiro entende -->

{{ valorDolar | currency:'USD' }}
<!-- US$ 1.500,00 — simbolo brasileiro para dolar -->

{{ valorDolar | currency:'USD':'symbol':'1.2-2':'en-US' }}
<!-- $1,500.00 — formato americano especifico -->
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App usada apenas por brasileiros | Configure `LOCALE_ID: 'pt-BR'` global + `currency:'BRL'` |
| App multi-regiao | Configure locale global da regiao principal, use locale especifico nas excecoes |
| Precisa mostrar dolar no padrao americano dentro de app brasileira | Passe `'en-US'` como ultimo parametro do pipe |
| Nao sabe o codigo da moeda | Consulte a lista ISO 4217 (ex: BRL, USD, EUR, JPY, GBP) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Deixar locale default `en-US` em app brasileira | Configure `LOCALE_ID` para `'pt-BR'` nos providers |
| Repetir locale em cada pipe quando toda app e mesma regiao | Configure globalmente via `LOCALE_ID` |
| Usar codigo minusculo `'brl'` | Use maiusculo `'BRL'` (ISO 4217) |
| Formatar manualmente com pontos e virgulas | Deixe o CurrencyPipe + locale fazer a formatacao |
| Esquecer `registerLocaleData()` ao mudar locale | Sempre registre o locale antes de usa-lo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
