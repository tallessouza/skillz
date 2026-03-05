# Deep Explanation: Prisma Delete

## Por que uma unica linha resolve

O Prisma abstrai toda a complexidade do SQL DELETE. Quando voce escreve:

```typescript
await prisma.question.delete({ where: { id } })
```

O Prisma gera o SQL equivalente:

```sql
DELETE FROM "Question" WHERE "id" = $1
```

Se o registro nao existir, o Prisma lanca um `PrismaClientKnownRequestError` com codigo `P2025` (Record to delete does not exist). Isso significa que voce **nao precisa** fazer um `findUnique` antes do `delete` — o proprio Prisma valida a existencia.

## Fluxo REST para DELETE

O padrao REST define que:
1. O ID do recurso vem na URL: `DELETE /questions/abc-123`
2. O body da requisicao e vazio (ou ignorado)
3. A resposta pode ser `204 No Content` (sem body) ou `200` com o registro deletado

O instrutor demonstrou isso no Insomnia: ao duplicar a requisicao de update, ele trocou o metodo para DELETE e removeu o body (selecao "No Body"), mantendo apenas o ID na URL.

## Recuperando o ID

O ID vem de `request.params` porque a rota e definida com parametro dinamico:

```typescript
app.delete('/questions/:id', ...)
```

O framework (Fastify/Express) extrai automaticamente o valor de `:id` e disponibiliza em `request.params.id`.

## Verificacao no Prisma Studio

Apos executar o delete, o instrutor verificou de duas formas:
1. Chamando o endpoint GET de listagem — retornou apenas 1 registro
2. Abrindo o Prisma Studio (`npx prisma studio`) — confirmou visualmente que o registro foi removido

Essa dupla verificacao e uma boa pratica durante desenvolvimento para garantir que a operacao funcionou corretamente.

## Eficiencia

O instrutor enfatizou que "com essa linha de codigo a gente deletou um registro do banco de dados" — destacando a simplicidade do Prisma. Nao precisa escrever SQL manual, nao precisa gerenciar conexao, nao precisa fazer query de verificacao antes.