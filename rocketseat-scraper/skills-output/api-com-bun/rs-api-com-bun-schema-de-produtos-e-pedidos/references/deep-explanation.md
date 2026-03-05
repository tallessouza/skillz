# Deep Explanation: Schema de Produtos e Pedidos

## Por que centavos e nao decimais?

O instrutor enfatiza: valores monetarios SEMPRE em centavos como integer. A razao vai alem de "boa pratica":

1. **Floating point e traicoeiro** — `0.1 + 0.2 !== 0.3` em JavaScript. Centavos como integer eliminam isso completamente.
2. **Transmissao back↔front simplificada** — integer serializa sem perda. Divide por 100 so na hora de exibir na interface.
3. **Nome da coluna documenta a unidade** — `priceInCents` torna impossivel confundir se o valor e em reais ou centavos.

## A decisao de cascade mais importante: cliente vs pedidos

O instrutor usa uma analogia concreta de delivery:

> "Imagina que tu tem uma loja no iFood. Tu recebeu 50 pedidos de um cliente. Aquilo aparece nos teus graficos de faturamento. Ai o maluco deleta a conta dele. E ai teu grafico de faturamento vai la pra baixo, porque deletou todos os pedidos dele. Tu como lojista perdeu esses pedidos."

Por isso `customerId` em orders e **nullable com set null**, nao cascade. O pedido continua existindo sem referencia ao cliente, preservando historico financeiro do restaurante.

Ja `restaurantId` em orders usa cascade porque: "dificilmente um cliente vai querer ficar vendo pedidos antigos de um restaurante que foi deletado". E um caso de uso muito mais remoto.

## Por que salvar totalInCents no pedido?

O instrutor faz uma conta real:

- Loja pequena: JOIN toda vez e OK
- Loja grande: 20 mil pedidos/mes = ~250 mil pedidos/ano
- Media de 2 itens por pedido = 500 mil registros em orderItems
- Para calcular receita anual: JOIN de 250k + 500k registros

Alem disso, o pedido **nunca e editado** apos criacao. Nos apps de delivery, se voce esqueceu algo, liga na loja — o pedido no sistema nao muda. Por isso:
- Salvar total na criacao e seguro (dado imutavel)
- Nem precisa de `updatedAt` na tabela orders

## Por que priceInCents em orderItems se ja existe em products?

> "O preco do produto e variavel. Imagina entrar no detalhe de um pedido de tres meses atras e ver R$18,40. So que agora esse hamburguer pode estar custando mais caro."

OrderItems.priceInCents e um **snapshot** — o preco no momento exato da compra. Funciona como um cache permanente. Nunca referencie o preco atual do produto para exibir historico.

## A logica de set null em orderItems.productId

Mesma logica do cliente: se o restaurante remove o "hamburguer do mes" do cardapio, nao faz sentido deletar todos os pedidos que tinham aquele item. O historico de faturamento seria perdido. Entao `productId` fica nullable com `set null`.

## Enum de status do pedido

O instrutor mapeou baseado em apps de delivery reais:

- `pending` — pedido recebido pela loja (default)
- `processing` — loja aceitou e esta preparando
- `delivering` — saiu para entrega
- `delivered` — entregue
- `cancelled` — cancelado

## Workflow de geracao

Apos criar os schemas:
1. `bun run generate` — cria a migration
2. Verificar o arquivo de migration gerado
3. `bun run migrate` — aplica ao banco