# Code Examples: Obtendo Parâmetros Nomeados

## Exemplo 1: parseRoutePath original (só route params)

```javascript
// src/utils/parseRoutePath.js — versão anterior
function parseRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const params = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\\-_]+)')
  const pathRegex = new RegExp(`^${params}$`)
  return pathRegex
}
```

Essa versão só captura route params como `:id`. Se a URL tiver query string (`?page=3`), o match falha.

## Exemplo 2: parseRoutePath com query params (aula atual)

```javascript
// src/utils/parseRoutePath.js — versão atualizada
function parseRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const params = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\\-_]+)')

  // Adiciona captura de query params como grupo nomeado "query"
  const pathRegex = new RegExp(`^${params}(?<query>\\?(.*))?$`)
  return pathRegex
}
```

Mudanças:
1. Template literal envolve a expressão
2. `(?<query>\\?(.*))?` adicionado antes do `$`
3. O grupo é opcional (`?` no final) — URLs sem query string continuam funcionando

## Exemplo 3: Uso no route handler (middleware)

```javascript
// src/middlewares/routeHandler.js
function routeHandler(request, response) {
  const route = routes.find(route => {
    return route.method === request.method && route.path.test(request.url)
  })

  if (route) {
    const routeParams = request.url.match(route.path)
    console.log(routeParams.groups)
    // { id: '123', query: '?category=computer&price=5000' }

    request.params = routeParams.groups
  }
}
```

## Exemplo 4: Testando diferentes URLs

```javascript
const regex = parseRoutePath('/products/:id')

// Com route param e query params
'/products/123?page=3&category=computer'.match(regex)
// groups: { id: '123', query: '?page=3&category=computer' }

// Só route param, sem query
'/products/123'.match(regex)
// groups: { id: '123', query: undefined }

// Com um só query param
'/products/456?category=computer'.match(regex)
// groups: { id: '456', query: '?category=computer' }
```

## Exemplo 5: Anatomia do escape de caracteres

```javascript
// Em regex literal:
/\?/           // match literal ?

// Em new RegExp (string):
new RegExp('\\?')  // a string '\\?' vira a regex /\?/

// Em template literal:
new RegExp(`(?<query>\\?(.*))?$`)
// \\? → \? na regex → match literal ?
// (.*) → qualquer caractere
// ? após ) → grupo opcional
// $ → fim da string
```

## Exemplo 6: O que cada parte captura

```javascript
const url = '/products/abc-123?category=computer&price=5000'
const regex = /^\/products\/(?<id>[a-z0-9\-_]+)(?<query>\?(.*))?$/

const match = url.match(regex)

match[0]           // '/products/abc-123?category=computer&price=5000' (match completo)
match.groups.id    // 'abc-123' (route param)
match.groups.query // '?category=computer&price=5000' (query string inteira)
match[3]           // 'category=computer&price=5000' (sem o ?, grupo interno sem nome)
```