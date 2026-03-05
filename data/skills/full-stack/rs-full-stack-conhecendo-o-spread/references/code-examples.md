# Code Examples: Spread Operator

## Exemplo 1: Expandir array no console (da aula)

```typescript
const numbers = [1, 2, 3]

// Sem spread — mostra como array
console.log(numbers) // [1, 2, 3]

// Com spread — mostra elementos separados
console.log(...numbers) // 1 2 3
```

## Exemplo 2: Array de objetos (da aula)

```typescript
const users = [
  { name: 'rodrigo', email: 'rodrigo@email.com', avatar: 'r.png' },
  { name: 'joao', email: 'joao@email.com', avatar: 'j.png' },
]

// Sem spread
console.log(users) // [{...}, {...}] como array

// Com spread — objetos separados
console.log(...users) // {name: 'rodrigo'...} {name: 'joao'...}
```

## Exemplo 3: Combinar arrays

```typescript
const frontend = ['React', 'Vue', 'Angular']
const backend = ['Node', 'Express', 'Fastify']
const fullstack = [...frontend, ...backend]
// ['React', 'Vue', 'Angular', 'Node', 'Express', 'Fastify']
```

## Exemplo 4: Adicionar elemento mantendo imutabilidade

```typescript
const tasks = ['tarefa 1', 'tarefa 2']

// Adicionar no final
const withNew = [...tasks, 'tarefa 3']

// Adicionar no início
const withFirst = ['tarefa 0', ...tasks]

// Inserir no meio
const withMiddle = [...tasks.slice(0, 1), 'tarefa 1.5', ...tasks.slice(1)]
```

## Exemplo 5: Clonar objeto e sobrescrever propriedades

```typescript
const user = { name: 'rodrigo', email: 'rodrigo@email.com', avatar: 'r.png' }

// Atualizar email mantendo o resto
const updated = { ...user, email: 'novo@email.com' }
// { name: 'rodrigo', email: 'novo@email.com', avatar: 'r.png' }
```

## Exemplo 6: Defaults + overrides

```typescript
const defaultConfig = {
  host: 'localhost',
  port: 3000,
  debug: false,
}

const userConfig = {
  port: 8080,
  debug: true,
}

const finalConfig = { ...defaultConfig, ...userConfig }
// { host: 'localhost', port: 8080, debug: true }
```

## Exemplo 7: Spread com strings

```typescript
const word = 'spread'
const letters = [...word]
// ['s', 'p', 'r', 'e', 'a', 'd']
```

## Exemplo 8: Spread como argumentos de função

```typescript
const coordinates = [10, 20, 30]

function setPosition(x: number, y: number, z: number) {
  console.log(`x: ${x}, y: ${y}, z: ${z}`)
}

setPosition(...coordinates) // x: 10, y: 20, z: 30
```

## Exemplo 9: Remover propriedade de objeto (spread + rest)

```typescript
const user = { name: 'rodrigo', password: '123', email: 'r@email.com' }
const { password, ...safeUser } = user
// safeUser = { name: 'rodrigo', email: 'r@email.com' }
```

## Exemplo 10: Merge condicional

```typescript
const baseUser = { name: 'rodrigo', role: 'user' }
const isAdmin = true

const user = {
  ...baseUser,
  ...(isAdmin && { role: 'admin', permissions: ['all'] }),
}
```