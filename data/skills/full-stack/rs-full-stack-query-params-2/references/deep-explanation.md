# Deep Explanation: Query Parameters no Express

## Por que o Express simplifica tanto?

No Node.js puro, para recuperar query parameters voce precisava:
1. Pegar `req.url`
2. Usar `new URL()` ou expressao regular para separar a query string
3. Fazer parsing manual dos pares chave=valor
4. Inserir manualmente no objeto de requisicao

O Express faz todo esse trabalho automaticamente. Quando uma requisicao chega com `?page=1&limit=10`, o Express ja popula `req.query` com `{ page: '1', limit: '10' }`. Zero configuracao.

## Query Parameters vs Route Parameters

O instrutor destaca uma diferenca fundamental:

**Route params (`:id`)** fazem parte da rota. Se voce define `/products/:id` e faz uma requisicao para `/products` (sem o id), o Express **nao encontra a rota** — retorna 404. Sao obrigatorios.

**Query params (`?page=1`)** sao opcionais. A rota `/products` funciona tanto com `GET /products` quanto com `GET /products?page=1&limit=10`. A rota e a mesma, os parametros sao extras.

### Analogia pratica

Pense em route params como o endereco de uma casa (obrigatorio para chegar la) e query params como instrucoes de entrega (opcionais — "deixe na portaria", "toque 2x"). A entrega acontece com ou sem as instrucoes.

## Anatomia de uma URL com query params

```
GET /products?page=1&limit=10
     |______| |_______________|
      rota     query string

Parsed pelo Express:
req.query = { page: '1', limit: '10' }
```

- `?` marca o inicio dos query parameters
- `&` separa parametros multiplos
- Formato: `chave=valor`
- Tudo chega como **string** — conversao e responsabilidade do desenvolvedor

## Caso de uso classico: Paginacao

O exemplo do instrutor usa paginacao como caso de uso perfeito para query params:
- `page` — qual pagina o usuario quer ver
- `limit` — quantos itens por pagina

Isso faz sentido porque:
1. Sao opcionais (sem eles, retorne a primeira pagina com limite default)
2. Nao identificam um recurso especifico (diferente de `/products/123`)
3. Sao combinaveis (voce pode ter page + limit + search + category)

## Desestruturacao direta

O instrutor mostra que voce pode desestruturar `req.query` diretamente:

```javascript
const { page, limit } = req.query
```

Ou desestruturar o proprio `req`:

```javascript
const { query } = req
// query.page, query.limit
```

Ambos funcionam. A primeira forma e mais direta quando voce sabe quais params espera.

## Armadilha dos tipos

Um ponto critico que o instrutor nao aprofunda mas e essencial: **todos os valores de `req.query` sao strings**. Se voce fizer `page + 1` onde `page = '1'`, vai obter `'11'` (concatenacao de string), nao `2`.

Sempre converta:
```javascript
const pageNumber = Number(page) // ou parseInt(page, 10)
```