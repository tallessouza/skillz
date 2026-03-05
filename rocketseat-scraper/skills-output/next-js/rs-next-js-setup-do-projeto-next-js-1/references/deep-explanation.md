# Deep Explanation: Setup do Projeto Next.js (App Router)

## App Router vs Pages Router

O instrutor destaca que a App Folder (App Router) e "a estrutura mais atual" para criar aplicacoes Next.js. Isso significa que o Pages Router ainda funciona, mas o App Router e o caminho recomendado para novos projetos. O curso cobre funcionalidades exclusivas do App Router:

- **Interception Routes** — rotas que interceptam navegacao para mostrar modais
- **Parallel Routes** — renderizar multiplas paginas na mesma view
- **Layouts** — wrappers persistentes que nao re-renderizam entre navegacoes
- **Loading States** — UI de loading automatico por segmento de rota
- **Caching** — sistema de cache integrado do Next.js

## Por que --empty?

O template padrao do Next.js vem com uma homepage estilizada, CSS modules, SVGs embutidos e varios arquivos que voce vai apagar imediatamente. O flag `--empty` elimina todo esse boilerplate, trazendo apenas o minimo necessario: um `page.tsx` com "Hello World" e um `layout.tsx` basico.

## React Compiler — O que realmente faz

O instrutor explica com clareza: "React Compiler, o proprio nome ja diz, e um compilador. Ele executa no momento que a gente esta colocando nosso codigo em producao, ele vai adicionar algumas camadas de codigo no nosso app que vao evitar que essas renderizacoes desnecessarias acontecam."

Historicamente, desenvolvedores React precisavam usar `useMemo`, `useCallback` e `React.memo` manualmente para evitar re-renders. O React Compiler automatiza isso no build time, tornando essas otimizacoes manuais "desnecessarias" (palavra do instrutor).

O instrutor nota que "dificilmente a gente vai ver algum funcionamento inesperado" — indicando que o React Compiler ja esta maduro o suficiente para uso em producao.

## Layout no App Router

O instrutor faz uma observacao importante: o layout "nao tem o head, porque o head, na verdade, e criado pelo Next de forma automatizada com base nesse metadata." Isso e uma mudanca fundamental em relacao ao Pages Router onde voce usava `<Head>` do `next/head`.

O objeto `metadata` aceita "basicamente tudo o que a gente poderia ter no head de uma aplicacao web" — Open Graph, imagens, titulo, descricao, etc.

O layout e descrito como "o que fica por volta de toda a nossa aplicacao" — o lugar para providers de contexto e qualquer coisa compartilhada globalmente.

## Biome como substituto de ESLint+Prettier

O Next.js agora oferece Biome como opcao no setup. O instrutor mostra que com a extensao do Biome no editor, formatacao e linting acontecem automaticamente no save. Ele demonstra configuracoes personalizaveis como `semicolons: "asNeeded"` para remover ponto e virgula opcionais.

## Contexto do projeto

A aplicacao que sera construida e inspirada no **Feature Base** e **Canny** — boards de roadmap publico onde usuarios podem comentar e votar em features. O instrutor menciona que softwares como Notion, Linear e Expo usam esse tipo de ferramenta para que a comunidade "possa ditar os rumos de para onde aquele software vai caminhar."

## Editor

O instrutor menciona usar o Zed "muito mais por questoes de performance", mas enfatiza que qualquer editor (VS Code, Cursor) funciona. Nao ha dependencia de editor para o projeto.