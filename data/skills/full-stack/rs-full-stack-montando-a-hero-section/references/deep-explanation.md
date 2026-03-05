# Deep Explanation: Montando a Hero Section

## O que e uma Hero Section

Hero section e a primeira secao visivel de uma landing page, logo apos o header. Contem tipicamente:
- **Headline** (H1) — frase principal de impacto
- **Subtitulo** (P) — complemento da headline
- **Call to Action (CTA)** — botoes de acao (download, ver planos, etc.)
- **Imagem decorativa** — ilustracao ou background que reforça o visual

O termo "hero" vem do design grafico editorial, onde a imagem principal de uma pagina era chamada de "hero image".

## Mobile-First: Por que e o padrao

O instrutor demonstra na pratica o erro de pensar desktop-first: ele calcula o tamanho da imagem para desktop (412px = 25.75rem), percebe o erro ("eu to olhando o grande, ne, eu tenho que olhar o pequeno"), e recalcula para mobile (206px = 12.875rem).

A abordagem mobile-first significa:
1. CSS base = tela pequena (sem media query)
2. `@media (min-width: X)` expande para telas maiores
3. Isso garante que o baseline funciona em qualquer dispositivo

## Seletor de Atributo CSS: `[src*="keyword"]`

O instrutor explica detalhadamente este seletor pouco usado:

- `*=` significa "contem" — procura a sequencia de caracteres em qualquer posicao do valor do atributo
- `img[src*="music"]` encontra qualquer `<img>` cujo `src` contenha "music"
- Pode ser parcial: `[src*="bars"]`, `[src*="music"]`, `[src*="ic"]` — todos funcionariam
- Analogia do instrutor: "pode ter coisa antes, pode ter coisa depois, mas se encontrar essa sequencia, entao ele entende que e esse cara"

Isso evita adicionar classes CSS em imagens puramente decorativas, mantendo o HTML mais limpo.

### Variantes do seletor de atributo:
- `[src^="prefix"]` — comeca com
- `[src$="suffix"]` — termina com
- `[src*="contains"]` — contem
- `[src="exact"]` — valor exato

## Background Image Strategy

O instrutor usa duas estrategias diferentes para a imagem de fundo:
- **Desktop:** `background` shorthand com `no-repeat bottom center / contain`
- **Mobile:** "outra estrategia" (nao implementada nesta aula)

O `padding-bottom: 15rem` no desktop cria espaco para que a proxima secao nao sobreponha o background image, ja que `contain` pode deixar a imagem parcialmente visivel na parte inferior.

## Conversao px → rem

Toda medida em px do Figma deve ser convertida para rem:
- Formula: `valor_px / 16 = valor_rem`
- Exemplos da aula: `412 / 16 = 25.75rem`, `206 / 16 = 12.875rem`
- Motivo: rem respeita a preferencia de tamanho de fonte do usuario no navegador

## Acessibilidade nos Botoes

- Botao com texto visivel: nao precisa de `aria-label`
- Botao sem texto ou so com icone: precisa de `aria-label="descricao da acao"`
- Imagem decorativa: `alt=""` (vazio, nao ausente) — o leitor de tela simplesmente ignora

## Filosofia de "Parar de Fazer"

O instrutor compartilha uma reflexao importante sobre desenvolvimento front-end: "a gente simplesmente para de fazer, porque sempre a gente acha uma coisinha, da para melhorar outra, entao chega uma hora que a gente para." Isso reflete o principio de "good enough" — perfeccionismo e inimigo de entrega.