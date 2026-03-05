# Code Examples: Escopo de Variáveis em JavaScript

## Exemplo 1: Hoisting com var

```javascript
// Cenário: usar variável antes de declarar
console.log(user) // undefined
var user = "Rodrigo"
console.log(user) // "Rodrigo"
```

O que o JavaScript faz internamente:

```javascript
var user            // declaração içada para o topo
console.log(user)   // undefined (existe mas sem valor)
user = "Rodrigo"    // atribuição no local original
console.log(user)   // "Rodrigo"
```

## Exemplo 2: var vaza do escopo de bloco

```javascript
var email = "joao@email.com"

{
  // Escopo de bloco
  console.log(email) // "joao@email.com" — acessa escopo pai
}
```

Variável criada **dentro** de um bloco com var:

```javascript
{
  var age = 18
}
console.log(age) // 18 — var ignora o bloco, vaza para escopo global
```

Equivalente interno:

```javascript
var age        // hoisting: sobe para escopo global
{
  age = 18     // atribuição
}
console.log(age) // 18
```

## Exemplo 3: let respeita escopo de bloco

```javascript
{
  let age = 18
  console.log(age) // 18
}
console.log(age) // ReferenceError: age is not defined
```

## Exemplo 4: let impede uso antes da declaração (TDZ)

```javascript
console.log(address) // ReferenceError: Cannot access 'address' before initialization
let address = "rua X"
```

Diferente do var:

```javascript
console.log(address) // undefined (sem erro, mas bug silencioso)
var address = "rua X"
```

## Exemplo 5: Hierarquia de escopo — pai para filho

```javascript
let address = "rua X"

{
  console.log(address) // "rua X" — escopo filho acessa o pai
  address = "rua Y"    // modifica variável do escopo pai
}

console.log(address) // "rua Y" — modificação persiste
```

## Exemplo 6: Escopo filho NÃO é visível no pai

```javascript
{
  let secret = "hidden"
}
console.log(secret) // ReferenceError — escopo pai não vê o filho
```

## Exemplo 7: Múltiplos níveis de escopo

```javascript
let global = "visível em tudo"

{
  let level1 = "visível aqui e abaixo"
  
  {
    let level2 = "só visível aqui"
    console.log(global)  // ✓
    console.log(level1)  // ✓
    console.log(level2)  // ✓
  }
  
  console.log(global)  // ✓
  console.log(level1)  // ✓
  // console.log(level2) // ✗ ReferenceError
}

console.log(global)  // ✓
// console.log(level1) // ✗ ReferenceError
// console.log(level2) // ✗ ReferenceError
```

## Exemplo 8: Armadilha clássica com var em for loop

```javascript
// BUG com var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Output: 3, 3, 3 (var vaza, todos referenciam o mesmo i)

// CORRETO com let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Output: 0, 1, 2 (let cria escopo por iteração)
```

## Exemplo 9: Refatorando var para let/const

```javascript
// Antes (var)
var name = "Rodrigo"
var API_URL = "https://api.example.com"
var items = []

for (var i = 0; i < 10; i++) {
  items.push(i)
}
console.log(i) // 10 — vazou!

// Depois (let/const)
const name = "Rodrigo"          // nunca muda → const
const API_URL = "https://api.example.com"  // nunca muda → const
let items = []                  // será reatribuída? se não, const também

for (let i = 0; i < 10; i++) {
  items.push(i)
}
// console.log(i) — ReferenceError (contido no for)
```