# Code Examples: Separando Parâmetros de Query String

## Exemplo completo da aula

### extractQueryParams.js

```javascript
// src/utils/extract-query-params.js
export function extractQueryParams(query) {
  return query.slice(1)
    .split('&')
    .reduce((queryParams, param) => {
      const [key, value] = param.split('=')
      queryParams[key] = value
      return queryParams
    }, {})
}
```

### Uso no route handler (middleware)

```javascript
import { extractQueryParams } from './utils/extract-query-params.js'

// Dentro do middleware que processa a requisição:
const [path, query] = request.url.split('?')

// Injeta query params no request
request.query = query
  ? extractQueryParams('?' + query) // a função espera a string com ?
  : {}
```

**Nota:** dependendo de como a URL foi separada previamente, o `query` pode ou não conter o `?`. A função `extractQueryParams` espera receber com o `?` para usar `slice(1)`.

### Uso na rota

```javascript
// src/routes.js
export const routes = [
  {
    method: 'GET',
    path: '/product',
    handler: (request, response) => {
      // Query params são opcionais — não precisa declarar na rota
      // Ex: GET /product?categoria=computador&preco=500
      return response.end(JSON.stringify(request.query))
      // Retorna: {"categoria":"computador","preco":"500"}
    }
  }
]
```

## Visualização passo a passo

```javascript
const query = '?categoria=computador&preco=500'

// Passo 1: slice(1)
query.slice(1)
// → 'categoria=computador&preco=500'

// Passo 2: split('&')
'categoria=computador&preco=500'.split('&')
// → ['categoria=computador', 'preco=500']

// Passo 3: reduce — iteração 1
// queryParams = {}, param = 'categoria=computador'
// split('=') → ['categoria', 'computador']
// queryParams = { categoria: 'computador' }

// Passo 3: reduce — iteração 2
// queryParams = { categoria: 'computador' }, param = 'preco=500'
// split('=') → ['preco', '500']
// queryParams = { categoria: 'computador', preco: '500' }
```

## Variações e edge cases

### Query com valor vazio

```javascript
// URL: /search?q=&page=1
extractQueryParams('?q=&page=1')
// → { q: '', page: '1' }
// split('=') de 'q=' → ['q', ''] — funciona corretamente
```

### Query com um único parâmetro

```javascript
// URL: /users?active=true
extractQueryParams('?active=true')
// → { active: 'true' }
// split('&') de 'active=true' → ['active=true'] — array com 1 item
```

### Versão com decodeURIComponent (para caracteres especiais)

```javascript
export function extractQueryParams(query) {
  return query.slice(1)
    .split('&')
    .reduce((queryParams, param) => {
      const [key, value] = param.split('=')
      queryParams[decodeURIComponent(key)] = decodeURIComponent(value)
      return queryParams
    }, {})
}

// URL: /search?nome=Jo%C3%A3o&cidade=S%C3%A3o%20Paulo
// → { nome: 'João', cidade: 'São Paulo' }
```

### Versão com conversão de tipos

```javascript
export function extractQueryParams(query) {
  return query.slice(1)
    .split('&')
    .reduce((queryParams, param) => {
      const [key, rawValue] = param.split('=')
      const value = decodeURIComponent(rawValue)
      
      // Converte números e booleanos
      if (value === 'true') queryParams[key] = true
      else if (value === 'false') queryParams[key] = false
      else if (!isNaN(value) && value !== '') queryParams[key] = Number(value)
      else queryParams[key] = value
      
      return queryParams
    }, {})
}

// URL: /product?preco=500&disponivel=true&nome=notebook
// → { preco: 500, disponivel: true, nome: 'notebook' }
```

### Teste no Insomnia/terminal

```bash
# Requisição com query params:
curl "http://localhost:3333/product?categoria=computador&preco=500"

# Resposta esperada:
# {"categoria":"computador","preco":"500"}

# Sem query params (fallback para {}):
curl "http://localhost:3333/product"

# Resposta esperada:
# {}
```