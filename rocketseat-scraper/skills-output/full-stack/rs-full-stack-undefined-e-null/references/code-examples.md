# Code Examples: Undefined e Null

## Exemplo 1: Variável sem valor (da aula)

```javascript
let emptiness
console.log("O valor é:", emptiness)
// Output: "O valor é: undefined"
```

A variável `emptiness` foi declarada mas não recebeu nenhum valor. O JavaScript automaticamente atribui `undefined`.

## Exemplo 2: Variável com valor atribuído (da aula)

```javascript
let emptiness = "Rodrigo"
console.log("O valor é:", emptiness)
// Output: "O valor é: Rodrigo"
```

Agora a variável tem conteúdo, o `undefined` foi substituído.

## Exemplo 3: Null intencional (da aula)

```javascript
let empathy = null
console.log("O valor é:", empathy)
// Output: "O valor é: null"
```

O programador atribuiu `null` intencionalmente para dizer "esta variável está vazia de propósito."

## Variação: Ciclo de vida de uma variável

```javascript
let currentUser           // undefined — acabou de ser criada
console.log(currentUser)  // undefined

currentUser = null        // null — sabemos que não há usuário logado
console.log(currentUser)  // null

currentUser = { name: "Rodrigo", email: "rodrigo@email.com" }
console.log(currentUser)  // { name: "Rodrigo", email: "rodrigo@email.com" }

currentUser = null        // null — usuário fez logout
console.log(currentUser)  // null
```

## Variação: Parâmetros de função

```javascript
function greet(name) {
  console.log("Olá,", name)
}

greet("Rodrigo") // "Olá, Rodrigo"
greet()           // "Olá, undefined" — parâmetro não passado
```

## Variação: Propriedade inexistente de objeto

```javascript
const user = { name: "Rodrigo" }

console.log(user.name)  // "Rodrigo"
console.log(user.email) // undefined — propriedade não existe
```

## Variação: Retorno de função sem return

```javascript
function doSomething() {
  // não retorna nada
}

const result = doSomething()
console.log(result) // undefined
```

## Variação: Verificação prática

```javascript
let selectedProduct = null

// Verificar se algo foi selecionado
if (selectedProduct === null) {
  console.log("Nenhum produto selecionado")
}

// Verificar ambos (null ou undefined) com loose equality
let uninitializedVar

if (uninitializedVar == null) {
  console.log("É null OU undefined") // entra aqui
}

if (selectedProduct == null) {
  console.log("É null OU undefined") // entra aqui também
}
```

## Variação: JSON e null

```javascript
const jsonString = '{"name": "Rodrigo", "address": null}'
const parsed = JSON.parse(jsonString)

console.log(parsed.name)    // "Rodrigo"
console.log(parsed.address) // null — JSON suporta null

// undefined NÃO existe em JSON
const obj = { a: 1, b: undefined }
console.log(JSON.stringify(obj)) // '{"a":1}' — b foi removido!
```