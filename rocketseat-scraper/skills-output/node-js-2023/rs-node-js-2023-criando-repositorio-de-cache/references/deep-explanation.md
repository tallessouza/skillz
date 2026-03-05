# Deep Explanation: Cache Repository em Clean Architecture

## Por que cache NAO pertence ao domain?

O instrutor enfatiza que o use-case `GetQuestionBySlug` faz `questionsRepository.findDetailsBySlug(slug)` e **nao se interessa** de onde vem os dados — Redis, Postgres, arquivo, API externa. Se colocarmos um `if` no use-case ("se tem cache, pega do cache, senao pega do banco"), estamos colocando codigo de **otimizacao de infraestrutura** dentro da camada de negocio.

Esses condicionais nao sao regra de negocio. Sao decisoes de persistencia. O use-case deve permanecer "sem saber" se cache existe ou nao.

## Modelo mental: cache como proxy transparente

Pense no cache como um proxy entre o use-case e o banco. O use-case chama o repositorio. O repositorio (na camada de infra) decide internamente se vai ao cache ou ao banco. O use-case nunca percebe a diferenca.

## Quando cachear: a regra dos "15 usuarios em 10 minutos"

O instrutor propoe uma heuristica pratica: olhe para um recurso e pergunte — "se 15 pessoas acessarem isso em 10 minutos, elas verao a mesma coisa?" Se sim, e cacheavel. Se nao (como listagens paginadas com filtros dinamicos), o cache provavelmente nao vale a complexidade.

### Por que listagens paginadas sao problematicas para cache

- Cada pagina e um cache diferente
- Filtros multiplicam as combinacoes (titulo, data, ordenacao)
- Novas perguntas surgem a cada minuto, invalidando caches constantemente
- A complexidade de gerenciar essas chaves supera o beneficio

### Exemplos de bons candidatos a cache

- Detalhes de uma pergunta (titulo, autor, respostas recentes) — mudam raramente
- Perfil de usuario — muda esporadicamente
- Configuracoes da aplicacao — quase nunca mudam

## Cache e dados desatualizados: e normal

O instrutor usa o exemplo do GitHub: ao trocar sua foto de perfil, voce precisa dar F5 varias vezes ate a foto atualizar. Isso e cache. Quando trabalhamos com cache, aceitamos que informacoes podem ficar desatualizadas por um tempo. O importante e que nao fiquem desatualizadas **para sempre**.

## Invalidacao de cache

A invalidacao e o ato de **deletar** uma entrada do cache quando o dado original muda. Exemplo: usuario altera o titulo da pergunta → deletamos `question:abc:details` do cache → proximo acesso busca do banco e recria o cache atualizado.

## Por que string (JSON) e nao estruturas nativas do Redis?

Redis suporta hashes, lists, sets, etc. Mas o instrutor argumenta que para cache simples, serializar como JSON string e suficiente porque:
- Nao precisamos fazer queries nos dados cacheados
- Nao precisamos filtrar ou percorrer os dados
- Se precisassemos buscar "cache onde valor contem propriedade X", ai sim usariamos estruturas nativas

## Classe abstrata vs interface

No NestJS, interfaces nao funcionam bem com Dependency Injection (DI) porque interfaces sao apagadas em runtime pelo TypeScript. Classes abstratas mantem a referencia em runtime, permitindo que o container de DI resolva a dependencia corretamente.