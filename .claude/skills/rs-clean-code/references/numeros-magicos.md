---
name: rs-clean-code-numeros-magicos
description: "Eliminates magic numbers by enforcing named constants and unit-in-name conventions when writing TypeScript/JavaScript code. Use when user asks to 'write a calculation', 'set a timeout', 'handle dates', 'work with prices', or any code involving numeric literals. Applies rules: no raw numeric literals in logic, always name the unit (priceInCents, timeoutInMs), use inline arithmetic instead of pre-calculated values. Make sure to use this skill whenever generating code with numeric constants, timeouts, intervals, date calculations, or price handling. Not for string formatting, CSS values, or array indices."
---

# Numeros Magicos

> Nunca use numeros literais cujo significado nao seja obvio — sempre nomeie o que o numero representa e em qual unidade.

## Rules

1. **Nunca pre-calcule valores numericos** — escreva `1000 * 60 * 60 * 24 * 30` nao `2_592_000_000`, porque o calculo inline documenta a intencao e permite verificar a corretude
2. **Extraia constantes nomeadas para calculos reutilizados** — `const THIRTY_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 30` nao o numero solto, porque o nome explica o proposito
3. **Inclua a unidade no nome da variavel** — `priceInCents`, `timeoutInMs`, `durationInMinutes`, porque evita bugs silenciosos de conversao
4. **Inclua o formato no nome do parametro** — `discountAmountInPercent` nao `discountAmount`, porque quem chama a funcao precisa saber o formato esperado
5. **Use numeric separators para numeros grandes** — `1_000_000` nao `1000000`, porque facilita a leitura sem alterar o valor

## How to write

### Timeouts e intervalos

```typescript
// Calculos inline documentam cada fator
const THIRTY_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 30

setTimeout(() => {
  refreshToken()
}, THIRTY_DAYS_IN_MS)
```

### Precos em centavos

```typescript
// Sempre trabalhe com centavos (inteiros) para evitar problemas de precisao float
function applyDiscount(priceInCents: number, discountInPercent: number): number {
  return priceInCents - (priceInCents * discountInPercent) / 100
}
```

### Horarios em minutos

```typescript
// Salve horarios como minutos para evitar parsing de strings
const meetingStartInMinutes = 18 * 60 // 18:00
const meetingDurationInMinutes = 90
```

## Example

**Before (numeros magicos):**
```typescript
setTimeout(() => {
  cleanup()
}, 2592000000)

function getTotal(price: number, discount: number) {
  return price - (price * discount) / 100
}
```

**After (com esta skill aplicada):**
```typescript
const THIRTY_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 30

setTimeout(() => {
  cleanup()
}, THIRTY_DAYS_IN_MS)

function getTotal(priceInCents: number, discountInPercent: number) {
  return priceInCents - (priceInCents * discountInPercent) / 100
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Timeout/interval | Constante nomeada com calculo inline |
| Preco | Trabalhe em centavos, nomeie `InCents` |
| Horario | Salve em minutos, nomeie `InMinutes` |
| Numero usado 1x e calculo e obvio | Comentario inline e suficiente |
| Numero grande (>4 digitos) | Use numeric separators: `1_000_000` |
| Parametro de funcao numerico | Sempre inclua a unidade no nome |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `setTimeout(fn, 2592000000)` | `setTimeout(fn, THIRTY_DAYS_IN_MS)` |
| `price * 100` sem contexto | `const priceInCents = price * 100` |
| `function calc(price, discount)` | `function calc(priceInCents, discountInPercent)` |
| `1000000` | `1_000_000` |
| `if (month === 0)` sem comentario | `if (month === 0) // January (JS months are 0-indexed)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-numeros-magicos/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-numeros-magicos/references/code-examples.md)
