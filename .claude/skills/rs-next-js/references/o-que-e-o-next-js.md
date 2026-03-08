---
name: rs-next-js-o-que-e-o-next-js
description: "Applies Next.js architectural mental model when deciding between SPA and SSR approaches. Use when user asks to 'create a Next.js app', 'improve SEO', 'choose between SPA and SSR', 'set up server-side rendering', or 'build a website with React'. Explains the intermediate Node server pattern and why Next.js exists. Make sure to use this skill whenever discussing Next.js architecture or SSR vs SPA trade-offs. Not for implementing specific Next.js features like API routes, middleware, or app router patterns (use rs-next-js-roteamento-e-layouts, rs-next-js-entendendo-os-react-server-components)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: next-js
  module: fundamentos-next-js
  tags: [next-js, ssr, spa, seo, architecture, mental-model]
---

# O que e o Next.js — Modelo Mental

> Next.js e um servidor Node intermediario que renderiza React no servidor antes de entregar ao cliente, resolvendo problemas de SEO e tempo de carregamento inicial.

## Key concept

Next.js nao e apenas um framework React — e um **servidor intermediario** escrito em Node.js posicionado entre o front-end e o back-end. Essa arquitetura resolve o problema fundamental das SPAs: a pagina em branco inicial.

**Padrao: Intermediate Server (Core/Shell)** — O servidor Node (Core) renderiza React e devolve HTML pronto ao browser (Shell). O browser recebe conteudo ja montado, sem depender de JavaScript client-side para a primeira renderizacao.

## Decision framework

| Situacao | Abordagem | Motivo |
|----------|-----------|--------|
| Site precisa de SEO (blog, e-commerce, landing page) | Next.js com SSR | Conteudo ja renderizado quando crawler acessa |
| Dashboard interno, painel admin | SPA tradicional (Vite + React) | SEO irrelevante, SPA mais simples |
| Site com conteudo estatico que muda pouco | Next.js com SSG | Melhor performance, paginas pre-geradas |
| App que precisa de ambos (areas publicas + privadas) | Next.js hibrido | SSR para paginas publicas, client-side para areas logadas |

## Como pensar no fluxo

### SPA tradicional (React puro)
```
Browser → Front-end React → API /users → JSON → React renderiza no browser
                                                    ^
                                          Pagina em branco ate aqui
```

### Com Next.js (SSR)
```
Browser → Next.js (servidor Node) → API /users → JSON
                |
    Next renderiza React no servidor Node
                |
    HTML pronto devolvido ao browser ← Sem pagina em branco
```

**WHY:** Node executa JavaScript. React e JavaScript. Entao o mesmo codigo React que rodaria no browser pode rodar no servidor Node — essa e a base tecnica que torna SSR possivel sem reescrever nada.

## Por que funciona

1. **Node executa JavaScript** — React e JavaScript, entao Node consegue executar React fora do browser
2. **Servidor intermediario** — Next.js faz a requisicao ao back-end, recebe o JSON, renderiza o React, e devolve HTML pronto
3. **Crawler recebe pagina completa** — quando Google acessa, conteudo ja esta renderizado, sem depender de JavaScript no cliente

## Trade-offs: SSR vs SPA

| Aspecto | SPA (React puro) | Next.js (SSR) |
|---------|------------------|---------------|
| SEO | Ruim — pagina em branco para crawlers | Excelente — HTML completo |
| Complexidade | Menor — apenas front-end | Maior — servidor Node intermediario |
| Custo de infra | Hosting estatico barato | Servidor Node rodando (custo de infra) |
| Tempo ate primeiro conteudo | Lento — espera JS carregar | Rapido — HTML ja pronto |

## Termos-chave

| Termo | Significado |
|-------|-------------|
| **SPA** | Single Page Application — renderizacao 100% no browser |
| **SSR** | Server-Side Rendering — renderizacao no servidor Node antes de entregar ao browser |
| **Hidratacao** | Processo onde React "assume" o HTML estatico enviado pelo servidor e torna interativo |

## Anti-patterns

| Decisao errada | Decisao correta |
|----------------|-----------------|
| Usar SPA para site que precisa de SEO | Usar Next.js com SSR/SSG |
| Usar Next.js para todo projeto React | Avaliar se SEO e necessario — SPA pode ser suficiente |
| Achar que Next.js substitui o back-end | Next.js e intermediario — o back-end continua existindo |
| Ignorar o custo de servidor do SSR | SSR exige servidor Node rodando — tem custo de infra |

## Troubleshooting

### Pagina React nao aparece no Google
**Symptom:** Site React puro (Vite/CRA) nao e indexado pelo Google corretamente
**Cause:** O index.html do SPA tem apenas `<div id="root"></div>` — ate o JS carregar, a pagina e branca. Crawlers com JS desabilitado ou timeout curto veem pagina vazia
**Fix:** Migrar para Next.js com SSR ou SSG. O servidor Node renderiza o React antes de enviar ao browser, garantindo HTML completo para crawlers

### Confusao entre Next.js e back-end
**Symptom:** Desenvolvedor tenta usar Next.js como substituto do back-end completo
**Cause:** Next.js parece fazer "tudo" por ter API Routes e server-side rendering
**Fix:** Entender que Next.js e um intermediario — ele renderiza o front-end no servidor, mas o back-end (regras de negocio, banco de dados dedicado) continua existindo como servico separado

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-o-que-e-o-next-js/references/deep-explanation.md) — Analogia do restaurante (garcom-chef), contexto historico 2016, evolucao alem do SSR
- [code-examples.md](../../../data/skills/next-js/rs-next-js-o-que-e-o-next-js/references/code-examples.md) — Comparacao HTML SPA vs SSR, fluxo getServerSideProps, diagrama visual
