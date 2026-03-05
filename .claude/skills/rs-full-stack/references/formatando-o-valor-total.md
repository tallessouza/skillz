---
name: rs-full-stack-formatando-o-valor-total
description: "Enforces BRL currency formatting patterns when writing JavaScript DOM manipulation code. Use when user asks to 'format currency', 'display money', 'show total value', 'format BRL', or any task involving monetary values in Brazilian Real. Applies rules: separate currency symbol into its own DOM element, reuse formatter functions, handle decimal comma correctly in replace operations. Make sure to use this skill whenever generating code that displays formatted prices or totals in Brazilian currency. Not for backend currency calculations, internationalization setup, or non-BRL currencies."
---

# Formatando Valores Monetários (BRL)

> Separe o símbolo da moeda em elemento DOM próprio e reutilize funções de formatação existentes.

## Rules

1. **Crie o símbolo da moeda como elemento separado** — use `<small>` para o "R$", porque o símbolo tem estilo CSS customizado e precisa ser controlado independentemente do valor
2. **Reutilize funções de formatação existentes** — se já existe `formatCurrencyBRL()`, use-a em vez de formatar manualmente, porque métodos separados permitem reaproveitamento em múltiplos contextos
3. **Remova o símbolo da string formatada com replace** — após formatar, use `.replace("R$", "")` para extrair só o valor numérico, porque o símbolo será exibido pelo elemento `<small>`
4. **Preserve a vírgula decimal no replace** — ao limpar strings monetárias, inclua a vírgula no padrão mantido, porque sem ela `45,60` vira `4560` (bug silencioso e crítico)
5. **Limpe o container antes de reinserir** — use `innerHTML = ""` antes de `append()`, porque conteúdo anterior precisa ser removido ao atualizar totais
6. **Use `append()` para múltiplos nós** — `element.append(symbolElement, formattedValue)` adiciona símbolo e valor em sequência

## How to write

### Elemento de símbolo monetário
```javascript
const symbolBRL = document.createElement("small")
symbolBRL.textContent = "R$"
```

### Formatação com remoção do símbolo
```javascript
const formattedTotal = formatCurrencyBRL(total)
  .toUpperCase()
  .replace("R$", "")
```

### Atualização do DOM
```javascript
expensesTotal.innerHTML = ""
expensesTotal.append(symbolBRL, formattedTotal)
```

## Example

**Before (bug — vírgula perdida):**
```javascript
// Replace sem preservar vírgula: 45,60 → 4560
const cleaned = formatted.replace(/[^0-9]/g, "")
```

**After (correto):**
```javascript
// Replace preservando vírgula: 45,60 → 45,60
const cleaned = formatted.toUpperCase().replace("R$", "")
```

## Heuristics

| Situação | Faça |
|----------|------|
| Símbolo monetário com estilo diferente do valor | Crie elemento DOM separado (`<small>`) |
| Função de formatação já existe no projeto | Reutilize, não duplique |
| Replace em string monetária | Teste com valores decimais (ex: 45,60) para garantir que vírgula persiste |
| Atualizando total no DOM | Limpe com `innerHTML = ""` antes de `append()` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `element.textContent = "R$ " + value` | `element.append(symbolEl, formattedValue)` |
| `value.replace(/[^0-9]/g, "")` | `value.replace("R$", "")` (preserva vírgula) |
| Formatar manualmente com template literal | Reutilizar `formatCurrencyBRL()` existente |
| `element.textContent = newValue` (sem limpar) | `element.innerHTML = ""; element.append(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação de símbolo, bug da vírgula e padrões de reuso
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-formatando-o-valor-total/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-formatando-o-valor-total/references/code-examples.md)
