# Code Examples: Arrow Function

## Exemplo 1: Arrow function basica (da aula)

```javascript
// Definicao
const showMessage1 = () => {
  console.log("Ola")
}

// Execucao
showMessage1() // Output: Ola
```

## Exemplo 2: Com um parametro (da aula)

```javascript
const showMessage2 = (username) => {
  console.log("Ola,", username)
}

showMessage2("Maria") // Output: Ola, Maria
```

## Exemplo 3: Com multiplos parametros e concatenacao (da aula)

```javascript
const showMessage2 = (username, email) => {
  console.log("Ola, " + username + ". Seu e-mail e " + email)
}

showMessage2("Maria", "maria@email.com")
// Output: Ola, Maria. Seu e-mail e maria@email.com
```

## Exemplo 4: Com template literals (da aula)

```javascript
const showMessage2 = (username, email) => {
  console.log(`Ola, ${username}. Seu e-mail e ${email}`)
}

showMessage2("Maria", "maria@email.com")
// Output: Ola, Maria. Seu e-mail e maria@email.com
```

## Variacoes adicionais

### Retorno implicito (uma expressao)

```javascript
const double = n => n * 2
console.log(double(5)) // 10
```

### Retorno implicito de objeto (precisa de parenteses)

```javascript
const createUser = (name, email) => ({ name, email })
console.log(createUser("Maria", "m@e.com"))
// { name: "Maria", email: "m@e.com" }
```

### Como callback em array methods

```javascript
const numbers = [1, 2, 3, 4, 5]

const doubled = numbers.map(n => n * 2)
// [2, 4, 6, 8, 10]

const evens = numbers.filter(n => n % 2 === 0)
// [2, 4]

const sum = numbers.reduce((acc, n) => acc + n, 0)
// 15
```

### Comparacao lado a lado: function expression vs arrow

```javascript
// Function expression
const greet = function(name) {
  return `Ola, ${name}`
}

// Arrow function (com bloco)
const greet = (name) => {
  return `Ola, ${name}`
}

// Arrow function (retorno implicito)
const greet = name => `Ola, ${name}`
```

### Arrow function em event listeners

```javascript
// Funciona bem quando nao precisa de `this`
document.querySelector("button").addEventListener("click", () => {
  console.log("Botao clicado!")
})
```

### Arrow function em Promises

```javascript
fetch("/api/users")
  .then(response => response.json())
  .then(users => console.log(users))
  .catch(error => console.error(error))
```