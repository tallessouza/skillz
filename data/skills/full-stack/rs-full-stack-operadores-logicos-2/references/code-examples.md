# Code Examples: Operadores Lógicos

## Exemplo 1: AND — Validação de login (da aula)

```javascript
// Variáveis representando se email e senha estão corretos
const email = true
const password = true

// AND: ambos precisam ser verdadeiros
console.log(email && password) // true — libera acesso
```

```javascript
// Se a senha estiver incorreta
const email = true
const password = false

console.log(email && password) // false — acesso negado
```

## Exemplo 2: OR — Verificação alternativa (da aula)

```javascript
const email = true
const password = false

// OR: basta um ser verdadeiro
console.log(email || password) // true
```

```javascript
// Ambos falsos
const email = false
const password = false

console.log(email || password) // false
```

## Exemplo 3: NOT — Inversão (da aula)

```javascript
const password = false

// NOT inverte o valor na expressão
console.log(!password) // true

// A variável NÃO foi alterada
console.log(password) // false
```

## Exemplo 4: Combinação com isAdmin (da aula)

```javascript
const email = true
const password = true
const isAdmin = false

console.log(email && password && isAdmin) // false (isAdmin é false)
```

## Variação: Login completo com feedback

```javascript
const isEmailCorrect = true
const isPasswordCorrect = false

// AND para login
const canLogin = isEmailCorrect && isPasswordCorrect
console.log(canLogin) // false

// NOT para mensagem de erro
if (!canLogin) {
  console.log("Email ou senha incorretos")
}
```

## Variação: Sistema de permissões

```javascript
const isAuthenticated = true
const isAdmin = false
const isModerator = true

// Precisa estar autenticado E (ser admin OU moderador)
const canModerate = isAuthenticated && (isAdmin || isModerator)
console.log(canModerate) // true
```

## Variação: Validação de formulário com múltiplos campos

```javascript
const isNameFilled = true
const isEmailFilled = true
const isPasswordFilled = false

// AND: todos os campos obrigatórios precisam estar preenchidos
const isFormValid = isNameFilled && isEmailFilled && isPasswordFilled
console.log(isFormValid) // false — falta a senha
```

## Variação: Early return com NOT

```javascript
function processOrder(isStockAvailable, isPaymentConfirmed) {
  // Guard clause usando NOT
  if (!isStockAvailable) {
    console.log("Produto sem estoque")
    return
  }

  if (!isPaymentConfirmed) {
    console.log("Pagamento não confirmado")
    return
  }

  console.log("Pedido processado com sucesso")
}

processOrder(true, false) // "Pagamento não confirmado"
```

## Tabela verdade completa — AND

```javascript
console.log(true  && true)  // true
console.log(true  && false) // false
console.log(false && true)  // false
console.log(false && false) // false
```

## Tabela verdade completa — OR

```javascript
console.log(true  || true)  // true
console.log(true  || false) // true
console.log(false || true)  // true
console.log(false || false) // false
```

## Tabela verdade completa — NOT

```javascript
console.log(!true)  // false
console.log(!false) // true
```