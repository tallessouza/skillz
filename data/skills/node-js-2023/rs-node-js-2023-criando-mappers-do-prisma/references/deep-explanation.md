# Deep Explanation: Criando Mappers do Prisma

## Por que mappers existem

O objetivo do mapper e converter uma entidade da camada de dominio para uma entidade da camada de persistencia (Prisma). As camadas sao "organismos individuais" — nao necessariamente estao sempre conectados.

## Insight central: entidades de dominio != tabelas

O instrutor enfatiza que **nem toda entidade de dominio representa uma tabela no banco de dados**. Exemplos concretos:

- Uma tabela `comment` no banco serve para dois tipos de entidade: `QuestionComment` e `AnswerComment`
- Uma tabela `attachment` serve para `QuestionAttachment` e `AnswerAttachment`
- Futuramente, entidades de dominio podem representar **agregados** (ex: pergunta + autor) que nao tem tabela propria

A analogia do instrutor: imagine que voce buscou uma pergunta e trouxe junto o autor. Agora voce tem uma estrutura que nao e so `Question` (que so tem `authorId`, nao tem nome/avatar). E uma nova entidade a nivel de dominio, mas no banco continua sendo duas tabelas separadas.

## Por que o throw em vez de tratamento elegante

O `throw new Error()` dentro do mapper quando uma FK obrigatoria e nula e intencional. O instrutor explica:

> "Aqui é um erro não esperado. Eu só quero que realmente isso chegue aqui se tiver dado um erro muito não esperado, foi programado de uma maneira muito errada ou algo muito errado está acontecendo."

O erro vai cair na tratativa de erro generalizada do framework (NestJS). Nao precisa de handler especifico porque esse cenario nunca deveria acontecer em operacao normal.

## Por que omitir toPrisma em alguns mappers

Para `QuestionAttachment` e `AnswerAttachment`, o repositorio so tem metodos de busca e delete. Nao existe `create` ou `save` que precise converter dominio → Prisma. Portanto, criar `toPrisma` seria codigo morto.

## Estrategia de criacao por copia

O instrutor usa uma estrategia pragmatica: copia o mapper de `Question`, faz find-and-replace para `Answer`, e depois ajusta as diferencas (remove campos que nao existem, adiciona campos especificos). Isso e mais rapido e menos propenso a erros do que escrever do zero.

## updatedAt como nulo

Em varias entidades, `updatedAt` pode ser nulo porque um registro recem-criado que nunca foi editado nao tem data de atualizacao. Isso e consistente com a diferenca entre `undefined` (nao informado) e `null` (informado como vazio) discutida em aulas anteriores.

## Tipo UncheckedCreateInput

O `toPrisma` retorna `Prisma.{Entity}UncheckedCreateInput` — o tipo "unchecked" do Prisma permite passar IDs de relacionamento diretamente (como `authorId`, `questionId`) em vez de usar a API de connect do Prisma. Isso e mais direto para mappers.