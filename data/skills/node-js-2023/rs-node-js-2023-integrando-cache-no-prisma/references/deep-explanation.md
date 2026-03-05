# Deep Explanation: Integrando Cache no Prisma

## Por que separar chaves com dois pontos?

O instrutor explica que o Redis usa dois pontos como convencao de categorizacao hierarquica. Exemplo:

```
question:1:details
question:1:reputation
```

Se voce quer deletar TODOS os caches da pergunta 1, basta deletar por prefixo `question:1` — o Redis remove `question:1:details`, `question:1:reputation`, e qualquer outro que comece com esse prefixo.

Se voce usasse algo como `questionDetails1`, `questionReputation1`, seria muito mais dificil agrupar e deletar caches relacionados. A separacao por dois pontos cria uma hierarquia natural: entidade → identificador → tipo de dado.

## O padrao cache-hit-early-return

O fluxo e:

1. **Primeira requisicao:** usuario chama `findDetailsBySlug` → nao tem cache → busca no banco → salva no cache → retorna
2. **Segunda requisicao (e seguintes):** usuario chama `findDetailsBySlug` → encontra no cache → faz `JSON.parse` → retorna IMEDIATAMENTE (early return)

O early return e crucial: se o cache hit acontece, o restante do codigo (query ao banco, mapeamento, etc.) **nem executa**. Isso e o ganho real de performance.

## Serializacao JSON

O Redis armazena strings. Objetos JavaScript complexos (como `QuestionDetails` com nested objects) precisam ser convertidos:
- **Ao salvar:** `JSON.stringify(questionDetails)` — converte objeto para string
- **Ao ler:** `JSON.parse(cacheHit)` — converte string de volta para objeto

## Invalidacao no write

O instrutor destaca que no metodo `save` (que atualiza a pergunta), o cache DEVE ser invalidado. Ele faz isso dentro do `Promise.all` junto com o update do Prisma, para que ambas operacoes acontecam em paralelo.

A invalidacao pode ser:
- **Especifica:** `cache.delete('question:${slug}:details')` — deleta apenas o cache de details
- **Por prefixo:** `cache.delete('question:${slug}:*')` — deleta TODOS os caches daquela pergunta (details, reputation, etc.)

## Injecao de dependencia

O `CacheRepository` e injetado no construtor do `PrismaQuestionsRepository`. O instrutor menciona que pode chamar de `cacheRepository` ou simplesmente `cache` — preferiu `cache` por ser mais curto. Isso segue o padrao de DI do NestJS onde repositorios recebem suas dependencias via construtor.

## Decisao: slug vs id na chave

O instrutor escolheu usar o `slug` na chave de cache (nao o `id`) porque o metodo `findDetailsBySlug` recebe o slug como parametro. Usar o mesmo identificador que o metodo recebe simplifica a construcao da chave tanto na leitura quanto na invalidacao.