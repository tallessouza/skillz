# Code Examples: Tipagem em Funções TypeScript

## Exemplo 1: Função soma com parâmetros e retorno tipados

```typescript
function sum(x: number, y: number): number {
  const result = x + y
  console.log("Resultado = " + result)
  return result
}

const result = sum(7, 3) // result é number
```

### Erros que o TypeScript captura:

```typescript
// Erro: Argument of type 'string' is not assignable to parameter of type 'number'
sum("7", 3)

// Erro: Expected 2 arguments, but got 1. An argument for 'y' was not provided.
sum(7)

// Erro: Expected 2 arguments, but got 3.
sum(7, 3, 5)
```

## Exemplo 2: O perigo da inferência de retorno

```typescript
// SEM tipo de retorno explícito — perigoso
function sum(x: number, y: number) {
  const result = x + y
  return result // TypeScript infere: number ✓
}

// Alguém altera o corpo:
function sum(x: number, y: number) {
  const result = x + y
  return result.toString() // TypeScript infere: string — SEM ERRO!
}

// Consumidor quebra silenciosamente:
const total = sum(3, 2) // total é "32", não 5
```

```typescript
// COM tipo de retorno explícito — seguro
function sum(x: number, y: number): number {
  const result = x + y
  return result.toString() // ERRO: Type 'string' is not assignable to type 'number'
}
```

## Exemplo 3: void como proteção

```typescript
// Com void declarado, return é bloqueado:
function sum(x: number, y: number): void {
  const result = x + y
  console.log("Resultado = " + result)
  return result // ERRO: Type 'number' is not assignable to type 'void'
}
```

## Exemplo 4: Arrow function tipada

```typescript
const showMessage = (name: string): string => {
  const message = "Olá " + name
  return message
}

showMessage("Rodrigo Gonçalves") // ✓

// Erro: retorno incompatível
const showMessage = (name: string): string => {
  return 42 // ERRO: Type 'number' is not assignable to type 'string'
}

// Erro: parâmetro extra
showMessage("Rodrigo", "extra") // ERRO: Expected 1 arguments, but got 2
```

## Exemplo 5: Variações de funções tipadas

### Múltiplos parâmetros com tipos diferentes

```typescript
function createUser(name: string, age: number, active: boolean): string {
  return `${name}, ${age} anos, ${active ? "ativo" : "inativo"}`
}
```

### Função sem retorno (void explícito)

```typescript
function logUser(name: string, age: number): void {
  console.log(`Usuário: ${name}, Idade: ${age}`)
}
```

### Arrow function sem retorno

```typescript
const logError = (message: string): void => {
  console.error(`[ERROR] ${message}`)
}
```

### Inferência segura no corpo (não no retorno)

```typescript
function multiply(x: number, y: number): number {
  const result = x * y // result é inferido como number — OK dentro do corpo
  return result // retorno explícito garante consistência
}
```