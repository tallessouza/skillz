# Deep Explanation: Teste de Edição com WatchedList

## Por que pre-popular o repositório de relacionamentos?

O instrutor explica que ao testar edição, você precisa simular um estado existente no banco de dados. A pergunta já foi criada COM anexos — então antes de testar a edição, o repositório de attachments precisa refletir esse estado inicial.

A técnica é usar `.items.push()` diretamente no array interno do repositório in-memory. O instrutor reconhece que "aqui não é um problema" fazer isso em testes, mesmo sem usar um método `create` formal.

## O cenário de diff: 1,2 → 1,3

O exemplo central da aula:
- Estado inicial: attachments com IDs `1` e `2`
- Edição: passa IDs `1` e `3`
- Resultado esperado: remove `2`, adiciona `3`, mantém `1`

Isso demonstra o poder da WatchedList: ela rastreia o que foi adicionado e removido, então o repositório só executa as operações necessárias (DELETE do 2, INSERT do 3), em vez de deletar tudo e recriar.

## Repositório in-memory de attachments

O instrutor cria o `InMemoryQuestionAttachmentsRepository` copiando do `InMemoryQuestionCommentsRepository` e adaptando:
- Remove `findById` (não necessário para attachments)
- Remove paginação do `findManyByQuestionId` (attachments não pagina)
- Mantém apenas `filter` por `questionId`

## Teste de edição não-autorizada

Para o caso "should not be able to edit a question from another user", o instrutor simplifica passando `attachmentsIds: []` vazio, porque o teste vai falhar na verificação de autorização antes de chegar na lógica de attachments. O foco do teste é a permissão, não os anexos.

## Analogia do instrutor sobre WatchedList

> "É basicamente um array que a gente pode observar, manter informações sobre itens removidos e adicionados. Então, é um array com mais dados."

O instrutor enfatiza que o ganho real aparece quando integrar com banco de dados real, porque:
- Sem WatchedList: deletar tudo e recriar (ineficiente)
- Com WatchedList: apenas DELETE dos removidos e INSERT dos adicionados

## Factory de test helpers

O instrutor cria `makeQuestionAttachment` copiando de `makeQuestionComment` e adaptando:
- Remove `authorId`
- Adiciona `attachmentId: new UniqueEntityId()`
- Remove dependência do faker (não precisa de dados fake)