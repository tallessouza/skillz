# Deep Explanation: Deletar Comentario da Resposta (Padrao Copy-and-Adapt)

## Por que a repeticao e aceitavel no inicio

O instrutor faz uma observacao importante sobre a psicologia do desenvolvimento: programadores ficam ansiosos com repeticao no inicio de um projeto e querem automatizar tudo (snippets, generators, abstrações). Mas essa repeticao massiva de criar entidades, repositorios, use cases e testes so acontece no **inicio** do desenvolvimento.

Depois que o projeto esta em producao, o trabalho muda para **manutencao**: ajustar coisas existentes, corrigir bugs, adicionar pequenas funcionalidades. Raramente se cria entidades novas do zero.

**Conclusao do instrutor:** "Cuidado em tentar automatizar demais as coisas agora, criar muitos snippets e tudo mais, porque isso não é o intuito porque dificilmente isso vai se manter dessa forma mais pra frente."

## O processo mecanico de copy-and-adapt

O instrutor demonstra uma sequencia especifica:

1. **Repository interface** — copiar os metodos `findById` e `delete` do `QuestionCommentsRepository` para o `AnswerCommentsRepository`, usando find-and-replace de `question` por `answer`

2. **Factory** — copiar `makeQuestionComment` para criar `makeAnswerComment`, mesmo processo de replace

3. **Use case** — copiar `delete-question-comment.ts` inteiro, replace `question` → `answer`

4. **Spec** — copiar `delete-question-comment.spec.ts` inteiro, replace `question` → `answer`

5. **Rodar testes** — `npm run test` para validar que tudo funciona

O instrutor enfatiza que o find-and-replace do VS Code facilita muito esse processo: "seleciono todo lugar que está escrito question, dou um replace e troco por answer. Show de bola, já ajustou tudo numa porrada só."

## A regra de autoria e uma invariante do dominio

A verificacao de que somente o autor pode deletar o comentario e identica em ambos os use cases. Isso nao e coincidencia — e uma **invariante do dominio**. Comentarios, sejam de perguntas ou respostas, pertencem a quem os escreveu. Essa regra nao muda com a entidade pai.

## Por que nao abstrair

Com dois use cases identicos (DeleteQuestionComment e DeleteAnswerComment), a tentacao e criar um `DeleteCommentUseCase` generico. O instrutor implicitamente rejeita isso ao manter os dois separados. Razoes:

- **Simplicidade** — cada use case e autocontido e facil de entender
- **Evolucao independente** — se as regras divergirem no futuro, nao precisa desfazer a abstracao
- **DDD** — no Domain-Driven Design, cada agregado tem seus proprios use cases, mesmo que semelhantes
- **Testabilidade** — testes isolados por use case sao mais claros que testes parametrizados