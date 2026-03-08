---
name: rs-full-stack-format-currency
description: "Enforces currency formatting best practices when displaying monetary values in Brazilian Real (BRL) using Intl.NumberFormat. Use when user asks to 'format money', 'display price', 'format currency', 'show BRL value', or 'convert number to money string'. Applies pattern: utility function with Intl.NumberFormat, pt-BR locale, currency style, and optional symbol stripping. Make sure to use this skill whenever rendering monetary values in UI components. Not for payment processing, currency conversion between different currencies, or backend price calculations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-utils
  tags: [javascript, typescript, currency, intl, numberformat, brl]
---

# Formatação de Moeda (Currency Formatting)

> Valores monetários exibidos na UI devem ser formatados via função utilitária dedicada usando `Intl.NumberFormat`, nunca concatenação manual de strings.

## Rules

1. **Crie uma função utilitária isolada** — `formatCurrency` em `utils/format-currency.ts`, porque centraliza a lógica de formatação e evita duplicação
2. **Use `Intl.NumberFormat` com locale `pt-BR`** — nunca formate manualmente com `toFixed` + replace, porque `Intl` lida com separadores de milhar, decimais e símbolo automaticamente
3. **Receba o valor como `number`, não `string`** — valores monetários internos usam ponto decimal (ex: `34.5`), porque é o padrão numérico da programação
4. **Remova o símbolo `R$` quando o layout já o inclui** — use `.replace("R$", "").trim()`, porque evita duplicação visual do símbolo de moeda
5. **Configure `style: "currency"` e `currency: "BRL"`** — essas propriedades garantem formatação correta com duas casas decimais e separadores brasileiros

## How to write

### Função utilitária de formatação

```typescript
// utils/format-currency.ts
export function formatCurrency(value: number) {
  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return currency.format(value).replace("R$", "").trim()
}
```

### Uso em componentes

```typescript
import { formatCurrency } from "@/utils/format-currency"

// Valor chega como número: 34.5
const formattedAmount = formatCurrency(34.5)
// Resultado: "34,50" (sem o "R$", pois o layout já exibe o símbolo)
```

## Example

**Before (valor sem formatação):**
```typescript
// Valor exibido direto como número
const amount = 34.5
<span>R$ {amount}</span>
// Renderiza: "R$ 34.5" — sem zero, com ponto, sem separador de milhar
```

**After (com formatCurrency aplicado):**
```typescript
import { formatCurrency } from "@/utils/format-currency"

const amount = 34.5
<span>R$ {formatCurrency(amount)}</span>
// Renderiza: "R$ 34,50" — com vírgula, duas casas decimais, separador correto
```

## Heuristics

| Situação | Ação |
|----------|------|
| Layout já possui símbolo R$ via CSS ou markup | Remover `R$` do retorno com `.replace("R$", "").trim()` |
| Layout NÃO possui símbolo | Manter retorno completo do `Intl.NumberFormat` (com R$) |
| Valor vem como string da API | Converter com `Number(value)` antes de passar para `formatCurrency` |
| Precisa de mais/menos casas decimais | Usar `minimumFractionDigits` e `maximumFractionDigits` no options |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `value.toFixed(2).replace(".", ",")` | `formatCurrency(value)` |
| `"R$ " + value` | `formatCurrency(value)` com Intl |
| `amount: "R$ 34,50"` (string hardcoded) | `amount: 34.5` (number) + formatação na view |
| Formatação inline no componente | Função utilitária em `utils/` |
| `parseFloat(value).toLocaleString()` sem config | `Intl.NumberFormat` com locale e currency explícitos |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `Intl.NumberFormat` retorna formato errado | Locale incorreto ou ausente | Use `"pt-BR"` explicitamente, nao confie no default |
| Valor exibido como `NaN` | Input e string nao-numerica | Converta com `Number(value)` e valide antes de formatar |
| Simbolo R$ aparece duplicado | Layout ja tem R$ e `formatCurrency` tambem retorna | Adicione `.replace("R$", "").trim()` no retorno |
| Centavos nao aparecem (ex: `34` em vez de `34,00`) | `toFixed` usado em vez de `Intl.NumberFormat` | Use `Intl.NumberFormat` que garante duas casas decimais |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre Intl.NumberFormat, locale handling e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações