# Code Examples: Case Sensitive em JavaScript

## Exemplo 1: Variaveis com case diferente sao distintas

```javascript
// Declarando duas variaveis — mesmo "nome" mas case diferente
var product = "teclado mecanico"
var Product = "mouse gamer"

// Cada uma tem seu proprio valor
console.log(product) // "teclado mecanico"
console.log(Product) // "mouse gamer"
```

**Explicacao:** O JavaScript trata `product` (tudo minusculo) e `Product` (P maiusculo) como duas variaveis completamente separadas na memoria.

## Exemplo 2: Variavel inexistente gera erro

```javascript
var product = "teclado mecanico"

console.log(price) // ReferenceError: price is not defined
```

**Explicacao:** `price` nunca foi declarada. O erro "is not defined" indica que o identificador nao existe no escopo atual.

## Exemplo 3: Sobrescrita com var

```javascript
var product = "teclado mecanico"
console.log(product) // "teclado mecanico"

var product = "fone sem fio"
console.log(product) // "fone sem fio" — sobrescreveu
```

**Explicacao:** Usar `var` com o mesmo nome (mesmo case) no mesmo escopo sobrescreve o valor anterior. O "teclado mecanico" foi perdido.

## Exemplo 4: Texto vs referencia a variavel

```javascript
var product = "teclado mecanico"

console.log(product)    // "teclado mecanico" — conteudo da variavel
console.log("product")  // "product" — texto literal
```

**Explicacao:** Sem aspas, JavaScript busca a variavel. Com aspas, e apenas uma string.

## Variacao: Tres cases do mesmo nome

```javascript
var product = "teclado"
var Product = "mouse"
var PRODUCT = "monitor"

console.log(product) // "teclado"
console.log(Product) // "mouse"
console.log(PRODUCT) // "monitor"
```

Tres variaveis independentes. Isso e valido mas confuso — evite na pratica.

## Variacao: Case errado como fonte de bug

```javascript
var userName = "Rodrigo"

// Tentativas que falham:
// console.log(username)  // ReferenceError
// console.log(UserName)  // ReferenceError
// console.log(USERNAME)  // ReferenceError

// So funciona com o case exato:
console.log(userName)    // "Rodrigo"
```

## Variacao: Funcoes tambem sao case sensitive

```javascript
function calcularPreco() {
  return 100
}

// calcularpreco()  // ReferenceError — case diferente
// CalcularPreco()  // ReferenceError — case diferente
calcularPreco()     // 100 — case exato
```

## Variacao: Comparando com let (prevencao de sobrescrita)

```javascript
let product = "teclado mecanico"
// let product = "fone sem fio"  // SyntaxError: Identifier 'product' has already been declared

// Com let, a re-declaracao e bloqueada — mais seguro que var
product = "fone sem fio"  // reatribuicao sem let funciona normalmente
console.log(product)      // "fone sem fio"
```