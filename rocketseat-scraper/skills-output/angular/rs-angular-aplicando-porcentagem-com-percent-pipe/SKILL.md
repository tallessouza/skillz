---
name: rs-angular-percent-pipe
description: "Applies Angular PercentPipe formatting rules when writing template expressions with percentage values. Use when user asks to 'format percentage', 'show percent', 'use percent pipe', 'display percentage in Angular', or 'format number as percent'. Enforces correct input values (0.5 for 50%), DigitsInfo syntax (minInt.minFrac-maxFrac), and rounding rules. Make sure to use this skill whenever generating Angular templates that display percentages. Not for CurrencyPipe, DecimalPipe, or non-Angular percentage formatting."
---

# PercentPipe — Formatacao de Porcentagem no Angular

> Ao usar o PercentPipe, o valor de entrada representa a fracao (0.5 = 50%), e o DigitsInfo controla inteiros minimos, decimais minimos e decimais maximos.

## Rules

1. **Valor de entrada e fracao, nao porcentagem** — passe `0.5` para 50%, `1.0` para 100%, porque o pipe multiplica por 100 automaticamente
2. **Sintaxe do DigitsInfo e `minInt.minFrac-maxFrac`** — exemplo `1.2-2`, porque cada posicao controla uma regra diferente de formatacao
3. **Zeros sao adicionados quando faltam decimais** — se minFrac exige 4 e o valor tem 1 decimal, zeros completam, porque o pipe garante o minimo de casas fracionarias
4. **Arredondamento quando sobram decimais** — digito descartado >= 5 incrementa o anterior, < 5 mantem, porque segue regras matematicas padrao de arredondamento
5. **Padrao sem DigitsInfo e `1.0-0`** — 1 inteiro minimo, 0 decimais minimos, 0 decimais maximos
6. **Locale define separador decimal** — ponto para en-US, virgula para pt-BR, porque o pipe respeita a configuracao regional

## How to write

### Uso basico no template

```html
<!-- Valor 0.5 exibe "50%" -->
{{ value | percent }}

<!-- Com DigitsInfo: minimo 2 decimais, maximo 2 -->
{{ value | percent:'1.2-2' }}

<!-- Com locale -->
{{ value | percent:'1.2-2':'pt-BR' }}
```

### Valores de entrada corretos

```typescript
// No componente
percentualConcluido = 0.75;   // 75%
taxaConversao = 0.032;        // 3.2%
completo = 1.0;               // 100%
```

## Example

**Before (erro comum — passar valor ja em porcentagem):**

```html
<!-- percentual = 50 -->
{{ percentual | percent }}
<!-- Resultado: 5,000% (ERRADO — 50 * 100 = 5000) -->
```

**After (com esta skill aplicada):**

```html
<!-- percentual = 0.5 -->
{{ percentual | percent:'1.0-2' }}
<!-- Resultado: 50% -->
```

## DigitsInfo — Tabela de referencia rapida

| DigitsInfo | Entrada | Valor x100 | Resultado | Motivo |
|------------|---------|------------|-----------|--------|
| (nenhum) | 0.5 | 50 | `50%` | Padrao 1.0-0 |
| `1.2-2` | 0.5 | 50 | `50.00%` | Zeros adicionados (minFrac=2) |
| `1.0-3` | 0.123456 | 12.3456 | `12.346%` | Arredondado (6>=5, 5+1=6) |
| `1.0-0` | 0.123456 | 12.3456 | `12%` | Todos decimais removidos |
| `1.4-4` | 0.123 | 12.3 | `12.3000%` | Zeros completam ate minFrac=4 |
| `1.2-2` | 0.1235 | 12.35 | `12.35%` | Ja atende, sem mudanca |
| `1.0-0` | 0.005 | 0.5 | `1%` | 5>=5, arredonda inteiro para 1 |

## Heuristics

| Situacao | Faca |
|----------|------|
| Backend envia valor ja em porcentagem (ex: 50) | Divida por 100 antes de passar ao pipe |
| Precisa de casas decimais fixas | Use minFrac igual a maxFrac (ex: `1.2-2`) |
| Nao quer decimais | Use `1.0-0` |
| Valor pode ter muitos decimais | Defina maxFrac para controlar arredondamento |
| Precisa de locale pt-BR | Configure locale (proximo passo) ou passe como parametro |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `{{ 50 \| percent }}` (valor ja em %) | `{{ 0.5 \| percent }}` (fracao) |
| Multiplicar por 100 antes do pipe | Passe a fracao direta, o pipe multiplica |
| Ignorar DigitsInfo e reclamar de zeros | Configure `minFrac-maxFrac` explicitamente |
| Assumir que 100 = 100% | Lembre: `100 * 100 = 10000%` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
