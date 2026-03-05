# Code Examples: Instalação e Configuração do ContentLayer

## 1. Instalação das dependências

```bash
npm install contentlayer2 next-contentlayer2
```

> Nota: o instrutor mencionou que `date-fns` estava no exemplo original mas não é necessário nesta etapa.

## 2. next.config.mjs — antes e depois

### Antes:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

### Depois:
```typescript
import { withContentLayer } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withContentLayer(nextConfig);
```

**Ponto importante:** O instrutor converteu a sintaxe de `require`/`module.exports` para `import`/`export` ESM, que é o padrão atual do Next.js.

## 3. tsconfig.json — campos adicionados

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "contentlayer/generated": ["./.contentlayer/generated"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".contentlayer/generated"
  ]
}
```

O `baseUrl: "."` é pré-requisito para que os `paths` funcionem. O include da pasta `.contentlayer/generated` informa ao TypeScript que deve considerar esses arquivos na compilação.

## 4. contentlayer.config.ts — schema completo

```typescript
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "**/*.md",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
      required: true,
    },
    image: {
      type: "string",
      required: true,
    },
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

### Detalhamento dos campos:

| Campo | Tipo | Required | Propósito |
|-------|------|----------|-----------|
| `title` | string | sim | Título do post |
| `description` | string | sim | Descrição/resumo do post |
| `date` | date | sim | Data de publicação |
| `image` | string | sim | Path ou URL da imagem de capa |
| `slug` | string (computed) | — | Derivado do nome do arquivo |

### Como o slug é computado:

```
Arquivo: posts/meu-primeiro-post.md
doc._raw.sourceFileName → "meu-primeiro-post.md"
.replace(".md", "")     → "meu-primeiro-post"
```

Usado na rota: `/blog/meu-primeiro-post`

## 5. .gitignore — adição

```gitignore
# contentlayer
.contentlayer
```

## 6. Estrutura de pastas resultante

```
projeto/
├── posts/                      # Pasta para arquivos .md (criada vazia)
├── contentlayer.config.ts      # Schema dos documentos
├── next.config.mjs             # Envolvido com withContentLayer
├── tsconfig.json               # Paths e includes adicionados
├── .gitignore                  # .contentlayer adicionado
└── .contentlayer/              # Gerado automaticamente (não commitar)
    └── generated/
        ├── Post/               # Dados processados
        └── index.d.ts          # Tipos TypeScript gerados
```

## 7. Verificação após configuração

Sempre rode o dev server após modificar o `next.config.mjs`:

```bash
npm run dev
```

Se tudo estiver configurado corretamente, o servidor inicia sem erros. Se o TypeScript reclamar de imports do ContentLayer, reinicie o TS Server no editor.