# Deep Explanation: Sidebar Colapsavel em React/Next.js

## Por que funcoes nomeadas ao inves de toggle?

O instrutor cria `collapseSidebar` e `expandSidebar` como funcoes separadas ao inves de um unico `toggleSidebar`. Isso nao e acidental — cada funcao tem semantica clara. O botao de colapsar SEMPRE colapsa, o de expandir SEMPRE expande. Nao ha ambiguidade. Isso tambem facilita passar a funcao correta para cada botao sem risco de inversao logica.

## Client Components no Next.js App Router

O instrutor marca o componente com `"use client"` logo no inicio e explica: "A gente vai precisar de algumas interacoes aqui do lado do client." No App Router do Next.js, qualquer componente que use `useState`, `useEffect`, `useRouter` ou event handlers precisa ser um Client Component. Isso e uma decisao arquitetural — o sidebar tem estado interativo, entao nao pode ser Server Component.

## Acessibilidade como cidada de primeira classe

O instrutor adiciona `aria-label` e `title` nos botoes de icone sem que ninguem pergunte. Para botoes de fechar menu mobile: `aria-label="Fechar menu"` e `title="Fechar menu"`. Para expandir sidebar: `aria-label="Expandir sidebar"` e `title="Expandir sidebar"`. Isso nao e optional — botoes com apenas icones sao completamente invisiveis para leitores de tela sem esses atributos.

## Responsividade: mobile close button

O botao de fechar (X) so aparece no mobile. No desktop, o sidebar tem o botao de colapsar (seta). O instrutor usa `md:hidden` para esconder o botao de fechar em telas medias e maiores. Isso e um padrao comum: no mobile o sidebar e um overlay que precisa ser fechado, no desktop e uma coluna lateral que colapsa.

## Renderizacao condicional completa vs esconder elementos

O instrutor nao usa `display: none` ou `hidden` para colapsar. Ele renderiza duas `<section>` completamente diferentes baseado no estado `isCollapsed`. A versao expandida tem logo, titulo, botao de acao. A versao colapsada tem apenas o botao de expandir. Isso e melhor que esconder elementos porque cada estado tem layout e spacing completamente diferentes.

## Logo como componente separado com Link

O instrutor cria um componente `Logo` simples que e um `Link` do Next.js apontando para `/`. Isso significa que clicar no logo sempre leva pra home. E um padrao web universal que o instrutor implementa naturalmente.

## Navegacao com router.push

Para o botao "Novo prompt", ao inves de usar um `<Link>`, o instrutor usa `router.push("/new")` dentro de um `onClick`. Isso porque o elemento e um `<Button>` com comportamento customizado, nao um link semantico. O `useRouter` vem de `next/navigation` (App Router), nao de `next/router` (Pages Router).

## Contexto da aula no curso

O instrutor menciona que nas proximas aulas vai pausar a criacao de componentes para abordar conceitos teoricos de arquitetura e introduzir testes, incluindo TDD. Isso sinaliza que o sidebar sera refatorado com patterns mais avancados posteriormente.