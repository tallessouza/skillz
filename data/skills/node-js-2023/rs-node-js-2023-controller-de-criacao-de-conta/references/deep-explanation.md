# Deep Explanation: Controller por Rota no NestJS

## Por que um controller por rota?

O instrutor Diego explica o problema com o padrao MVC tradicional onde um controller acumula varias rotas. Ele da um exemplo concreto: imagine um controller de CRUD de usuarios e outro de CRUD de grupos. Quando surge uma rota para "adicionar usuario a um grupo", voce cai numa decisao: coloco no controller de grupo ou no de usuario? Essa indecisao so piora conforme a aplicacao cresce.

Alem disso, arquivos de controller ficam enormes. A solucao e simples: um arquivo por rota. O nome do arquivo descreve exatamente o que a rota faz (`create-account.controller.ts`).

## O sufixo `.controller.ts`

Diego esclarece que o sufixo NAO e obrigatorio no NestJS. A vantagem e que funciona como uma "extensao" que editores podem reconhecer. Ele menciona a extensao "Symbols" do VSCode, onde voce pode configurar icones customizados para arquivos `.controller.ts`. Fora isso, nao ha obrigatoriedade tecnica.

## Prefixo na classe vs no metodo

Com um controller por rota, Diego prefere colocar o prefixo (`/accounts`) no decorator `@Controller` e deixar `@Post()` vazio. Sua justificativa: "fica mais visivel para o usuario, assim que ele abre o arquivo ja esta bem ali em cima". Ele menciona que o inverso (prefixo no metodo) tambem funciona, mas com uma rota por controller, no `@Controller` e mais legivel.

## O metodo `handle`

Como so existe uma rota por controller, o metodo se chama simplesmente `handle`. Nao ha necessidade de nomes descritivos como `createAccount` quando o arquivo inteiro ja se chama `create-account.controller.ts`.

## Body com decorators

Diego contrasta com o Express: "no Express, a gente pegaria o request e response. No Nest, a gente usa decorators." Ele explica que uma requisicao pode ter parametros, query, headers, body — e voce nao precisa pegar tudo. O `@Body()` seleciona apenas o corpo da requisicao. Isso e um conceito central do NestJS: decorators para selecionar partes da requisicao.

## Strict mode no TypeScript

Diego faz uma pausa para corrigir o tsconfig: "uma das coisas que eu acho que e um defeitinho do NestJS, a template padrao vem sem strict como true". Ele demonstra o impacto: sem `strictNullChecks`, o `findUnique` nao indica que o retorno pode ser `null`. Com strict habilitado, o TypeScript forca voce a tratar o caso nulo. "Em todos os projetos, eu uso isso como true sempre."

## Exceptions tipadas

O NestJS oferece exceptions especificas que mapeiam diretamente para HTTP status codes. Diego mostra que ao digitar "exception" no editor, aparecem varias opcoes: `ConflictException` (409), `NotFoundException` (404), `ForbiddenException` (403), `BadRequestException` (400), etc. Ele escolhe `ConflictException` para o caso de email duplicado, passando uma mensagem descritiva.

Sem tratamento, o NestJS retorna um generico "Internal Server Error" (500) com detalhes do erro do Prisma — informacao que nao deveria vazar para o cliente.

## HttpCode decorator

Diego explica que rotas POST no NestJS automaticamente retornam 201. O `@HttpCode(201)` pode parecer redundante, mas torna explicito o status code esperado. Isso e util quando voce quer mudar o padrao (por exemplo, uma rota POST que retorna 200).

## Registro no AppModule

Todo controller criado precisa ser registrado no array `controllers` do `AppModule`. Diego mostra que ao salvar e iniciar o servidor, o NestJS loga quais controllers foram mapeados e suas rotas. Mais tarde, quando houver muitos controllers, esses logs podem ser desativados com `NestFactory.create(AppModule, { logger: false })`.