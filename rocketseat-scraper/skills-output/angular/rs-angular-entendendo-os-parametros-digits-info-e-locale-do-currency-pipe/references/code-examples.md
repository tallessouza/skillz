# Code Examples: CurrencyPipe digitsInfo e locale

## Exemplo basico — sobrescrevendo digitsInfo

```html
<!-- Padrao da moeda BRL (2 casas decimais) -->
{{ 1234.567 | currency:'BRL' }}
<!-- R$1,234.57 (en-US padrao, arredonda para 2 decimais) -->

<!-- Sobrescrevendo para 1.2-2 -->
{{ 1234.567 | currency:'BRL':'code':'1.2-2' }}
<!-- BRL1,234.57 -->
```

O 4o parametro (posicao 3, zero-indexed) e o digitsInfo. O instrutor enfatiza contar a posicao: "1, 2, 3, 4 — o quarto parametro."

## Exemplo — locale pt-BR

```html
{{ 1234.56 | currency:'BRL':'symbol':'':'pt-BR' }}
<!-- R$ 1.234,56 -->
```

Mudancas aplicadas pelo locale pt-BR:
- Ponto como separador de milhar (1.234)
- Virgula como separador decimal (,56)
- Simbolo R$ no inicio

## Exemplo — locale fr-FR

```html
{{ 1234.56 | currency:'EUR':'symbol':'':'fr-FR' }}
<!-- 1 234,56 € -->
```

Mudancas aplicadas pelo locale fr-FR:
- Espaco como separador de milhar (1 234)
- Virgula como separador decimal (,56)
- Simbolo € no **final** (posicao muda por regiao)

## Exemplo — mesma moeda, locales diferentes

```html
<!-- USD para americanos -->
{{ 9999.99 | currency:'USD':'symbol':'':'en-US' }}
<!-- $9,999.99 -->

<!-- USD para brasileiros -->
{{ 9999.99 | currency:'USD':'symbol':'':'pt-BR' }}
<!-- US$ 9.999,99 -->
```

Note que o simbolo muda de `$` para `US$` — isso evita ambiguidade, ja que `$` sozinho poderia ser confundido com real em contexto brasileiro.

## Exemplo — digitsInfo customizado com locale

```html
<!-- 4 casas decimais, formatacao brasileira -->
{{ 1234.56789 | currency:'BRL':'symbol':'1.4-4':'pt-BR' }}
<!-- R$ 1.234,5679 -->

<!-- Sem casas decimais, formatacao americana -->
{{ 1234.56 | currency:'BRL':'symbol':'1.0-0':'en-US' }}
<!-- R$1,235 (arredondado) -->
```

## Registro de locale — setup necessario

```typescript
// app.config.ts ou main.ts
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es-MX';

registerLocaleData(localePt, 'pt-BR');
registerLocaleData(localeFr, 'fr-FR');
registerLocaleData(localeEs, 'es-MX');
```

Sem esse registro, o Angular vai usar `en-US` como fallback e o locale especificado no pipe sera ignorado silenciosamente.

## Formato do digitsInfo — referencia rapida

```
{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}

Exemplos:
'1.0-0'   → sem decimais
'1.2-2'   → exatamente 2 decimais
'1.2-4'   → entre 2 e 4 decimais
'3.2-2'   → minimo 3 digitos inteiros (ex: 001,234.56)
```

## Tabela de referencia — o que cada parametro controla

```
| Parametro    | Controla                        | Exemplo          |
|--------------|--------------------------------|------------------|
| currencyCode | Qual moeda (ISO 4217)          | 'BRL', 'USD'     |
| display      | Como mostrar simbolo           | 'symbol', 'code' |
| digitsInfo   | Quantos digitos                | '1.2-2'          |
| locale       | Separadores, posicao, simbolo  | 'pt-BR'          |
```