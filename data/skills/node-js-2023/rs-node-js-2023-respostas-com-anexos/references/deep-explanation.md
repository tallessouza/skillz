# Deep Explanation: Respostas com Anexos

## Por que domain-first?

O instrutor enfatiza repetidamente: "começando sempre da camada de domínio e depois a gente vai para o restante". Isso não é preferência — é arquitetura limpa. O domínio define contratos (interfaces de repositório), e a infra implementa. Se você começar pela infra, corre o risco de moldar o domínio pela limitação do banco.

## O padrão de replicação Question → Answer

A aula inteira é um exercício de replicação controlada. O instrutor já construiu todo o sistema de attachments para Questions. Agora replica para Answers. A técnica dele:

1. **Identifica o que falta** — no caso de uso `AnswerQuestion`, já recebe `attachmentsIds` e cria `AnswerAttachment`, mas o repositório não tem `createMany`/`deleteMany`
2. **Copia do equivalente existente** — copia métodos do `InMemoryQuestionAttachmentsRepository`
3. **Find-replace com preserveCase** — troca `questionAttachment` por `answerAttachment` mantendo case correto
4. **Valida que compilou** — "pode ver que já parou de dar erro"

## A armadilha da foreign key

O instrutor destaca explicitamente: "tem que ser depois do método create, lembrando, né? porque senão a foreign key vai falhar". No Prisma, se você tentar criar um `AnswerAttachment` com um `answerId` que ainda não existe no banco, o banco rejeita. Ordem importa.

## Promise.all no save

No método `save`, três operações são independentes entre si:
- Update da answer
- CreateMany dos novos attachments
- DeleteMany dos removidos

Como são independentes, usar `Promise.all` é correto e mais performático que sequencial.

## O insight do default array vazio

Quando o instrutor adicionou attachments ao edit answer controller, os testes existentes quebraram porque não enviavam o campo. A solução elegante: `.default([])` no Zod schema. Isso mantém retrocompatibilidade — se o frontend não enviar attachments, trata como array vazio.

## Teste de sync: a estratégia 1,2 → 1,3

O padrão de teste para verificar sync de attachments:
1. Cria entidade com attachments 1 e 2
2. Edita para ter attachments 1 e 3
3. Verifica que no banco restam apenas 1 e 3 (2 foi deletado, 3 foi criado)

Isso testa simultaneamente o `createMany` (3 é novo) e o `deleteMany` (2 foi removido).

## Attachment compartilhado entre Question e Answer

O instrutor alerta: "como o attachment pode estar tanto associado com uma Question quanto com uma Answer, a gente tem que lembrar de trocar". O modelo `Attachment` no Prisma tem tanto `questionId` quanto `answerId` (nullable). No mapper, é crítico usar o campo correto.

## Factories para testes e2e

O instrutor cria uma factory `makeAnswerAttachment` que:
- Recebe `PrismaService` como dependência
- Cria o registro diretamente no banco via Prisma
- Permite que testes e2e tenham dados reais para verificar

Sem factory, você teria que criar manualmente via Prisma em cada teste, duplicando código.