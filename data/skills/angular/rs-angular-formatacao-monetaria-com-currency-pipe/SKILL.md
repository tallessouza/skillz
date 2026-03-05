---
name: rs-angular-currency-pipe
description: "Applies Angular CurrencyPipe formatting rules when displaying monetary values in templates. Use when user asks to 'format currency', 'display price', 'show money value', 'format monetary', or uses CurrencyPipe in Angular templates. Covers currencyCode, display, digitsInfo, and locale parameters. Make sure to use this skill whenever formatting numbers as currency in Angular. Not for PercentPipe, DecimalPipe, or non-Angular currency formatting."
---

# Formatacao Monetaria com CurrencyPipe

> Usar o CurrencyPipe para transformar numeros em strings monetarias formatadas, adaptadas a regiao da aplicacao.

## Rules

1. **Sempre informar o currencyCode** — passar o codigo ISO 4217 (`BRL`, `USD`, `EUR`, `CAD`, `JPY`), porque sem ele o pipe nao sabe qual moeda representar
2. **Usar o parametro display para controlar o simbolo** — `'symbol'` exibe `R$`, `$`, `€`; `'code'` exibe `BRL`, `USD`, `EUR`, porque cada contexto exige formato diferente
3. **digitsInfo controla casas decimais** — formato `{minInteiro}.{minDecimal}-{maxDecimal}`, ex: `'1.2-2'` forca 2 casas decimais, porque moedas diferentes tem precisoes diferentes (JPY usa 0 decimais)
4. **locale define a formatacao regional** — separadores de milhar e decimal mudam conforme a regiao (BR usa `.` milhar e `,` decimal, US usa `,` milhar e `.` decimal), porque exibir formatacao errada confunde o usuario
5. **Locale padrao e en-US** — se nenhum locale global for configurado, o Angular usa `en-US`, porque esse e o default do framework
6. **CurrencyPipe e um Pure Pipe** — vem de `@angular/common`, importar no componente standalone ou no modulo antes de usar

## How to write

### Uso basico no template

```html
<!-- Valor: 1234.5 -->
<p>{{ valor | currency:'BRL' }}</p>         <!-- R$1,234.50 (locale en-US padrao) -->
<p>{{ valor | currency:'USD' }}</p>         <!-- $1,234.50 -->
<p>{{ valor | currency:'EUR' }}</p>         <!-- €1,234.50 -->
<p>{{ valor | currency:'JPY' }}</p>         <!-- ¥1,235 -->
```

### Controlando display e digitsInfo

```html
<!-- Exibir codigo ao inves do simbolo -->
<p>{{ preco | currency:'BRL':'code' }}</p>          <!-- BRL1,234.50 -->

<!-- Forcar 2 casas decimais -->
<p>{{ preco | currency:'BRL':'symbol':'1.2-2' }}</p> <!-- R$1,234.50 -->
```

### No componente (standalone)

```typescript
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-preco',
  standalone: true,
  imports: [CurrencyPipe],
  template: `<span>{{ preco | currency:'BRL':'symbol':'1.2-2' }}</span>`
})
export class PrecoComponent {
  preco = 1234.5;
}
```

## Example

**Before (numero sem formatacao):**
```html
<p>{{ produto.preco }}</p>
<!-- Exibe: 1234.5 -->
```

**After (com CurrencyPipe):**
```html
<p>{{ produto.preco | currency:'BRL':'symbol':'1.2-2' }}</p>
<!-- Exibe: R$1,234.50 (en-US locale) -->
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Exibir preco em reais | `currency:'BRL'` |
| Exibir preco em dolares | `currency:'USD'` |
| Moeda sem casas decimais (JPY) | `currency:'JPY':'symbol':'1.0-0'` |
| Mostrar codigo ISO ao inves de simbolo | Segundo parametro `'code'` |
| Formatacao BR (ponto milhar, virgula decimal) | Configurar locale `pt-BR` globalmente |
| Nao lembra dos parametros | Sintaxe: `value | currency:code:display:digitsInfo:locale` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Formatar moeda manualmente com template literals | Usar `currency` pipe |
| Esquecer o currencyCode | Sempre passar ISO 4217: `'BRL'`, `'USD'` |
| Assumir que locale padrao e pt-BR | Configurar locale global ou passar no pipe |
| Usar `number` pipe para valores monetarios | Usar `currency` pipe que adiciona simbolo e formatacao |
| Hardcodar `R$` + number pipe | Usar `currency:'BRL'` que trata tudo automaticamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
