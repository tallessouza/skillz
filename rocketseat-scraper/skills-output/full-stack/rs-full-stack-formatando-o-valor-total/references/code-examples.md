# Code Examples: Formatando o Valor Total

## Exemplo completo da aula

### Criando o elemento do símbolo
```javascript
// Cria o <small> para exibir "R$" com estilo customizado via CSS
const symbolBRL = document.createElement("small")
symbolBRL.textContent = "R$"
```

### Formatando o valor e removendo o símbolo
```javascript
// Formata o valor e remove o R$ que será exibido pela <small> com estilo customizado
const total = formatCurrencyBRL(total)
  .toUpperCase()
  .replace("R$", "")
```

### Atualizando o DOM
```javascript
// Limpa o conteúdo do elemento (incluindo HTML interno)
expensesTotal.innerHTML = ""

// Adiciona o símbolo da moeda e o valor total formatado
expensesTotal.append(symbolBRL, total)
```

## Demonstração do bug da vírgula

### Código com bug
```javascript
// BUG: remove tudo que não é número, incluindo a vírgula
const value = "R$ 45,60"
const cleaned = value.replace(/[^0-9]/g, "")
console.log(cleaned) // "4560" — ERRADO!
```

### Código corrigido
```javascript
// CORRETO: remove apenas o símbolo "R$"
const value = "R$ 45,60"
const cleaned = value.toUpperCase().replace("R$", "").trim()
console.log(cleaned) // "45,60" — correto
```

## Variações úteis

### Com Intl.NumberFormat (alternativa ao formatCurrencyBRL)
```javascript
function formatCurrencyBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

// Uso com separação de símbolo
const formatted = formatCurrencyBRL(4560) // "R$ 4.560,00"
const valueOnly = formatted.toUpperCase().replace("R$", "").trim() // "4.560,00"
```

### Usando formatToParts para evitar replace
```javascript
// Alternativa mais robusta: Intl.NumberFormat.formatToParts
function formatCurrencyParts(value) {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  const parts = formatter.formatToParts(value)
  const symbol = parts.find(p => p.type === "currency")?.value // "R$"
  const numericValue = parts
    .filter(p => p.type !== "currency" && p.type !== "literal")
    .map(p => p.value)
    .join("") // "4.560,00"

  return { symbol, value: numericValue }
}
```

### Função completa de atualização do total
```javascript
function updateExpensesTotal(total) {
  // Cria elemento para o símbolo
  const symbolBRL = document.createElement("small")
  symbolBRL.textContent = "R$"

  // Formata valor sem o símbolo
  const formattedTotal = formatCurrencyBRL(total)
    .toUpperCase()
    .replace("R$", "")

  // Atualiza o DOM
  const expensesTotal = document.querySelector("#expenses-total")
  expensesTotal.innerHTML = ""
  expensesTotal.append(symbolBRL, formattedTotal)
}
```

### Testando valores edge case
```javascript
// Sempre teste estes cenários:
updateExpensesTotal(0)        // R$ 0,00
updateExpensesTotal(45.60)    // R$ 45,60  (não 4560!)
updateExpensesTotal(1000)     // R$ 1.000,00
updateExpensesTotal(0.01)     // R$ 0,01
updateExpensesTotal(99999.99) // R$ 99.999,99
```