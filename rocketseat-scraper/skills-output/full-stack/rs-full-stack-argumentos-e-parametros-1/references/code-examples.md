# Code Examples: Argumentos e Parâmetros

## Exemplo 1: Função com um parâmetro (message)

```javascript
// Parâmetro: username
// A função exibe uma saudação personalizada
function message(username) {
  console.log(`Olá, ${username}`)
}

// Argumentos passados:
message("Rodrigo") // Olá, Rodrigo
message("Ana")     // Olá, Ana
```

### Variação: tentando usar o parâmetro fora da função

```javascript
function message(username) {
  console.log(`Olá, ${username}`)
}

console.log(username) // ReferenceError: username is not defined
```

### Variação: variável externa com mesmo nome

```javascript
let username = "João"

function message(username) {
  console.log(`Olá, ${username}`)
}

message("Rodrigo") // Olá, Rodrigo (usa o parâmetro, não a variável externa)
message("Ana")     // Olá, Ana
```

### Variação: sem parâmetro, usa escopo externo

```javascript
let username = "João"

function message() {
  console.log(`Olá, ${username}`)
}

message() // Olá, João (busca no escopo externo)
```

## Exemplo 2: Função de soma com dois parâmetros

```javascript
function sum(a, b) {
  console.log(a + b)
}

sum(10, 20) // 30
sum(7, 3)   // 10
```

### Variação: retornando em vez de logando

```javascript
function sum(a, b) {
  return a + b
}

const result = sum(10, 20)
console.log(result) // 30
```

## Exemplo 3: Ordem dos parâmetros importa (joinText)

```javascript
function joinText(text1, text2, text3) {
  console.log(`${text1} ${text2} ${text3}`)
}

joinText("Rodrigo", "Gonçalves", "Santana")
// Rodrigo Gonçalves Santana

joinText("Gonçalves", "Rodrigo", "Santana")
// Gonçalves Rodrigo Santana ← ordem invertida!
```

## Exemplo 4: Valores padrão (default parameters)

### Sem valores padrão (problema)

```javascript
function joinText(text1, text2, text3) {
  console.log(`${text1} ${text2} ${text3}`)
}

joinText("Rodrigo")
// Rodrigo undefined undefined
```

### Com valores padrão (solução)

```javascript
function joinText(text1, text2 = '', text3 = '') {
  console.log(`${text1} ${text2} ${text3}`)
}

joinText("Rodrigo")
// Rodrigo   (sem undefined)

joinText("Rodrigo", "Gonçalves")
// Rodrigo Gonçalves

joinText("Rodrigo", "Gonçalves", "Santana")
// Rodrigo Gonçalves Santana
```

### Com valor padrão customizado

```javascript
function joinText(text1, text2 = '', text3 = 'x') {
  console.log(`${text1} ${text2} ${text3}`)
}

joinText("Rodrigo")
// Rodrigo  x

joinText("Rodrigo", "Gonçalves", "Santana")
// Rodrigo Gonçalves Santana (default ignorado quando argumento é passado)
```

## Exemplo 5: Aplicações práticas expandidas

### Função de saudação com horário padrão

```javascript
function greet(name, period = 'dia') {
  console.log(`Bom ${period}, ${name}!`)
}

greet("Rodrigo")           // Bom dia, Rodrigo!
greet("Ana", "noite")      // Bom noite, Ana!
```

### Função de cálculo com taxa padrão

```javascript
function calculatePrice(basePrice, taxRate = 0.1) {
  return basePrice + (basePrice * taxRate)
}

calculatePrice(100)       // 110 (taxa padrão 10%)
calculatePrice(100, 0.2)  // 120 (taxa customizada 20%)
```

### Função com muitos parâmetros (preview de objetos)

```javascript
// Posicional — ordem importa, fácil errar
function createUser(name, email, age, city) {
  return { name, email, age, city }
}

// Com objeto — ordem não importa (abordado em aulas futuras)
function createUser({ name, email, age, city = 'São Paulo' }) {
  return { name, email, age, city }
}

createUser({ email: "r@email.com", name: "Rodrigo", age: 30 })
// { name: "Rodrigo", email: "r@email.com", age: 30, city: "São Paulo" }
```