# Code Examples: Rest Params em JavaScript

## Exemplo 1: Funcao basica com um parametro vs rest

O instrutor comeca com uma funcao simples recebendo apenas `a`:

```javascript
// Sem rest — so captura o primeiro argumento
function values(a) {
  console.log(a)
}

values(2, 1, 3) // 2 — perdeu 1 e 3
```

Depois adiciona rest para capturar o restante:

```javascript
// Com parametro nomeado + rest
function values(a, ...rest) {
  console.log(a)       // 2
  console.log(rest)    // [1, 3]
  console.log(...rest) // 1 3
}

values(2, 1, 3)
```

## Exemplo 2: Rest coletando TODOS os parametros

Removendo o parametro `a` e usando apenas rest:

```javascript
function values(...rest) {
  console.log(...rest) // valores espalhados
}

values(2, 1, 3, 4) // 2 1 3 4
values(2, 1, 3)    // 2 1 3
values(2)          // 2
```

## Exemplo 3: Visualizando como array vs espalhado

```javascript
function values(...rest) {
  console.log(rest)    // [2, 1, 3, 4] — como array
  console.log(...rest) // 2 1 3 4 — espalhado (spread)
}

values(2, 1, 3, 4)
```

## Exemplo 4: Acessando .length do rest

```javascript
function values(...rest) {
  console.log(rest.length) // quantidade de parametros
}

values(2, 1, 3, 4) // 4
values(2, 1, 3)    // 3
```

## Exemplo 5: Renomeando rest para args

```javascript
function values(...args) {
  console.log(args.length)
  console.log(args)
  console.log(...args)
}

values(2, 1, 3)
// 3
// [2, 1, 3]
// 2 1 3
```

## Exemplo 6: Parametro nomeado + rest (caso de uso real)

O instrutor menciona o padrao de ter um parametro como `title` e o rest para o restante:

```javascript
function createEntry(title, ...rest) {
  console.log('Titulo:', title)
  console.log('Outros params:', rest)
}

createEntry('Meu Post', 'tag1', 'tag2', 'draft')
// Titulo: Meu Post
// Outros params: ['tag1', 'tag2', 'draft']
```

## Variacoes praticas (alem da aula)

### Sum com rest

```javascript
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0)
}

sum(10, 20, 30) // 60
sum(5)           // 5
sum()            // 0
```

### Wrapper que repassa argumentos

```javascript
function logAndExecute(fn, ...args) {
  console.log('Chamando com:', args)
  return fn(...args)
}

logAndExecute(Math.max, 1, 5, 3) // 5
```

### Merge de objetos com rest

```javascript
function mergeConfigs(base, ...overrides) {
  return Object.assign({}, base, ...overrides)
}

mergeConfigs(
  { theme: 'light' },
  { lang: 'pt' },
  { theme: 'dark' }
)
// { theme: 'dark', lang: 'pt' }
```

### Primeiro e restante (destructuring + rest)

```javascript
function processQueue(...tasks) {
  const [first, ...remaining] = tasks
  console.log('Processando:', first)
  console.log('Na fila:', remaining)
}

processQueue('email', 'sms', 'push')
// Processando: email
// Na fila: ['sms', 'push']
```