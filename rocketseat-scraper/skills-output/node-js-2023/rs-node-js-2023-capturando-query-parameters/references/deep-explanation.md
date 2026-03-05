# Deep Explanation: Capturando Query Parameters

## Tres formas de receber informacoes em uma API

O instrutor reforça que existem tres mecanismos distintos de envio de dados para uma API HTTP:

1. **Route Parameters** — parametros nomeados na URL (`/users/:id`), obrigatorios, identificam recursos
2. **Request Body** — dados enviados no corpo da requisicao (JSON, form-data), usado para criacao/atualizacao
3. **Query Parameters** — parametros opcionais apos `?` na URL, usados para filtragem, paginacao, ordenacao

A distincao principal: route params sao **obrigatorios** e identificam UM recurso. Query params sao **opcionais** e modificam COMO a listagem e retornada.

## Por que regex para capturar query params?

Como o servidor HTTP esta sendo construido do zero (sem Express/Fastify), toda a logica de roteamento usa regex. O `buildRoutePath` ja converte patterns como `/users/:id` em regex com grupos nomeados. Agora, a regex precisa tambem capturar a query string.

### A regex explicada: `(?<query>\\?(.*))?$`

- `(` — abre grupo externo
- `?<query>` — nomeia o grupo como "query" (acessivel via `groups.query`)
- `\\?` — literal `?` (escapado porque `?` e metacaractere regex)
- `(.*)` — captura tudo depois do `?` (`.` = qualquer caractere, `*` = zero ou mais vezes)
- `)` — fecha grupo externo
- `?` — torna o grupo inteiro OPCIONAL (a rota funciona com ou sem query string)
- `$` — ancora no fim da string (nada pode existir depois)

### Por que o grupo e opcional?

Query parameters sao, por natureza, opcionais. Uma rota `GET /users` deve funcionar tanto como `/users` quanto como `/users?search=Diego`. Se o grupo regex nao fosse opcional, a rota sem query string nao daria match.

## A funcao extractQueryParams — passo a passo

### Input
String no formato: `?search=Diego&page=2`

### Passo 1: `substr(1)`
Remove o `?` inicial → `search=Diego&page=2`

### Passo 2: `split('&')`
Separa pelo `&` → `['search=Diego', 'page=2']`

### Passo 3: `reduce`
Itera sobre cada item do array, transformando em objeto:
- `'search=Diego'` → `split('=')` → `['search', 'Diego']` → `{ search: 'Diego' }`
- `'page=2'` → `split('=')` → `['page', '2']` → `{ search: 'Diego', page: '2' }`

O `reduce` comeca com `{}` (objeto vazio) e vai adicionando propriedades a cada iteracao.

### Por que reduce e nao map?

`map` transforma array em array. `reduce` transforma array em qualquer coisa — neste caso, um objeto. E a ferramenta certa quando voce quer "achatar" uma lista em uma estrutura diferente.

## Separacao de concerns: query vs route params

O instrutor destaca a importancia de separar query params de route params na desestruturacao:

```javascript
const { query, ...params } = route.params.groups
```

Isso garante que `req.params` contem apenas route params (como `id`) e `req.query` contem apenas query params (como `search`, `page`). Misturar os dois num unico objeto causaria confusao.

## O fallback para objeto vazio

```javascript
req.query = query ? extractQueryParams(query) : {}
```

Se a rota for chamada sem query string, `query` sera `undefined`. Passar `undefined` para `extractQueryParams` causaria erro em `substr(1)`. O ternario garante que `req.query` sempre sera um objeto, facilitando o uso no handler:

```javascript
// Seguro — req.query sempre e objeto
const { search } = req.query
```

## Nota do instrutor sobre regex

O instrutor reconhece que regex e um tema profundo e recomenda praticar com jogos e exercicios online de regex. O foco do modulo e Node.js, nao regex, entao a implementacao e funcional mas nao cobre todos os edge cases (como valores com caracteres especiais encoded).