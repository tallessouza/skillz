# Deep Explanation: Gerando OpenGraph Image

## Como o Next.js resolve OpenGraph Images

O Next.js usa convencao de nomes de arquivo para metadados. Quando encontra um arquivo chamado `opengraph-image` em qualquer pasta dentro de `app/`, ele automaticamente:

1. **Se for imagem estatica** (`.png`, `.jpg`, `.gif`): usa diretamente como og:image
2. **Se for codigo** (`.tsx`, `.jsx`, `.ts`, `.js`): executa a funcao e converte o resultado em imagem

Isso segue o mesmo padrao de `layout.tsx`, `page.tsx`, `loading.tsx` — arquivos com nomes reservados que o Next interpreta automaticamente.

## ImageResponse: HTML → Imagem

O `ImageResponse` (importado de `next/og` ou `next/server`) converte JSX em imagem PNG. Internamente usa a biblioteca Satori da Vercel, que renderiza um subset de CSS/HTML em SVG e depois converte para PNG.

### Limitacoes importantes do Satori:
- **Nao suporta todas as propriedades CSS** — funciona bem com flexbox, mas nao com grid complexo
- **Nao carrega CSS externo** — tudo deve ser inline styles
- **Tailwind classes nao funcionam** — o runtime nao processa classes, use `tailwindcss/colors` para acessar as cores programaticamente
- **`next/image` nao funciona** — o componente Image depende do runtime do Next que nao esta disponivel neste contexto isolado

## Por que URLs absolutas sao obrigatorias

O og-image e acessado por crawlers externos (Facebook, Twitter, Discord). Esses crawlers recebem a URL da imagem via meta tag e fazem uma requisicao HTTP. Um caminho relativo como `/produto.png` nao faz sentido para um crawler externo — ele precisa do dominio completo.

A solucao idiomatica e usar o construtor `new URL()`:
```typescript
const url = new URL('/imagem.png', 'http://localhost:3000')
// Resultado: http://localhost:3000/imagem.png
```

## Variaveis de ambiente: NEXT_PUBLIC_ vs sem prefixo

O Diego explica um ponto sutil: variaveis sem `NEXT_PUBLIC_` so sao acessiveis no servidor. Como `opengraph-image.tsx` e um server component (nunca roda no browser), nao precisa do prefixo. Ele recomenda criar uma variavel separada `APP_URL` ao inves de reutilizar `NEXT_PUBLIC_API_BASE_URL`, porque semanticamente sao coisas diferentes — se o backend for separado, a API URL muda mas a APP URL nao.

## Config exports como meta tags

O Next.js converte exports nomeados do arquivo og-image em meta tags:

| Export | Meta tag gerada |
|--------|----------------|
| `export const alt = '...'` | `<meta property="og:image:alt" content="..." />` |
| `export const size = { width, height }` | `<meta property="og:image:width" />` e `height` |
| `export const contentType = 'image/png'` | `<meta property="og:image:type" content="image/png" />` |

## Fontes customizadas

Embora o Diego nao tenha usado no exemplo final, o `ImageResponse` aceita um array de fontes no segundo argumento:

```typescript
new ImageResponse(jsx, {
  ...size,
  fonts: [
    {
      name: 'Inter',
      data: await fetch('...inter-regular.ttf').then(r => r.arrayBuffer()),
      weight: 400,
      style: 'normal',
    },
  ],
})
```

Para isso, voce precisa do arquivo `.ttf` da fonte. Pode baixar do Google Fonts. A fonte e necessaria porque o og-image e isolado do layout — nao herda nenhuma configuracao de fonte do `layout.tsx`.

## Twitter Image vs OpenGraph Image

Se voce nao criar um `twitter-image.tsx` separado, o Next usa automaticamente o `opengraph-image` para o Twitter tambem. O Twitter suporta o protocolo OpenGraph. A diferenca e que o Twitter aceita imagens maiores, entao se voce quiser otimizar para o Twitter, pode criar um arquivo separado com dimensoes maiores.