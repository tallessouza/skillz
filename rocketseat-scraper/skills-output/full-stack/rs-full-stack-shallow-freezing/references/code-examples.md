# Code Examples: Shallow Freezing com Object.freeze()

## Exemplo 1: Objeto simples da aula

```javascript
const book = {
  title: "Objetos Imutáveis",
  category: "JavaScript",
  author: {
    name: "Rodrigo",
    email: "rodrigo@email.com",
  },
}

// Sem freeze — mutacao funciona normalmente
book.category = "HTML"
console.log(book.category) // "HTML"
```

## Exemplo 2: Freeze aplicado — propriedade direta bloqueada

```javascript
const book = {
  title: "Objetos Imutáveis",
  category: "JavaScript",
  author: {
    name: "Rodrigo",
    email: "rodrigo@email.com",
  },
}

Object.freeze(book)

book.category = "CSS"
console.log(book.category) // "JavaScript" — nao mudou
```

## Exemplo 3: Freeze aplicado — objeto aninhado AINDA muta

```javascript
const book = {
  title: "Objetos Imutáveis",
  category: "JavaScript",
  author: {
    name: "Rodrigo",
    email: "rodrigo@email.com",
  },
}

Object.freeze(book)

book.author.name = "João"
console.log(book.author.name) // "João" — MUDOU! Shallow freeze nao protege nested
```

## Exemplo 4: Verificando se objeto esta frozen

```javascript
const config = { debug: false }
console.log(Object.isFrozen(config)) // false

Object.freeze(config)
console.log(Object.isFrozen(config)) // true
```

## Exemplo 5: Freeze em arrays

```javascript
const colors = ["red", "green", "blue"]
Object.freeze(colors)

colors.push("yellow")    // TypeError em strict mode, silencioso em sloppy
colors[0] = "purple"     // Ignorado
console.log(colors)      // ["red", "green", "blue"]
```

## Exemplo 6: Freeze nao reverte mutacoes anteriores

```javascript
const user = { name: "Ana", role: "admin" }

user.role = "viewer"     // Mutacao ANTES do freeze
Object.freeze(user)

user.role = "admin"      // Tentativa de reverter — bloqueada
console.log(user.role)   // "viewer" — ficou com a mutacao pre-freeze
```

## Exemplo 7: Strict mode com freeze

```javascript
"use strict"

const settings = { theme: "dark" }
Object.freeze(settings)

try {
  settings.theme = "light" // TypeError: Cannot assign to read only property
} catch (error) {
  console.error(error.message)
}
```

## Exemplo 8: Freeze manual em cada nivel (workaround)

```javascript
const book = {
  title: "Objetos Imutáveis",
  category: "JavaScript",
  author: {
    name: "Rodrigo",
    email: "rodrigo@email.com",
  },
}

Object.freeze(book)
Object.freeze(book.author) // Congela o objeto aninhado tambem

book.author.name = "João"
console.log(book.author.name) // "Rodrigo" — agora sim, protegido
```

## Variacao: TypeScript com as const

```typescript
const book = {
  title: "Objetos Imutáveis",
  category: "JavaScript",
  author: {
    name: "Rodrigo",
    email: "rodrigo@email.com",
  },
} as const

// TypeScript impede em compile-time:
// book.category = "CSS"  // Error: Cannot assign to 'category' because it is a read-only property
// book.author.name = "João"  // Error: Cannot assign to 'name' because it is a read-only property

// Mas `as const` e apenas type-level — em runtime, o objeto ainda e mutavel!
// Para protecao em runtime, combine com Object.freeze()
```