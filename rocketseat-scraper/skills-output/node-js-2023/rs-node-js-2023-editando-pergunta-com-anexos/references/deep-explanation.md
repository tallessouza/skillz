# Deep Explanation: Editando Pergunta com Anexos via WatchedList

## Por que nao carregar filhos no findById

O instrutor explica um ponto crucial de design: quando voce busca uma pergunta do banco de dados com `findById`, os anexos NAO vem junto. Isso e intencional.

A razao e que perguntas e anexos vivem em tabelas diferentes. Existem muitos lugares no sistema onde voce precisa dos dados da pergunta mas NAO precisa dos anexos. Carregar anexos toda vez que busca uma pergunta seria um "carregamento desnecessario de dados do banco de dados".

Isso significa que na edicao, o campo `attachments` da entidade `Question` estara vazio. Voce NAO pode comparar a lista de IDs que esta chegando com a lista que ja tem dentro da question, porque essa lista esta vazia.

A solucao: criar um repositorio separado (`QuestionAttachmentsRepository`) com um metodo `findManyByQuestionId` para buscar os anexos atuais APENAS quando necessario (no caso, na edicao).

## O papel do compareItems

O metodo `compareItems` na WatchedList e usado internamente pela classe para determinar se dois itens sao "o mesmo item". Sem ele, a WatchedList nao consegue saber quais itens foram adicionados, quais foram removidos, e quais permaneceram.

Para anexos, o criterio e simples: se o `attachmentId` e igual, e o mesmo anexo. O `compareItems` retorna `a.attachmentId.equals(b.attachmentId)`.

## Fluxo completo da edicao

1. Recebe request com `questionId` + `attachmentIds` (nova lista desejada)
2. Busca a question via `questionsRepository.findById(questionId)` — attachments vazio
3. Busca anexos atuais via `questionAttachmentsRepository.findManyByQuestionId(questionId)`
4. Cria `QuestionAttachmentList` com os anexos atuais (estado "original")
5. Cria array de novos `QuestionAttachment` a partir dos `attachmentIds` recebidos
6. Chama `attachmentList.update(newAttachments)` — WatchedList calcula:
   - `getNewItems()`: itens que estao na nova lista mas nao na original (adicionados)
   - `getRemovedItems()`: itens que estavam na original mas nao na nova (removidos)
7. Atribui a lista atualizada na question
8. Salva via repositorio — o repositorio pode usar as listas de added/removed para fazer INSERT/DELETE precisos

## Analogia com o teste da WatchedList

O instrutor faz uma conexao direta: "e muito semelhante ao que a gente fez no teste da WatchedList pro update". Na aula anterior, testaram o metodo `update` isoladamente. Agora, na edicao real, o fluxo e identico — a diferenca e que os "itens atuais" vem do banco de dados via repositorio, nao de um array hardcoded.

## Mudancas necessarias ao adotar WatchedList

Ao trocar `QuestionAttachment[]` por `QuestionAttachmentList`, varios pontos quebram:

1. **Setter da entidade**: precisa aceitar `QuestionAttachmentList` ao inves de array
2. **Valor padrao**: `[]` vira `new QuestionAttachmentList([])`
3. **Create question use case**: `QuestionAttachment[]` passa a ser wrappado em `new QuestionAttachmentList(items)`
4. **Testes**: acessar `.attachments` nao retorna mais array direto — precisa de `.currentItems`

O instrutor enfatiza que essas mudancas sao mecanicas mas necessarias para que o sistema de tracking funcione corretamente.