# Deep Explanation: Controllers das Rotas de Check-ins

## Por que separar schemas por fonte (body, params, query)?

O instrutor encontra um bug ao vivo durante a aula: nos controllers de `nearby` e `search` de gyms, ele estava usando `request.body` quando deveria usar `request.query`. Em rotas GET, parametros de filtro e paginacao vem na query string, nao no body. Esse erro so seria pego nos testes e2e, mas ao revisar o codigo dos check-ins, ele antecipa e corrige.

A licao: criar schemas Zod separados para cada fonte (`bodySchema`, `paramsSchema`, `querySchema`) forca voce a pensar de onde cada dado vem. Misturar tudo num schema so esconde a origem e causa bugs silenciosos.

## Por que o ID da academia vai na URL?

O instrutor pondera entre duas opcoes:
1. Receber `gymId` no body da requisicao
2. Colocar `gymId` como parametro na URL: `POST /gyms/:gymId/check-ins`

Ele prefere a segunda porque o check-in **sempre** pertence a uma academia. A URL expressa essa relacao de pertencimento (recurso aninhado). Alem disso, e mais RESTful — a URL descreve o recurso sendo criado.

## Por que PATCH e nao PUT para validacao?

Validar um check-in altera apenas um campo (`validated_at`). PUT implica substituicao completa do recurso. PATCH e semanticamente correto para atualizacao parcial. O status 204 (No Content) e retornado porque nao ha corpo de resposta necessario — a operacao de validacao nao precisa devolver dados.

## Padrao de organizacao por recurso

Cada recurso (users, gyms, check-ins) tem sua propria pasta com:
- `routes.ts` — registra todas as rotas do recurso e hooks compartilhados
- Um arquivo por controller/acao

O hook `verifyJwt` e adicionado uma unica vez no `routes.ts` e se aplica a todas as rotas do recurso. Isso evita repetir a verificacao de autenticacao em cada controller individual.

## O ID do usuario vem do token, nunca do client

Para obter o usuario logado, o instrutor usa `request.user.sub` (extraido do JWT pelo Fastify). Nunca receber o userId do body ou query — isso seria uma vulnerabilidade de seguranca onde um usuario poderia fazer check-in em nome de outro.

## Factory pattern para use cases

O controller nunca instancia o use case diretamente. Sempre usa `makeXxxUseCase()` que encapsula a construcao do repositorio e injecao de dependencias. O controller nao conhece e nao deve conhecer os detalhes de infraestrutura.

## Correcao ao vivo: body vs query

O instrutor percebe durante a aula que cometeu um erro em controllers anteriores (nearby e search de gyms): usou `request.body` em rotas GET quando deveria ser `request.query`. Ele corrige imediatamente e comenta que sem essa correcao, os testes e2e falhariam depois. Isso reforça a importancia de schemas tipados por fonte.