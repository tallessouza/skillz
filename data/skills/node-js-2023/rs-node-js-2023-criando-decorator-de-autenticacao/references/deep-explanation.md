# Deep Explanation: Custom Decorator de Autenticacao

## Por que nao usar @Request()?

O NestJS roda em cima do Express por padrao. Quando voce usa `@Req()` ou `@Request()`, voce esta importando o tipo `Request` do Express e acessando o objeto inteiro da requisicao. Isso tem varios problemas:

1. **Acoplamento ao Express** — se migrar para Fastify, quebra
2. **Sem tipagem no `user`** — `request.user` e `any` por padrao
3. **Acesso excessivo** — o controller nao precisa de headers, cookies, etc., so do usuario

O instrutor mostra exatamente isso: "nao acho tao legal pegar o request inteiro. Ate porque tem que vir a tipagem aqui do Express e tal."

## createParamDecorator vs outros tipos de decorator

O NestJS tem diferentes funcoes para criar decorators:

- **`createParamDecorator`** — para parametros de metodo (como `@Body()`, `@Param()`, `@Query()`)
- **Class decorators** — como `@Controller()`, `@Injectable()`
- **Method decorators** — como `@Get()`, `@Post()`

O `@CurrentUser()` e um **parameter decorator** porque ele decora um parametro da funcao handler, assim como `@Body()` decora o parametro que recebe o corpo da requisicao.

## Os dois parametros do createParamDecorator

A funcao callback recebe dois parametros:

1. **`data`** — o que voce passa dentro dos parenteses do decorator. Ex: `@CurrentUser('sub')` passaria `'sub'` como data. Quando nao ha parametros, use `_: never` para documentar que nunca sera usado.

2. **`context: ExecutionContext`** — o contexto da requisicao. Dele voce pode extrair:
   - A classe onde o decorator foi chamado
   - O metodo onde esta aplicado
   - Os argumentos do metodo
   - A requisicao HTTP via `context.switchToHttp().getRequest()`

## A cadeia: switchToHttp().getRequest()

O `ExecutionContext` e generico — funciona para HTTP, WebSockets, gRPC. Por isso voce precisa chamar `switchToHttp()` para converter para o contexto HTTP, e entao `getRequest()` para pegar o objeto request onde o Guard ja injetou o `user`.

## Evolucao do nome: TokenPayload → UserPayload

O instrutor comeca nomeando como `TokenPayload`/`TokenSchema` mas depois renomeia para `UserPayload` porque e mais semantico — no contexto do controller, voce esta trabalhando com "dados do usuario", nao com "dados do token". O token e um detalhe de implementacao da autenticacao.

## Fluxo completo

```
Request com JWT → JwtAuthGuard valida → injeta user no request → @CurrentUser() extrai e tipa → controller recebe UserPayload
```