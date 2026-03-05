# Deep Explanation: Controller Responder Pergunta

## Por que prefixar parametros em rotas aninhadas

O instrutor enfatiza um ponto crucial: quando voce tem um recurso encadeado (answer pertence a question), o parametro na URL **nao e o id do recurso principal**. O recurso principal e a resposta (answer), nao a pergunta. A pergunta e apenas uma informacao contextual.

Por isso, usar apenas `:id` causa ambiguidade — o leitor do codigo nao sabe se e o id da resposta ou da pergunta. Usar `:questionId` elimina essa duvida.

O instrutor tambem menciona que mais pra frente pode existir um `:id` na mesma rota (para a resposta em si), e ai a confusao seria ainda maior. Se quiser padronizar para sempre ter prefixo (como `:answerId`), tambem funciona.

## Rota como categorizacao do recurso

A rota `/questions/:questionId/answers` nao e uma rota de perguntas — e uma rota de **respostas**. A pergunta aparece na URL apenas como contexto hierarquico. Essa distincao e importante para:

- Organizacao mental do codigo
- Nomeacao do controller (`AnswerQuestionController`, nao `QuestionAnswerController`)
- Escolha do metodo HTTP (POST cria uma **resposta**, nao uma pergunta)

## Naming semantico: authorId vs instructorId

O instrutor originalmente usou `instructorId` no use case, mas mudou para `authorId` porque semanticamente qualquer usuario (aluno ou instrutor) pode responder uma pergunta. A parte de autorizacao (quem **pode** responder) sera tratada depois, mas o **nome** do campo deve refletir o dominio real desde o inicio.

## Estrategia de teste E2E

O instrutor copia o teste de `edit-question` (nao `create-question`) porque o edit ja tem o factory de question configurado. Isso e uma decisao pragmatica — reusar setup de teste que ja cria os dados necessarios.

O teste:
1. Cria uma question via factory
2. Faz POST em `/questions/:questionId/answers` com conteudo `"new answer"`
3. Verifica status 201
4. Busca no banco se existe um answer com conteudo `"new answer"`

## Checklist de registro no module

O instrutor ja sabe antecipadamente que o teste vai falhar antes de registrar o controller e use case no module. Isso e um padrao recorrente no NestJS: todo novo controller precisa de:

1. Controller adicionado ao array `controllers` do module
2. Use case adicionado ao array `providers` do module
3. `@Injectable()` no use case

Esquecer qualquer um desses passos resulta em erro silencioso ou endpoint inexistente.