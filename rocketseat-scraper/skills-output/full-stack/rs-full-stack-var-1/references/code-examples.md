# Code Examples: Declaracao de Variaveis com var

## Exemplo 1: Declaracao sem valor

Direto da aula:
```javascript
// Declara uma variavel sem valor
var user;
console.log(user); // undefined
```

**O que acontece:** A variavel `user` e criada na memoria, mas como nenhum valor foi atribuido, o JavaScript retorna `undefined`.

## Exemplo 2: Declaracao com valor

Direto da aula:
```javascript
// Declara uma variavel com valor
var email = "rodrigo@email.com";
console.log(email); // "rodrigo@email.com"
```

**O que acontece:** A variavel `email` e criada e imediatamente recebe o valor string `"rodrigo@email.com"`.

## Exemplo 3: Substituicao de valor

Direto da aula:
```javascript
var email = "rodrigo@email.com";
console.log(email); // "rodrigo@email.com"

// Substitui o valor da variavel
email = "joao@email.com";
console.log(email); // "joao@email.com"
```

**O que acontece:** O primeiro `console.log` mostra o valor original. Depois a reatribuicao troca o valor. O segundo `console.log` mostra o novo valor.

## Variacoes praticas

### Declarar e atribuir depois
```javascript
var nome;
nome = "Maria";
console.log(nome); // "Maria"
```

### Multiplas variaveis
```javascript
var nome = "Carlos";
var idade = 25;
var cidade = "Sao Paulo";

console.log(nome);   // "Carlos"
console.log(idade);  // 25
console.log(cidade);  // "Sao Paulo"
```

### Substituicao multipla
```javascript
var status = "ativo";
console.log(status); // "ativo"

status = "inativo";
console.log(status); // "inativo"

status = "bloqueado";
console.log(status); // "bloqueado"
```

### Diferentes tipos de valor
```javascript
var texto = "Hello";
var numero = 42;
var decimal = 3.14;
var booleano = true;

console.log(texto);    // "Hello"
console.log(numero);   // 42
console.log(decimal);  // 3.14
console.log(booleano); // true
```