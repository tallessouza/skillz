# Code Examples: Verificacao de Tipo Estatico

## Exemplo 1: Reatribuicao de constante

```typescript
// ERRO: Cannot assign to 'message' because it is a constant
const message = "Hello TypeScript!"
message = "TypeScript!"  // ❌ TypeScript alerta aqui

// CORRECAO: usar let se precisa reatribuir
let message = "Hello TypeScript!"
message = "TypeScript!"  // ✅ OK com let
```

## Exemplo 2: Chamar string como funcao

```typescript
let message = "Hello TypeScript!"

// ERRO: This expression is not callable. Type 'String' has no call signatures.
message()  // ❌ string nao e funcao

// CORRECAO: criar uma funcao de verdade
function showMessage() {
    console.log(message)
}
showMessage()  // ✅ agora sim, e chamavel
```

## Exemplo 3: Propriedade inexistente em objeto

```typescript
const user = {
    name: "Rodrigo Gonçalves",
    email: "rodrigo@email.com"
}

// ERRO: Property 'avatar' does not exist on type '{ name: string; email: string; }'
console.log(user.avatar)  // ❌ avatar nao existe

// CORRECAO: acessar propriedade que existe
console.log(user.name)  // ✅ "Rodrigo Gonçalves"
```

## Exemplo 4: Erro de digitacao detectado

```typescript
const user = {
    name: "Rodrigo Gonçalves",
    email: "rodrigo@email.com"
}

// ERRO: Property 'emal' does not exist. Did you mean 'email'?
console.log(user.emal)  // ❌ typo detectado

// CORRECAO: usar IntelliSense (Ctrl+Space) para autocompletar
console.log(user.email)  // ✅ correto
```

## Exemplo completo da aula (codigo final corrigido)

```typescript
// const message = "Hello TypeScript!"  // const nao permite reatribuicao
let message = "Hello TypeScript!"

function showMessage() {
    console.log(message)
}

// Consigo mudar? Sim, porque agora e let
message = "TypeScript!"

// Consigo executar? Sim, porque showMessage e uma funcao
// message()  // ❌ isso nao funciona — string nao e funcao
showMessage()  // ✅ funcao e chamavel

const user = {
    name: "Rodrigo Gonçalves",
    email: "rodrigo@email.com"
}

// Propriedade existe? Sim, name existe no objeto
// console.log(user.avatar)  // ❌ avatar nao existe
console.log(user.name)  // ✅ "Rodrigo Gonçalves"
```

## Variacoes adicionais

### Variacao: objeto com propriedade opcional

```typescript
// Se avatar fosse opcional, voce definiria assim com interface:
interface User {
    name: string
    email: string
    avatar?: string  // opcional
}

const user: User = {
    name: "Rodrigo Gonçalves",
    email: "rodrigo@email.com"
}

// Agora TypeScript permite, mas avisa que pode ser undefined
console.log(user.avatar)  // string | undefined
console.log(user.avatar?.toUpperCase())  // safe access com optional chaining
```

### Variacao: funcao tipada

```typescript
let message: string = "Hello TypeScript!"

function showMessage(): void {
    console.log(message)
}

// TypeScript sabe que showMessage retorna void
const result = showMessage()  // result e void — nao pode usar como valor
```