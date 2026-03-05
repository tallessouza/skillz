# Code Examples: Calculando o Valor Total

## Exemplo 1: Codigo completo da aula

```javascript
// Selecao de elementos
const expensesTotal = document.querySelector("aside header h2")

// Dentro da funcao que percorre os itens:
let total = 0

for (let i = 0; i < items.length; i++) {
  const itemAmount = items[i].querySelector(".amount")

  // Limpeza: remove caracteres nao numericos (mantendo . e ,)
  let value = itemAmount.textContent
    .replace(/[^\d.,]/g, "")
    .replace(",", ".")

  // Conversao para float
  value = parseFloat(value)

  // Validacao
  if (isNaN(value)) {
    return alert("Nao foi possivel calcular o total. O valor nao parece ser um numero.")
  }

  // Acumulacao
  total += Number(value)
}

// Exibicao (sem formatacao nesta etapa)
expensesTotal.textContent = total
```

## Exemplo 2: Fluxo de transformacao do valor

```javascript
// Valor original no DOM: "R$ 45,60"

// Passo 1: replace regex
"R$ 45,60".replace(/[^\d.,]/g, "")
// Resultado: "45,60" (removeu "R$ ")

// Passo 2: replace virgula por ponto
"45,60".replace(",", ".")
// Resultado: "45.60"

// Passo 3: parseFloat
parseFloat("45.60")
// Resultado: 45.6 (numero)

// Passo 4: isNaN check
isNaN(45.6)
// Resultado: false (e um numero valido, segue em frente)

// Passo 5: Number() e acumulacao
total += Number(45.6)
// total = 0 + 45.6 = 45.6
```

## Exemplo 3: Variacao com valores problematicos

```javascript
// Valor com texto extra: "Alimentação R$ 1.550,00"
let value = "Alimentação R$ 1.550,00"
  .replace(/[^\d.,]/g, "")  // "1.550,00"
  .replace(",", ".")         // "1.550.00"

// ATENCAO: isso gera "1.550.00" que parseFloat interpreta como 1.55
// Para valores com milhar, seria necessario tratamento adicional
// (remover ponto de milhar antes de converter virgula)
```

## Exemplo 4: Guard com isNaN em acao

```javascript
// Cenario: campo amount vazio ou com texto invalido
let value = "".replace(/[^\d.,]/g, "").replace(",", ".")
// value = ""

value = parseFloat("")
// value = NaN

if (isNaN(value)) {
  return alert("Nao foi possivel calcular o total.")
  // Funcao para aqui, nao adiciona NaN ao total
}
```

## Exemplo 5: Operador += vs forma expandida

```javascript
// Forma expandida (funciona, mas verbosa)
total = total + Number(value)

// Forma curta com += (preferida)
total += Number(value)

// Ambas produzem o mesmo resultado
// += e mais idiomatico em JavaScript
```

## Exemplo 6: Erro comum — acumulador dentro do loop

```javascript
// ERRADO: total reseta a cada iteracao
for (let i = 0; i < items.length; i++) {
  let total = 0  // BUG: declarado dentro do loop
  total += Number(value)
}
// total nao existe aqui fora (escopo do for)

// CORRETO: total declarado fora do loop
let total = 0
for (let i = 0; i < items.length; i++) {
  total += Number(value)
}
// total = soma de todos os valores
```