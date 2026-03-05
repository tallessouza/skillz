# Code Examples: Deep Freeze

## Exemplo 1: Demonstração do problema (congelamento raso)

```javascript
const book = {
  title: "Objetos Imutáveis",
  category: "javascript",
  author: {
    name: "Rodrigo",
    email: "rodrigo@email.com"
  }
}

// Congelamento raso
Object.freeze(book)

// Primeiro nível: protegido
book.category = "CSS"
console.log(book.category) // "javascript" — não mudou

// Segundo nível: NÃO protegido
book.author.name = "João"
console.log(book.author.name) // "João" — MUTOU!
```

## Exemplo 2: Implementação completa do deepFreeze (da aula)

```javascript
function deepFreeze(object) {
  // Obtém um array com todas as propriedades do objeto
  const props = Reflect.ownKeys(object)

  // Itera sobre todas as propriedades do objeto
  for (const prop of props) {
    // Obtém o valor associado à propriedade atual
    const value = object[prop]

    // Verifica se o valor é um objeto ou função
    if (value && (typeof value === "object" || typeof value === "function")) {
      // Aplica deepFreeze recursivamente em objetos aninhados
      deepFreeze(value)
    }
  }

  // Retorna o objeto congelado
  return Object.freeze(object)
}

// Uso
const book = {
  title: "Objetos Imutáveis",
  category: "javascript",
  author: {
    name: "Rodrigo",
    email: "rodrigo@email.com"
  }
}

deepFreeze(book)

// Testando primeiro nível
book.category = "HTML"
console.log(book.category) // "javascript" — protegido

// Testando segundo nível
book.author.name = "João"
console.log(book.author.name) // "Rodrigo" — também protegido!
```

## Exemplo 3: Versão TypeScript com generics

```typescript
function deepFreeze<T extends Record<string, unknown>>(object: T): Readonly<T> {
  const props = Reflect.ownKeys(object)

  for (const prop of props) {
    const value = object[prop as keyof T]

    if (value && (typeof value === "object" || typeof value === "function")) {
      deepFreeze(value as Record<string, unknown>)
    }
  }

  return Object.freeze(object)
}
```

## Exemplo 4: Versão segura contra referências circulares

```javascript
function deepFreeze(object, visited = new WeakSet()) {
  if (visited.has(object)) return object
  visited.add(object)

  const props = Reflect.ownKeys(object)

  for (const prop of props) {
    const value = object[prop]

    if (value && (typeof value === "object" || typeof value === "function")) {
      deepFreeze(value, visited)
    }
  }

  return Object.freeze(object)
}

// Funciona mesmo com referência circular
const obj = { a: { b: null } }
obj.a.b = obj // referência circular
deepFreeze(obj) // não entra em loop infinito
```

## Exemplo 5: Deep freeze com arrays aninhados

```javascript
const config = {
  app: "MeuApp",
  features: ["auth", "dashboard", "reports"],
  database: {
    host: "localhost",
    ports: [5432, 5433],
    credentials: {
      user: "admin",
      password: "secret"
    }
  }
}

deepFreeze(config)

config.features.push("new-feature")     // TypeError em strict mode
config.database.ports[0] = 9999         // Falha silenciosa ou TypeError
config.database.credentials.user = "x"  // Falha silenciosa ou TypeError
```

## Exemplo 6: Comparação Object.keys vs Reflect.ownKeys

```javascript
const obj = {}
const sym = Symbol("hidden")

Object.defineProperty(obj, "secret", {
  value: { data: "sensitive" },
  enumerable: false
})
obj[sym] = { data: "symbolic" }
obj.visible = { data: "public" }

// Object.keys perde propriedades
console.log(Object.keys(obj)) // ["visible"]

// Reflect.ownKeys captura tudo
console.log(Reflect.ownKeys(obj)) // ["secret", "visible", Symbol(hidden)]
```