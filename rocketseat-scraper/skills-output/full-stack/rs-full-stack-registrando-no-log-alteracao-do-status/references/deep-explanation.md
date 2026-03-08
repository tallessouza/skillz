# Deep Explanation: Registrando no Log Alteração do Status

## Por que registrar logs de mudança de status?

Em qualquer sistema que gerencia entregas, pedidos ou tickets, o status de uma entidade muda ao longo do tempo. Sem um registro dessas mudanças, é impossível saber:

- Quando o pedido saiu do armazém
- Quando foi coletado pelo entregador
- Quando foi entregue ao destinatário
- Se houve algum problema no meio do caminho

O log de status funciona como um **diário da entidade** — cada entrada registra um momento no ciclo de vida.

## O padrão: log como tabela associada

A abordagem usada na aula é criar uma tabela `DeliveryLog` separada da tabela `Delivery`. Cada registro de log aponta para uma entrega específica via `deliveryId` e contém uma `description` que descreve o novo estado.

Isso é preferível a simplesmente sobrescrever o campo `status` na tabela principal porque:

1. **Histórico completo** — saber que o pedido está "entregue" não conta a história de como chegou lá
2. **Auditoria** — em caso de disputa, o log prova que as transições aconteceram
3. **Timestamps automáticos** — cada log tem `createdAt`, permitindo saber *quando* cada transição ocorreu

## Onde o log é criado

O instrutor posiciona a criação do log **dentro do DeliveryStatusController**, imediatamente após a atualização de status. Isso é intencional:

```javascript
// Dentro do controller de atualização de status
await prisma.delivery.update({ where: { id }, data: { status } });

// Log criado no mesmo fluxo
await prisma.deliveryLog.create({
  data: { deliveryId: id, description: status },
});
```

A lógica é: **quem muda o status é responsável por registrar a mudança**. Não é um job assíncrono, não é um trigger de banco — é código explícito no mesmo endpoint.

## Interação com regras de transição

Na aula, o instrutor demonstra que as regras de transição de status (ex: não pode pular de "processing" para "delivered") são validadas **antes** da atualização. Isso significa que o log só é criado se a transição foi legítima.

Fluxo demonstrado:
1. Criar pedido → status padrão "processing"
2. Tentar registrar log "O pedido foi coletado" → falha porque precisa primeiro mudar para "shipped"
3. Mudar status para "shipped" → log registra "shipped"
4. Criar log "O pedido foi coletado" → funciona porque o status já é "shipped"
5. Mudar para "delivered" → log registra "delivered"
6. Tentar nova operação → falha porque o pedido já foi entregue

Esse fluxo mostra que **log e regras de negócio caminham juntos**. O log é consequência de uma operação válida, nunca de uma tentativa rejeitada.

## Decisão: status como description

O instrutor usa o próprio valor do status como `description` do log. Isso é uma simplificação pragmática — em produção, a descrição poderia ser mais rica:

- `"shipped"` → `"Pedido despachado para entrega"`
- `"delivered"` → `"Pedido entregue ao destinatário"`

Mas para o escopo da aplicação, usar o enum diretamente é suficiente e evita mapeamentos extras.

## Analogia do instrutor

O instrutor trata o sistema como uma **sequência de eventos obrigatórios**: processing → shipped → delivered. Cada etapa é um checkpoint que gera evidência (log). Tentar pular etapas é bloqueado, e tentar agir após a conclusão também. É como um sistema de rastreamento de correios — cada scan no código de barras gera um registro, e a ordem importa.

## Robustez mencionada

Ao final da aula, o instrutor destaca que as "regrinhas" implementadas (validação de transição + logging) tornam a aplicação "mais robusta e interessante". O ponto é que uma API sem essas proteções seria funcional mas frágil — qualquer chamada poderia corromper o estado da entrega. Com validação + log, a API é **defensiva** e **auditável**.