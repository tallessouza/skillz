# Code Examples: Gerando Open Graph Image no Next.js

## Exemplo completo da aula

### Estrutura de arquivos

```
app/
  issues/
    [id]/
      page.tsx              # Pagina da issue
      opengraph-image.tsx   # Imagem OG gerada dinamicamente
```

### opengraph-image.tsx — Versao basica (sem dados dinamicos)

```typescript
import { ImageResponse } from "next/og";

export default function IssueImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "#16161D",
          padding: "80px",
        }}
      >
        <p style={{ fontSize: 48, fontWeight: 600, color: "#9397AA" }}>
          Issue #01
        </p>
        <p
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ECEDF2",
            textAlign: "left",
            maxWidth: 1000,
          }}
        >
          Issue de exemplo
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

### opengraph-image.tsx — Versao completa com dados dinamicos e cache

```typescript
import { ImageResponse } from "next/og";

interface IssueImageProps {
  params: { id: string };
}

export default async function IssueImage({ params }: IssueImageProps) {
  const { id } = params;

  // Fetch com cache de 15 minutos
  const issue = await getCachedIssueDetails(id);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "#16161D",
          padding: "80px",
        }}
      >
        <p style={{ fontSize: 48, fontWeight: 600, color: "#9397AA" }}>
          {issue.issueNumber}
        </p>
        <p
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ECEDF2",
            textAlign: "left",
            maxWidth: 1000,
          }}
        >
          {issue.title}
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

### Estilos aplicados pelo instrutor

| Elemento | Propriedade | Valor | Razao |
|----------|-------------|-------|-------|
| Container | `display` | `"flex"` | Obrigatorio no ImageResponse |
| Container | `flexDirection` | `"column"` | Empilhar textos verticalmente |
| Container | `alignItems` | `"flex-start"` | Alinhar a esquerda |
| Container | `justifyContent` | `"flex-end"` | Conteudo no rodape da imagem |
| Container | `background` | `"#16161D"` | Fundo escuro |
| Container | `padding` | `"80px"` | Espacamento generoso |
| Numero da issue | `fontSize` | `48` | Texto secundario grande |
| Numero da issue | `fontWeight` | `600` | Semi-bold |
| Numero da issue | `color` | `"#9397AA"` | Cinza suave |
| Titulo | `fontSize` | `72` | Destaque principal |
| Titulo | `fontWeight` | `700` | Bold |
| Titulo | `color` | `"#ECEDF2"` | Quase branco |
| Titulo | `textAlign` | `"left"` | Para quando quebrar linha |
| Titulo | `maxWidth` | `1000` | Evitar colar na borda direita |

### Como verificar a imagem gerada

1. Acesse a pagina da issue no browser
2. Abra DevTools → Elements → `<head>`
3. Busque por `og:image` (Ctrl+F)
4. Copie a URL do `content` da meta tag
5. Acesse a URL diretamente — a imagem PNG sera exibida

### Meta tag gerada automaticamente

```html
<meta property="og:image" content="http://localhost:3000/issues/42/opengraph-image" />
```

O Next.js gera essa tag sem nenhuma configuracao adicional, apenas pela presenca do arquivo `opengraph-image.tsx` na rota.