# Code Examples: Comentário de Documentação (JSDoc)

## Exemplo da aula — Função signIn

### Função sem documentação
```javascript
function signIn(email, password) {
  // todo o fluxo de autenticação do usuário
  return 7
}

signIn("rodrigo@email.com", "12345678")
// IDE hover: signIn(email: any, password: any): number
```

### Função com JSDoc completo
```javascript
/**
 * Authenticates the user.
 * @param {string} email - User email.
 * @param {string} password - More than 6 characters.
 * @returns {number} User ID.
 */
function signIn(email, password) {
  // todo o fluxo de autenticação do usuário
  return 7
}

signIn("rodrigo@email.com", "12345678")
// IDE hover: mostra resumo, tipos, descrições e retorno
```

## Variações e padrões adicionais

### Função com objeto como parâmetro
```javascript
/**
 * Creates a new user account.
 * @param {{ name: string, email: string, age: number }} userData - User registration data.
 * @returns {string} Created user ID.
 */
function createUser(userData) {
  // creation flow
  return "user-abc-123"
}
```

### Função sem retorno
```javascript
/**
 * Sends a welcome email to the newly registered user.
 * @param {string} email - Recipient email address.
 * @param {string} userName - User display name for personalization.
 */
function sendWelcomeEmail(email, userName) {
  // send email flow
}
```

### Função com retorno condicional
```javascript
/**
 * Finds a user by their email address.
 * @param {string} email - Email to search for.
 * @returns {object|null} User object if found, null otherwise.
 */
function findUserByEmail(email) {
  // search flow
  return null
}
```

### Função com callback
```javascript
/**
 * Fetches user data and executes callback with result.
 * @param {string} userId - ID of the user to fetch.
 * @param {function} callback - Called with (error, user) after fetch completes.
 */
function fetchUser(userId, callback) {
  // async fetch flow
}
```

### Atalho do editor (como gerar automaticamente)

1. Posicione o cursor na linha acima da função
2. Digite `/**`
3. Pressione Enter
4. O VS Code gera automaticamente a estrutura com `@param` e `@returns`
5. Preencha os tipos entre `{}` e as descrições após o nome

```javascript
// Antes de preencher (auto-gerado):
/**
 *
 * @param {*} email
 * @param {*} password
 * @returns
 */
function signIn(email, password) {
  return 7
}

// Depois de preencher:
/**
 * Authenticates the user.
 * @param {string} email - User email.
 * @param {string} password - More than 6 characters.
 * @returns {number} User ID.
 */
function signIn(email, password) {
  return 7
}
```

### Tags JSDoc adicionais úteis

```javascript
/**
 * Calculates the total price with tax.
 * @param {number} priceInCents - Base price in cents.
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.15 for 15%).
 * @returns {number} Total price in cents including tax.
 * @example
 * calculateTotal(1000, 0.15) // returns 1150
 * @throws {Error} If priceInCents is negative.
 * @since 1.2.0
 * @deprecated Use calculateTotalV2 instead.
 */
function calculateTotal(priceInCents, taxRate) {
  if (priceInCents < 0) throw new Error("Price cannot be negative")
  return Math.round(priceInCents * (1 + taxRate))
}
```