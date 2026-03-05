# Code Examples: Escopo de Função e Hoisting

## Exemplo 1: Hoisting básico (da aula)

```javascript
// Chamando ANTES da declaração
showMessage("Olá, Rodrigo")

function showMessage(message) {
  console.log(message)
}
// Output: "Olá, Rodrigo"
```

O engine internamente reorganiza como:
```javascript
// O que o engine "vê" após hoisting:
function showMessage(message) {
  console.log(message)
}

showMessage("Olá, Rodrigo")
```

## Exemplo 2: Chamada depois da declaração (da aula)

```javascript
function showMessage(message) {
  console.log(message)
}

showMessage("Olá, Rodrigo")
// Output: "Olá, Rodrigo"
// Funciona normalmente — ordem natural
```

## Exemplo 3: Função dentro de função com endLine (da aula)

```javascript
function showMessage(message) {
  console.log(message)
  endLine()

  function endLine() {
    console.log("----------")
  }
}

showMessage("Olá, Rodrigo")
// Output:
// "Olá, Rodrigo"
// "----------"
```

### Variação: endLine chamada antes da declaração dentro do escopo

```javascript
function showMessage(message) {
  endLine()           // Funciona — hoisting dentro do escopo
  console.log(message)
  endLine()

  function endLine() {
    console.log("----------")
  }
}

showMessage("Olá, Rodrigo")
// Output:
// "----------"
// "Olá, Rodrigo"
// "----------"
```

## Exemplo 4: Erro de escopo (da aula)

```javascript
function showMessage(message) {
  console.log(message)

  function endLine() {
    console.log("----------")
  }
}

endLine() // ReferenceError: endLine is not defined
```

## Exemplo 5: Variações práticas

### Múltiplos níveis de aninhamento

```javascript
function outer() {
  function middle() {
    function inner() {
      console.log("inner")
    }
    inner() // OK
  }
  middle() // OK
  // inner() // ReferenceError — inner só existe dentro de middle
}

outer() // OK
// middle() // ReferenceError — middle só existe dentro de outer
```

### Função auxiliar reutilizada internamente

```javascript
function processUsers(users) {
  const active = users.filter(isActive)
  const formatted = active.map(formatName)
  return formatted

  function isActive(user) {
    return user.status === "active"
  }

  function formatName(user) {
    return `${user.firstName} ${user.lastName}`
  }
}

// isActive e formatName não poluem o escopo global
// processUsers é a única interface pública
```

### Function expression vs declaration (comparação)

```javascript
// Declaration — hoisted
greet("Ana") // "Olá, Ana"

function greet(name) {
  console.log(`Olá, ${name}`)
}

// Expression — NÃO hoisted
farewell("Ana") // TypeError: farewell is not a function

var farewell = function(name) {
  console.log(`Tchau, ${name}`)
}
```

### Padrão top-down com hoisting

```javascript
// Fluxo principal primeiro (legível)
function main() {
  const data = fetchData()
  const processed = processData(data)
  displayResult(processed)

  // Implementações depois
  function fetchData() {
    return [1, 2, 3]
  }

  function processData(items) {
    return items.map(x => x * 2)
  }

  function displayResult(result) {
    console.log("Result:", result)
  }
}
```