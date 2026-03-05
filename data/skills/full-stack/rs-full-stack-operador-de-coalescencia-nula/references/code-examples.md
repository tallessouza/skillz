# Code Examples: Operador de Coalescência Nula (??)

## Exemplo 1: Valor básico com null

```javascript
const content = null
console.log(content ?? "conteúdo padrão")
// Output: "conteúdo padrão"
```

## Exemplo 2: Valor básico com conteúdo

```javascript
const content = "Olá Rodrigo"
console.log(content ?? "conteúdo padrão")
// Output: "Olá Rodrigo"
```

## Exemplo 3: Comportamento com undefined

```javascript
const content = undefined
console.log(content ?? "conteúdo padrão")
// Output: "conteúdo padrão"
```

## Exemplo 4: Comportamento com false (NÃO substitui)

```javascript
const content = false
console.log(content ?? "conteúdo padrão")
// Output: false
```

## Exemplo 5: Comportamento com true

```javascript
const content = true
console.log(content ?? "conteúdo padrão")
// Output: true
```

## Exemplo 6: Comportamento com objeto vazio (NÃO substitui)

```javascript
const content = {}
console.log(content ?? "conteúdo padrão")
// Output: {}
```

## Exemplo 7: Avatar do usuário — sem avatar

```javascript
const user = {
  name: "Rodrigo",
  avatar: undefined
}

console.log(user.avatar ?? "default.png")
// Output: "default.png"
```

## Exemplo 8: Avatar do usuário — com avatar

```javascript
const user = {
  name: "Rodrigo",
  avatar: "rodrigo.png"
}

console.log(user.avatar ?? "default.png")
// Output: "rodrigo.png"
```

## Exemplo 9: Avatar com null

```javascript
const user = {
  name: "Rodrigo",
  avatar: null
}

console.log(user.avatar ?? "default.png")
// Output: "default.png"
```

## Exemplo 10: Comparação ?? vs || com valores falsy

```javascript
// Valor 0 (número válido)
console.log(0 ?? 42)   // 0 — preservado
console.log(0 || 42)   // 42 — BUG se 0 era intencional

// String vazia (pode ser intencional)
console.log("" ?? "fallback")   // "" — preservado
console.log("" || "fallback")   // "fallback" — BUG

// false (boolean intencional)
console.log(false ?? true)   // false — preservado
console.log(false || true)   // true — BUG
```

## Exemplo 11: Configuração com defaults

```typescript
interface AppConfig {
  port?: number
  debug?: boolean
  title?: string
}

function initApp(config: AppConfig) {
  const port = config.port ?? 3000
  const debug = config.debug ?? false
  const title = config.title ?? "My App"

  console.log({ port, debug, title })
}

initApp({ port: 0, debug: false })
// { port: 0, debug: false, title: "My App" }
// Com || seria: { port: 3000, debug: false, title: "My App" } — BUG no port!
```

## Exemplo 12: Encadeamento de fallbacks

```typescript
function getDisplayName(user: {
  nickname?: string
  name?: string
  email?: string
}) {
  return user.nickname ?? user.name ?? user.email ?? "Usuário Anônimo"
}

getDisplayName({ email: "r@dev.com" })           // "r@dev.com"
getDisplayName({ name: "Rodrigo" })               // "Rodrigo"
getDisplayName({ nickname: "Rod", name: "Rodrigo" }) // "Rod"
getDisplayName({})                                 // "Usuário Anônimo"
```

## Exemplo 13: Com optional chaining

```typescript
type User = {
  settings?: {
    theme?: string
    language?: string
  }
}

const user: User = {}

const theme = user?.settings?.theme ?? "light"
const language = user?.settings?.language ?? "pt-BR"

console.log(theme)    // "light"
console.log(language) // "pt-BR"
```

## Exemplo 14: Resposta de API

```typescript
interface ApiResponse {
  data?: {
    user?: {
      avatar?: string
      bio?: string
    }
  }
}

function renderProfile(response: ApiResponse) {
  const avatar = response.data?.user?.avatar ?? "/images/default-avatar.png"
  const bio = response.data?.user?.bio ?? "Este usuário ainda não escreveu uma bio."

  return { avatar, bio }
}
```