# Code Examples: Comprimento de Strings

## Exemplo 1: Comprimento basico de string

```javascript
let message = "Estou estudando os fundamentos do JavaScript"
console.log(message.length) // 46
```

## Exemplo 2: Espacos contam

```javascript
let message = "estou"
console.log(message.length) // 5

message = "estou "  // espaco adicionado
console.log(message.length) // 6
```

## Exemplo 3: Validacao de senha

```javascript
let password = "12345"

if (password.length < 6) {
  console.log("A senha deve ter ao menos 6 caracteres")
}
// Output: "A senha deve ter ao menos 6 caracteres"

password = "123456"
if (password.length < 6) {
  console.log("A senha deve ter ao menos 6 caracteres")
}
// Nenhum output — passou na validacao
```

## Exemplo 4: Length em numero (nao funciona)

```javascript
const value = 12345
console.log(value.length)  // undefined
console.log(typeof value)  // "number"
```

## Exemplo 5: Conversao com String()

```javascript
const value = 12345
console.log(String(value))         // "12345"
console.log(typeof String(value))  // "string"
console.log(String(value).length)  // 5
```

## Exemplo 6: Conversao com toString()

```javascript
const value = 12345
console.log(value.toString().length) // 5
```

## Variacoes adicionais

### Validacao de campo de texto com maximo

```javascript
const username = "rodrigo_silva"

if (username.length > 20) {
  console.log("Nome de usuario deve ter no maximo 20 caracteres")
}
```

### Verificar se string esta vazia

```javascript
const input = ""

if (input.length === 0) {
  console.log("Campo obrigatorio")
}
```

### Contar digitos de diferentes tipos de numero

```javascript
console.log(String(42).length)       // 2
console.log(String(1000).length)     // 4
console.log(String(3.14).length)     // 4 (ponto conta como caractere)
console.log(String(-10).length)      // 3 (sinal de menos conta)
```

### Validacao com range (minimo e maximo)

```javascript
const password = "abc"

if (password.length < 6 || password.length > 20) {
  console.log("A senha deve ter entre 6 e 20 caracteres")
}
```