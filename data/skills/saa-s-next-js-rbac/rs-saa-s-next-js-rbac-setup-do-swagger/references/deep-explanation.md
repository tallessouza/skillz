# Deep Explanation: Setup do Swagger

## Por que documentar cedo?

O instrutor enfatiza um ponto critico: **se voce deixar pra documentar a API so no final, e um trabalhao que geralmente as pessoas nao fazem**. A documentacao deve crescer junto com a API. Cada rota nova ja nasce documentada.

## Como funciona a cadeia de integracao

A integracao funciona em 3 camadas:

1. **Zod** define os schemas de validacao (body, params, querystring, response)
2. **fastify-type-provider-zod** converte Zod schemas em JSON Schema usando `jsonSchemaTransform`
3. **@fastify/swagger** consome esses JSON Schemas e gera a especificacao OpenAPI completa

Essa cadeia significa que voce **nao precisa escrever documentacao separada** — os schemas Zod que voce ja usa para validacao sao a fonte unica de verdade.

## O papel do transform

A linha `transform: jsonSchemaTransform` e o elo critico. Sem ela, o Fastify Swagger nao entende schemas Zod. O transform vem do pacote `fastify-type-provider-zod` e converte a representacao Zod para JSON Schema padrao que o OpenAPI entende.

Na documentacao do fastify-type-provider-zod existe uma secao especifica "How to use together with Fastify Swagger" que o instrutor referencia.

## Swagger vs Swagger UI

- **@fastify/swagger**: Gera o JSON da especificacao OpenAPI. Esse JSON pode ser consumido por ferramentas externas como Swagger Hub, Postman, ou qualquer cliente OpenAPI.
- **@fastify/swagger-ui**: Renderiza esse JSON numa interface web navegavel. Registrado com `routePrefix: '/docs'`, serve a interface em `localhost:3333/docs`.

## Tags como organizacao

Tags no OpenAPI agrupam endpoints. O instrutor demonstra que ao adicionar `tags: ['auth']`, a rota aparece sob o grupo "auth" na UI. Todas as rotas com a mesma tag aparecem juntas — isso e essencial quando a API cresce para dezenas de endpoints.

## Summary como comunicacao

O campo `summary` aparece ao lado do endpoint na documentacao. O instrutor mostra que "as vezes so olhando pro metodo e o path nao da pra determinar o proposito da rota". O summary resolve isso com uma descricao curta como "Create a new account".

## O que o OpenAPI spec gera automaticamente

Quando configurado corretamente, a documentacao mostra:
- O request body esperado
- O schema completo com validacoes (min length, formato email, etc.)
- Os tipos de cada campo
- Tudo extraido diretamente dos schemas Zod