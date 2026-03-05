# Deep Explanation: Middleware de Autenticação no Fastify

## Por que nao bloquear direto no hook?

O instrutor explica um insight importante: nem toda rota que precisa saber quem é o usuario quer bloquear acesso de usuarios nao logados. Exemplo: uma rota que retorna dados publicos mas personaliza a resposta se o usuario estiver logado. Ao colocar `request.jwtVerify()` direto no pre-handler, TODA requisicao sem token é rejeitada. A solucao é expor um metodo `getCurrentUserId()` que a rota chama quando quiser — se a rota precisa de auth, chama o metodo e ele lanca erro; se nao precisa, simplesmente nao chama ou envolve em try/catch.

## Escopo no Fastify (conceito fundamental)

O Fastify tem um sistema de **encapsulamento por contexto**. Quando voce faz `app.addHook('preHandler', ...)` dentro de um plugin, esse hook so vale para as rotas registradas DENTRO daquele mesmo plugin/arquivo. Isso é por design — o Fastify isola contexto para evitar side effects globais.

O problema: quando voce cria um middleware de auth e registra ele numa rota com `app.register(auth)`, voce espera que o hook adicionado dentro do `auth` afete as rotas do arquivo que registrou. Mas sem `fastifyPlugin`, o hook fica preso no escopo interno.

### Como fastifyPlugin resolve

`fastifyPlugin` é um wrapper que diz ao Fastify: "este plugin NAO deve criar um novo contexto de encapsulamento". Ou seja, tudo que ele adiciona (hooks, decorators, etc.) vaza para o escopo pai — exatamente o que queremos para middlewares.

```
Sem fastifyPlugin:
  app.register(auth)  →  hooks ficam DENTRO do auth
  app.get(...)        →  NAO tem acesso aos hooks

Com fastifyPlugin:
  app.register(auth)  →  hooks vazam para o app pai
  app.get(...)        →  TEM acesso aos hooks
```

## Interface merging no TypeScript

O instrutor destaca uma feature especifica do TypeScript que muitos devs nao conhecem: **interfaces sao extensiveis por padrao**. Se voce declara `interface User { id: string }` e depois `interface User { name: string }`, o TypeScript combina ambas automaticamente. Isso NAO funciona com `type` — types nao fazem merge.

O Fastify usa `interface FastifyRequest` internamente. Ao criar um arquivo `@types/fastify.d.ts` com `declare module 'fastify'` e exportar uma `interface FastifyRequest` com novos metodos, o TypeScript automaticamente combina com a interface original. Resultado: `request.getCurrentUserId()` passa a ser reconhecido pelo TypeScript em toda a aplicacao.

### Detalhe do tsconfig

O instrutor encontrou um erro porque o `tsconfig.json` so incluia arquivos na pasta `src/`. O diretorio `@types/` na raiz nao era escaneado. Solucao: adicionar `"@types"` ao array `include` do tsconfig.

## Nomenclatura: middleware vs plugin

O instrutor reconhece que o Fastify chama tudo de "plugin", mas prefere usar "middleware" para este caso especifico porque a semantica é mais clara — um middleware é algo que intercepta requests, enquanto "plugin" é generico demais.