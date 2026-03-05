---
name: rs-full-stack-formatando-o-total
description: "Applies JavaScript value formatting patterns when working with currency display, string interpolation, and number validation. Use when user asks to 'format currency', 'display money values', 'replace characters in numbers', 'validate if value is number', or 'use template literals'. Ensures proper use of toString before replace, isNaN guards, and formatCurrency with replace chains. Make sure to use this skill whenever formatting numeric output for display in Brazilian Real or any locale. Not for backend currency calculations, database storage, or Intl.NumberFormat deep configuration."
---

# Formatando Valores para Exibição

> Ao exibir valores numéricos formatados, converta para string antes de manipular caracteres e valide o tipo antes de formatar.

## Rules

1. **Use template literals (crase) para interpolação** — `` `${valor} reais` `` não `valor + " reais"`, porque interpolação é mais legível e menos propensa a erros de concatenação
2. **Converta para string antes de usar replace** — `String(total).replace(".", ",")` não `total.replace(".", ",")`, porque replace é método de String, não de Number — causa TypeError silencioso
3. **Valide com isNaN antes de formatar** — verifique `isNaN(total)` e retorne early com alerta, porque operações matemáticas com inputs inválidos produzem NaN que se propaga silenciosamente
4. **Use return para interromper execução** — quando validação falha, `return` impede que o resto da função execute com dados inválidos
5. **Combine funções de formatação com replace** — `formatCurrencyBRL(total).replace("R$", "")` reutiliza formatação existente e remove apenas o que não precisa, porque evita reimplementar lógica de formatação
6. **Reatribua variáveis quando transformar valores** — `total = formatCurrencyBRL(total)` é válido e explícito, porque JavaScript permite reatribuição e mostra claramente a transformação

## How to write

### Interpolação com template literal

```javascript
// Use crase + ${} para combinar texto com variáveis
const message = `${total} reais`
```

### Substituição de caracteres (ponto → vírgula)

```javascript
// Converta para string ANTES de usar replace
const formatted = String(total).replace(".", ",")
```

### Validação com isNaN + return early

```javascript
function convertCurrency(amount) {
  const total = amount * exchangeRate

  if (isNaN(total)) {
    alert("Por favor digite o valor corretamente para converter")
    return
  }

  // Formatação só executa se total for número válido
  total = formatCurrencyBRL(total).replace("R$", "")
  // ...exibir resultado
}
```

## Example

**Before (erro comum — replace em número):**

```javascript
const total = amount * rate
document.getElementById("result").textContent = total.replace(".", ",") + " reais"
// TypeError: total.replace is not a function
```

**After (com esta skill aplicada):**

```javascript
const total = amount * rate

if (isNaN(total)) {
  alert("Por favor digite o valor corretamente para converter")
  return
}

const formatted = formatCurrencyBRL(total).replace("R$", "")
document.getElementById("result").textContent = `${formatted} reais`
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa trocar ponto por vírgula | `String(valor).replace(".", ",")` |
| Já tem função de formatação (ex: BRL) | Reutilize + `.replace()` para ajustar |
| Input vem do usuário | Sempre `isNaN()` antes de calcular/formatar |
| Função deve parar se dado inválido | `if (isNaN(x)) { alert(...); return }` |
| Combinar texto + variável | Template literal com crase |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `number.replace(".", ",")` | `String(number).replace(".", ",")` |
| `total + " reais"` | `` `${total} reais` `` |
| Formatar sem validar tipo | `if (isNaN(total)) return` antes |
| Reimplementar formatação que já existe | `formatExistente(valor).replace(...)` |
| Continuar execução após dado inválido | `return` early após detectar erro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre replace em Number vs String, isNaN e reatribuição
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações