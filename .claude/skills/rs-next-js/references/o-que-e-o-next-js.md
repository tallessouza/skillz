---
name: rs-next-js-o-que-e-o-next-js
description: "Applies Next.js architectural mental model when deciding between SPA and SSR approaches. Use when user asks to 'create a Next.js app', 'improve SEO', 'choose between SPA and SSR', 'set up server-side rendering', or 'build a website with React'. Explains the intermediate Node server pattern and why Next.js exists. Make sure to use this skill whenever discussing Next.js architecture or SSR vs SPA trade-offs. Not for implementing specific Next.js features like API routes, middleware, or app router patterns."
---

# O que e o Next.js — Modelo Mental

> Next.js e um servidor Node intermediario que renderiza React no servidor antes de entregar ao cliente, resolvendo problemas de SEO e tempo de carregamento inicial.

## Conceito central

Next.js nao e apenas um framework React — e um **servidor intermediario** escrito em Node.js posicionado entre o front-end e o back-end. Essa arquitetura resolve o problema fundamental das SPAs: a pagina em branco inicial.

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
                                                    ↑
                                          Pagina em branco ate aqui
```

### Com Next.js (SSR)
```
Browser → Next.js (servidor Node) → API /users → JSON
                ↓
    Next renderiza React no servidor Node
                ↓
    HTML pronto devolvido ao browser ← Sem pagina em branco
```

## Por que funciona

1. **Node executa JavaScript** — React e JavaScript, entao Node consegue executar React fora do browser
2. **Servidor intermediario** — Next.js faz a requisicao ao back-end, recebe o JSON, renderiza o React, e devolve HTML pronto
3. **Crawler recebe pagina completa** — quando Google acessa, conteudo ja esta renderizado, sem depender de JavaScript no cliente

## Problema original (2016)

Crawlers de busca tinham duas limitacoes ao indexar SPAs:

1. **JavaScript desabilitado** — alguns crawlers desabilitavam JS para processar mais rapido, resultando em div root vazia
2. **Timeout curto** — mesmo com JS habilitado, o timeout nao dava tempo do React renderizar

Resultado: paginas React nao eram indexadas corretamente.

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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-o-que-e-o-next-js/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-o-que-e-o-next-js/references/code-examples.md)
