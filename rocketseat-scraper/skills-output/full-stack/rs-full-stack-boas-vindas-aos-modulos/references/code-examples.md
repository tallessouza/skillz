# Code Examples: Módulos JavaScript

## Exemplo 1: Projeto sem módulos (problema)

```javascript
// app.js — arquivo único que faz tudo
const users = []

function createUser(name, email) {
  if (!email.includes('@')) {
    throw new Error('Email inválido')
  }
  const user = { id: users.length + 1, name, email }
  users.push(user)
  return user
}

function findUser(id) {
  return users.find(user => user.id === id)
}

function formatUser(user) {
  return `${user.name} <${user.email}>`
}

// Uso direto no mesmo arquivo
const joao = createUser('João', 'joao@email.com')
console.log(formatUser(joao))
```

**Problema:** Validação, dados, lógica e formatação tudo junto. Se precisar reutilizar `formatUser` em outro lugar, não consegue.

## Exemplo 2: Mesmo projeto com módulos (solução)

```javascript
// validation.js
export function validateEmail(email) {
  return email.includes('@')
}
```

```javascript
// users.js
import { validateEmail } from './validation.js'

const users = []

export function createUser(name, email) {
  if (!validateEmail(email)) {
    throw new Error('Email inválido')
  }
  const user = { id: users.length + 1, name, email }
  users.push(user)
  return user
}

export function findUser(id) {
  return users.find(user => user.id === id)
}
```

```javascript
// formatters.js
export function formatUser(user) {
  return `${user.name} <${user.email}>`
}
```

```javascript
// main.js
import { createUser } from './users.js'
import { formatUser } from './formatters.js'

const joao = createUser('João', 'joao@email.com')
console.log(formatUser(joao))
```

## Exemplo 3: Estrutura de pastas para projeto maior

```
src/
├── models/
│   └── user.js          // estrutura de dados
├── services/
│   └── userService.js   // lógica de negócio
├── utils/
│   ├── validation.js    // validações genéricas
│   └── formatters.js    // formatação de saída
└── main.js              // ponto de entrada
```

## Habilitando ES Modules no Node.js

```json
// package.json
{
  "type": "module"
}
```

Ou usar extensão `.mjs` nos arquivos. Sem isso, Node.js trata arquivos como CommonJS por padrão.