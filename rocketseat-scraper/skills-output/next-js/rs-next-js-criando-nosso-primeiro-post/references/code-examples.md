# Code Examples: Criando Posts Markdown com Content Layer

## Exemplo completo do arquivo Markdown do post

```markdown
---
title: "Transformando esse negocio em uma loja virtual"
description: "Descricao curta sobre o conteudo do post."
date: 2024-12-20T10:20:00
image: /assets/primeiro-post.png
---

Conteudo do post em Markdown aqui.

## Secao 1

Texto da primeira secao.

## Secao 2

Texto da segunda secao com mais detalhes.
```

## Estrutura de pastas

```
projeto/
├── posts/
│   └── primeiro-post.md
├── public/
│   └── assets/
│       └── primeiro-post.png
├── .contentlayer/
│   └── generated/
│       └── index.json          # Gerado pelo build
├── pages/
│   └── index.tsx
└── contentlayer.config.ts
```

## Importando os posts na pagina

```typescript
// pages/index.tsx
import { allPosts } from "contentlayer/generated"

export default function Home() {
  console.log(allPosts) // Array com todos os posts parseados

  return (
    <div>
      {allPosts.map((post, index) => (
        <article key={index}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <time>{post.date}</time>
          <img src={post.image} alt={post.title} />
        </article>
      ))}
    </div>
  )
}
```

## JSON gerado pela Content Layer

```json
[
  {
    "title": "Transformando esse negocio em uma loja virtual",
    "date": "2024-12-20T10:20:00.000Z",
    "description": "Descricao curta sobre o conteudo do post.",
    "image": "/assets/primeiro-post.png",
    "body": {
      "raw": "Conteudo do post em Markdown aqui.\n\n## Secao 1\n\nTexto da primeira secao.\n\n## Secao 2\n\nTexto da segunda secao com mais detalhes.",
      "html": "<p>Conteudo do post em Markdown aqui.</p>\n<h2>Secao 1</h2>\n<p>Texto da primeira secao.</p>\n<h2>Secao 2</h2>\n<p>Texto da segunda secao com mais detalhes.</p>"
    }
  }
]
```

## Comando de build (obrigatorio antes do primeiro uso)

```bash
# Gerar os arquivos da Content Layer
pnpm contentlayer build

# Depois rodar o dev server
pnpm dev
```

## Verificando que o post foi criado corretamente

```bash
# Checar se o JSON foi gerado
cat .contentlayer/generated/index.json | head -20
```

## Adicionando um segundo post

```markdown
---
title: "Segundo post do blog"
description: "Explorando mais funcionalidades do Next.js."
date: 2024-12-22T14:00:00
image: /assets/segundo-post.png
---

Conteudo do segundo post.
```

Apos salvar, o `allPosts` tera 2 itens no array automaticamente (com fast refresh em dev, ou apos rebuild em producao).