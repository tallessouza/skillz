# Code Examples: Continue em Estruturas de Repetição

## Exemplo base do instrutor

```javascript
// Loop simples de 0 a 9, pulando o 5
for (let i = 0; i < 10; i++) {
  if (i === 5) continue
  console.log(i)
}
// Output: 0, 1, 2, 3, 4, 6, 7, 8, 9
```

**Passo a passo:**
- i=0: 0 !== 5, imprime 0
- i=1: 1 !== 5, imprime 1
- i=2: 2 !== 5, imprime 2
- i=3: 3 !== 5, imprime 3
- i=4: 4 !== 5, imprime 4
- i=5: 5 === 5, `continue` → pula console.log, vai pra i=6
- i=6: 6 !== 5, imprime 6
- ... continua até i=9

## Variações práticas

### Pular múltiplos valores

```javascript
for (let i = 0; i < 20; i++) {
  if (i % 2 === 0) continue  // pula todos os pares
  console.log(i)
}
// Output: 1, 3, 5, 7, 9, 11, 13, 15, 17, 19
```

### Pular itens inválidos num array

```javascript
const inputs = ['João', '', 'Maria', null, 'Pedro', undefined, 'Ana']

for (const input of inputs) {
  if (!input) continue  // pula '', null, undefined

  console.log(`Processando: ${input}`)
}
// Processando: João
// Processando: Maria
// Processando: Pedro
// Processando: Ana
```

### Guard clauses em processamento de dados

```javascript
const products = [
  { name: 'Notebook', price: 3500, stock: 10 },
  { name: 'Mouse', price: 80, stock: 0 },
  { name: 'Teclado', price: 250, stock: 5 },
  { name: 'Monitor', price: 1200, stock: 0 },
]

for (const product of products) {
  if (product.stock === 0) continue       // sem estoque, pula
  if (product.price < 100) continue       // muito barato, pula

  console.log(`Destaque: ${product.name} - R$${product.price}`)
}
// Destaque: Notebook - R$3500
// Destaque: Teclado - R$250
```

### Continue em while

```javascript
let attempts = 0
const maxAttempts = 10

while (attempts < maxAttempts) {
  attempts++  // IMPORTANTE: incrementar ANTES do continue

  const result = Math.random()
  if (result < 0.7) continue  // pula tentativas com resultado baixo

  console.log(`Tentativa ${attempts}: resultado ${result.toFixed(2)} (aceito)`)
}
```

### Continue vs código equivalente sem continue

```javascript
// COM continue (mais limpo)
for (const file of files) {
  if (file.size === 0) continue
  if (file.extension === '.tmp') continue
  if (!file.permissions.read) continue

  processFile(file)
  logAccess(file)
  updateIndex(file)
}

// SEM continue (pirâmide de ifs)
for (const file of files) {
  if (file.size !== 0) {
    if (file.extension !== '.tmp') {
      if (file.permissions.read) {
        processFile(file)
        logAccess(file)
        updateIndex(file)
      }
    }
  }
}
```

### Combinando continue e break no mesmo loop

```javascript
const transactions = [
  { id: 1, amount: 100, status: 'completed' },
  { id: 2, amount: -50, status: 'refund' },
  { id: 3, amount: 200, status: 'completed' },
  { id: 4, amount: 0, status: 'error' },
  { id: 5, amount: 500, status: 'completed' },
]

let total = 0
for (const transaction of transactions) {
  if (transaction.status === 'error') break      // erro crítico, para tudo
  if (transaction.status === 'refund') continue   // pula reembolsos

  total += transaction.amount
}
console.log(`Total: ${total}`) // 300 (100 + 200, parou no error antes do 500)
```