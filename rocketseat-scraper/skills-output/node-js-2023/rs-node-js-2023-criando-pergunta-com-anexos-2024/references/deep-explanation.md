# Deep Explanation: Criando Pergunta com Anexos

## O problema central: ID da pivot vs ID do recurso

O instrutor encontrou um bug sutil que e extremamente comum em clean architecture com entidades pivot (join tables). A entidade `QuestionAttachment` tem tres IDs:

1. **id** — ID proprio da entidade pivot (gerado automaticamente pelo `Entity.create()`)
2. **attachmentId** — referencia ao anexo real
3. **questionId** — referencia a pergunta

O bug: no mapper Prisma, o codigo usava `id` (o ID da pivot) para identificar qual anexo associar. Mas esse ID e gerado do zero toda vez e nao tem relacao com o attachment real no banco.

### Por que o ID da pivot era igual ao attachmentId antes?

O instrutor explica: "geralmente eu estava mantendo ele com o mesmo id do anexo. O id do anexo repetia, entao ele ficava tanto dentro do attachmentId quanto do id em si." Ou seja, em alguns lugares do codigo, ao criar o `QuestionAttachment`, o segundo parametro do `create()` recebia o mesmo `attachmentId`, fazendo com que coincidissem. Mas no caso de uso `CreateQuestion`, isso nao acontecia — o `attachmentId` era passado apenas no campo correto, e o `id` era gerado automaticamente.

## Processo de debugging do instrutor

O instrutor seguiu um processo metodico de debugging de dentro para fora:

1. **Identificou o sintoma**: teste falhou com `expected [] to have length 2`
2. **Console.log no createMany**: viu que chegava vazio
3. **Console.log no controller**: attachments chegavam corretamente
4. **Console.log no repository**: `question.attachments.currentItems` tinha os items
5. **Isolou o problema**: entre o repository e o createMany, algo se perdia
6. **Encontrou a causa raiz**: o mapper usava `id` ao inves de `attachmentId`

Esse processo de adicionar console.log em cada camada da arquitetura limpa e uma tecnica valiosa — cada camada (controller → use case → repository → mapper) pode transformar ou perder dados.

## Nota sobre o ambiente de teste

O instrutor menciona que rodou o teste tanto pelo VS Code quanto pelo terminal (`pnpn run test e2e`), porque o VS Code estava com "um bugzinho". Isso e comum em projetos NestJS com testes E2E — as vezes o test runner integrado ao editor nao funciona corretamente, e rodar pelo terminal resolve.

## A importancia de factories separadas

O instrutor ja tinha `makeQuestionAttachment` (que cria o relacionamento pivot), mas nao tinha `makeAttachment` (que cria o anexo em si no banco). Ele copiou a estrutura de `makeStudent` e adaptou para `makeAttachment`. O padrao e consistente:

- `makeXxx()` — cria entidade em memoria (para unit tests)
- `XxxFactory.makePrismaXxx()` — cria e salva no banco (para E2E tests)

Cada entidade do dominio precisa da sua propria factory para testes E2E.