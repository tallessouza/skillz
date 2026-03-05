# Deep Explanation: Chat Sessions com TDD em NestJS

## Por que teste primeiro?

O instrutor demonstra o ciclo TDD na pratica: escreve o teste, roda (falha porque a tabela nao existe), cria a tabela, roda de novo (falha porque a rota nao existe), cria o modulo, roda de novo (falha por falta de `@Param`), corrige, e finalmente passa. Cada falha guia o proximo passo da implementacao.

Esse approach evita "implementar no escuro" — voce nunca escreve codigo sem saber exatamente o que ele precisa fazer, porque o teste ja definiu o contrato.

## O problema da ordenacao nos testes

O instrutor encontrou um bug real: testes de carrinho dependiam da ordem dos itens no array (`response.body[0]`, `response.body[1]`), mas a query SQL nao tinha ORDER BY. Isso significa que o banco pode retornar em qualquer ordem, e o teste passa ou falha de forma nao-deterministica.

A correcao foi trocar de acesso por indice para `toContainEqual` — verifica se o array CONTEM o objeto, independente da posicao. Essa e uma licao importante: **se voce nao controla a ordem, nao teste a ordem**.

## rootDir do Jest e module mapper

O primeiro fix foi no `jest.config` — o `rootDir` estava apontando para a pasta de teste ao inves da raiz do projeto. Isso quebrava o module mapper que traduz `@/` para `src/`. Com o rootDir errado, o Jest nao conseguia resolver imports com `@` porque o caminho base estava incorreto.

## Arquitetura: PostgresService direto

O projeto usa SQL direto via um `PostgresService` customizado ao inves de ORM (TypeORM, Prisma, etc). O instrutor nao usa camada de abstracao — queries sao strings SQL com parametros posicionais (`$1`, `$2`). Isso da controle total sobre as queries mas exige disciplina na tipagem dos retornos.

## userId fixo durante desenvolvimento

Como autenticacao nao e o foco do modulo, o controller usa um `userId = 1` fixo como propriedade privada. Isso e uma decisao pragmatica — permite focar na logica do chat sem se perder em auth. O instrutor explica que futuramente seria o usuario logado.

## Estrategia de desenvolvimento: backend completo, depois frontend

O instrutor decide conscientemente NAO fazer o frontend da feature de chat sessions agora. A justificativa: ficar alternando entre back e front quebra o foco na construcao da integracao com LLM, que e o core do modulo. Melhor fazer todo o backend (sessions, messages, bot) e depois o frontend de uma vez.

## O bug do @Param esquecido

Um dos erros mais comuns em NestJS: definir a rota como `@Get(':sessionId')` mas esquecer de decorar o parametro do metodo com `@Param('sessionId')`. Sem o decorator, o NestJS nao injeta o valor, o service recebe `undefined`, nao encontra nada, e retorna 404. O teste capturou esse bug antes de ir para producao.

## Estrutura do modulo NestJS

Cada feature segue o padrao:
1. `chat.module.ts` — registra controllers e providers
2. `chat.service.ts` — logica de negocio + queries SQL
3. `chat.controller.ts` — rotas HTTP
4. Registro no `app.module.ts` — imports do modulo

O `PostgresService` e injetado como provider no modulo do chat porque o service depende dele para executar queries.