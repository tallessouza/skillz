# Code Examples: Boolean

## Exemplo básico da aula

```javascript
// Exibindo valores booleanos
console.log(true)   // true
console.log(false)  // false

// Criando variável boolean
const isLoading = true
console.log(isLoading)        // true
console.log(typeof isLoading) // "boolean"
```

## Padrões de nomenclatura completos

### Prefixo `is` — estado atual
```javascript
const isLoading = true
const isProcessing = false
const isAuthenticated = true
const isVisible = false
const isFormSubmitting = true
```

### Prefixo `has` — posse/existência
```javascript
const hasPermission = true
const hasChildren = false
const hasError = true
const hasUnsavedChanges = false
```

### Prefixo `can` — capacidade
```javascript
const canEdit = true
const canDelete = false
const canAccessAdmin = true
```

### Prefixo `should` — intenção
```javascript
const shouldRefresh = true
const shouldNotify = false
const shouldRedirect = true
```

### Prefixo `was` — passado
```javascript
const wasDeleted = true
const wasSent = false
const wasModified = true
```

## Uso prático em UI

```javascript
const isLoading = true

// Controle de renderização
if (isLoading) {
  console.log("Exibir spinner...")
} else {
  console.log("Exibir conteúdo")
}
```

## Verificação de tipo

```javascript
const isActive = true
const name = "João"
const age = 25

console.log(typeof isActive)  // "boolean"
console.log(typeof name)      // "string"
console.log(typeof age)       // "number"
```

## Causa vs Efeito (padrão avançado)

```javascript
// CAUSA (reutilizável)
const isFormSubmitting = true

// Múltiplos EFEITOS derivados da mesma causa
const isButtonDisabled = isFormSubmitting
const isSpinnerVisible = isFormSubmitting
const isFormLocked = isFormSubmitting
```

## Conversão para boolean

```javascript
// Usando Boolean()
console.log(Boolean(1))         // true
console.log(Boolean(0))         // false
console.log(Boolean("texto"))   // true
console.log(Boolean(""))        // false
console.log(Boolean(null))      // false
console.log(Boolean(undefined)) // false

// Usando double negation (!!)
console.log(!!1)    // true
console.log(!!0)    // false
console.log(!!"a")  // true
console.log(!!"")   // false
```