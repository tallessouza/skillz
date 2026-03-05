# Code Examples: Inferência de Tipos e Tipagem Explícita

## Exemplo 1: Tipagem explícita básica (da aula)

```typescript
// Tipagem explícita — declarando tipo sem valor
let myName: string

// Tentativa de atribuir número → ERRO
myName = 66 // Type 'number' is not assignable to type 'string'

// Atribuição correta
myName = "Rodrigo Gonçalves" // OK
```

## Exemplo 2: Inferência de tipos básica (da aula)

```typescript
// Inferência — TypeScript deduz string pelo valor
let message = "Oi, tudo bem?"

// Tentativa de atribuir número → ERRO (mesmo sem anotação explícita)
message = 74 // Type 'number' is not assignable to type 'string'

// Reatribuição com texto → OK
message = "Sim. Tudo ótimo!"
```

## Exemplo 3: Comparação lado a lado

```typescript
// REDUNDANTE — tipo explícito quando há valor
let greeting: string = "Hello"
const count: number = 42
const isReady: boolean = true

// CORRETO — inferência quando há valor
let greeting = "Hello"
const count = 42
const isReady = true

// CORRETO — explícito quando NÃO há valor
let userName: string
let retryCount: number
let isLoading: boolean
```

## Exemplo 4: Funções

```typescript
// Parâmetros: sempre explícitos (não há valor para inferir)
function greet(name: string, age: number): string {
  return `Olá ${name}, você tem ${age} anos`
}

// Retorno: inferência é aceitável em funções simples
function double(n: number) {
  return n * 2 // TypeScript infere retorno number
}
```

## Exemplo 5: Variações com const vs let

```typescript
// const com literal → tipo literal (mais restrito)
const direction = "north" // tipo: "north" (não string)

// let com literal → tipo amplo
let direction2 = "north" // tipo: string (permite reatribuição)

// const com objeto → propriedades são mutáveis
const config = { debug: true } // { debug: boolean }
config.debug = false // OK — propriedades não são readonly
```

## Exemplo 6: Quando inferência não é suficiente

```typescript
// Array vazio — TypeScript não sabe o tipo dos elementos
const items: string[] = [] // explícito necessário

// Variável que será atribuída depois
let result: number | null // explícito necessário
result = null
result = 42

// Union types
let status: "active" | "inactive" // explícito necessário
status = "active"
```