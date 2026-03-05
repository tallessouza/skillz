# Deep Explanation: Hooks Globais no Fastify

## O modelo de contexto do Fastify (encapsulamento)

O conceito mais importante desta aula e o **encapsulamento de plugins do Fastify**. Quando voce usa `app.register()`, o Fastify cria um contexto isolado. Tudo que voce registra dentro desse plugin — hooks, decorators, plugins internos — fica **confinado** aquele escopo.

O instrutor demonstra isso de forma pratica: ele cria um `addHook('preHandler')` dentro do `transactionsRoutes` e depois cria uma rota `/hello` diretamente no `server.ts`. Ao chamar `/hello`, o hook **nao dispara**. Isso prova que o contexto do plugin e isolado.

### Analogia do instrutor

O instrutor usa a palavra "plugin" de forma intencional — cada arquivo de rotas registrado com `app.register()` e um plugin. E cada plugin e uma "parte separada da aplicacao" com "contexto especifico". Essa e a diferenca fundamental entre Fastify e Express: no Express, middleware global e realmente global. No Fastify, "global" dentro de um plugin significa "global para aquele plugin".

## Lifecycle hooks disponiveis

O instrutor menciona que ao digitar `app.addHook()`, o Fastify oferece varias opcoes:

- **onRequest** — primeiro hook, antes de qualquer parsing
- **preParsing** — antes de parsear o body
- **preValidation** — antes de validar o schema
- **preHandler** — depois de validar, antes de executar o handler (mais usado)
- **preSerialization** — antes de serializar a resposta
- **onResponse** — depois de enviar a resposta

O `preHandler` foi escolhido porque e o mesmo tipo usado no `checkSessionIdExists` — executa antes do handler da rota, ideal para validacoes e logging.

## A solucao para hooks verdadeiramente globais

O instrutor mostra a solucao: mover o `addHook` para fora do plugin, no `server.ts`, **antes** de qualquer `app.register()`. Isso registra o hook no contexto raiz do Fastify, que e herdado por todos os plugins filhos.

A ordem importa: o hook deve ser registrado antes dos plugins para que os plugins o herdem.

## Separacao de responsabilidades

O instrutor recomenda extrair a funcao do hook para um arquivo separado, da mesma forma que foi feito com `checkSessionIdExists`. Isso segue o mesmo pattern ja estabelecido na aplicacao — funcoes de middleware em arquivos proprios, importadas por referencia.

## Caso de uso mencionado

O instrutor deixa claro que nesta aplicacao especifica nao ha caso de uso para hook global, mas demonstra o pattern com um logger simples usando template literals:

```typescript
console.log(`[${request.method}] ${request.url}`)
```

Exemplos de uso real mencionados: logging de requisicoes, validacoes globais, verificacoes de autenticacao que se aplicam a todas as rotas.