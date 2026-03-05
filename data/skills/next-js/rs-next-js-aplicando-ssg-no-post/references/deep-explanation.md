# Deep Explanation: SSG em Rotas Dinamicas

## Por que rotas dinamicas quebram sem getStaticPaths

Quando o Next.js executa o build, ele precisa saber antecipadamente quais paginas gerar para rotas dinamicas como `[slug].tsx`. Sem getStaticPaths, o Next tenta renderizar a pagina mas o parametro `slug` e `undefined` — qualquer operacao como `.toLowerCase()` ou `.find()` falha com erro de propriedade em undefined.

O instrutor demonstrou isso ao vivo: rodou `next build` sem getStaticPaths e o build quebrou com "cannot read property of undefined". O slug simplesmente nao existe em tempo de build sem essa funcao.

## O modelo mental dos 4 mecanismos

O instrutor recapitulou os 4 mecanismos de forma clara:

1. **getServerSideProps** — busca dados a cada requisicao. Ativa o modo dinamico. Dados sempre atualizados, mas mais lento.
2. **getStaticProps** — executado apenas no build. Gera HTML estatico. Performance absurdamente melhor quando o cenario permite.
3. **getStaticPaths** — especifica quais rotas dinamicas devem ser geradas em tempo de build. Trabalha sempre junto com getStaticProps.
4. **ISR (Incremental Static Regeneration)** — combina os dois mundos. Paginas estaticas que se atualizam apos o build sem precisar de novo deploy. Configurado via `revalidate` no retorno do getStaticProps.

## Fallback: blocking vs false — a analogia do blog

O instrutor usou o exemplo de um blog com posts semanais para explicar fallback:

- Voce pre-gera os 5 ultimos posts no build
- Um usuario acessa um post de 4 meses atras (fora dos 5)
- Com `fallback: "blocking"`: o Next gera a pagina no servidor e entrega ao usuario (primeira visita mais lenta, proximas sao cache)
- Com `fallback: false`: retorna 404, a pagina simplesmente nao existe

A escolha depende do caso: se o conteudo existe e deve ser acessivel, use blocking. Se o conjunto e fechado (apenas esses 5), use false.

## O contexto do getStaticProps em rotas dinamicas

Diferente de paginas estaticas simples, em rotas dinamicas o getStaticProps recebe `context.params` com os valores da rota. O instrutor logou o contexto e mostrou: `{ params: { slug: "primeiro-post" } }`. Isso so funciona porque getStaticPaths previamente informou quais slugs existem.

## Content Layer e a inteligencia do Next

O instrutor observou que, por usar contentlayer (dados locais), o Next e inteligente o suficiente para detectar que os dados sao estaticos mesmo sem declarar explicitamente. Porem, para APIs externas, sem getStaticProps a pagina viria em branco com JavaScript desabilitado — os dados nao estariam no HTML.

## NotFound como guard clause

O padrao `if (!post) return { notFound: true }` no getStaticProps serve como protecao: se por algum motivo o slug passado nao encontra um post correspondente, o Next retorna uma pagina 404 ao inves de quebrar com erro.