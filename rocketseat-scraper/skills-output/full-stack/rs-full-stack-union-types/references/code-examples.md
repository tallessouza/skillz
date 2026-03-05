# Code Examples: Union Types

## Exemplo basico da aula

```typescript
// Declaracao com union type
let response: string | null

// Atribuindo string — OK
response = "Teste"

// Atribuindo null — OK
response = null
```

## Union com tres tipos

```typescript
// Variavel que aceita string, null ou number
let response: string | null | number

response = "mensagem de texto"  // OK
response = null                  // OK
response = 42                    // OK
response = true                  // Error: Type 'boolean' is not assignable
```

## Removendo tipos da union

Quando voce remove um tipo da union, o TypeScript imediatamente acusa erro nos valores que nao correspondem:

```typescript
// Se remover number da union:
let response: string | null
response = 42  // Error: Type 'number' is not assignable to type 'string | null'

// Se remover null da union:
let response: string
response = null  // Error: Type 'null' is not assignable to type 'string'
```

## Cenario real: resposta de API

```typescript
// Funcao que busca usuario no banco
function findUserName(id: number): string | null {
  // Pode retornar o nome (string) ou null se nao encontrar
  const user = database.find(id)
  if (user) {
    return user.name
  }
  return null
}

let userName: string | null = findUserName(123)
```

## Cenario real: estado de componente

```typescript
// Estado que comeca sem valor e depois recebe dados
let errorMessage: string | null = null

// Apos validacao
errorMessage = "Email invalido"

// Apos correcao
errorMessage = null
```

## Union com type alias (evolucao natural)

```typescript
// Quando a union fica grande, extraia para um type alias
type ApiResponse = string | number | null

let response: ApiResponse
response = "sucesso"
response = 404
response = null
```

## Narrowing com union types

```typescript
let response: string | null = getApiResponse()

// TypeScript exige narrowing antes de usar metodos de string
if (response !== null) {
  console.log(response.toUpperCase()) // OK — TypeScript sabe que e string aqui
}

// Alternativa com optional chaining (nao e union-specific, mas comum)
console.log(response?.toUpperCase())
```