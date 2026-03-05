---
name: rs-full-stack-criando-valor-despesa
description: "Applies DOM element creation with innerHTML and currency formatting patterns when building expense or financial UI components in JavaScript. Use when user asks to 'create expense item', 'format currency value', 'build financial list', 'display money amount', or 'use innerHTML with template literals'. Enforces correct nested element creation via innerHTML, currency symbol separation, and string formatting with toUpperCase+replace. Make sure to use this skill whenever generating code that displays formatted monetary values in DOM elements. Not for backend payment processing, API design, or CSS styling."
---

# Criando Valor de Despesa com innerHTML e Formatação

> Ao criar elementos que exibem valores monetários, use innerHTML com template literals para construir estruturas HTML aninhadas e formate o valor separando o símbolo da moeda.

## Rules

1. **Use innerHTML para estruturas aninhadas** — quando um elemento contém sub-elementos com formatação diferente (ex: símbolo de moeda menor que o valor), innerHTML com template literal é mais prático que múltiplos createElement, porque reduz código e mantém a estrutura visual clara
2. **Separe o símbolo da moeda do valor** — coloque `R$` em um `<small>` separado e remova-o do valor formatado, porque o símbolo precisa de estilização diferente (tamanho menor, cor diferente)
3. **Use toUpperCase antes de replace** — ao remover texto de strings formatadas, normalize com `toUpperCase()` antes do `replace()`, porque garante que o match funcione independente de capitalização
4. **Respeite a tag HTML do CSS** — se o CSS estiliza `small` dentro de `.expense-amount`, crie `<small>` e não `<span>`, porque a estilização depende do seletor exato
5. **Adicione classes via classList.add** — use `element.classList.add("classe")` em vez de manipular `className`, porque é seguro para múltiplas classes

## How to write

### Elemento com valor monetário formatado

```javascript
// Cria o container do valor
const expenseAmount = document.createElement("span")
expenseAmount.classList.add("expense-amount")

// innerHTML com template literal para estrutura aninhada
// small para o símbolo R$ (estilização diferente) + valor sem símbolo
expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
  .toUpperCase()
  .replace("R$", "")}`
```

### Adicionando ao item pai

```javascript
// Append múltiplos filhos de uma vez
item.append(expenseIcon, expenseInfo, expenseAmount)
```

## Example

**Before (erro comum — tag errada):**
```javascript
// Usando span onde deveria ser small — CSS não aplica estilização
expenseAmount.innerHTML = `<span>R$</span>${value}`
```

**After (com esta skill aplicada):**
```javascript
// small corresponde ao seletor CSS .expense-amount small
expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
  .toUpperCase()
  .replace("R$", "")}`
```

## Heuristics

| Situação | Faça |
|----------|------|
| Elemento tem sub-elementos com estilos diferentes | Use innerHTML com template literal |
| Valor já vem formatado com símbolo de moeda | Remova o símbolo e exiba separadamente |
| Precisa fazer replace em string formatada | Normalize com toUpperCase() antes |
| CSS usa seletor por tag (small, strong, em) | Use exatamente a tag que o CSS espera |
| Múltiplos filhos para adicionar ao pai | Use `parent.append(a, b, c)` em vez de múltiplos appendChild |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `innerHTML = "<span>R$</span>"` (quando CSS espera small) | `innerHTML = "<small>R$</small>"` |
| `amount.replace("r$", "")` (sem normalizar case) | `amount.toUpperCase().replace("R$", "")` |
| Múltiplos `createElement` para estrutura simples aninhada | `innerHTML` com template literal |
| `element.className = "classe"` (sobrescreve existentes) | `element.classList.add("classe")` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre innerHTML vs createElement e formatação de moeda
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações