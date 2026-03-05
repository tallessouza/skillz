# Code Examples: Compilando TypeScript

## Exemplo 1: Arquivo inicial sem TypeScript

```typescript
// src/server.ts (conteudo sem tipagem — funciona no Node por acaso)
console.log("hello world")
```

```bash
# Funciona porque nao tem sintaxe TypeScript
node src/server.ts
# Output: hello world
```

## Exemplo 2: Adicionando tipagem

```typescript
// src/server.ts
function sum(a: number, b: number): number {
  return a + b
}

const result: number = sum(5, 3)
console.log(`Resultado da soma: ${result}`)
```

```bash
# Falha — Node nao entende ": number"
node src/server.ts
# Error: unexpected token ':'
```

## Exemplo 3: Compilando e executando

```bash
# Passo 1: Compilar
npx tsc src/server.ts
# Gera src/server.js

# Passo 2: Executar
node src/server.js
# Output: Resultado da soma: 8
```

## Exemplo 4: Resultado da compilacao

**server.ts (antes):**
```typescript
function sum(a: number, b: number): number {
  return a + b
}
const result: number = sum(5, 3)
console.log(`Resultado da soma: ${result}`)
```

**server.js (depois do tsc):**
```javascript
function sum(a, b) {
  return a + b
}
const result = sum(5, 3)
console.log(`Resultado da soma: ${result}`)
```

## Exemplo 5: Erro de tipo detectado pelo TypeScript

```typescript
// O TypeScript detecta esse erro ANTES de executar
function sum(a: number, b: number): boolean {
  return a + b  // Erro: Type 'number' is not assignable to type 'boolean'
}
```

O editor mostra o erro imediatamente. Se tentar compilar com `npx tsc`, a compilacao falha com a mesma mensagem de erro.

## Exemplo 6: Implicit any (o que evitar)

```typescript
// Em arquivo .ts — editor mostra warning
function sum(a, b) {  // ⚠️ Parameter 'a' implicitly has an 'any' type
  return a + b
}

// Corrigido:
function sum(a: number, b: number): number {
  return a + b
}
```

## Variacoes praticas

### Funcao com string

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`
}
const message: string = greet("World")
console.log(message)
```

### Funcao com boolean

```typescript
function isAdult(age: number): boolean {
  return age >= 18
}
const canVote: boolean = isAdult(21)
console.log(`Pode votar: ${canVote}`)
```

### Funcao com multiplos tipos de retorno via union

```typescript
function divide(a: number, b: number): number | null {
  if (b === 0) return null
  return a / b
}
const quotient: number | null = divide(10, 3)
```