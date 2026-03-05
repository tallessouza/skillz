# Code Examples: If Else

## Exemplo 1: Verificacao de idade (da aula)

```javascript
// Variavel com idade
const age = 17

// Verifica se e menor de idade
if (age < 18) {
  console.log("Voce nao pode dirigir")
} else {
  console.log("Voce pode dirigir")
}
// Output: "Voce nao pode dirigir" (porque 17 < 18)
```

## Exemplo 2: Mudando o valor para testar o else

```javascript
const age = 23

if (age < 18) {
  console.log("Voce nao pode dirigir")
} else {
  console.log("Voce pode dirigir")
}
// Output: "Voce pode dirigir" (porque 23 NAO e < 18, cai no else)
```

## Exemplo 3: Outro valor que entra no if

```javascript
const age = 15

if (age < 18) {
  console.log("Voce nao pode dirigir")
} else {
  console.log("Voce pode dirigir")
}
// Output: "Voce nao pode dirigir" (porque 15 < 18)
```

## Variacao: Aplicando em outros contextos

### Verificacao de estoque

```javascript
const stock = 0

if (stock > 0) {
  console.log("Produto disponivel")
} else {
  console.log("Produto esgotado")
}
```

### Verificacao de autenticacao

```javascript
const isLoggedIn = false

if (isLoggedIn) {
  console.log("Bem-vindo de volta!")
} else {
  console.log("Faca login para continuar")
}
```

### Verificacao de permissao

```javascript
const userRole = "viewer"

if (userRole === "admin") {
  console.log("Acesso total concedido")
} else {
  console.log("Acesso restrito")
}
```