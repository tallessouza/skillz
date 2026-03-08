---
name: rs-full-stack-registrando-no-log-alteracao-do-status
description: "Enforces audit logging for entity status changes when building delivery APIs, order tracking systems, or any status-driven workflow with Prisma and Express. Use when user asks to 'track status changes', 'add audit log', 'log delivery updates', 'register status history', or 'create status changelog'. Applies pattern: every status mutation triggers a log entry with delivery ID and description. Make sure to use this skill whenever implementing status transitions that need traceability. Not for application-level error logging, system monitoring, or Winston/Pino log configuration."
---

# Registrando no Log Alteração do Status

> Toda mutação de status de uma entidade deve gerar automaticamente um registro de log associado, garantindo rastreabilidade completa do ciclo de vida.

## Rules

1. **Registre log em toda atualização de status** — use `await prisma.deliveryLog.create()` imediatamente após confirmar a mudança de status, porque sem log a operação não tem rastreabilidade
2. **Associe o log à entidade pelo ID** — passe `deliveryId: id` no campo `data`, porque logs órfãos são inúteis para auditoria
3. **Use a descrição para registrar o novo estado** — passe o `status` ou uma descrição legível como `description`, porque facilita consultas e listagens sem joins adicionais
4. **Mantenha o log no mesmo controller da mutação** — o log vive junto com a lógica que altera o status, porque garante que ambos acontecem no mesmo fluxo de execução
5. **Respeite as regras de transição antes de logar** — só registre log se a mudação de status foi bem-sucedida (validações de ordem de status passaram), porque logs de operações rejeitadas poluem o histórico

## How to write

### Log no DeliveryStatusController

```javascript
// Dentro do controller que atualiza o status
await prisma.deliveryLog.create({
  data: {
    deliveryId: id,
    description: status,
  },
});
```

### Fluxo completo: atualizar status + registrar log

```javascript
app.patch("/deliveries/:id/status", async (request, response) => {
  const { id } = request.params;
  const { status } = request.body;

  // 1. Buscar entrega atual e validar transição de status
  const delivery = await prisma.delivery.findUnique({ where: { id } });

  if (!delivery) {
    return response.status(404).json({ error: "Delivery not found" });
  }

  // 2. Validar regras de transição (ex: não pode atualizar se já entregue)
  if (delivery.status === "delivered") {
    return response.status(400).json({ error: "Delivery already completed" });
  }

  // 3. Atualizar o status
  await prisma.delivery.update({
    where: { id },
    data: { status },
  });

  // 4. Registrar no log
  await prisma.deliveryLog.create({
    data: {
      deliveryId: id,
      description: status,
    },
  });

  return response.json({ message: "Status updated" });
});
```

### Listando logs de uma entrega

```javascript
app.get("/deliveries/:id", async (request, response) => {
  const { id } = request.params;

  const delivery = await prisma.delivery.findUnique({
    where: { id },
    include: {
      logs: true, // Traz todos os registros de log associados
    },
  });

  return response.json(delivery);
});
```

## Example

**Before (sem audit log):**
```javascript
app.patch("/deliveries/:id/status", async (request, response) => {
  const { id } = request.params;
  const { status } = request.body;

  await prisma.delivery.update({
    where: { id },
    data: { status },
  });

  return response.json({ message: "Status updated" });
});
```

**After (com audit log):**
```javascript
app.patch("/deliveries/:id/status", async (request, response) => {
  const { id } = request.params;
  const { status } = request.body;

  const delivery = await prisma.delivery.findUnique({ where: { id } });

  if (delivery.status === "delivered") {
    return response.status(400).json({ error: "Delivery already completed" });
  }

  await prisma.delivery.update({
    where: { id },
    data: { status },
  });

  await prisma.deliveryLog.create({
    data: {
      deliveryId: id,
      description: status,
    },
  });

  return response.json({ message: "Status updated" });
});
```

## Heuristics

| Situação | Ação |
|----------|------|
| Status de entidade muda (pedido, entrega, ticket) | Criar registro de log com ID da entidade + novo status |
| Precisa listar histórico de mudanças | Usar `include: { logs: true }` no Prisma |
| Regras de transição impedem a mudança | Não registrar log — a operação não aconteceu |
| Entidade já está no estado final (delivered) | Retornar erro antes de tentar atualizar ou logar |
| Descrição do log precisa ser legível | Usar texto descritivo ("O pedido foi coletado") ou o próprio enum do status |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| Atualizar status sem registrar log | Sempre criar log após mutação bem-sucedida |
| Registrar log antes de validar a transição | Validar regras primeiro, logar só se passou |
| Log sem referência à entidade (sem deliveryId) | Sempre associar log ao ID da entidade |
| Log com descrição genérica ("status changed") | Usar o status concreto ou frase descritiva |
| Logar operações rejeitadas/falhas de validação | Só logar transições que realmente aconteceram |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre audit logging, ciclo de vida de entregas e regras de transição
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e cenários reais