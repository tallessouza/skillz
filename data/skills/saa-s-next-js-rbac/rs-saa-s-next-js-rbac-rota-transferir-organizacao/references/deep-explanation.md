# Deep Explanation: Rota de Transferencia de Propriedade

## Por que PATCH e nao PUT?

O instrutor explica a distincao semantica: PUT substitui a entidade inteira, PATCH atualiza um campo especifico. Quando voce so quer mudar o owner, PUT seria semanticamente incorreto. Alem disso, ao usar PATCH, voce adiciona o recurso sendo atualizado na URL (`/owner`), tornando a API auto-documentada.

A URL `PATCH /organizations/:slug` sozinha nao comunica O QUE esta sendo atualizado. Por isso, `/organizations/:slug/owner` e mais expressivo — qualquer dev lendo a rota sabe exatamente o que ela faz.

## Validacao de membership: por que e obrigatoria

Transferir uma organizacao para alguem que nao pertence a ela e um erro de logica de negocio. O instrutor usa o indice composto `organizationId_userId` do Prisma para buscar de forma eficiente:

```typescript
where: {
  organizationId_userId: {
    organizationId: organization.id,
    userId: transferToUserId,
  }
}
```

Esse pattern aproveita o `@@unique([organizationId, userId])` definido no schema Prisma, garantindo busca O(1) por indice.

## Promocao de role: o insight do instrutor

O instrutor destaca um caso que muitos devs ignorariam: e se o membro destino tem role `BILLING` ou `MEMBER`? Nao faz sentido transferir ownership para alguem sem permissoes administrativas. Por isso, a role e forcada para `ADMIN` na mesma transacao — nao importa qual era a role anterior.

## Prisma $transaction: array vs callback

O instrutor inicialmente escreveu a forma com callback:

```typescript
await prisma.$transaction(async (tx) => {
  await tx.member.update(...)
  await tx.organization.update(...)
})
```

Mas depois refatorou para a forma com array:

```typescript
await prisma.$transaction([
  prisma.member.update(...),
  prisma.organization.update(...),
])
```

Vantagens da forma com array (conforme o instrutor):
1. **Execucao paralela** — as queries rodam simultaneamente, nao sequencialmente
2. **Sintaxe mais limpa** — nao precisa do `tx`, usa direto o `prisma`
3. **Mesma garantia atomica** — se qualquer uma falhar, ambas sao revertidas

A forma com callback e necessaria apenas quando a segunda query depende do resultado da primeira. Como aqui sao operacoes independentes (update member + update organization), o array e superior.

## Erro BadRequest vs Unauthorized

Note a distincao: quando o usuario nao tem PERMISSAO para transferir, e `UnauthorizedError`. Quando o destinatario nao e membro, e `BadRequestError`. Sao erros semanticamente diferentes — um e de autorizacao, outro e de validacao de input.