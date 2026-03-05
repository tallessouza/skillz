# Deep Explanation: Controller Deletar Comentario da Resposta

## Padrao Copy-Adapt em Clean Architecture NestJS

O instrutor demonstra um padrao recorrente no desenvolvimento de controllers NestJS em clean architecture: **copiar o controller analogo mais proximo e adaptar**. Neste caso, o `deleteQuestionComment` serve de base para o `deleteAnswerComment`.

### Por que esse padrao funciona

Em uma arquitetura limpa, controllers de mesma operacao (DELETE) sobre entidades similares (QuestionComment vs AnswerComment) tem estrutura identica:
- Mesmo decorator HTTP (`@Delete()`)
- Mesmo status code (204 No Content)
- Mesmos parametros (ID via `@Param`, usuario via `@CurrentUser`)
- Mesma delegacao para use case

A unica diferenca esta nos nomes de entidade e rotas.

### O bug sutil do copy-paste

O momento mais revelador da aula e quando os testes falham com **500 ao inves de 204**. O instrutor investiga e descobre que o repositorio Prisma (`prisma-answer-comment-repository`) estava referenciando `question` ao inves de `comment` na query de delete.

Esse e um bug classico de copy-paste: ao copiar o repositorio de QuestionComment para AnswerComment, uma referencia ficou apontando para a entidade errada. O erro so aparece em runtime porque TypeScript nao consegue validar strings de query do Prisma em tempo de compilacao.

**Licao:** Sempre que copiar codigo entre entidades, verifique TODAS as referencias internas, especialmente queries de banco de dados.

### Cadeia de dependencias no teste e2e

Para testar a delecao de um AnswerComment, o teste precisa criar toda a cadeia:

1. **Question** — porque Answer depende de Question
2. **Answer** — porque AnswerComment depende de Answer
3. **AnswerComment** — o objeto alvo da delecao

Isso exige que o teste tenha acesso a tres factories: `QuestionFactory` (implicitamente, via setup), `AnswerFactory` e `AnswerCommentFactory`. Cada factory precisa ser registrada como provider no `TestingModule`.

### Registro no HTTP Module

O instrutor enfatiza que tanto o controller quanto o use case precisam ser adicionados ao `http.module.ts`. Esse e um passo facil de esquecer e que resulta em rotas silenciosamente inexistentes (NestJS nao lanca erro para controllers nao registrados).

### Checklist de adaptacao ao copiar controller

1. Trocar todos os nomes de entidade (QUESTION → ANSWER)
2. Atualizar a rota (`/questions/comments/:id` → `/answers/comments/:id`)
3. Renomear parametro ID (`questionCommentId` → `answerCommentId`)
4. Importar use case correto
5. Registrar no http.module.ts
6. No teste: trocar factories e criar cadeia de dependencias completa
7. Verificar repositorio Prisma por referencias cruzadas