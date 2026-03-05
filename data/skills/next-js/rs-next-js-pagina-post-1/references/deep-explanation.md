# Deep Explanation: Pagina de Post com Rota Dinamica

## Por que [slug].tsx e nao [id].tsx?

O instrutor enfatiza que o nome entre colchetes define a chave em `router.query`. Se o arquivo se chama `[slug].tsx`, o valor vem em `router.query.slug`. Se mudasse para `[id].tsx`, seria `router.query.id`. O nome deve refletir semanticamente o que o parametro representa — neste caso, o slug do post na URL.

## useRouter como fonte do parametro dinamico

O Next.js Pages Router oferece varias formas de acessar parametros da rota. O instrutor escolhe `useRouter` por ser a abordagem mais direta no lado client. O objeto `router` contem:
- `query`: objeto com todos os parametros dinamicos e query strings
- `asPath`: path completo da URL
- `pathname`: pattern da rota (ex: `/blog/[slug]`)

O instrutor demonstra fazendo `console.log(router)` primeiro para inspecionar o objeto completo antes de extrair o que precisa — uma pratica de debug recomendada.

## Conexao com a aula de roteamento

O instrutor referencia aulas anteriores sobre roteamento no Next.js, indicando que rotas dinamicas sao um conceito fundamental que se aplica em multiplos contextos. A mesma mecanica de `[param]` usada aqui para posts funciona para qualquer entidade (produtos, usuarios, categorias).

## Breadcrumb como padrao de navegacao

O instrutor instala uma biblioteca de breadcrumb (provavelmente shadcn/ui) e estrutura a hierarquia:
1. Link para "Blog" (volta para listagem)
2. Separador
3. Nome do post atual (sem link, pois ja esta nessa pagina)

O uso de `asChild` no BreadcrumbLink permite passar o `<Link>` do Next.js como filho, mantendo a navegacao client-side ao inves de full page reload.

## Estrutura semantica do HTML

O instrutor usa tags semanticas com proposito:
- `<main>` — conteudo principal da pagina
- `<article>` — conteudo autocontido (o post)
- `<figure>` — container para a imagem do post

Isso nao e apenas "boas praticas" — impacta acessibilidade (leitores de tela) e SEO.

## Grid para layout futuro

O instrutor configura um grid com `grid-cols-[1fr_300px]` mesmo antes de ter o sidebar pronto. Isso demonstra planejamento: a coluna principal ocupa o espaco disponivel (1fr) e a sidebar tera 300px fixos. Em telas menores (`grid-cols-1`), tudo empilha em uma coluna.

## Tratamento do undefined

`allPosts.find()` pode retornar `undefined` se nenhum post corresponder ao slug. O instrutor usa o operador `!` (non-null assertion) como solucao temporaria, reconhecendo que precisa ser melhorado depois. Em producao, o correto seria retornar 404 ou redirecionar.