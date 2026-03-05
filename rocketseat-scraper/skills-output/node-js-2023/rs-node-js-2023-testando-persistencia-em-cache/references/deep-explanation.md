# Deep Explanation: Testando Persistencia em Cache

## Por que testar no repositorio e nao no controller?

O instrutor explica que o metodo `findDetailsBySlug` do repositorio e o ponto onde o cache acontece. Embora hoje ele seja chamado por um controller especifico, nao ha garantia de que sera sempre assim. O metodo pode ser chamado por qualquer parte da aplicacao. Portanto, o teste deve estar associado ao repositorio, nao ao controller.

A frase chave: "Não necessariamente aquele método no repositório vai ser chamado especificamente só por um controller, ele pode ser chamado por qualquer coisa."

## A tecnica dos dados falsos para provar cache hit

Este e o insight mais valioso da aula. Para provar que o metodo realmente le do cache (e nao do banco de dados), o instrutor pre-popula o cache com dados arbitrarios (`{ empty: true }`) antes de chamar o metodo.

Se o metodo retornar `{ empty: true }`, isso prova inequivocamente que ele leu do cache, porque esses dados nao existem no banco de dados. O instrutor destaca: "Eu não estou colocando realmente os question details porque esse método findDetailsBySlug ele vai lá, bate no cache e retorna qualquer coisa que tem em cache. Ele não valida que aquelas informações seguem o formato específico."

Essa tecnica funciona porque:
1. O cache e verificado ANTES da query ao banco
2. O metodo retorna o que encontrar no cache sem validacao de schema
3. Dados arbitrarios no retorno = prova de cache hit

## Isolamento do Redis entre ambientes

Assim como o Prisma altera a URL do banco de dados para cada teste, o Redis usa indices de banco de dados (0-15 por padrao) para isolar ambientes. A configuracao `REDIS_DB=1` no `.env.test` garante que testes usem um banco separado.

A diferenca critica entre `flushDB` e `flushAll`:
- `flushDB`: apaga apenas o banco selecionado (pelo indice DB)
- `flushAll`: apaga TODOS os bancos do Redis — perigoso em ambiente compartilhado

## Tipagem de variaveis ambiente com envSchema

O instrutor mostra um pattern importante: em vez de usar `process.env` diretamente (sem autocomplete), ele usa `envSchema.parse(process.env)` para obter uma variavel `env` tipada. Isso da autocomplete no editor e validacao em runtime.

## Os tres comportamentos essenciais de cache

Todo sistema de cache deve ter testes para:

1. **Cache write**: apos a primeira chamada, os dados estao no cache
2. **Cache read**: chamadas subsequentes retornam do cache (nao do banco)
3. **Cache invalidation**: operacoes de escrita limpam o cache

Sem testar os tres, voce pode ter bugs silenciosos como:
- Cache nunca sendo escrito (performance nao melhora)
- Cache nunca sendo lido (cache existe mas nao e usado)
- Cache nunca sendo invalidado (dados stale/desatualizados)