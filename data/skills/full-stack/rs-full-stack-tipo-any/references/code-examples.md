# Code Examples: Tipo Any no TypeScript

## Exemplo 1: Comportamento basico do any (da aula)

```typescript
// any IMPLICITO — sem tipo declarado, TypeScript assume any
let message
message = "Esse é um texto"  // OK
message = 45                  // OK
message = true                // OK
// Nenhum erro — TypeScript nao verifica nada
```

```typescript
// any EXPLICITO — mesmo comportamento, intencao clara
let message: any
message = "Esse é um texto"  // OK
message = 45                  // OK
message = true                // OK
```

```typescript
// Com tipo string — TypeScript ativa verificacao
let message: string
message = "Esse é um texto"  // OK
message = 45                  // ERRO: Type 'number' is not assignable to type 'string'
message = true                // ERRO: Type 'boolean' is not assignable to type 'string'
```

```typescript
// Com tipo number — so aceita numeros
let message: number
message = "Esse é um texto"  // ERRO
message = 45                  // OK
message = true                // ERRO
```

## Exemplo 2: any vs unknown

```typescript
// COM ANY — perigoso, nenhuma verificacao
function processAny(data: any) {
  console.log(data.name.toUpperCase())  // Compila, mas pode explodir em runtime
}
processAny(42)  // Runtime error: Cannot read properties of undefined

// COM UNKNOWN — seguro, forca verificacao
function processUnknown(data: unknown) {
  // console.log(data.name)  // ERRO: Object is of type 'unknown'
  
  if (typeof data === 'object' && data !== null && 'name' in data) {
    console.log((data as { name: string }).name.toUpperCase())  // Seguro
  }
}
```

## Exemplo 3: Migracao JS para TS (any temporario aceitavel)

```typescript
// arquivo recem convertido de .js para .ts
// TODO: tipar corretamente — ticket TECH-123

// any: migracao em andamento, resposta da API nao documentada
let userData: any = await fetch('/api/user').then(r => r.json())

// Evolucao: criar interface
interface User {
  id: number
  name: string
  email: string
}
let typedUserData: User = await fetch('/api/user').then(r => r.json())
```

## Exemplo 4: Funcao generica em vez de any

```typescript
// RUIM — any perde informacao de tipo
function firstElement(arr: any[]): any {
  return arr[0]
}
const item = firstElement([1, 2, 3])  // item e any — perdeu o tipo

// BOM — generic preserva o tipo
function firstElement<T>(arr: T[]): T {
  return arr[0]
}
const item = firstElement([1, 2, 3])  // item e number — tipo preservado
```

## Exemplo 5: Type assertion como alternativa ao any

```typescript
// Em vez de any para "forcar" um tipo
const element: any = document.getElementById('app')
element.innerText = 'Hello'

// Melhor: type assertion explicita
const element = document.getElementById('app') as HTMLDivElement
element.innerText = 'Hello'  // TypeScript sabe que e HTMLDivElement

// Ainda melhor: null check
const element = document.getElementById('app')
if (element) {
  element.innerText = 'Hello'
}
```

## Exemplo 6: noImplicitAny em tsconfig

```json
{
  "compilerOptions": {
    "strict": true,        // inclui noImplicitAny
    "noImplicitAny": true  // ou separadamente
  }
}
```

Com essa flag ativa:
```typescript
let message       // ERRO: Variable 'message' implicitly has an 'any' type
let message: any  // OK — any explicito ainda permitido (decisao consciente)
```