# Deep Explanation: Adicionando Imagens de Fundo

## Por que uma div separada?

O instrutor demonstra um pattern essencial: quando voce aplica `opacity` diretamente numa section que tem background-image, **todo o conteudo filho herda a opacidade**. Texto, botoes, tudo fica transparente. A solucao e criar uma div irma do conteudo, posicionada com `absolute inset-0`, que funciona como uma camada independente.

## O stacking context (relative/absolute)

O instrutor mostra ao vivo o problema: ao adicionar a div absoluta sem colocar `relative` na section pai, o layout quebra. Os passos corretos:

1. `section` recebe `relative` — cria o contexto de posicionamento
2. Div de background recebe `absolute inset-0` — preenche toda a section
3. Div de conteudo recebe `relative` — sobe acima da camada de background no z-index implicito

Sem o passo 3, o conteudo fica visualmente atras da imagem de fundo.

## Mobile-first com Tailwind

O instrutor segue a abordagem mobile-first do Tailwind:
- Estado padrao: `hidden` (mobile nao mostra a imagem decorativa)
- A partir de `md`: `block` (exibe a imagem)

Isso e consistente com a filosofia do Next.js/Tailwind de otimizar para mobile primeiro.

## Organizacao de assets

As imagens SVG exportadas do Figma/Style Guide vao direto para `public/`. O instrutor exporta:
- `background-features.svg` — fundo da section de Features
- `background-footer.svg` — fundo da section Call to Action

Ambas seguem o mesmo pattern de implementacao, mostrando que o approach e reutilizavel.

## Contexto de migracao

O instrutor menciona que o codigo esta usando Pages Router mas sera migrado para App Router (Next 13+). Isso motiva manter o codigo bem organizado, porque sections bem componentizadas facilitam a migracao futura.