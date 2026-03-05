# Deep Explanation: Controller de Criacao de Academia

## Por que separar rotas por recurso?

O instrutor explica que quando todas as rotas ficam num unico arquivo, cada rota que precisa de autenticacao exige um `onRequest: [verifyJWT]` individual. Isso e repetitivo e propenso a erros (esquecer de adicionar em uma rota nova).

A solucao e agrupar rotas por recurso. Quando um recurso inteiro exige autenticacao (como academias), voce aplica `app.addHook('onRequest', verifyJWT)` uma unica vez no topo do arquivo — todas as rotas registradas **abaixo** desse hook herdam a verificacao automaticamente.

O Fastify chama isso de "hook", mas o instrutor prefere o termo "middleware" por ser mais universal. Funcionalmente, e a mesma coisa: uma funcao que executa antes de cada handler de rota.

## Por que a separacao nao quebrou imports?

O instrutor menciona que ao mover arquivos para subpastas, nenhum import quebrou porque o projeto usa path aliases (`@/`). O alias sempre resolve para o caminho correto independente de onde o arquivo esta fisicamente. Isso e uma vantagem pratica de configurar `@` como alias no `tsconfig.json`.

## Zod refine() — quando usar

O Zod tem validacoes nativas como `.min()`, `.max()`, `.positive()`, `.negative()`. Mas para validacoes que nao sao padrao (como "latitude deve estar entre -90 e 90"), usa-se `.refine()`.

O `refine()` recebe o valor do campo e retorna `true` (passou) ou `false` (falhou). O instrutor usa `Math.abs(value) <= 90` porque latitude pode ser tanto -90 quanto +90. `Math.abs()` transforma qualquer numero em positivo, simplificando a comparacao para um unico check.

Para longitude, o limite e 180 (tanto -180 quanto +180).

## Por que omitir try/catch no controller de criacao de academia

O instrutor destaca que o `CreateGymUseCase` nao lanca nenhum erro customizado (diferente do registro de usuario que pode lancar "email ja existe"). Como nao ha erro especifico para tratar, o try/catch e desnecessario — qualquer erro inesperado sera capturado pelo global error handler do Fastify.

Isso evita codigo defensivo desnecessario e mantém o controller limpo.

## Padrao de criacao de controller

O instrutor copia o controller de registro de usuario como base, demonstrando que controllers seguem um padrao consistente:

1. Definir schema Zod para o body
2. Fazer parse do `request.body`
3. Instanciar o use case via factory
4. Chamar `.execute()` com os dados validados
5. Retornar o status code adequado