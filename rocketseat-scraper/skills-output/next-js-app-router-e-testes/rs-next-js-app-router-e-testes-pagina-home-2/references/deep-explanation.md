# Deep Explanation: Pagina Home — Layout de E-commerce

## Por que grid-cols-9 e nao 12?

O instrutor escolheu 9 colunas porque a divisao necessaria era 6+3 (proporção 2:1). Com 12 colunas (sistema Bootstrap), seria 8+4, que funciona mas nao e necessario. O numero de colunas do grid deve refletir a necessidade real do layout, nao uma convencao generica.

O grid com 9 colunas e 6 linhas cria uma matriz onde:
- Produto destaque: 6 colunas x 6 linhas (ocupa 2/3 da largura, altura total)
- Produto menor 1: 3 colunas x 3 linhas (1/3 da largura, metade da altura)
- Produto menor 2: 3 colunas x 3 linhas (1/3 da largura, metade da altura)

## Por que max-h-[860px]?

O instrutor explica que layouts fullscreen sao problematicos: "e um pouco dificil de lidar com layouts que eles sao fullscreen porque tu nao sabe muito bem o que fazer com os elementos quando tu ta numa tela muito grande". Em telas pequenas, empilhar elementos e intuitivo. Em telas muito grandes, o espaco extra nao tem uso claro. A altura maxima impoe um limite superior previsivel.

## Group hover — estilizando filhos pelo estado do pai

O conceito central: colocar `group` no elemento pai (o `<Link>`) permite que qualquer filho use `group-hover:` para reagir ao hover do pai. Isso e necessario porque o hover acontece no link, mas o efeito visual (zoom) acontece na imagem.

Sem `group`, seria necessario JavaScript (`onMouseEnter`/`onMouseLeave`) ou CSS mais complexo com seletores de pai.

A transicao usa `duration-500` (500ms) em vez do padrao 150ms porque o zoom suave precisa de mais tempo para parecer natural. O instrutor testa e ajusta visualmente.

## Next Image — width/height nao e o tamanho na tela

Ponto importante: o `width` e `height` do `<Image>` do Next.js nao definem o tamanho que a imagem ocupa na tela. Eles definem o tamanho em que a imagem e carregada/otimizada. O instrutor verifica no Figma que o container tem ~830px e escolhe 920px para garantir que a imagem tenha resolucao suficiente.

## Quality 100 para e-commerce

O padrao do Next Image e `quality={80}`, que funciona para a maioria dos casos. Mas em imagens grandes de produto, a compressao fica visivel. O instrutor destaca: "como a imagem e muito grande, se eu botar a qualidade 80, vai dar pra perceber que a qualidade ta um pouquinho zoada". Para e-commerce, onde a imagem vende o produto, `quality={100}` e justificado.

## Pasta public — arquivos estaticos

Tudo dentro de `/public` fica acessivel na raiz do site. `/public/moletom.png` vira `localhost:3000/moletom.png`. O Next.js nao processa esses arquivos — eles sao servidos diretamente. Por isso o `src` do Image usa `/moletom.png` (sem `public/`).

## Tag de preco — decisoes de design

A tag de preco usa varias tecnicas combinadas:
- `absolute` + `bottom-28 right-28`: posicionamento fixo relativo ao container
- `bg-black/60`: fundo preto com 60% de opacidade para ver a imagem por tras
- `border-2 border-zinc-500`: borda sutil para definir o contorno
- `rounded-full`: totalmente arredondado (pill shape)
- `p-1 pl-5`: padding minimo geral, mas padding-left maior porque o lado esquerdo (nome) precisa de mais respiro, enquanto o lado direito (preco) tem seu proprio container arredondado

Para produtos menores, o offset muda de `bottom-28 right-28` (112px) para `bottom-10 right-10` (40px) porque o card e menor.

## overflow-hidden no container

O `overflow-hidden` previne que a imagem, ao receber `scale-105` no hover, ultrapasse os limites do card. Sem isso, o zoom faria a imagem "vazar" para fora do arredondamento do `rounded-lg`.

## Decisao de arredondamento (rounded-lg)

O instrutor menciona que o layout original no Figma nao tinha arredondamento nos cards, mas ele adicionou durante o desenvolvimento: "eu depois fui botando, eu achei que o arredondamento ficou um pouquinho melhor porque e tudo arredondado, ne, menos essas caixas aqui". Isso ilustra que o desenvolvimento visual e iterativo — nem tudo precisa seguir o design pixel-perfect.