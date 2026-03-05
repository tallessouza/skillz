# Deep Explanation: Controller Listar Comentarios da Pergunta

## Raciocinio do instrutor

### Por que copiar de controllers similares?

O instrutor demonstra explicitamente o padrao de copiar o `fetch-question-answers.controller` como base para o `fetch-question-comments.controller`. A logica e simples: controllers de listagem de entidades relacionadas seguem a mesma estrutura — recebem um ID pai via param, chamam o use case, e mapeiam o resultado com um presenter. Copiar e substituir e mais rapido e menos propenso a erro do que criar do zero.

### Presenter generico vs especifico

O instrutor faz uma decisao de design importante: criar um `CommentPresenter` generico ao inves de um `QuestionCommentPresenter`. A justificativa e que `Comment` e uma classe abstrata, e `QuestionComment` e `AnswerComment` estendem suas props. Como a listagem nao precisa de campos especificos da subclasse, o presenter generico serve para ambos os casos.

O instrutor menciona: "nao vou estar listando nenhum id que e especifico do question comment, ele e mais generico para qualquer comentario". Isso mostra o principio de criar abstracoess no nivel certo — nao generico demais, nao especifico demais.

### O erro mais comum: esquecer o registro no modulo

O instrutor demonstra ao vivo o erro de esquecer de registrar o controller e o use case no modulo NestJS. Os testes falham, e a causa e simplesmente a falta do registro. Isso reforca que o checklist de criacao de controller DEVE incluir o registro no modulo como passo obrigatorio.

### Fluxo de desenvolvimento demonstrado

1. Criar o arquivo do controller (copiando de similar)
2. Fazer replace dos nomes (answers → comments)
3. Criar o presenter
4. Criar o teste e2e (copiando de similar)
5. Substituir factories no teste (AnswerFactory → QuestionCommentFactory)
6. Rodar testes → falha
7. Registrar no modulo
8. Rodar testes → passa

Esse fluxo mostra que o instrutor usa TDD de forma pragmatica: cria o controller, cria o teste, roda, e usa o erro para lembrar do que falta.

### Classe abstrata Comment e heranca

O instrutor explica que `Comment` e uma classe abstrata com `CommentProps`, e tanto `QuestionComment` quanto `AnswerComment` estendem essas props. Por isso o presenter pode trabalhar com o tipo base `Comment` — ele acessa apenas as props comuns definidas na classe abstrata.

## Conexao com o padrao geral do curso

Este controller segue exatamente o mesmo padrao dos outros controllers de listagem criados no curso:
- `FetchRecentQuestionsController`
- `FetchQuestionAnswersController`
- `FetchQuestionCommentsController`

A repeticao do padrao e intencional — o instrutor quer que o aluno internalize a estrutura ate que seja automatica.