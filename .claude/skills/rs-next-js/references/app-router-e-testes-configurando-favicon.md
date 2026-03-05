---
name: rs-nextjs-app-router-configurando-favicon
description: "Applies Next.js App Router favicon and metadata file conventions when setting up or configuring a Next.js project. Use when user asks to 'add a favicon', 'configure metadata', 'setup opengraph image', 'add icons to Next.js app', or 'configure robots.txt'. Covers special filenames in the app directory for favicon, icon, opengraph-image, twitter-image, robots.txt, sitemap.xml. Make sure to use this skill whenever working with Next.js App Router metadata or favicon configuration. Not for React meta tags in non-Next.js projects or HTML head manipulation."
---

# Configurando Favicon e Metadata Files no Next.js App Router

> No App Router do Next.js, arquivos com nomes especificos dentro da pasta `app/` sao automaticamente reconhecidos como metadata — nao precisa configurar nada manualmente no head.

## Rules

1. **Use nomes de arquivo reservados** — `icon.png`, `favicon.ico`, `opengraph-image.png`, `twitter-image.png`, `robots.txt`, `sitemap.xml`, porque o Next.js detecta automaticamente pelo nome
2. **favicon.ico vai na raiz do app/ e so aceita .ico** — para outros formatos (PNG, SVG), use o nome `icon` em vez de `favicon`, porque `.ico` e o unico formato aceito para `favicon.*`
3. **Use icon.png para formatos com transparencia** — PNG ou SVG funcionam como `icon.png` / `icon.svg` na pasta `app/`, porque Figma e outras ferramentas nao exportam `.ico`
4. **Favicons por rota sao possiveis** — coloque um `icon.png` dentro de uma subpasta (ex: `app/search/icon.png`) para ter favicon diferente naquela rota
5. **Metadata images podem ser geradas via codigo** — crie `opengraph-image.tsx` ou `icon.tsx` para gerar imagens dinamicas, porque permite personalizar por pagina sem criar arquivos manualmente

## Arquivos de Metadata Reconhecidos

| Arquivo | Proposito | Formatos |
|---------|-----------|----------|
| `favicon.ico` | Favicon (somente raiz app/) | `.ico` |
| `icon.png` | Favicon alternativo | `.png`, `.svg` |
| `opengraph-image.png` | Imagem de compartilhamento | `.jpg`, `.png`, `.gif` ou `.tsx` |
| `twitter-image.png` | Imagem Twitter Card | `.jpg`, `.png`, `.gif` ou `.tsx` |
| `robots.txt` | Regras de indexacao | `.txt` |
| `sitemap.xml` | Mapa do site | `.xml` |
| `manifest.json` | PWA manifest | `.json`, `.webmanifest` |

## Steps

### Step 1: Exportar o icone

Exporte a imagem do favicon em PNG ou SVG (formato com transparencia).

### Step 2: Colocar na pasta app/

```
src/app/icon.png    ← Nome DEVE ser "icon", nao "favicon"
```

### Step 3: Verificar

O Next.js automaticamente injeta a tag no `<head>`. Basta rodar o projeto e verificar a aba do navegador.

## Example

**Estrutura correta:**
```
src/app/
├── icon.png              ← Favicon global
├── layout.tsx
├── page.tsx
└── search/
    ├── icon.png          ← Favicon especifico da rota /search
    └── page.tsx
```

**Estrutura incorreta:**
```
src/app/
├── favicon.png           ← ERRADO: favicon.* so aceita .ico
├── public/favicon.png    ← ERRADO: nao vai na pasta public no App Router
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tem arquivo .ico | Use `favicon.ico` na raiz de `app/` |
| So tem PNG/SVG | Use `icon.png` ou `icon.svg` na raiz de `app/` |
| Precisa favicon diferente por rota | Coloque `icon.png` dentro da subpasta da rota |
| Precisa imagem dinamica (ex: por produto) | Crie `opengraph-image.tsx` com geracao via codigo |
| Quer controlar indexacao | Crie `robots.txt` na pasta `app/` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar favicon em `public/` no App Router | Coloque em `src/app/icon.png` |
| Nomear como `favicon.png` | Nomeie como `icon.png` (favicon.* so aceita .ico) |
| Configurar favicon manualmente no `<head>` | Deixe o Next.js detectar automaticamente pelo nome do arquivo |
| Criar imagens de OG manualmente para cada pagina | Use `opengraph-image.tsx` para gerar via codigo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-configurando-favicon/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-configurando-favicon/references/code-examples.md)
