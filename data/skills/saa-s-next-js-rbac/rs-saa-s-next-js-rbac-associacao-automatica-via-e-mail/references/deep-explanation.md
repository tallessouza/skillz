# Deep Explanation: Associacao Automatica via E-mail

## Contexto de negocio

Essa funcionalidade e uma regra de negocio, nao um requisito funcional. O instrutor faz essa distincao importante: nao entraria em "requisitos funcionais" mas sim em "regras de negocio". Isso significa que ela nao e uma feature visivel para o usuario final na interface, mas sim um comportamento automatico do sistema.

## Caso real: Vercel

O instrutor usa a Vercel como exemplo concreto. Na Vercel, ao criar uma organizacao e configurar um dominio, qualquer pessoa que faca login com aquele dominio de e-mail e automaticamente adicionada ao time. Esse e exatamente o padrao implementado aqui — comum em ferramentas SaaS B2B como Slack, Notion, Linear, etc.

## Por que `findFirst` e nao `findMany`

O codigo usa `findFirst` porque assume que um dominio pertence a uma unica organizacao. Em cenarios reais, pode haver multiplas organizacoes com o mesmo dominio — nesse caso, seria necessario usar `findMany` e criar multiplas associacoes.

## O truque do `undefined` no Prisma

Ponto tecnico importante: quando voce passa `undefined` para um campo no Prisma, ele simplesmente ignora aquele campo, como se ele nao tivesse sido informado. Isso permite usar um ternario elegante:

```typescript
member_on: autoJoinOrganization ? { create: { ... } } : undefined
```

Se fosse `null`, o Prisma tentaria setar o campo como nulo, o que causaria erro em campos de relacionamento.

## Creates encadeados do Prisma

O Prisma permite criar registros em tabelas relacionadas dentro de um unico `create`. O campo `member_on` reflete o relacionamento definido no schema Prisma. Ao usar `create` dentro dele, o Prisma:

1. Cria o usuario
2. Cria o registro na tabela `member`
3. Faz tudo numa unica transacao

Isso garante atomicidade — ou ambos sao criados, ou nenhum.

## Role padrao

O schema Prisma define `MEMBER` como role padrao na tabela member. Como auto-join deve sempre usar a role mais restritiva (membro comum), nao e necessario informar a role explicitamente. O instrutor destaca que "como isso aqui esta fazendo um auto-join, a role padrao ja e membro".

## Posicionamento no fluxo

A logica de auto-join fica ENTRE a validacao de e-mail unico e o create do usuario. Sequencia:

1. Valida que nao existe usuario com mesmo e-mail
2. Extrai dominio e busca organizacao com auto-join ativo
3. Cria usuario com ou sem associacao

## Teste pratico

O instrutor demonstra usando o seed do banco que ja cria uma organizacao `acme-inc` com `domain: "acme.com"` e `shouldAttachUsersByDomain: true`. Ao cadastrar `diego@acme.com`, o usuario e automaticamente associado como membro dessa organizacao — verificavel no Prisma Studio.