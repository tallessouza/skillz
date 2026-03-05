# Code Examples: Tipos Primitivos do TypeScript

## Exemplo 1: String — demonstrado na aula

```typescript
// Declaracao com tipo string
let username: string

// Atribuicao valida
username = "rodrigo"

// Atribuicoes invalidas (TypeScript acusa erro)
// username = 17    // Error: Type 'number' is not assignable to type 'string'
// username = true  // Error: Type 'boolean' is not assignable to type 'string'
```

## Exemplo 2: Number — demonstrado na aula

```typescript
// Declaracao com tipo number
let total: number

// Inteiro — valido
total = 3

// Decimal — tambem valido (number cobre ambos)
total = 7.5

// Atribuicoes invalidas
// total = "tres"   // Error: Type 'string' is not assignable to type 'number'
// total = true     // Error: Type 'boolean' is not assignable to type 'number'
```

## Exemplo 3: Boolean — demonstrado na aula

```typescript
// Declaracao com tipo boolean
let isLoading: boolean

// Valores validos
isLoading = true
isLoading = false

// Atribuicoes invalidas
// isLoading = 1        // Error: Type 'number' is not assignable to type 'boolean'
// isLoading = "true"   // Error: Type 'string' is not assignable to type 'boolean'
```

## Variacoes praticas

### Variaveis com valor inicial

```typescript
// TypeScript infere o tipo automaticamente quando ha valor inicial
let username = "rodrigo"  // TypeScript infere: string
let total = 3             // TypeScript infere: number
let isLoading = true      // TypeScript infere: boolean

// Mesmo inferido, a protecao funciona:
// username = 17  // Error: Type 'number' is not assignable to type 'string'
```

### Parametros de funcao

```typescript
function greet(name: string): string {
  return `Ola, ${name}!`
}

greet("rodrigo")  // OK
// greet(17)       // Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

### Valores monetarios

```typescript
// Decimais SEMPRE com ponto
let priceInReais: number = 3.50
let discountPercentage: number = 15.5
```

### Flags de estado comuns em frontend

```typescript
let isLoading: boolean = false
let isAuthenticated: boolean = false
let hasError: boolean = false
let isModalOpen: boolean = true
```