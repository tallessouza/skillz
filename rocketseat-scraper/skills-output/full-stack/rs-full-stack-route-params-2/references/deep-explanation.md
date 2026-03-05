# Deep Explanation: Route Params no Express

## Por que route params existem

Em Node puro, para extrair um segmento dinamico da URL (como o ID de um produto), voce precisava:

1. Parsear a URL manualmente
2. Criar uma expressao regular que correspondesse ao padrao esperado
3. Testar a URL contra a regex
4. Extrair os grupos de captura
5. Tratar erros de matching

O Express abstrai tudo isso com uma sintaxe declarativa: `:nomeDoParametro`. Quando o Express ve dois pontos seguidos de um nome na definicao da rota, ele automaticamente:
- Cria o pattern matching interno
- Extrai o valor do segmento da URL
- Disponibiliza em `request.params` como um objeto chave-valor

## Como o Express resolve internamente

Quando voce define `app.get("/products/:id")`, o Express internamente converte isso em algo equivalente a uma regex `^\/products\/([^\/]+)$` e mapeia o grupo de captura para a chave `id` no objeto `request.params`.

## Multiplos parametros

Voce pode encadear quantos parametros quiser na rota. Cada `:nome` vira uma chave em `request.params`:

```
Rota:   /products/:id/users/:userId
URL:    /products/42/users/rodrigo
Params: { id: "42", userId: "rodrigo" }
```

O instrutor demonstrou isso passando `/products/set/rodrigo` com a rota `/products/:id/:user`, mostrando que ambos os valores sao extraidos corretamente.

## Ponto importante: dois pontos so na definicao

Os dois pontos (`:`) sao usados APENAS na definicao da rota. Ao recuperar o valor com `request.params`, voce usa o nome sem os dois pontos. Isso e um ponto de confusao comum para iniciantes.

## Comparacao direta: Node puro vs Express

O instrutor enfatizou a diferenca dramatica de complexidade. O que em Node puro exigia expressao regular, verificacao de padrao e tratamento de dados, no Express se resume a:
1. Colocar `:nome` na rota
2. Desestruturar de `request.params`

Essa e uma das maiores vantagens de usar um framework como Express — abstrair operacoes repetitivas e propensas a erro.

## Todos os parametros sao strings

Importante: `request.params` sempre retorna strings. Se voce precisa de um numero, faca a conversao explicitamente (`Number(id)` ou `parseInt(id, 10)`).

## Route params vs Query params

- **Route params** (`:id`): identificam um recurso especifico, sao obrigatorios na URL
- **Query params** (`?key=value`): filtros opcionais, paginacao, ordenacao