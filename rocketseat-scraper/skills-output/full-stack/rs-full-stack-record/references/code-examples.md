# Code Examples: TypeScript Record Utility Type

## Exemplo 1: Record basico — pontuacoes

Direto da aula. Chaves string, valores number.

```typescript
const scores: Record<string, number> = {
  "Rodrigo": 10,
  "Mayk": 15
}

// Adicionar novas entradas — valido desde que respeite a tipagem
scores["Diego"] = 20

// ERRO: valor deve ser number
scores["Ana"] = "vinte"  // Type 'string' is not assignable to type 'number'
```

## Exemplo 2: Restringindo chaves com union type

Direto da aula. O union type Profile limita as chaves permitidas.

```typescript
type Profile = "admin" | "user" | "guest"

const user: Record<Profile, number> = {
  admin: 1,
  guest: 2,
  user: 3
}

// ERRO: omitir uma chave
const incomplete: Record<Profile, number> = {
  admin: 1,
  guest: 2
  // Property 'user' is missing
}

// ERRO: adicionar chave extra
const extra: Record<Profile, number> = {
  admin: 1,
  guest: 2,
  user: 3,
  default: 4  // Object literal may only specify known properties
}
```

## Exemplo 3: Valores com interface customizada

Direto da aula. Chaves como ID numerico, valores como objeto User.

```typescript
interface User {
  name: string
  email: string
}

const users: Record<number, User> = {
  1: { name: "Rodrigo", email: "rodrigo@email.com" },
  2: { name: "Mayk", email: "mayk@email.com" },
}

// ERRO: faltou email
const broken: Record<number, User> = {
  1: { name: "Rodrigo" }
  // Property 'email' is missing in type '{ name: string; }'
}
```

## Variacao: Dicionario de configuracao

```typescript
interface FeatureFlag {
  enabled: boolean
  rolloutPercentage: number
}

const features: Record<string, FeatureFlag> = {
  darkMode: { enabled: true, rolloutPercentage: 100 },
  newCheckout: { enabled: false, rolloutPercentage: 0 },
  betaSearch: { enabled: true, rolloutPercentage: 25 },
}
```

## Variacao: Mapeamento de rotas HTTP

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

interface RouteHandler {
  path: string
  handler: (req: Request) => Response
}

const routes: Record<HttpMethod, RouteHandler[]> = {
  GET: [{ path: "/users", handler: getUsers }],
  POST: [{ path: "/users", handler: createUser }],
  PUT: [{ path: "/users/:id", handler: updateUser }],
  DELETE: [{ path: "/users/:id", handler: deleteUser }],
}
```

## Variacao: Internacionalizacao (i18n)

```typescript
type Language = "pt" | "en" | "es"

const translations: Record<Language, Record<string, string>> = {
  pt: { greeting: "Ola", farewell: "Tchau" },
  en: { greeting: "Hello", farewell: "Goodbye" },
  es: { greeting: "Hola", farewell: "Adios" },
}
```

## Variacao: Record com Partial para chaves opcionais

```typescript
type Theme = "light" | "dark" | "system"

interface ThemeConfig {
  background: string
  text: string
  accent: string
}

// Nem todos os temas precisam estar configurados
const themes: Partial<Record<Theme, ThemeConfig>> = {
  light: { background: "#fff", text: "#000", accent: "#007bff" },
  dark: { background: "#1a1a1a", text: "#fff", accent: "#4dabf7" },
  // "system" nao precisa estar presente
}
```

## Variacao: Record aninhado para permissoes

```typescript
type Role = "admin" | "editor" | "viewer"
type Resource = "posts" | "users" | "settings"
type Permission = "read" | "write" | "delete"

const permissions: Record<Role, Record<Resource, Permission[]>> = {
  admin: {
    posts: ["read", "write", "delete"],
    users: ["read", "write", "delete"],
    settings: ["read", "write", "delete"],
  },
  editor: {
    posts: ["read", "write"],
    users: ["read"],
    settings: ["read"],
  },
  viewer: {
    posts: ["read"],
    users: ["read"],
    settings: ["read"],
  },
}
```