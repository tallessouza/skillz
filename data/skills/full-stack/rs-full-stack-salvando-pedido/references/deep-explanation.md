# Deep Explanation: Salvando Pedido

## Por que snapshot de preço é crítico

O instrutor destaca um padrão fundamental de e-commerce e sistemas de restaurante: **o preço no momento do pedido deve ser salvo como valor concreto, não como referência**.

A analogia é simples: imagine que um prato custa R$100 hoje. O cliente faz o pedido. Amanhã o restaurante muda o preço para R$120. Se o sistema calcula o total do pedido fazendo JOIN com a tabela de produtos, o cliente seria cobrado R$120 por algo que custava R$100 quando pediu.

Por isso, `product.price` é copiado para `orders.price` no momento do insert. A tabela `products` continua tendo o preço atualizado (para novos pedidos), e a tabela `orders` tem o preço histórico fiel.

## Estrutura da tabela orders

O instrutor define a tipagem com campos essenciais:

- `id` — identificador único do item do pedido
- `table_session_id` — vincula à sessão da mesa (quem pediu)
- `product_id` — referência ao produto (para nome, descrição, etc.)
- `quantity` — quantidade solicitada
- `price` — preço unitário NO MOMENTO do pedido
- `created_at` / `updated_at` — timestamps

O cálculo do total de um item é `quantity * price` diretamente nos dados da order, sem precisar consultar a tabela de produtos.

## Fluxo demonstrado

1. Criou tipagem em `database/types/order-repository.d.ts`
2. No controller, usou `knex<OrderRepository>("orders").insert(...)` 
3. Passou `table_session_id`, `product_id`, `quantity` e `price: product.price`
4. Removeu o retorno desnecessário do produto no response
5. Testou no Insomnia/Postman — primeiro um prato de R$100, depois um refrigerante de R$7,50 com quantidade 2
6. Verificou no banco (Beekeeper/DBeaver) que os registros estavam corretos

## Organização visual dos campos

O instrutor reorganizou a ordem dos campos no insert para melhor legibilidade:
1. `table_session_id` (contexto — a quem pertence)
2. `product_id` (o quê)
3. `quantity` (quanto)
4. `price` (valor unitário)

Isso não muda funcionalidade, mas melhora a experiência de leitura do código.

## Edge case: cálculo de total

O instrutor menciona que depois será possível calcular o total multiplicando `quantity * price` nas orders. Isso confirma que o design é intencional — os dados necessários para o cálculo estão todos na tabela de pedidos, sem dependência de JOIN com products para valores monetários.