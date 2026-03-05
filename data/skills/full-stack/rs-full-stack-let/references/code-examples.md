# Code Examples: Declaracao de Variaveis com Let

## Exemplo 1: Declarar sem valor

```javascript
// Reserva espaco na memoria, sem conteudo
let user;
console.log(user); // undefined
```

## Exemplo 2: Atribuir valor depois

```javascript
let user;
user = "Rodrigo Gonçalves";
console.log(user); // "Rodrigo Gonçalves"
```

## Exemplo 3: Declarar com valor

```javascript
let email = "rodrigo@email.com";
console.log(email); // "rodrigo@email.com"
```

## Exemplo 4: Reatribuir valor

```javascript
let email = "rodrigo@email.com";
console.log(email); // "rodrigo@email.com"

email = "joao@email.com";
console.log(email); // "joao@email.com"
```

## Exemplo 5: Redeclaracao com let (ERRO)

```javascript
let user = "Rodrigo";
let user = "João";
// SyntaxError: Identifier 'user' has already been declared
```

## Exemplo 6: Comparacao var vs let

```javascript
// Com var — sobrescrita silenciosa
var user = "Rodrigo";
var user = "João";
console.log(user); // "João" (sem erro, perigoso)

// Com let — erro protetor
let name = "Rodrigo";
// let name = "João"; // SyntaxError
name = "João"; // correto
console.log(name); // "João"
```

## Variacoes praticas

### Multiplas variaveis independentes

```javascript
let firstName = "Rodrigo";
let lastName = "Gonçalves";
let email = "rodrigo@email.com";

console.log(firstName); // "Rodrigo"
console.log(lastName);  // "Gonçalves"
console.log(email);     // "rodrigo@email.com"
```

### Declarar varias sem valor e atribuir depois

```javascript
let city;
let country;

city = "São Paulo";
country = "Brasil";

console.log(city);    // "São Paulo"
console.log(country); // "Brasil"
```

### Reatribuicao multipla (valor muda ao longo do tempo)

```javascript
let status = "pendente";
console.log(status); // "pendente"

status = "processando";
console.log(status); // "processando"

status = "concluido";
console.log(status); // "concluido"
```