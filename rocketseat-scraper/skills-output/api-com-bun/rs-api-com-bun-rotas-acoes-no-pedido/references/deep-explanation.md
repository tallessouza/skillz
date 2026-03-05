# Deep Explanation: Rotas — Acoes no Pedido

## Maquina de Estados do Pedido

O instrutor apresenta um fluxo claro de estados para pedidos:

```
pending → processing → delivering → delivered
    ↘         ↘
     canceled   canceled
```

A ideia central e que cada acao (approve, dispatch, deliver, cancel) so pode ser executada quando o pedido esta em um status especifico. Isso forma uma **maquina de estados finita** onde as transicoes sao controladas pela API.

## Logica de cada acao

### Cancel
- **Status permitidos:** `pending` ou `processing`
- **Status resultante:** `canceled`
- **Raciocinio do instrutor:** "Eu nao vou poder cancelar um pedido que ja saiu para entrega ou ja foi entregue." Faz sentido fisico — se o produto ja saiu, cancelar no sistema nao desfaz a entrega.

### Dispatch
- **Status permitido:** `processing`
- **Status resultante:** `delivering`
- **Raciocinio:** Dispatch e o ato de enviar para entrega. So faz sentido despachar algo que ja foi aprovado (processing).

### Deliver
- **Status permitido:** `delivering`
- **Status resultante:** `delivered`
- **Raciocinio:** So pode marcar como entregue algo que esta em processo de entrega.

## Padrao de copia do instrutor

O instrutor explicitamente copia a funcao `approve` como base para todas as outras acoes. Isso mostra que o padrao e identico — o que muda entre as acoes e:
1. A URL do endpoint
2. O nome da funcao
3. Os status permitidos na guarda
4. O novo status apos a transicao
5. A mensagem de erro

Esse padrao de "copiar e ajustar" e pragmatico para endpoints CRUD simples, mas em projetos maiores seria candidato a uma abstracao (factory de acoes com tabela de transicoes).

## Mensagens de erro

O instrutor reconhece que as mensagens poderiam ser melhores ("daria pra ser bem melhor essa mensagem aqui mas vamos deixar assim"). Em producao, considere:
- Informar o status atual do pedido na mensagem
- Informar quais status seriam aceitos
- Usar codigos de erro estruturados

## Registro no server

Todas as rotas precisam ser registradas no arquivo server principal. O instrutor registra cancel, deliver e dispatch de uma vez. Esquecer de registrar uma rota e um erro comum que resulta em 404 silencioso.

## Teste manual com Hopscotch

O instrutor testa cada acao manualmente:
1. Pega um pedido com status adequado no Drizzle Studio
2. Executa a acao via Hopscotch
3. Consulta `getOrderDetails` para verificar a transicao

Esse fluxo de teste manual valida a maquina de estados completa: processing → dispatch → delivering → deliver → delivered.