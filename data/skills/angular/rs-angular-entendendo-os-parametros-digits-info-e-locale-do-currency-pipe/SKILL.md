---
name: rs-angular-currency-pipe-params
description: "Applies correct CurrencyPipe digitsInfo and locale parameters when formatting currency values in Angular templates. Use when user asks to 'format currency', 'display money', 'format price', 'use CurrencyPipe', or 'change locale in pipe'. Enforces correct parameter order, locale-aware formatting, and digitsInfo override patterns. Make sure to use this skill whenever generating Angular templates with currency formatting. Not for percent pipe, date pipe, or non-Angular currency formatting."
---

# CurrencyPipe — digitsInfo e locale

> Ao formatar moeda com CurrencyPipe, controle precisao decimal via digitsInfo e aparencia regional via locale — sao preocupacoes independentes.

## Rules

1. **Respeite a ordem dos parametros** — `value | currency:currencyCode:display:digitsInfo:locale`, porque inverter causa erros silenciosos de formatacao
2. **digitsInfo so controla digitos** — formato `{minInteiros}.{minDecimais}-{maxDecimais}`, porque ele NAO muda separador de milhar/decimal (isso e locale)
3. **locale controla 3 coisas** — separador milhar/decimal, posicao do simbolo, e simbolo da moeda, porque regioes diferentes exibem a mesma moeda de formas distintas
4. **Cada moeda tem digitsInfo padrao** — locale NAO sobrescreve digitsInfo, porque sao parametros independentes; so o parametro digitsInfo sobrescreve
5. **Use codigos BCP 47 para locale** — `pt-BR`, `en-US`, `fr-FR`, porque e o padrao aceito pelo Angular
6. **Registre o locale no app** — importe e registre com `registerLocaleData()`, porque o Angular so inclui `en-US` por padrao

## How to write

### CurrencyPipe com parametros completos

```html
<!-- Ordem: currencyCode : display : digitsInfo : locale -->
{{ price | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}

<!-- Sobrescrevendo apenas digitsInfo (4o parametro) -->
{{ price | currency:'USD':'code':'1.2-2' }}

<!-- Apenas locale sem digitsInfo customizado -->
{{ price | currency:'EUR':'symbol':'':'fr-FR' }}
```

### Registro de locale no modulo

```typescript
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');
```

## Example

**Before (sem controle de locale/digitsInfo):**
```html
{{ 1234.5 | currency:'BRL' }}
<!-- Resultado: R$1,234.50 (formatacao en-US padrao) -->
```

**After (com locale e digitsInfo corretos):**
```html
{{ 1234.5 | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
<!-- Resultado: R$ 1.234,50 (ponto milhar, virgula decimal, simbolo no inicio) -->
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App brasileiro com precos em BRL | Use `locale:'pt-BR'` e registre o locale |
| Mostrar moeda estrangeira para usuario BR | Use currency code da moeda + `locale:'pt-BR'` |
| Precisao decimal diferente do padrao da moeda | Sobrescreva com digitsInfo, nunca com locale |
| Multiplas moedas na mesma pagina | Cada pipe pode ter locale diferente |
| Simbolo aparece na posicao errada | Problema de locale, nao de display |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Tentar mudar casas decimais via locale | Use o parametro digitsInfo |
| Esquecer de registrar locale e esperar formatacao correta | `registerLocaleData(localePt, 'pt-BR')` |
| Confundir ordem dos parametros | Lembre: code, display, digitsInfo, locale (1,2,3,4) |
| Usar locale para "consertar" separador milhar/decimal | Locale controla isso — mas entenda que digitsInfo e locale sao independentes |
| Assumir que simbolo e igual em todas as regioes | Mesma moeda pode ter simbolos diferentes por regiao (ambiguidade) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
