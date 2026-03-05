# Deep Explanation: Listando Pedidos com Joins

## Por que qualificar colunas com nome da tabela?

Quando você faz um `SELECT` em uma única tabela, pode usar o nome da coluna diretamente: `SELECT id, name FROM products`. Porém, no momento que você conecta duas tabelas com JOIN, ambas podem ter colunas com o mesmo nome (ex: `id`, `created_at`, `price`).

O banco de dados não sabe qual `id` você quer — o da tabela `orders` ou o da tabela `products`? Isso gera um **erro de ambiguidade**. A solução é sempre prefixar: `orders.id`, `products.id`.

O instrutor enfatiza que mesmo quando não há ambiguidade real (ex: só `products` tem `name`), é boa prática qualificar todas as colunas quando há join, porque:
- Outra pessoa lendo a query sabe imediatamente de onde vem cada dado
- Se alguém adicionar uma coluna homônima em outra tabela no futuro, a query não quebra

## O insight do preço temporal

Este é o ponto mais sutil da aula. Existem dois preços:

1. **`products.price`** — o preço ATUAL do produto (pode ter sido atualizado)
2. **`orders.price`** — o preço registrado NO MOMENTO do pedido

Se você traz `products.price`, está mostrando o preço de hoje, não o que o cliente pagou. O instrutor destaca: "a gente está mostrando o preço que foi registrado no momento do pedido, não o do produto, que pode pegar um preço mais atualizado."

Isso é um padrão comum em sistemas de e-commerce e PDV: **sempre armazene o preço no registro do pedido** e consulte esse valor, nunca o valor atual do catálogo.

## Por que não validar sessão inexistente?

O instrutor toma uma decisão pragmática: se a sessão não existe, a query simplesmente retorna um array vazio. Não precisa fazer uma consulta adicional para verificar se a sessão existe antes de buscar os pedidos.

Raciocínio: "só de retornar nada, a gente vai entender que a sessão de fato não existe, então a gente não precisa fazer esse tipo de validação aqui."

Isso reduz complexidade e uma ida ao banco desnecessária. Em APIs REST, retornar `200 []` para uma coleção vazia é perfeitamente válido.

## Parâmetros de rota específicos

O instrutor começa com `:id` genérico e depois refatora para `:table_session_id`. O raciocínio: "esse ID está muito genérico". Ao nomear o parâmetro com o que ele realmente representa, o código se auto-documenta e evita confusão quando a rota tiver múltiplos identificadores.

## Ordem: JOIN antes de WHERE

O instrutor coloca o `.join()` antes do `.where()`. Isso é importante porque:
- Logicamente, primeiro você conecta as tabelas, depois filtra os resultados
- Alguns query builders podem ter comportamento inesperado se o filtro referencia colunas da tabela que ainda não foi conectada