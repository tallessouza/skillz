# Code Examples: Tipagem em Arrays

## Exemplo 1: Lista de strings com anotacao

```typescript
let names: string[] = ["Rodrigo", "Mayk"]

// Operacoes validas
names.push("Ana")
names[0] = "Carlos"

// ERRO: Argument of type 'number' is not assignable to parameter of type 'string'
names.push(8)
```

## Exemplo 2: Lista de numeros com anotacao

```typescript
let numbers: number[] = [1, 2, 3, 4, 5]

// Operacoes validas
numbers.push(6)
numbers[0] = 100

// ERRO: Argument of type 'string' is not assignable to parameter of type 'number'
numbers.push("texto")
```

## Exemplo 3: Inferencia de tipo

```typescript
let products = ["Product x", "Product y", "Product z"]
// TypeScript infere: string[]

// Operacoes validas
products.push("Product w")

// ERRO: mesmo sem anotacao, TypeScript protege
products.push(42)
```

## Exemplo 4: Array vazio (precisa de anotacao)

```typescript
// SEM anotacao — TypeScript infere never[], inutilizavel
let bad = []

// COM anotacao — funciona corretamente
let good: string[] = []
good.push("funciona")
```

## Exemplo 5: Outros tipos de array

```typescript
let flags: boolean[] = [true, false, true]
let prices: number[] = [9.99, 19.99, 29.99]
let mixed: (string | number)[] = ["hello", 42]
```

## Exemplo 6: Em funcoes

```typescript
function getNames(): string[] {
  return ["Rodrigo", "Mayk"]
}

function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0)
}
```