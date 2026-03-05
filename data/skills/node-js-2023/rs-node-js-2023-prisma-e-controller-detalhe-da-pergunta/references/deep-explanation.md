# Deep Explanation: Presenter e Mapper com Composicao

## Por que composicao de mappers funciona

O instrutor destaca um insight importante: "eu posso reaproveitar um mapper dentro do outro. Isso nao e um problema. Funciona tranquilamente." Essa frase aparentemente simples esconde um principio arquitetural poderoso — mappers sao funcoes puras de transformacao, e funcoes puras compoem naturalmente.

Quando o `PrismaQuestionDetailsMapper` precisa converter attachments do formato Prisma para o formato de dominio, ele nao reimplementa a logica. Ele delega para `PrismaAttachmentMapper.toDomain`. Isso significa que se a estrutura de um attachment mudar, so um lugar precisa ser atualizado.

## O mesmo principio vale para presenters

O instrutor explicita: "todo presenter tambem e um mapper, ele esta so transformando uma informacao que esta em um formato para outro." Presenters e mappers sao a mesma coisa conceptualmente — funcoes de transformacao. A diferenca e a direcao:

- **Mapper**: Prisma -> Domain (entrada)
- **Presenter**: Domain -> HTTP (saida)

Por isso `QuestionDetailsPresenter` usa `AttachmentPresenter.toHTTP()` dentro do map — mesma composicao, direcao oposta.

## TypeScript como guardioes de relacoes

Um ponto crucial que o instrutor demonstra: quando o mapper espera `author` e `attachments` no tipo de entrada, mas o repository faz query sem `include`, o TypeScript imediatamente acusa erro. O instrutor celebra: "o TypeScript e uma belezinha — se eu esqueco de colocar uma informacao que o meu mapper precisa, ele ja da erro."

Isso cria um contrato forte entre:
1. O tipo esperado pelo mapper (o que ele precisa)
2. O resultado do Prisma query (o que a query retorna)
3. O `include` no Prisma (o que voce pede ao banco)

Se qualquer um desses tres nao bate, TypeScript bloqueia em tempo de compilacao.

## Por que criar presenter separado para details

O instrutor cria `QuestionDetailsPresenter` separado de `QuestionPresenter` existente. Isso porque o endpoint de detalhes retorna campos extras (author name, attachments) que o endpoint de listagem nao retorna. Misturar os dois geraria campos opcionais desnecessarios e confusao sobre qual formato cada endpoint retorna.

## Propagacao de erros ao mudar interfaces

O instrutor demonstra que apos mudar a interface do `InMemoryQuestionsRepository` (adicionando dependencias de `attachments` e `students`), o `tsc` revelou erros em arquivos de teste de eventos que tambem usavam esse repositorio. Isso mostra a importancia de rodar `tsc` apos mudancas em interfaces — os erros propagam para todos os consumidores.

O instrutor resolve isso criando as dependencias faltantes nos testes afetados, na ordem correta que o construtor espera: "primeiro o attachments e depois o students, porque e a ordem que ele recebe la dentro."

## Checagem de qualidade no final

O instrutor segue um ritual apos finalizar: `pnpm run test:e2e`, depois `pnpm run test`, depois `tsc` (checagem de tipos), depois lint. Essa sequencia garante que nada foi quebrado em nenhuma camada.