# Deep Explanation: Pagina de Detalhe do Produto

## Rotas Dinamicas no App Router

No Next.js App Router, parametros dinamicos na URL sao representados por pastas com colchetes. Para `/store/product/camiseta-xyz`, a estrutura e:

```
app/store/product/[slug]/page.tsx
```

O `[slug]` indica que qualquer valor nessa posicao da URL sera capturado como parametro. Basta criar a pasta com colchetes e o `page.tsx` dentro — o Next.js ja reconhece automaticamente.

## Por que max-height de 860px?

O instrutor explica que a pagina foi desenhada pensando em fullscreen. O problema: se o usuario tem uma tela muito grande, a imagem ocuparia a tela toda e o conteudo textual (preco, descricao, tamanhos) ficaria minusculo ao lado. Setar uma altura maxima garante que o layout permanece equilibrado independente do tamanho da tela.

Isso e um padrao comum em e-commerce: a "hero area" do produto tem dimensoes controladas.

## Grid 3 colunas vs Flexbox

O instrutor menciona que poderia fazer com flex tambem, mas escolheu grid de 3 colunas por clareza:
- Imagem ocupa 2 colunas (`col-span-2`)
- Detalhes ocupam 1 coluna

Isso da uma proporcao 2/3 para imagem e 1/3 para informacoes, que e visualmente equilibrado para PDPs.

## overflow-hidden na imagem

A imagem dentro do container pode crescer alem dos limites (especialmente com o max-height). O `overflow-hidden` evita barras de rolagem — simplesmente corta as bordas da imagem. O instrutor comenta: "quem sabe corta um pedaco da manga, nao e um problema, nao vai prejudicar a experiencia."

## quality={100} no next/image

Por padrao, o Next.js Image usa quality 80 para otimizar tamanho. Mas para imagens grandes de produto (que sao o foco visual da pagina), a perda de qualidade e perceptivel. O instrutor recomenda quality 100 nesse caso especifico.

## Botoes de tamanho com dimensao fixa

Os botoes de tamanho (P, M, G, GG) tem `h-9 w-14` fixos porque o conteudo varia — alguns tem uma letra, outros duas. Sem dimensao fixa, o botao de "GG" seria maior que o de "P", quebrando o alinhamento visual.

## Justify-center vertical

O `flex flex-col justify-center` na coluna de informacoes alinha todo o conteudo verticalmente ao centro da coluna. Conforme mais informacoes sao adicionadas, o bloco cresce de forma organizada a partir do centro.

## Badge de preco com inline-block

O instrutor inicialmente pensou em usar flex + justify-center no badge de preco, mas percebeu que `inline-block` resolve — o badge so precisa se ajustar ao conteudo, sem necessidade de um container flex dedicado.