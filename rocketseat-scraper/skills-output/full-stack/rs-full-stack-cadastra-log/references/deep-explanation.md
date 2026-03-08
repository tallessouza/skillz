# Deep Explanation: Cadastra Log

## Por que validar ANTES de consultar o banco?

O instrutor segue uma ordem deliberada: primeiro Zod valida o body, depois consulta o banco. Isso é importante porque:

1. **Rejeição barata** — validação de schema é síncrona e instantânea. Se o body está malformado, não há razão para abrir conexão com o banco.
2. **Mensagens de erro claras** — Zod gera erros descritivos sobre qual campo está faltando ou com formato errado, enquanto o banco daria erros crípticos de constraint violation.
3. **Segurança** — nunca passe dados não-validados para queries. Mesmo com Prisma parametrizando, a validação de tipo previne comportamento inesperado.

## A cadeia de guards: existência → estado → mutação

O instrutor implementa dois guards antes de criar o log:

### Guard 1: Entidade existe?
```
findUnique → null? → throw AppError("Delivery not found", 404)
```

Isso é fundamental porque sem essa verificação, o Prisma lançaria um erro de foreign key violation — uma mensagem técnica que não ajuda o cliente da API. O AppError com 404 comunica claramente o problema.

### Guard 2: Estado permite operação?

```
delivery.status === "processing"? → throw AppError("Change status to shipped first")
```

Esta é a **regra de negócio central** da aula: um log de movimentação só faz sentido para um pedido que já foi enviado. A primeira movimentação registrada deve ser o envio (`shipped`). Se o pedido ainda está `processing`, não pode ter logs de movimentação.

O instrutor explica: "a primeira movimentação tem que ser que o pedido foi enviado, ele está em trânsito, está em caminho". Isso estabelece uma **máquina de estados implícita**:

```
processing → shipped → (logs de movimentação permitidos)
```

## Pattern: Log como filho de entidade

O `DeliveryLog` é um registro filho de `Delivery` com relação 1:N. Cada delivery pode ter múltiplos logs. O instrutor demonstra isso navegando pelo banco:

- Na tabela `delivery_log`: vê os logs individuais com suas descrições
- Clicando no `delivery_id` de um log: navega até o pedido pai
- Na tabela `deliveries`: vê os logs relacionados ao pedido

Essa bidirecionalidade é possível graças à relação definida no schema Prisma.

## Resposta 201 sem corpo

O instrutor retorna `response.status(201).json()` — sem nenhum dado no body. Isso é correto porque:

1. O cliente já tem todas as informações (ele enviou o delivery_id e a description)
2. O 201 confirma que o recurso foi criado
3. Se o cliente precisar do log criado (com ID gerado, timestamps), ele pode consultar depois

## Cenários de teste demonstrados

O instrutor testa manualmente três cenários:

1. **Body inválido** — envia sem delivery_id → Zod rejeita
2. **Delivery inexistente** — envia ID com último caractere alterado → 404 "Delivery not found"
3. **Status processing** — delivery existe mas não foi enviada → erro "Change status to shipped first"
4. **Sucesso** — após trocar status para shipped, o log é criado → 201

Esses cenários formam os casos de teste essenciais para qualquer endpoint similar.

## Visualização dos logs no banco

Após criar dois logs ("chegou no centro de distribuição" e "em trânsito para Ribeirão Preto"), o instrutor mostra como navegar a relação no banco:

- Pela tabela de logs: ver todos os logs e seus pedidos vinculados
- Pela tabela de pedidos: ver os logs de um pedido específico

Isso valida que a relação 1:N está funcionando corretamente e os dados estão consistentes.