# Deep Explanation: Gerando Open Graph Image no Next.js

## Por que ImageResponse vem de `next/og` e nao de `next/server`?

O instrutor destaca que, embora o autocomplete sugira importar de `next/server`, a importacao correta e de `next/og` (que vem de Open Graph). O modulo `next/og` usa internamente o Satori (da Vercel) para converter JSX em SVG e depois em PNG, o que explica as limitacoes de CSS.

## Limitacoes do CSS no ImageResponse

O instrutor enfatiza: "Only Flexbox and a subset of CSS properties are supported." Isso acontece porque o Satori nao e um browser — ele reimplementa um subset do CSS para renderizar em SVG. Consequencias praticas:

- `display: "flex"` e **obrigatorio** no container raiz
- `display: grid` nao funciona
- Muitas propriedades CSS avancadas nao estao disponiveis
- O instrutor menciona "tem uma agonia" de nao poder usar Tailwind

A documentacao completa do que funciona esta no repositorio do Satori (Vercel OG): https://github.com/vercel/satori

## Convencao de arquivo

O Next.js App Router detecta automaticamente arquivos com nomes especificos:
- `opengraph-image.tsx` → gera a meta tag `og:image`
- `twitter-image.tsx` → gera a meta tag `twitter:image`
- `icon.tsx` → gera favicon dinamico

Ao salvar o arquivo na rota correta (ex: `app/issues/[id]/opengraph-image.tsx`), o Next.js injeta automaticamente no `<head>` da pagina correspondente a tag `og:image` apontando para a rota de geracao da imagem.

## Dimensoes 1200x630

O instrutor explica que 1200x630 pixels e o tamanho padrao de imagens Open Graph — "aquela imagem de embed" que aparece quando voce compartilha um link no Twitter, LinkedIn, Discord, etc.

Essas dimensoes sao passadas como segundo argumento do `ImageResponse`:

```typescript
new ImageResponse(jsx, { width: 1200, height: 630 })
```

O `height: "100%"` e `width: "100%"` no style do container raiz referem-se a essas dimensoes.

## Acesso a parametros dinamicos

O componente de OG image recebe os mesmos `params` que a `page.tsx` da rota. Isso permite:

1. Receber o `id` da rota dinamica
2. Fazer fetch dos dados (ex: detalhes da issue)
3. Renderizar informacoes dinamicas na imagem

O instrutor destaca: "isso aqui ta acontecendo server-side", entao voce pode acessar banco de dados, APIs internas, etc.

## Cache e performance

O instrutor adiciona cache de 15 minutos nos dados fetchados dentro do OG image. A razao: cada vez que alguem (ou um bot de rede social) acessa a URL da imagem, o Next.js precisa gerar a imagem. Sem cache, cada acesso faria um novo fetch ao banco de dados.

Com `"use cache"` ou `unstable_cache`, os dados ficam cacheados e a geracao e quase instantanea: "DOM F5 esta bem rapidinho, ja esta com os dados pre-carregados."

## Resultado pratico

Quando alguem compartilha a URL de uma issue, redes sociais e apps de mensagem fazem crawl da pagina, encontram a meta tag `og:image`, acessam a URL da imagem, e exibem o preview automaticamente — com o numero e titulo da issue renderizados dinamicamente.