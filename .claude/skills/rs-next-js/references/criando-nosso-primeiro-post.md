---
name: rs-next-js-criando-primeiro-post
description: "Generates Markdown posts with frontmatter for Next.js Content Layer projects. Use when user asks to 'create a post', 'add markdown content', 'setup blog post', 'write frontmatter', or 'configure content layer posts'. Applies correct frontmatter structure, builds content layer, and verifies JSON output. Make sure to use this skill whenever creating markdown-based content in Next.js projects using Content Layer. Not for React components, API routes, or non-Content-Layer CMS setups."
---

# Criando Posts Markdown com Content Layer

> Todo post Markdown precisa de frontmatter valido com os campos obrigatorios definidos no schema da Content Layer.

## Prerequisites

- Content Layer configurado no projeto Next.js com schema definindo campos obrigatorios
- Pasta `posts/` na raiz do projeto para arquivos Markdown
- Pasta `public/assets/` para imagens referenciadas nos posts
- Se Content Layer nao foi buildado ainda: rodar `pnpm contentlayer build`

## Steps

### Step 1: Criar arquivo Markdown na pasta posts

Criar `posts/{slug}.md` com frontmatter YAML valido:

```markdown
---
title: "Titulo do post"
description: "Descricao curta do post em uma linha."
date: 2024-12-20T10:20:00
image: /assets/nome-da-imagem.png
---

Conteudo do post aqui em Markdown.

## Secao exemplo

Texto da secao...
```

### Step 2: Adicionar imagem referenciada

Colocar a imagem em `public/assets/{nome}.png` — o path no frontmatter e relativo a `public/`.

### Step 3: Buildar Content Layer

```bash
pnpm contentlayer build
```

Gera `.contentlayer/generated/` com `index.json` contendo array de posts em formato JSON (title, date, description, image, body.raw, body.html).

### Step 4: Importar e usar os posts

```typescript
import { allPosts } from "contentlayer/generated"

// allPosts e um array de objetos com todos os campos do frontmatter + body
console.log(allPosts)
```

## Output format

Content Layer gera JSON automaticamente:

```json
[
  {
    "title": "Titulo do post",
    "date": "2024-12-20T10:20:00.000Z",
    "description": "Descricao curta.",
    "image": "/assets/imagem.png",
    "body": {
      "raw": "conteudo markdown...",
      "html": "<p>conteudo HTML...</p>"
    }
  }
]
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Adicionou novo post mas nao aparece | Rodar `pnpm contentlayer build` novamente |
| Alterou frontmatter e quer ver resultado | Fast refresh atualiza automaticamente em dev |
| Campo obrigatorio faltando no frontmatter | Content Layer vai dar erro no build — confira o schema |
| Imagem nao carrega | Verificar se o path comeca com `/assets/` e o arquivo esta em `public/assets/` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| Omitir campos obrigatorios do frontmatter | Incluir todos: title, date, description, image |
| Colocar imagens fora de `public/` | Sempre em `public/assets/` |
| Editar arquivos em `.contentlayer/generated/` | Esses sao gerados — edite o `.md` original |
| Esquecer de buildar antes do primeiro uso | `pnpm contentlayer build` antes de importar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-criando-nosso-primeiro-post/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-criando-nosso-primeiro-post/references/code-examples.md)
