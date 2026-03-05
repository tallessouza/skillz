# Code Examples: Restringindo Valores com Type Aliases

## Exemplo basico da aula

```typescript
// Definindo o type com os valores permitidos
type Size = "small" | "medium" | "large"

// Usando o type como anotacao
let size: Size

// Valores validos
size = "small"   // OK
size = "medium"  // OK
size = "large"   // OK

// Valores invalidos — erro de compilacao
size = "pequeno" // Error: Type '"pequeno"' is not assignable to type 'Size'
size = "sm"      // Error: Type '"sm"' is not assignable to type 'Size'
```

## Variacoes praticas

### Status de pedido

```typescript
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  console.log(`Order ${orderId} updated to ${newStatus}`)
}

updateOrderStatus("ORD-001", "shipped")    // OK
updateOrderStatus("ORD-001", "processing") // Error
```

### Roles de usuario

```typescript
type UserRole = "admin" | "editor" | "viewer"

function hasPermission(role: UserRole, action: string): boolean {
  switch (role) {
    case "admin": return true
    case "editor": return action !== "delete"
    case "viewer": return action === "read"
  }
}
```

### Direcoes (enum-like sem enum)

```typescript
type Direction = "up" | "down" | "left" | "right"

function move(direction: Direction, steps: number) {
  console.log(`Moving ${direction} by ${steps} steps`)
}

move("up", 3)      // OK
move("diagonal", 2) // Error
```

### Combinando com outras tipagens

```typescript
type Theme = "light" | "dark" | "system"
type Language = "pt-BR" | "en-US" | "es-ES"

interface UserPreferences {
  theme: Theme
  language: Language
  fontSize: number
}

const preferences: UserPreferences = {
  theme: "dark",
  language: "pt-BR",
  fontSize: 16,
}
```

### Usando em condicoes (caso destacado pelo instrutor)

```typescript
type Plan = "free" | "pro" | "enterprise"

function getFeatures(plan: Plan): string[] {
  switch (plan) {
    case "free":
      return ["basic-support"]
    case "pro":
      return ["basic-support", "api-access", "priority-support"]
    case "enterprise":
      return ["basic-support", "api-access", "priority-support", "sla", "custom-integrations"]
  }
}

// O compilador garante que todos os casos sao cobertos
// Se adicionar um novo plan, o TypeScript avisa onde falta tratar
```

### Extensao de types existentes

```typescript
type Size = "small" | "medium" | "large"
type ExtendedSize = Size | "extra-small" | "extra-large"

let tshirtSize: ExtendedSize = "extra-large" // OK — inclui todos de Size + novos
```

### Parametro de funcao inline (sem type separado)

```typescript
// Para uso unico, pode definir inline
function setAlignment(align: "left" | "center" | "right") {
  document.body.style.textAlign = align
}
```

### Array de valores restritos

```typescript
type Color = "red" | "green" | "blue"

const palette: Color[] = ["red", "blue"] // Cada elemento validado
palette.push("green")   // OK
palette.push("yellow")  // Error
```

### Exhaustiveness check com never

```typescript
type Shape = "circle" | "square" | "triangle"

function getArea(shape: Shape, size: number): number {
  switch (shape) {
    case "circle": return Math.PI * size * size
    case "square": return size * size
    case "triangle": return (size * size) / 2
    default:
      // Se adicionar novo shape e esquecer o case, erro aqui
      const exhaustiveCheck: never = shape
      throw new Error(`Unhandled shape: ${exhaustiveCheck}`)
  }
}
```