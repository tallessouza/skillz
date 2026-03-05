# Deep Explanation: SSR, SSG e ISR

## Por que pre-renderizacao importa

O problema original que o Next.js veio resolver: SPAs classicas com React puro enviam uma pagina HTML em branco. Todo o conteudo e gerado via JavaScript no browser. Quando motores de busca (Google, Bing) acessam a pagina — muitas vezes com JavaScript desabilitado — encontram uma pagina vazia. Resultado: SEO terrivel, conteudo nao indexado.

Com pre-renderizacao no servidor, quando qualquer cliente (usuario ou crawler) acessa a pagina, o HTML ja vem com conteudo completo. A indexacao e imediata e precisa.

## As tres estrategias em detalhe

### SSR — Server-Side Rendering (getServerSideProps)

**Execucao:** No servidor, a cada requisicao (cada F5, cada acesso).

O instrutor demonstrou usando `new Date()` — ao dar F5 repetidamente, o horario sempre atualizava. Isso porque a funcao e re-executada no servidor a cada request.

**Quando usar (da documentacao oficial do Next):**
- Quando precisa de dados personalizados do usuario
- Quando precisa de request-time (headers, authorization, cookies)
- Quando precisa de requisicoes autenticadas
- Quando os dados DEVEM ser os mais atualizados possiveis no momento do acesso

**Trade-off:** Cada acesso bate no servidor. Em paginas com muito trafego, isso pode ser pesado.

**Icone no build:** O Next mostra como "rota dinamica — renderizada no servidor sob demanda". Essa e a principal diferenca visual no output do build.

### SSG — Static Site Generation (getStaticProps)

**Execucao:** Apenas uma unica vez, no momento do `next build`.

O instrutor demonstrou com `new Date()` — apos gerar o build, o horario ficou CONGELADO. Nao importa quantas vezes de F5, o valor nunca muda. Para atualizar, precisa rodar build novamente.

**Vantagem principal:** Performance. HTML estatico e servido instantaneamente, sem processamento no servidor. Desafoga completamente o servidor.

**Trade-off:** Para atualizar dados, precisa de rebuild + redeploy do projeto inteiro.

**Caso ideal (mencionado pelo instrutor):** Blogs com posts que raramente mudam. Se mudar, faz sentido gerar build novamente — nao e problema.

### ISR — Incremental Static Regeneration (getStaticProps + revalidate)

**Execucao:** Estatico como SSG, mas com regeneracao automatica a cada N segundos.

O instrutor demonstrou com `revalidate: 10` — ao dar F5 repetidamente, o valor ficava congelado por 10 segundos. Depois dos 10 segundos, na proxima requisicao, o valor atualizava. Entre regeneracoes, quantos F5 fizer, sempre mostra o cache.

**Mecanismo:** A cada N segundos, o Next invalida o cache daquela pagina especifica. Na proxima requisicao apos a invalidacao, ele regenera a pagina em background e serve a versao atualizada.

**Vantagem crucial sobre SSG:** Nao precisa de rebuild do projeto inteiro. Apenas aquela pagina especifica e regenerada.

**Vantagem sobre SSR:** Performance de estatico na maioria dos acessos. O servidor so e acionado a cada N segundos, nao a cada request.

## Coexistencia no mesmo projeto

O instrutor destacou que no mesmo projeto Next.js, voce pode ter as tres estrategias em paginas diferentes. A escolha e por pagina, nao por projeto. Isso permite otimizar cada rota para seu caso de uso especifico.

## Contexto historico

Quando o Next foi lancado, o principal problema era SPAs (Single Page Applications) com React puro que nao tinham SEO. O client-side rendering gerava paginas em branco para crawlers. O Next trouxe server-side rendering como solucao, e ao longo do tempo foi incrementando com SSG e ISR para oferecer mais opcoes de performance.

## Nota sobre o build

Ao rodar `pnpm build`, o Next mostra icones diferentes para cada tipo de rota:
- Rotas SSR aparecem como "dinamicas — renderizadas no servidor sob demanda"
- Rotas SSG aparecem como estaticas
- Rotas ISR aparecem como estaticas com periodo de revalidacao

Isso ajuda a verificar se a estrategia foi aplicada corretamente.