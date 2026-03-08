---
name: rs-full-stack-webpage-vs-website
description: "Applies the distinction between WebPage and WebSite when discussing or structuring web projects. Use when user asks to 'create a website', 'build a page', 'structure a web project', or 'plan site architecture'. Ensures correct terminology and mental model for single pages vs multi-page sites. Make sure to use this skill whenever planning or discussing web project structure. Not for backend architecture, API design, or database modeling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: html-fundamentals
  tags: [html, web, webpage, website, terminology, architecture]
---

# WebPage vs WebSite

> Uma WebPage e uma pagina individual acessada por URL; um WebSite e o agrupamento estruturado de varias WebPages.

## Key concept

WebPage e a unidade atomica da web: um documento composto por arquivos HTML, CSS e JavaScript, acessivel por uma URL unica no navegador. WebSite e a estrutura que agrupa multiplas WebPages conectadas entre si por navegacao (links, menus, rotas).

## Decision framework

| Quando voce encontra | Termo correto | Porque |
|---------------------|---------------|--------|
| Um unico documento com uma URL | WebPage | E uma pagina individual |
| Conjunto de paginas com navegacao entre elas | WebSite | E o agrupamento estruturado |
| Home, catalogo, blog, sobre — tudo junto | WebSite | Varias WebPages formam o site |
| Landing page isolada sem navegacao interna | WebPage | Pagina unica, sem agrupamento |

## How to think about it

### Analogia do sitio

WebSite vem de "site" (sitio, local). Pense como uma fazenda: o sitio e a propriedade inteira, cada construcao dentro dele (casa, celeiro, estabulo) e uma WebPage. Voce visita o sitio, mas entra em construcoes individuais.

### Navegacao define a fronteira

```
WebSite: skillzcity.com.br
├── / (home)           ← WebPage
├── /catalogo          ← WebPage
├── /blog              ← WebPage
└── /sobre             ← WebPage
```

Cada URL e uma WebPage. O conjunto conectado e o WebSite.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| WebPage e WebSite sao sinonimos | WebPage e uma pagina, WebSite e o conjunto |
| Um SPA e so uma WebPage | Pode ser um WebSite com rotas client-side |
| WebSite precisa de muitas paginas | Pode ter poucas, mas precisa de estrutura de navegacao |

## When to apply

- Ao planejar a estrutura de um projeto web (quantas paginas, como se conectam)
- Ao discutir escopo: "voce quer uma pagina ou um site completo?"
- Ao nomear arquivos e rotas — cada rota representa uma WebPage dentro do WebSite

## Limitations

- Essa distincao e conceitual e pedagogica — na pratica, SPAs e aplicacoes web modernas borram a linha entre pagina e site
- O termo WebSite nao implica tecnologia especifica (pode ser estatico, SSR, SPA, etc.)

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Confusao entre pagina e site ao definir escopo | Falta de distincao conceitual | Uma URL = WebPage; navegacao entre URLs = WebSite |
| SPA tratada como "uma pagina" | Rotas client-side criam WebPages virtuais | Cada rota e uma WebPage logica, mesmo sem reload |
| Estrutura de pastas nao reflete a arquitetura | Arquivos HTML nao organizados por pagina | Crie um arquivo HTML por WebPage ou um componente por rota |
| Cliente pede "um site" mas descreve uma landing page | Ambiguidade no escopo do projeto | Clarifique: "uma pagina unica ou varias paginas conectadas?" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos de estrutura de paginas e sites

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-webpage-vs-website/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-webpage-vs-website/references/code-examples.md)
