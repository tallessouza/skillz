# Deep Explanation: Value Object Detalhes da Pergunta

## Por que "Details" e nao o nome completo?

O instrutor deliberou sobre o nome: `QuestionWithAuthorAndAttachments` seria mais semantico, porem quando um Value Object agrega 2+ relacionamentos, o nome composto fica longo demais. O sufixo "Details" e uma convencao que sinaliza "esta entidade com todos os dados necessarios para visualizacao completa". E um ponto de equilibrio entre semantica e praticidade.

Para 1 relacionamento, o nome composto ainda funciona: `CommentWithAuthor`. O threshold e 2 relacionamentos — a partir dai, use `Details`.

## Por que nao substituir o metodo existente?

O instrutor enfatiza: "eu gosto de nao substituir os metodos, eu gosto de criar novos metodos". A razao e que diferentes rotas precisam de diferentes niveis de dados:

- **Listagem de perguntas**: nao precisa de anexos (nao sao visiveis na listagem)
- **Detalhe de pergunta**: precisa de autor + anexos (usuario clicou para ver tudo)

Se voce substituir `findBySlug` para retornar `QuestionDetails`, todas as rotas que usam esse metodo passam a fazer queries desnecessarias para buscar anexos e autor.

## Prefixar IDs em Value Objects

Value Objects nao pertencem a uma entidade especifica. Quando voce tem `questionId`, `authorId`, `bestAnswerId` no mesmo VO, o prefixo e essencial para distinguir. Dentro de uma entidade `Question`, voce pode usar `id` porque o contexto e implicito. No VO, o contexto precisa ser explicito.

## Reuso de classes vs criacao de novas estruturas

O instrutor explica: "a minha entidade de anexo ela so tem dois campos, titulo e url, que sao todos os campos que eu quero. Entao nao tem porque eu criar uma nova estrutura aqui dentro."

A regra e pragmatica:
- Se precisa de todos os campos → reuse a classe
- Se precisa de um subconjunto pequeno de uma classe grande → crie interface inline

## Throws no In-Memory Repository

Os `throw new Error` no repositorio in-memory NAO sao para producao — sao guardas de teste. Se o autor nao existe quando voce busca detalhes de uma pergunta, significa que o teste esqueceu de criar o autor. O erro explicito te diz exatamente o que faltou, ao inves de um `Cannot read property 'name' of undefined` generico.

## Fluxo completo: do repositorio intermediario ao dado final

O instrutor mostra um padrao de "hop" entre repositorios:

1. `questionAttachmentsRepository` — contem o RELACIONAMENTO (questionId ↔ attachmentId)
2. `attachmentsRepository` — contem os DADOS do anexo (titulo, url)

Voce precisa dos dois: primeiro descobre QUAIS anexos pertencem a pergunta (repo 1), depois busca OS DADOS de cada anexo (repo 2). Esse padrao de dois hops e comum em DDD quando o relacionamento many-to-many e modelado como entidade separada.

## O que o instrutor pulou (e por que)

O instrutor explicitamente pulou a criacao do Value Object para respostas com autor (`AnswerWithAuthor` para a rota `fetchQuestionAnswers`), dizendo que "seria exatamente a mesma coisa que a gente fez para o comentario" e "nao adicionaria qualquer tipo de aprendizado". Isso confirma que o padrao `WithAuthor` para 1 relacionamento ja foi estabelecido em aula anterior, e esta aula foca no caso mais completo de 2+ relacionamentos.