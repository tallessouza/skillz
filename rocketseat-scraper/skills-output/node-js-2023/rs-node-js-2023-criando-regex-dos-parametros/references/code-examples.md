# Code Examples: Criando RegEx dos Parâmetros de Rota

## 1. A RegEx base

```javascript
// Dentro do JavaScript, regex é delimitada por barras
const routeParametersRegex = /:([a-zA-Z]+)/g

// Testando com diferentes paths:
// '/users'              → nenhum match (array vazio)
// '/users/:id'          → 1 match: [':id', 'id']
// '/users/:userId/groups/:groupId' → 2 matches
```

## 2. Função buildRoutePath completa (como na aula)

```javascript
// src/utils/build-route-path.js
export function buildRoutePath(path) {
  // path chega como: '/users/:id'
  const routeParametersRegex = /:([a-zA-Z]+)/g

  // matchAll retorna um iterator, não array
  // Array.from converte para array inspecionável
  const parameters = Array.from(path.matchAll(routeParametersRegex))

  console.log(parameters)
  // Para '/users/:id':
  // [
  //   [':id', 'id', index: 7, input: '/users/:id', groups: undefined]
  // ]

  // Para '/users/:userId/groups/:groupId':
  // [
  //   [':userId', 'userId', index: 7, ...],
  //   [':groupId', 'groupId', index: 24, ...]
  // ]
}
```

## 3. Uso nas rotas do servidor

```javascript
import { buildRoutePath } from './utils/build-route-path.js'

// Cada path é envolvido por buildRoutePath
const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (req, res) => { /* ... */ }
  },
  {
    method: 'POST',
    path: buildRoutePath('/users'),
    handler: (req, res) => { /* ... */ }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => { /* ... */ }
  },
]
```

## 4. Demonstração do problema sem Array.from

```javascript
const path = '/users/:id'
const regex = /:([a-zA-Z]+)/g

// ERRADO — output ilegível
console.log(path.matchAll(regex))
// Output: Object [RegExp String Iterator] {}

// ERRADO — JSON.stringify não ajuda
console.log(JSON.stringify(path.matchAll(regex)))
// Output: {}

// CORRETO — Array.from converte para array
console.log(Array.from(path.matchAll(regex)))
// Output: [[':id', 'id', index: 7, input: '/users/:id', groups: undefined]]
```

## 5. Diferença com e sem flag `g`

```javascript
const path = '/users/:userId/groups/:groupId'

// SEM flag g — só encontra o primeiro
const regexSemG = /:([a-zA-Z]+)/
console.log(path.match(regexSemG))
// [':userId', 'userId'] — groupId é ignorado

// COM flag g — encontra todos
const regexComG = /:([a-zA-Z]+)/g
console.log(Array.from(path.matchAll(regexComG)))
// [[':userId', 'userId', ...], [':groupId', 'groupId', ...]]
```

## 6. Diferença com e sem parênteses (grupo de captura)

```javascript
const path = '/users/:id'

// COM parênteses — acesso ao nome limpo
const regexComGrupo = /:([a-zA-Z]+)/g
const match = Array.from(path.matchAll(regexComGrupo))
console.log(match[0][0]) // ':id' (match completo)
console.log(match[0][1]) // 'id'  (grupo de captura — nome limpo!)

// SEM parênteses — só o match completo
const regexSemGrupo = /:[a-zA-Z]+/g
const match2 = Array.from(path.matchAll(regexSemGrupo))
console.log(match2[0][0]) // ':id'
console.log(match2[0][1]) // undefined — sem grupo de captura!
```

## 7. Estrutura de pastas criada

```
src/
├── server.js
├── routes.js
└── utils/
    └── build-route-path.js   ← nova função utilitária
```