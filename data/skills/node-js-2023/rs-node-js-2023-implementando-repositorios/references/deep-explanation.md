# Deep Explanation: Implementando Repositórios Prisma

## Por que copiar e adaptar é a estratégia correta

O instrutor demonstra deliberadamente a técnica de copiar repositórios existentes e adaptar. Isso não é preguiça — é reconhecimento de que repositórios seguem um padrão mecânico e repetitivo. A estrutura é sempre a mesma:

1. Injeção do PrismaService
2. Métodos CRUD com mapper
3. Paginação consistente

A variação está apenas em: nome da entidade, nome do mapper, e campos de relacionamento (`questionId` vs `answerId`).

## O insight do delete sem mapper

Um dos pontos mais práticos da aula: no método `delete`, o mapper é desnecessário. O Prisma só precisa do `id` para deletar, então converter a entidade inteira para o formato Prisma é trabalho desperdiçado. O instrutor chega a essa conclusão ao vivo:

> "Como é só o id aqui eu poderia pegar direto o answer.id.toString(), daí não precisaria nem passar pelo mapper né, porque não tem muita necessidade."

Isso mostra pensamento pragmático — usar o mapper onde agrega valor (conversão de dados complexos) e pular onde não agrega (operações que só precisam do id).

## Hierarquia de entidades no projeto

O projeto Clean Architecture tem esta hierarquia de repositórios:

- **Questions** — entidade raiz
- **Answers** — resposta a uma question (tem `questionId`)
- **Question Comments** — comentário em question (tem `questionId`)
- **Answer Comments** — comentário em answer (tem `answerId`)
- **Question Attachments** — anexos de question (tem `questionId`)
- **Answer Attachments** — anexos de answer (tem `answerId`)

Cada par (Question/Answer) segue o mesmo padrão, com a diferença do campo de relacionamento.

## Attachments são diferentes

Os repositórios de attachments são mais simples — não têm `create`, `save`, `findById` ou `delete` individuais. Só têm:
- `findManyByParentId` — buscar todos os anexos de uma question/answer
- `deleteManyByParentId` — deletar todos os anexos (usado em cascade)

Isso reflete que attachments são value objects gerenciados pelo aggregate root, não entidades independentes.

## O perigo do find-and-replace

O instrutor quase comete um erro ao fazer find-and-replace de `questionComment` para `answerComment` — quase deleta a entidade errada no método delete. Ele percebe a tempo:

> "Aqui não é question comment... eu tava deletando a question, já ia dar pra cabeça."

Lição: ao copiar e adaptar repositórios, sempre revise o resultado final campo a campo, especialmente nos métodos `delete` e nos `where` clauses.