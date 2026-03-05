# Deep Explanation: Componentes Link e Image do Next.js

## Por que nao usar tags HTML nativas?

O instrutor destaca que performance e experiencia do usuario sao essenciais para aplicacoes web. As tags nativas `<img>` e `<a>` trazem problemas que exigem trabalho manual para resolver:

### Problema do Layout Shift com `<img>`

O instrutor usa uma analogia vivida: voce esta lendo um blog, seleciona um texto, e de repente o conteudo pula pra baixo porque uma imagem "brotou" no meio da pagina. Isso acontece porque a tag `<img>` nativa nao reserva espaco antes da imagem carregar. O componente `next/image` resolve isso automaticamente ao exigir `width` e `height`, garantindo estabilidade visual.

### Problema de navegacao com `<a>`

A tag `<a>` faz um full page refresh a cada clique. O `next/link` faz client-side navigation (sem refresh), e ainda faz **prefetch automatico**: quando o usuario passa o mouse (hover) sobre o link, o Next.js ja comeca a baixar a pagina de destino. Quando o clique acontece, a pagina ja esta pre-carregada. O instrutor demonstrou a velocidade da transicao e chamou de "sensacional".

## Otimizacoes automaticas do Image

O componente Image do Next.js:

1. **Redimensiona por dispositivo** — serve imagens menores para telas menores
2. **Converte para formatos modernos** — WebP e outros formatos mais eficientes
3. **Lazy loading nativo** — so carrega imagens visiveis na viewport
4. **Previne layout shift** — reserva espaco com width/height
5. **Tudo isso e default** — nao precisa configurar nada

## Pasta Public como raiz de assets

Tudo dentro de `public/` e acessivel a partir da raiz `/`. Se voce tem `public/assets/foto.png`, o src e simplesmente `/assets/foto.png`. Nao precisa referenciar `public/` no caminho.

## Componentes built-in

O instrutor enfatiza que esses componentes sao do proprio Next.js — nao precisa instalar pacotes adicionais. Sao importados de `next/image` e `next/link`.