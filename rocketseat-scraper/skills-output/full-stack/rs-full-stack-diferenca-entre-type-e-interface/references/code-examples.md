# Code Examples: Diferença entre Type e Interface

## Exemplo 1: Declaracao basica (da aula)

```typescript
// Com interface
interface IProduct {
    id: number
    name: string
}

// Com type
type TProduct = {
    id: number
    name: string
}

// Uso identico
let product1: IProduct = { id: 1, name: "Produto 1" }
let product2: TProduct = { id: 2, name: "Produto 2" }
```

## Exemplo 2: Extensao / Composicao (da aula)

```typescript
// Interface com extends
interface IBaseProduct {
    price: number
}

interface IProduct extends IBaseProduct {
    id: number
    name: string
}

// Type com intersecao
type TBaseProduct = {
    price: number
}

type TProduct = TBaseProduct & {
    id: number
    name: string
}

let product1: IProduct = { id: 1, name: "Produto 1", price: 500 }
let product2: TProduct = { id: 2, name: "Produto 2", price: 550 }
```

## Exemplo 3: Declaration Merging (da aula)

```typescript
interface IProduct {
    id: number
    name: string
}

// Mesma interface, nova propriedade
interface IProduct {
    quantity: number
}

// TypeScript unifica — product precisa de id, name E quantity
let product1: IProduct = { id: 1, name: "Produto 1", price: 500, quantity: 12 }
```

## Exemplo 4: Alias de primitivo (da aula)

```typescript
// Funciona com type
type TypeString = string
type TypeNumber = number

// NAO funciona com interface
interface X extends string {} // Error: An interface cannot extend a primitive type
```

## Exemplo 5: Variacoes adicionais — Union types

```typescript
// So possivel com type
type Status = "active" | "inactive" | "pending"
type Result = Success | Error

// Interface nao suporta unions
// interface Status = "active" | "inactive"  // Syntax error
```

## Exemplo 6: Variacoes adicionais — Tuple types

```typescript
// So possivel com type
type Coordinate = [number, number]
type NameAge = [string, number]

// Interface pode simular, mas e estranho
interface ICoordinate {
    0: number
    1: number
    length: 2
}
```

## Exemplo 7: Variacoes adicionais — Mapped types

```typescript
// So possivel com type
type ReadonlyProduct = {
    readonly [K in keyof Product]: Product[K]
}

type PartialProduct = Partial<Product>
type RequiredProduct = Required<Product>
```

## Exemplo 8: Extensao multipla

```typescript
// Interface pode estender multiplas interfaces
interface Timestamped {
    createdAt: Date
    updatedAt: Date
}

interface SoftDeletable {
    deletedAt: Date | null
}

interface Product extends Timestamped, SoftDeletable {
    id: number
    name: string
}

// Equivalente com type
type Product = Timestamped & SoftDeletable & {
    id: number
    name: string
}
```

## Resumo: quando cada um e a unica opcao

| Capacidade | `type` | `interface` |
|-----------|--------|-------------|
| Alias de primitivo | Sim | Nao |
| Union types | Sim | Nao |
| Tuple types | Sim | Nao |
| Mapped types | Sim | Nao |
| Declaration merging | Nao | Sim |
| `extends` com erro explicito em conflito | Nao | Sim |
| Descrever forma de objeto | Sim | Sim |
| Ser implementada por classe | Sim | Sim |