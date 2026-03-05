# Deep Explanation: Permissoes com CASL

## Por que `manage` e `all` sao reservados

O CASL usa internamente essas duas palavras para representar "tudo". Quando voce define `can('manage', 'all')`, o CASL entende que o usuario tem TODAS as permissoes em TODAS as entidades. Isso e fundamental para roles como admin — em vez de listar cada permissao individualmente, voce usa uma unica regra.

- `manage` = todas as actions (invite, delete, update, etc.)
- `all` = todas as subjects/entidades (User, Article, Payment, etc.)

Tudo que nao for `manage` ou `all` e definido por voce. O CASL so reconhece esses dois como especiais.

## O modelo mental de permissoes no CASL

O CASL opera com um modelo de **negacao por padrao**: o usuario nao pode fazer nada ate que voce explicitamente conceda permissao com `can()`.

Isso significa que `cannot()` so faz sentido como **excecao** a uma permissao ja concedida. Exemplo pratico do instrutor:

> "Se eu quero falar que todos os usuarios podem convidar, eu faco `can('invite', 'User')`. E ai se eu quero adicionar uma excecao — por exemplo, se o usuario foi convidado a menos de uma semana, ele nao pode convidar outros — eu uso `cannot`."

O padrao e: **conceder amplo, restringir especifico**.

## AbilityBuilder como padrao de construcao

O `AbilityBuilder` segue o padrao Builder classico:
1. Cria instancia com `new AbilityBuilder(createAppAbility)`
2. Configura com `can()` e `cannot()`
3. Finaliza com `build()` — retorna objeto imutavel

O objeto retornado por `build()` expoe `can()` e `cannot()` para checagem (nao para definicao). E importante nao confundir os dois: o `can` do builder define permissoes, o `can` do ability checa permissoes.

## Estrutura de monorepo usada na aula

O instrutor usa um monorepo com:
- `packages/auth` (chamado de "alpha" na aula) — pacote de permissoes com CASL
- `apps/api` — aplicacao Node que consome o pacote

O pacote de permissoes e importado como dependencia workspace (`@saas/auth`), permitindo que multiplas apps (api, web) compartilhem as mesmas regras de autorizacao. Isso garante consistencia de permissoes entre frontend e backend.

## Ferramentas de setup mencionadas

- **tsx** — executor TypeScript para Node.js (substituicao do ts-node), usado com `tsx watch` para hot reload
- **tsconfig do Node20** — configuracao base da Microsoft para TypeScript targeting Node 20
- **pnpm workspaces** — gerenciador de pacotes com suporte nativo a monorepo