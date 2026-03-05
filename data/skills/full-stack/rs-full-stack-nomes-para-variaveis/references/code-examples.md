# Code Examples: Nomes para Variáveis JavaScript

## 1. Case-sensitivity demonstrada

```javascript
// Estas são variáveis DIFERENTES
let username = "rodrigo"
let userName = "ana"

console.log(username)  // "rodrigo"
console.log(userName)  // "ana"
```

## 2. Caracteres especiais — início com underline

```javascript
let email = "rodrigo@email.com"
let _email = "diferente@email.com"

console.log(email)   // "rodrigo@email.com"
console.log(_email)  // "diferente@email.com"
```

## 3. Número no início — ERRO

```javascript
// ERRO DE SINTAXE — não pode começar com número
let 1user = "Ana"  // SyntaxError: Invalid or unexpected token

// Correto:
let user1 = "Ana"
let firstUser = "Ana"
```

## 4. Acentos — funciona mas não use

```javascript
// Tecnicamente válido
let ação = "cadastro"
console.log(ação)  // "cadastro"

// Recomendado
let action = "register"
console.log(action)  // "register"
```

## 5. Underline no meio — válido

```javascript
let user_email = "rodrigo@email.com"
console.log(user_email)  // "rodrigo@email.com"
```

## 6. Espaço no meio — ERRO

```javascript
// ERRO — JS interpreta como duas coisas separadas
let product name = "teclado"  // SyntaxError

// Correto com camelCase:
let productName = "teclado"

// Correto com snake_case:
let product_name = "teclado"
```

## 7. camelCase — exemplos completos

```javascript
let productName = "Teclado"
let firstName = "Rodrigo"
let lastName = "Gonçalves"
let userEmail = "rodrigo@email.com"
let isLoggedIn = true
let totalPrice = 299.90
let createdAt = new Date()
```

## 8. snake_case — exemplos completos

```javascript
let product_name = "Teclado"
let first_name = "Rodrigo"
let last_name = "Gonçalves"
let user_email = "rodrigo@email.com"
let is_logged_in = true
let total_price = 299.90
let created_at = new Date()
```

## 9. Nomes descritivos vs genéricos

```javascript
// RUIM — genérico, sem significado
let x = "Rodrigo"
let data = [1, 2, 3]
let temp = calculateTotal()

// BOM — descritivo, auto-explicativo
let firstName = "Rodrigo"
let productIds = [1, 2, 3]
let orderTotal = calculateTotal()
```

## 10. Tradução português → inglês (dica do instrutor)

```javascript
// Português (evite)         →  Inglês (use)
// let nomeProduto           →  let productName
// let precoTotal            →  let totalPrice
// let cadastrar             →  let register
// let listaDeUsuarios       →  let userList
// let dataDeCriacao         →  let createdAt
// let estaLogado            →  let isLoggedIn
// let quantidadeDeItens     →  let itemCount
```

## 11. Padrões lado a lado

```javascript
// camelCase (padrão JS para variáveis/funções)
let firstName = "Rodrigo"
function getUserById(id) { }

// snake_case (usado em configs/APIs)
let first_name = "Rodrigo"
function get_user_by_id(id) { }

// PascalCase (classes e componentes)
class UserProfile { }
function ProductCard() { }  // React component

// UPPER_SNAKE_CASE (constantes)
const MAX_LOGIN_ATTEMPTS = 5
const API_BASE_URL = "https://api.example.com"
```