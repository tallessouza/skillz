# Deep Explanation: Delivery API — Domain Model & Architecture

## Por que essa arquitetura?

O instrutor apresenta uma API de entregas como projeto integrador que exercita tudo aprendido até o momento no curso. A escolha não é acidental — uma API de entregas é um domínio rico que naturalmente exige:

1. **Autenticação e autorização com roles** — dois perfis (vendedor e cliente) com permissões distintas
2. **Máquina de estados** — o ciclo de vida de uma entrega (processando → enviado → entregue)
3. **Audit trail** — movimentações que registram cada transição

## User Roles como conceito central

O instrutor enfatiza "user roles" como um conceito fundamental. Não se trata apenas de saber quem é o usuário, mas **o que ele pode fazer**. O vendedor é quem envia o pedido para um cliente. O cliente é quem recebe e acompanha.

Essa separação de roles impacta diretamente a API:
- **Rotas diferentes** podem ter acesso condicionado ao role
- **Dados filtrados** — um vendedor vê as entregas que criou, um cliente vê as que recebeu
- **Operações exclusivas** — apenas o vendedor pode criar entregas e atualizar status

### Analogia prática
Pense em um sistema de correios: o remetente (vendedor) é quem posta a encomenda e atualiza o status. O destinatário (cliente) só pode consultar onde está o pacote. Ambos têm acesso ao sistema, mas com capacidades completamente diferentes.

## Status como máquina de estados

O instrutor lista três status: **processando**, **enviado** e **entregue**. Isso forma uma máquina de estados linear simples:

```
processing → shipped → delivered
```

### Por que máquina de estados e não flag booleano?
- Um booleano `isDelivered` só captura dois estados
- O domínio tem pelo menos três estados distintos
- Cada transição tem regras de negócio (não pode ir de "processing" direto para "delivered")
- A máquina de estados torna as transições explícitas e validáveis

### Extensibilidade
O instrutor menciona "a caminho" como parte do fluxo. Em uma evolução futura, estados como `out_for_delivery`, `returned`, `cancelled` podem ser adicionados. A arquitetura de máquina de estados suporta isso naturalmente.

## Movimentações como audit trail

O conceito mais interessante do projeto é o registro de **movimentações**. O instrutor explica: "a gente vai registrar as movimentações da entrega — por exemplo, o produto saiu para entrega, o produto está a caminho".

### Por que não basta o status?
O status é o **estado atual**. As movimentações são o **histórico completo**. Quando o usuário quer saber "quando meu pedido foi enviado?", a resposta não está no status atual (que pode já ser "entregue"), mas no registro de movimentação que documenta quando a transição para "enviado" aconteceu.

### Benefícios do audit trail
1. **Rastreabilidade** — saber exatamente quando cada transição ocorreu
2. **Transparência** — o cliente acompanha em tempo real
3. **Debugging** — quando algo dá errado, o histórico mostra o que aconteceu
4. **Extensibilidade** — movimentações podem incluir localização, responsável, observações

### Pattern: Event Sourcing Lite
Embora o instrutor não use o termo, o conceito de movimentações é uma forma simplificada de event sourcing. Cada mudança de estado gera um evento (movimentação) que é persistido. O estado atual pode ser reconstruído a partir dos eventos. Na prática, mantemos ambos (status direto + histórico) para performance.

## Relacionamento entre entidades

```
User (seller) ─┐
               ├── Delivery ──── DeliveryMovement[]
User (customer)┘
```

Uma delivery tem:
- Um **seller** (quem criou/enviou)
- Um **customer** (quem recebe)
- Um **status** atual
- Múltiplas **movimentações** (histórico)

Esse modelo permite queries como:
- "Todas as entregas que eu enviei" (filtro por sellerId)
- "Todas as entregas que estão vindo para mim" (filtro por customerId)
- "Histórico completo dessa entrega" (movimentações por deliveryId)

## Integração com conceitos anteriores do curso

O instrutor menciona explicitamente que o projeto usa "tudo o que você aprendeu até aqui". Isso sugere que a implementação vai envolver:
- Criação de servidor HTTP (Node.js puro ou com framework)
- Rotas e middleware
- Banco de dados e queries
- Autenticação e autorização
- Validação de dados
- Tratamento de erros

O projeto serve como exercício integrador que conecta todos esses conceitos em uma aplicação coesa.