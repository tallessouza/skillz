# Deep Explanation: Cadastrando Solicitação com Prisma

## Por que fazer double check no usuário?

O instrutor enfatiza um ponto importante: mesmo que exista um middleware de autenticação que já valida o usuário, é boa prática fazer um "double check" antes de operações de escrita no banco.

A razão é defensiva — o `userId` é um campo obrigatório na tabela `refund`. Se por algum motivo o middleware falhar silenciosamente ou o `request.user` vier incompleto, a query do Prisma vai lançar um erro de constraint violation que é muito menos informativo que um `AppError("Unauthorized", 401)`.

O padrão é simples:

```typescript
if (!request.user?.id) {
  throw new AppError("Unauthorized", 401)
}
```

Depois desse guard, o TypeScript infere que `request.user.id` existe — não precisa mais usar optional chaining (`?.`) nas linhas seguintes. O instrutor destaca exatamente isso: "se chegou aqui, tem o ID do usuário" — então `request.user.id` pode ser usado diretamente sem `?`.

## Padronização de mensagens de erro

O instrutor mostra que a mensagem de erro ("Unauthorized" / "Não autorizado") deve ser a mesma usada no middleware de autenticação. Isso é importante por dois motivos:

1. **Consistência para o frontend** — o cliente pode tratar erros de autenticação com uma única verificação de mensagem
2. **Debugging** — quando a mesma mensagem aparece em logs, fica claro que é um problema de autenticação, independente de onde foi lançada

## Por que retornar status 201?

HTTP 201 Created é o status correto para respostas a requisições POST que resultaram na criação de um recurso. O instrutor retorna o objeto completo criado pelo Prisma, que inclui campos gerados automaticamente:

- `id` — UUID gerado pelo banco
- `createdAt` — timestamp de criação
- `updatedAt` — timestamp de atualização

Isso elimina a necessidade de uma segunda query para buscar o registro recém-criado.

## Fluxo completo da operação

```
Request POST → Middleware auth (valida token) → Controller:
  1. Extrai dados do body (name, category, amount, filename)
  2. Double check: request.user.id existe?
     → Não: throw AppError 401
     → Sim: continua
  3. prisma.refund.create({ data: { ...campos, userId } })
  4. response.status(201).json(refund)
```

## Verificação com Prisma Studio

O instrutor demonstra a verificação usando Prisma Studio — antes do cadastro a tabela está vazia, depois do POST via Insomnia o registro aparece. Esse workflow de verificação (Insomnia → Prisma Studio) é útil durante desenvolvimento para confirmar que os dados estão sendo persistidos corretamente com todos os campos esperados.