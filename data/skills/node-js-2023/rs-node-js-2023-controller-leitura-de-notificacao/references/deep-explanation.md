# Deep Explanation: Controller de Leitura de Notificacao

## Por que PATCH e nao PUT ou POST?

O instrutor explica o raciocinio semantico: quando voce le uma notificacao, voce nao esta "atualizando a notificacao" (PUT implicaria substituir o recurso inteiro). Voce esta atualizando **uma unica informacao** — o campo `readAt`. Por isso PATCH e o metodo mais semanticamente correto.

O instrutor tambem menciona que POST seria aceitavel se voce pensar como "estou criando um evento de leitura", mas conclui que PATCH faz mais sentido neste contexto porque a operacao e claramente uma atualizacao parcial de um recurso existente.

## Decisao: 204 No Content

A rota nao retorna dados. Quando o cliente marca uma notificacao como lida, ele ja sabe qual notificacao e — nao precisa de confirmacao com body. O 204 comunica: "operacao realizada com sucesso, sem conteudo para retornar."

Isso tambem significa remover qualquer `return` no final do metodo do controller e remover imports de presenters, ja que nao ha transformacao de dados para resposta.

## Pattern: Factory de dominio vs Factory Prisma

O projeto ja tinha uma factory de notificacao a nivel de dominio (para testes unitarios). Para o teste E2E, o instrutor precisou criar a **PrismaNotificationFactory** — que persiste a notificacao no banco de dados real.

O pattern e consistente com o que ja existia para Questions:
1. Factory de dominio: `makeNotification()` — cria entidade em memoria
2. Factory Prisma: `makePrismaNotification()` — usa PrismaService para persistir

A factory Prisma e decorada com `@Injectable()` e recebe `PrismaService` via DI.

## Validacao de ownership

O instrutor destaca que nao basta receber o `notificationId` — e preciso tambem pegar o usuario atual (`@CurrentUser()`) e passar o `recipientId` para o use case. O use case e responsavel por verificar que a notificacao pertence ao usuario que esta tentando le-la.

Isso segue o principio de que **autorizacao e responsabilidade do use case**, nao do controller. O controller apenas coleta os dados necessarios (notificationId + userId) e delega.

## Erros genericos vs especificos

Diferente de outros controllers onde erros especificos foram criados (como `ResourceNotFoundError`), aqui o instrutor optou por um `BadRequestException` generico. A justificativa: os erros possiveis na leitura de notificacao sao suficientemente genericos para nao justificar classes de erro dedicadas.

## Estrategia de teste isolado

O instrutor mostra como testar apenas um controller especifico usando o path do arquivo:
```bash
--source infra/http/controllers/read-notification.controller.e2e-spec
```

Isso evita rodar toda a suite de testes E2E durante desenvolvimento, acelerando o ciclo de feedback.

## Quando use case NAO precisa de controller

O instrutor faz uma distincao importante: `SendNotification` nao tem controller porque o envio de notificacao acontece via **eventos** (domain events), nao via requisicao HTTP do usuario. Apenas `ReadNotification` precisa de controller porque e uma acao iniciada pelo usuario.

Regra geral: se a acao e iniciada pelo usuario via HTTP → precisa de controller. Se e iniciada por evento interno → nao precisa.