# Deep Explanation: SEO Dinâmico com generateMetadata

## Por que metadata no layout importa como fallback

O instrutor demonstra um insight pratico: ao verificar um post sem metadata, ele percebe que o post herda apenas texto do layout (title/description), mas nao imagem. Quando alguem compartilha essa pagina no Discord ou redes sociais, aparece sem imagem — "feio", nas palavras dele.

A solucao eh mover a configuracao de `openGraph.images` para o `layout.tsx`. Assim, qualquer pagina filha que nao defina sua propria imagem OG herda automaticamente a imagem padrao do layout. Isso eh o sistema de heranca de metadata do Next.js em acao — metadata faz merge hierarquico, do layout mais externo ate a pagina mais interna.

## O sistema de heranca de metadata do Next.js

O Next.js resolve metadata de forma hierarquica:
1. `app/layout.tsx` — metadata base
2. `app/blog/layout.tsx` — sobrescreve/complementa
3. `app/blog/[slug]/page.tsx` — nivel mais especifico

Campos como `title` sao sobrescritos completamente. Campos como `openGraph` fazem merge parcial. Se a pagina define `openGraph.images`, substitui o do layout. Se nao define, herda.

## Por que generateMetadata precisa ser async

O instrutor inicialmente cogita nao usar async ("talvez nem vai precisar"), mas rapidamente corrige: como `params` no App Router eh uma Promise, a funcao precisa ser async para fazer `await params`.

Isso eh uma mudanca do Next.js 13→15: params e searchParams se tornaram Promises para permitir streaming e partial prerendering. Codigo antigo que acessa `params.slug` diretamente vai quebrar silenciosamente ou gerar warnings.

## O nome precisa ser exato

O instrutor enfatiza: "Cuidado com o nome aqui, tem que ser exatamente esse" — e inclusive mostra que errou na primeira tentativa ("Metadeira" ao inves de "Metadata"). O Next.js detecta `generateMetadata` por convencao de nome. Qualquer variacao eh ignorada silenciosamente — nao ha erro, simplesmente nao funciona.

## Tipagem com Metadata do Next.js

O instrutor importa o tipo `Metadata` diretamente de `next` e usa como retorno da funcao: `Promise<Metadata>`. Isso habilita autocomplete no editor — ele demonstra que ao digitar os campos, o TypeScript sugere `description`, `authors`, `robots`, etc. automaticamente. Essa eh uma vantagem pratica de tipar corretamente.

## Compartilhamento de tipagem Props

O instrutor percebe que tanto o componente da pagina quanto `generateMetadata` recebem os mesmos params. Ele cria um type `Props` unico no topo do arquivo e usa nos dois lugares, evitando duplicacao.

## Resultado pratico: preview em redes sociais

O instrutor testa compartilhando links no Discord e em um verificador de meta tags. A diferenca eh dramatica: antes, link sem imagem e com informacoes genericas. Depois, preview completo com titulo, descricao, autor e imagem do post. Ele testa com multiplos posts para confirmar que cada um gera metadata propria.

## Deploy e cache na Vercel

O instrutor menciona que ao subir para a Vercel, o primeiro build demora mais, mas os subsequentes sao rapidos. Para conteudo estatico com `generateStaticParams`, as paginas sao pre-renderizadas no build — incluindo suas meta tags. Isso significa que o SEO funciona perfeitamente mesmo sem servidor, porque as tags ja estao no HTML estatico.