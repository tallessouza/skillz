---
name: rs-next-js-instalacao-e-configuracao
description: "Applies ContentLayer setup and configuration patterns when creating a Next.js blog with Markdown content. Use when user asks to 'setup contentlayer', 'configure markdown blog', 'create next.js blog', 'integrate mdx', or 'setup content layer with next'. Covers dependency installation, next.config wrapping, tsconfig paths, schema definition with computed fields, and gitignore. Make sure to use this skill whenever setting up ContentLayer or a Markdown-based blog in Next.js. Not for writing blog posts, styling, or frontend components."
---

# Instalação e Configuração do ContentLayer com Next.js

> Configure o ContentLayer como ponte tipada entre arquivos Markdown e o Next.js, definindo schema, computed fields e paths.

## Rules

1. **Instale as dependências corretas** — `contentlayer2` e `next-contentlayer2`, porque são os pacotes atualizados compatíveis com Next.js moderno
2. **Envolva o next.config com withContentLayer** — use import ESM e envolva o config existente, porque o ContentLayer precisa interceptar o build do Next.js
3. **Configure tsconfig.json com paths e includes** — adicione `baseUrl`, paths para `contentlayer/generated` e include da pasta `.contentlayer`, porque o TypeScript precisa reconhecer os tipos gerados
4. **Defina o schema no contentlayer.config.ts** — cada documento precisa de `name`, `filePathPattern`, `fields` e `computedFields`, porque isso gera tipagem forte automática
5. **Use computedFields para o slug** — derive o slug do `_raw.sourceFileName` removendo `.md`, porque isso mantém o slug sincronizado com o nome do arquivo
6. **Adicione .contentlayer ao .gitignore** — a pasta é gerada no build e não deve subir ao repositório

## How to write

### contentlayer.config.ts

```typescript
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "**/*.md",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    image: { type: "string", required: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(".md", ""),
    },
  },
}));

export default makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
});
```

### next.config.mjs (envolver com withContentLayer)

```typescript
import { withContentLayer } from "next-contentlayer2";

const nextConfig = {
  // configurações existentes
};

export default withContentLayer(nextConfig);
```

### tsconfig.json (campos adicionais)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "contentlayer/generated": ["./.contentlayer/generated"]
    }
  },
  "include": [".contentlayer/generated"]
}
```

## Example

**Before (projeto Next.js sem ContentLayer):**
```
next.config.mjs   → export default nextConfig
tsconfig.json      → sem paths para contentlayer
posts/             → não existe
.gitignore         → sem .contentlayer
```

**After (com ContentLayer configurado):**
```
next.config.mjs          → export default withContentLayer(nextConfig)
tsconfig.json            → baseUrl, paths e includes configurados
contentlayer.config.ts   → schema Post definido com computed slug
posts/                   → pasta criada na raiz (conteúdo vem depois)
.gitignore               → .contentlayer adicionado
```

## Heuristics

| Situação | Faça |
|----------|------|
| Adicionou config no next.config | Reinicie o dev server e verifique se não quebrou |
| TypeScript não reconhece tipos do ContentLayer | Reinicie o TS server no VS Code ou faça reload |
| Campo depende do nome do arquivo | Use `computedFields` com `_raw.sourceFileName` |
| Imagem do post é URL externa | Será `type: "string"` — configuração de domínios no next.config vem depois |
| Slug do post | Sempre derivado do nome do arquivo .md, nunca definido manualmente |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Definir slug como field manual | Use `computedFields` derivando de `sourceFileName` |
| Usar require/module.exports no next.config | Use import ESM (`import { withContentLayer }`) |
| Commitar pasta `.contentlayer/` | Adicione ao `.gitignore` |
| Instalar `contentlayer` (v1) | Use `contentlayer2` e `next-contentlayer2` |
| Esquecer `baseUrl: "."` no tsconfig | Sempre adicionar — paths não funcionam sem baseUrl |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-instalacao-e-configuracao/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-instalacao-e-configuracao/references/code-examples.md)
