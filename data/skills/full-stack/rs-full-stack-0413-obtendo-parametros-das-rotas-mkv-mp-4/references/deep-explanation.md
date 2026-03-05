# Deep Explanation: Obtendo Parâmetros das Rotas

## Por que extrair manualmente?

Em Node.js puro (sem Express, Fastify, etc.), a URL chega como string crua em `request.url`. Não existe `req.query` pronto — você precisa construir esse mecanismo. Isso é fundamental para entender como frameworks fazem por baixo dos panos.

## O pipeline de extração: slice → split → reduce

O instrutor constrói o parser em 3 etapas encadeadas, cada uma com propósito claro:

### 1. `slice(1)` — Remover o `?`

A query string chega como `?status=open`. O `?` é um delimitador da URL, não faz parte dos dados. `slice(1)` remove o primeiro caractere (índice 0 é o `?`).

Por que não `replace('?', '')`? Porque `replace` só remove a primeira ocorrência e poderia haver `?` em valores encodados. `slice(1)` é cirúrgico — remove exatamente a posição 0.

### 2. `split('&')` — Separar múltiplos parâmetros

Query strings usam `&` como delimitador entre pares: `?status=open&page=2&sort=name`. O `split('&')` transforma em array: `['status=open', 'page=2', 'sort=name']`.

O instrutor enfatiza: "pode ser que tenha outro parâmetro aqui para frente e aí junta-se com &. Então só para garantir vamos dividir." — mesmo com um parâmetro, o split funciona corretamente retornando array de 1 elemento.

### 3. `reduce` — Montar o objeto

O reduce percorre cada item do array, desestrutura com `split('=')` em `[key, value]`, e acumula no objeto. O acumulador inicial é `{}`.

```javascript
// Passo a passo mental:
// Iteração 1: params={}, param='status=open' → params={status:'open'}
// Iteração 2: params={status:'open'}, param='page=2' → params={status:'open', page:'2'}
```

## Regex groups para captura

O `request.url.match(route.path)` usa a regex definida na rota. O padrão inclui named groups:

```javascript
// A regex da rota transforma /users/:id em algo como:
// /^\/users\/(?<id>[a-z0-9-]+)(?<query>\?.+)?$/
```

O `match` retorna um objeto com propriedade `groups` contendo os named captures. O instrutor mostra que ao desestruturar `routeParams.groups` você acessa diretamente os parâmetros capturados.

## Verificação de existência

A query string é opcional — nem toda requisição tem `?params`. O ternário garante graceful degradation:

```javascript
request.query = query ? extractQueryParams(query) : {}
```

Sem essa verificação, `extractQueryParams(undefined)` causaria erro em `undefined.slice(1)`.

## Por que separar em módulo utilitário?

O instrutor cria o arquivo em `utils/extract-query-params.js` separado do route handler. Razões:

1. **Reutilização** — toda rota que precisar de query params usa a mesma função
2. **Testabilidade** — função pura, fácil de testar unitariamente
3. **Separação de responsabilidades** — o handler lida com lógica de negócio, não com parsing de URL

## Atribuição em `request.query`

O instrutor adiciona uma propriedade `query` diretamente no objeto `request`. Em Node.js puro, o request é um objeto mutável — você pode adicionar propriedades. Isso simula o que frameworks como Express fazem automaticamente com `req.query`.