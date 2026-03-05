# Deep Explanation: Criar e Buscar Carrinho com Agregacao JSON

## Por que duas etapas de insercao?

O carrinho (`carts`) e os itens (`cart_items`) sao entidades separadas com relacionamento 1:N. O item precisa de um `cart_id` valido — que so existe apos o INSERT do carrinho. Por isso a ordem e obrigatoria: cart primeiro, cart_items depois.

Alem disso, o carrinho precisa de um `store_id` que vem do produto. Entao ha uma dependencia transitiva: para criar o carrinho, precisa do produto; para criar o item, precisa do carrinho. A sequencia completa e:

1. SELECT produto → obter store_id
2. INSERT cart (user_id, store_id) → RETURNING id
3. INSERT cart_item (cart_id, product_id, quantity)

## A sacada do JSON_AGG

O instrutor destaca um problema classico de joins SQL: quando um carrinho tem 3 itens, o SELECT com JOIN retorna 3 linhas, todas com o mesmo `cart.id`. Para uma API REST, isso e inutil — o consumidor espera um objeto com um array de itens.

A solucao PostgreSQL e usar duas funcoes juntas:
- **JSON_BUILD_OBJECT**: constroi um objeto JSON a partir de pares chave-valor
- **JSON_AGG**: agrega multiplas linhas em um array JSON

Combinadas com GROUP BY, transformam N linhas de join em 1 linha por carrinho com um array `items`.

O instrutor enfatiza que **esqueceu o GROUP BY na primeira tentativa** e o teste pegou o erro — mostrando que testes sao fundamentais para pegar esse tipo de esquecimento.

## Analogia com o catalogo

O instrutor menciona que esse mesmo padrao de JSON_AGG ja foi usado na aula do catalogo de produtos. E um padrao recorrente no projeto: sempre que ha relacao 1:N e a API precisa retornar dados aninhados, a solucao e a mesma.

## Limpeza de testes com TRUNCATE

O instrutor encontrou um bug nos testes: cada execucao criava novos carrinhos sem limpar os anteriores, fazendo o ID esperado mudar. A solucao foi:

1. Obter a instancia do PostgreService via container de dependencias
2. No `afterEach`, executar TRUNCATE nas tabelas `carts` e `cart_items`
3. Manter `products` intacto (dados de referencia)

Isso garante isolamento entre testes — cada teste comeca com banco limpo.

## Tipagem minima

Ao buscar o produto so para obter `store_id`, o instrutor nao usa a tipagem completa do produto. Cria um tipo inline `{ store_id: string }` — porque so precisa desse campo. Isso evita importar ou criar interfaces desnecessarias para queries auxiliares.