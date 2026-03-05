# Code Examples: Operadores de Comparação Estrita

## Exemplos da aula

### Comparação estrita de igualdade (`===`)

```javascript
// Setup do instrutor
let variavel1 = 1
let variavel2 = 1

// Comparando número com número — mesmo tipo, mesmo valor
console.log(variavel1 === variavel2) // true

// Comparando número com string — tipo diferente
variavel2 = "1"
console.log(variavel1 === variavel2) // false
// Motivo: variavel1 é number, variavel2 é string
// O valor é o mesmo ("1"), mas o tipo não — suficiente para ser false
```

### Comparação estrita de diferença (`!==`)

```javascript
let variavel1 = 1
let variavel2 = 2

// 1 é diferente de 2? Sim
console.log(variavel1 !== variavel2) // true

// 1 é diferente de 1? Não
variavel2 = 1
console.log(variavel1 !== variavel2) // false

// 2 é diferente de 2? Não
variavel1 = 2
variavel2 = 2
console.log(variavel1 !== variavel2) // false

// 2 (número) é diferente de "2" (string)? Sim — tipos diferentes
variavel2 = "2"
console.log(variavel1 !== variavel2) // true
```

## Exemplos expandidos

### Problema clássico: input de formulário

```javascript
// Valor vem do DOM como string
const inputValue = document.getElementById("quantity").value // "5"

// Com == (perigoso)
if (inputValue == 5) {
  console.log("Quantidade válida!") // Entra aqui
  const total = inputValue + 10     // "510" — concatenou!
}

// Com === (seguro)
if (inputValue === 5) {
  // Não entra — tipos diferentes, te força a converter
}

// Correto: converter explicitamente
const quantity = Number(inputValue)
if (quantity === 5) {
  const total = quantity + 10 // 15 ✓
}
```

### Verificação de tipo em funções

```javascript
function calculateDiscount(price, discountPercent) {
  // Guard clause: verificar tipos antes de operar
  if (typeof price !== "number" || typeof discountPercent !== "number") {
    throw new Error("Ambos argumentos devem ser números")
  }

  return price - (price * discountPercent / 100)
}

calculateDiscount(100, 10)    // 90 ✓
calculateDiscount("100", 10)  // Error — detectado pela verificação estrita
```

### Comparação com null e undefined

```javascript
let user = null

// Estritamente igual
console.log(user === null)      // true
console.log(user === undefined) // false (null !== undefined com ===)

// Verificação completa
if (user === null || user === undefined) {
  console.log("Usuário não definido")
}

// Alternativa moderna (TypeScript/JS moderno)
const userName = user?.name ?? "Anônimo"
```

### Switch statement (usa === internamente)

```javascript
const status = "1" // string, não número

switch (status) {
  case 1:    // não entra — switch usa ===, "1" !== 1
    console.log("Ativo")
    break
  case "1":  // entra — mesmo tipo e valor
    console.log("Ativo (string)")
    break
}
```

### Comparações em arrays

```javascript
const permissions = ["admin", "editor", "viewer"]

// Verificar se usuário tem permissão específica
const userRole = "admin"
const hasAccess = permissions.includes(userRole) // includes usa ===

// Cuidado com tipos misturados
const ids = [1, 2, 3]
const inputId = "2" // string do input
console.log(ids.includes(inputId))         // false — === compara tipo
console.log(ids.includes(Number(inputId))) // true  — convertido para number
```