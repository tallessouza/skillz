# Deep Explanation: Setup do Projeto Next.js em Monorepo

## Por que reinstalar com pnpm?

O `create-next-app` nao suporta oficialmente criacao via `pnpm create` de forma confiavel. Ao usar `npx`, ele instala dependencias com npm, gerando um `package-lock.json` que conflita com o pnpm workspace. A solucao e criar com npx, depois limpar e reinstalar com pnpm para manter as vantagens do workspace (hoisting compartilhado, links simbolicos entre pacotes).

## Por que separar paths e include/exclude do tsconfig compartilhado?

O instrutor explica que opcoes como `paths` e `include`/`exclude` usam caminhos relativos ao arquivo onde estao definidas. Se colocadas no pacote `@saas/tsconfig`, o `"."` referenciaria o diretorio do pacote tsconfig, nao o diretorio do projeto Next.js. Por isso essas opcoes devem ficar no `tsconfig.json` local.

## Por que baseUrl?

O `baseUrl: "."` nao e obrigatorio para o Next.js funcionar, mas algumas bibliotecas externas dependem dele para resolver corretamente os paths de importacao. E uma configuracao preventiva que evita problemas futuros.

## ESLint: No na criacao, Yes no compartilhado

O instrutor seleciona "No" para ESLint durante o `create-next-app` porque a configuracao sera feita via pacote compartilhado do monorepo (`@saas/eslint-config`). O pacote ja inclui preset para Next.js (`next` em files), alem do plugin Prettier com ordenacao de classes Tailwind CSS.

## Fonte Inter vs Geist

O Next.js 15 usa a fonte Geist (da Vercel) por padrao, com arquivos locais em `src/app/fonts/`. O projeto usa Inter do Google Fonts, entao o diretorio `fonts/` e removido e a importacao muda para `next/font/google`.

## Turbopack

O instrutor menciona o Turbopack como sucessor do Webpack para ambiente de desenvolvimento, extremamente mais rapido. Na versao 15 do Next.js, o `--turbopack` flag pode ser usado no `next dev`.