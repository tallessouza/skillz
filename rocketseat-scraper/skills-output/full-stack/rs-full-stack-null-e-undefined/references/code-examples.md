# Code Examples: Null e Undefined no TypeScript

## Exemplo 1: Variavel sem valor atribuido

Direto da aula — declarar variavel com tipo mas sem valor:

```typescript
let value: number
console.log(value) // undefined

// TypeScript avisa: "Variable 'value' is used before being assigned"
// Mas o codigo executa e mostra undefined
```

Atribuindo valor depois:

```typescript
let value: number
value = 12
console.log(value) // 12
```

## Exemplo 2: Propriedade inexistente em objeto

```typescript
let user = {
  name: "Rodrigo"
}

// TypeScript infere: user: { name: string }
// Tentar acessar user.email gera erro de compilacao:
// "Property 'email' does not exist on type '{ name: string }'"

// console.log(user.email) // ERRO TypeScript
```

### Variacao: objeto com propriedade opcional

```typescript
let user: {
  name: string
  email?: string // opcional = string | undefined
} = {
  name: "Rodrigo"
}

console.log(user.email) // undefined (sem erro do TypeScript)
```

## Exemplo 3: Null como ausencia intencional

```typescript
let email = null
console.log(email) // null

if (!email) {
  console.log("Informe o e-mail!") // executa
}
```

### Variacao: com tipagem explicita

```typescript
let email: string | null = null

// Depois de receber input do usuario:
email = "rodrigo@email.com"

if (!email) {
  console.log("Informe o e-mail!")
} else {
  console.log(`Email: ${email}`) // "Email: rodrigo@email.com"
}
```

## Exemplo 4: Comparacao null vs undefined

```typescript
let a: string | null = null
let b: string | undefined = undefined

console.log(a == b)   // true (loose: ambos sao "nada")
console.log(a === b)  // false (strict: tipos diferentes)

console.log(!a)  // true
console.log(!b)  // true
```

## Exemplo 5: Funcao que pode retornar null

```typescript
function findUserByEmail(email: string): User | null {
  const user = database.find(u => u.email === email)
  return user ?? null // se nao encontrou, retorna null (intencional)
}

const user = findUserByEmail("teste@email.com")

if (!user) {
  console.log("Usuario nao encontrado")
}
```

## Exemplo 6: Objeto com propriedades nullable

```typescript
interface UserProfile {
  name: string
  email: string | null      // pode nao ter (intencional)
  phone?: string             // opcional (pode ser undefined)
  avatarUrl: string | null   // pode nao ter foto (intencional)
}

const profile: UserProfile = {
  name: "Rodrigo",
  email: null,        // usuario ainda nao informou
  avatarUrl: null     // sem foto de perfil
  // phone omitido = undefined
}
```

## Exemplo 7: Verificacoes condicionais (padroes da aula)

```typescript
// Negacao simples (captura null, undefined, "", 0, NaN)
if (!email) {
  console.log("Informe o e-mail!")
}

// Verificacao especifica de null
if (email === null) {
  console.log("Email e null")
}

// Verificacao de null OU undefined
if (email == null) {
  // captura tanto null quanto undefined (loose equality)
  console.log("Sem email")
}

// Nullish coalescing (valor padrao so para null/undefined)
const displayEmail = email ?? "Nao informado"
```