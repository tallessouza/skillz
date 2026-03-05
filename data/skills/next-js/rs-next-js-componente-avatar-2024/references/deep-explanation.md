# Deep Explanation: Compound Component Pattern — Avatar

## Por que compound pattern?

O instrutor identifica um problema classico: o avatar aparece tanto na listagem de posts (PostCard) quanto na pagina interna do post, mas com variacoes. Na listagem, mostra apenas nome e foto. Na pagina interna, mostra nome, foto, e data de publicacao.

A abordagem ingenua seria copiar o JSX. O compound pattern resolve isso criando pecas atomicas que podem ser compostas de formas diferentes em cada contexto.

## A analogia com HTML nativo

O compound pattern e inspirado em elementos HTML como `<select>` + `<option>`. Voce nao passa as opcoes como props — voce compoe:

```html
<select>
  <option>A</option>
  <option>B</option>
</select>
```

Da mesma forma, `Avatar.Container` + `Avatar.Image` + `Avatar.Title` sao compostos, nao configurados.

## Decisao: reutilizar tipagem do Next.js

Um momento importante da aula e quando o instrutor comeca a tipar `src: string`, `alt: string`, `width: number`, `height: number` manualmente para o AvatarImage — e percebe que esta duplicando o que o Next.js ja oferece com `ImageProps`. A decisao correta e importar e reutilizar:

```typescript
import Image, { ImageProps } from "next/image"
```

Isso evita divergencia de tipos e mantem compatibilidade automatica com futuras versoes do Next.js.

## Rest/spread para flexibilidade

O instrutor desestrutura apenas as props essenciais (`src`, `alt`, `width`, `height`) e passa o restante via spread:

```typescript
export function AvatarImage({ src, alt, width = 40, height = 40, ...rest }: ImageProps) {
  return <Image src={src} alt={alt} width={width} height={height} {...rest} />
}
```

Isso permite que o consumidor passe qualquer prop adicional do Image sem que o AvatarImage precise conhece-las.

## Correcao do `.includes()` para `===`

O instrutor faz uma correcao importante: na pagina de slug, o codigo usava `.includes()` para encontrar o post pelo slug. O problema: se dois slugs compartilham um prefixo (ex: "transformando-seu-negocio-loja-virtual" e "transformando-seu-negocio-loja-incrivel"), `.includes()` retornaria ambos. Como slug deve ser unico, o correto e `===` (strict equality).

## Correcao do border

Antes do componente, o instrutor corrige um detalhe de CSS: o PostCard tinha `border-top` mas visualmente o border aparecia nos 4 lados. A correcao foi mudar de `border-t` para `border` (ou remover o `t` do `border-t` no `border-radius` — o ajuste foi no `border-radius` para ficar correto na parte inferior).

## Estrutura do compound pattern

Cada subcomponente tem responsabilidade unica:

| Subcomponente | Responsabilidade | CSS |
|---------------|-----------------|-----|
| Container | Layout horizontal | `flex items-center gap-3` |
| Content | Layout vertical para texto | `flex flex-col` |
| Image | Renderizar foto | Wrapper do `next/image` |
| Title | Nome do autor | `text-body-sm text-gray-200` |
| Description | Metadado (data, etc) | `text-body-xs text-gray-300` |

## Formatacao de data

O instrutor formata a data de publicacao usando `toLocaleDateString('pt-BR')` e a envolve em uma tag `<time>` com `dateTime` para acessibilidade e semantica HTML.