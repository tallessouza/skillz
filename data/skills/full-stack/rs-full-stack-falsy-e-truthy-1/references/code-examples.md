# Code Examples: Falsy e Truthy

## Exemplos completos da aula

### Todos os valores falsy demonstrados

```javascript
// Valores falsy — todos retornam "falso" no ternario
console.log(false ? "verdadeiro" : "falso")      // "falso"
console.log(0 ? "verdadeiro" : "falso")           // "falso"
console.log(-0 ? "verdadeiro" : "falso")          // "falso"
console.log("" ? "verdadeiro" : "falso")          // "falso"
console.log(null ? "verdadeiro" : "falso")        // "falso"
console.log(undefined ? "verdadeiro" : "falso")   // "falso"
console.log(NaN ? "verdadeiro" : "falso")         // "falso"
```

### Todos os valores truthy demonstrados

```javascript
// Valores truthy — todos retornam "verdadeiro" no ternario
console.log(true ? "verdadeiro" : "falso")        // "verdadeiro"
console.log({} ? "verdadeiro" : "falso")          // "verdadeiro" (objeto vazio!)
console.log([] ? "verdadeiro" : "falso")          // "verdadeiro" (array vazio!)
console.log(1 ? "verdadeiro" : "falso")           // "verdadeiro"
console.log(3.23 ? "verdadeiro" : "falso")        // "verdadeiro"
console.log("0" ? "verdadeiro" : "falso")         // "verdadeiro" (string "0"!)
console.log("Mayk" ? "verdadeiro" : "falso")      // "verdadeiro"
console.log(" " ? "verdadeiro" : "falso")         // "verdadeiro" (espaco!)
console.log("false" ? "verdadeiro" : "falso")     // "verdadeiro" (string "false"!)
console.log(-1 ? "verdadeiro" : "falso")          // "verdadeiro"
console.log(Infinity ? "verdadeiro" : "falso")    // "verdadeiro"
console.log(-Infinity ? "verdadeiro" : "falso")   // "verdadeiro"
```

## Variacoes praticas

### Verificando dados de usuario vindos de API

```typescript
interface User {
  name: string
  age: number
  preferences: Record<string, string>
  tags: string[]
}

function displayUserProfile(user: User) {
  // ERRADO: age 0 (recem-nascido) seria ignorada
  // if (user.age) { showAge(user.age) }

  // CORRETO: verifica se age foi definida
  if (user.age !== undefined && user.age !== null) {
    showAge(user.age)
  }

  // ERRADO: objeto vazio {} passaria
  // if (user.preferences) { showPreferences(user.preferences) }

  // CORRETO: verifica se tem conteudo
  if (Object.keys(user.preferences).length > 0) {
    showPreferences(user.preferences)
  }

  // ERRADO: array vazio [] passaria
  // if (user.tags) { showTags(user.tags) }

  // CORRETO: verifica se tem itens
  if (user.tags.length > 0) {
    showTags(user.tags)
  }
}
```

### Formulario com validacao de input

```typescript
function validateForm(formData: { name: string; email: string; phone?: string }) {
  // ERRADO: aceita string com apenas espacos
  // if (formData.name) { ... }

  // CORRETO: trim antes de verificar
  if (!formData.name.trim()) {
    throw new Error("Nome e obrigatorio")
  }

  if (!formData.email.trim()) {
    throw new Error("Email e obrigatorio")
  }

  // Para campos opcionais, nullish coalescing e ideal
  const phone = formData.phone?.trim() ?? "Nao informado"

  return { name: formData.name.trim(), email: formData.email.trim(), phone }
}
```

### Valores default com || vs ??

```typescript
interface ProductConfig {
  quantity: number
  discount: number
  notes: string
}

function applyDefaults(config: Partial<ProductConfig>): ProductConfig {
  // ERRADO: || substitui 0 e "" que podem ser validos
  return {
    quantity: config.quantity || 1,      // 0 vira 1 (bug!)
    discount: config.discount || 0,      // OK neste caso (0 e o default)
    notes: config.notes || "Sem notas",  // "" vira "Sem notas" (pode ser bug)
  }

  // CORRETO: ?? so substitui null/undefined
  return {
    quantity: config.quantity ?? 1,      // 0 permanece 0
    discount: config.discount ?? 0,      // null/undefined vira 0
    notes: config.notes ?? "Sem notas",  // "" permanece ""
  }
}
```

### Conversao explicita com Boolean()

```typescript
// Quando voce precisa do valor booleano explicitamente
const hasItems = Boolean(cart.items.length)  // true se length > 0
const hasName = Boolean(user.name?.trim())   // true se nome nao-vazio

// Double negation (equivalente, mas menos legivel)
const hasItems = !!cart.items.length
const hasName = !!user.name?.trim()

// Filtrando valores falsy de um array
const mixedValues = [0, 1, "", "hello", null, undefined, false, true, NaN]
const truthyOnly = mixedValues.filter(Boolean)
// Resultado: [1, "hello", true]
```

### Guard clauses com falsy/truthy

```typescript
function processPayment(amount: number, currency?: string) {
  // amount 0 e valido? Depende do dominio
  if (amount === 0) {
    return { status: "skipped", reason: "zero amount" }
  }

  // Aqui sim, coercao implicita e segura (null/undefined/NaN)
  if (!amount) {
    throw new Error("Amount invalido")
  }

  const resolvedCurrency = currency?.trim() || "BRL"  // || e OK aqui: "" deve virar "BRL"

  return charge(amount, resolvedCurrency)
}
```