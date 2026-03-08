---
name: rs-next-js-o-que-e-seo
description: "Applies SEO fundamentals when building Next.js pages or any web application. Use when user asks to 'improve SEO', 'add meta tags', 'optimize for search engines', 'increase organic traffic', or 'make page rankable'. Classifies SEO actions into On-Page, Off-Page, and Technical SEO and guides implementation priorities. Make sure to use this skill whenever creating landing pages, blogs, or e-commerce pages in Next.js. Not for paid advertising, Google Ads configuration, or social media content creation."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: seo-fundamentals
  tags: [seo, meta-tags, open-graph, search-engines, next-js, organic-traffic, on-page-seo, technical-seo]
---

# SEO — Search Engine Optimization

> Alinhar estrutura da pagina, qualidade do conteudo e fatores externos para maximizar trafego organico nos motores de busca.

## Key concept

SEO e o conjunto de estrategias que aumentam o score de ranqueamento da pagina nos motores de busca (Google, Bing, Yahoo). Quanto maior o score, mais alto a pagina aparece nos resultados de pesquisa. O objetivo final e trafego organico — visitantes que chegam sem custo de midia paga.

Beneficios diretos: aumento de trafego organico, taxa de conversao, visibilidade da marca e vantagem competitiva.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Criando pagina nova (landing, blog, e-commerce) | On-Page SEO: meta tags, palavras-chave, textos alternativos, links internos |
| Pagina ja existe mas nao rankeia | Auditar os 3 tipos: On-Page, Off-Page e Technical SEO |
| Site lento ou sem HTTPS | Technical SEO: performance, seguranca, sitemap XML |
| Sem presenca em redes sociais | Off-Page SEO: construcao de links, marketing em redes sociais |
| E-commerce com muitas paginas | Garantir que todas as paginas sejam indexaveis pelos motores de busca |

## Os 3 tipos de SEO

### On-Page SEO (conteudo da pagina)
- Otimizacao de palavras-chave
- Qualidade do conteudo
- Meta tags (title, description, Open Graph)
- Textos alternativos em imagens
- Links internos (componente `Link` do Next.js ajuda aqui)

### Off-Page SEO (fora da pagina)
- Marketing em redes sociais (YouTube, LinkedIn, Instagram, X)
- Construcao de links externos apontando para o site
- Presenca em ecossistema digital ao redor da pagina

### Technical SEO (infraestrutura)
- Otimizacao de performance
- Responsividade (experiencia do usuario em dispositivos mobile, nao apenas visual)
- HTTPS (seguranca)
- Sitemap XML
- Navegacao otimizada

## Heuristics

| Situacao | Faca |
|----------|------|
| Blog pessoal sobre Next.js | On-Page SEO: meta tags + conteudo de qualidade para ranquear em buscas especificas |
| E-commerce | Garantir indexacao de todas as paginas de produto |
| Landing page de empresa | Os 3 tipos de SEO combinados |
| Projeto Next.js novo | Comecar pelo Technical SEO (performance, HTTPS) + On-Page (meta tags) |

## Common misconceptions

| As pessoas pensam | Realidade |
|-------------------|-----------|
| SEO e so colocar meta tags | Meta tags sao apenas uma parte do On-Page SEO; existem 3 tipos |
| Precisa pagar para ranquear | Trafego organico e gratuito; SEO existe justamente para nao depender de midia paga |
| Responsividade e so layout visual | Inclui experiencia completa do usuario em mobile: navegacao, performance, usabilidade |
| Basta ter um bom site | Fatores externos (redes sociais, backlinks) tambem influenciam o ranqueamento |

## When to apply

- Ao criar qualquer pagina web que precise ser encontrada via busca
- Ao fazer deploy de aplicacao Next.js (Vercel, etc.)
- Ao revisar paginas existentes que nao estao ranqueando bem
- Ao planejar estrategia de conteudo para blog ou e-commerce

## Limitations

- SEO nao substitui trafego pago em cenarios que exigem resultados imediatos
- Resultados de SEO sao de medio/longo prazo
- Este skill cobre fundamentos; implementacao pratica de meta tags e sitemap estao em skills separados

## Troubleshooting

### Meta tags nao aparecem no preview de compartilhamento
**Symptom:** Ao compartilhar link no WhatsApp/Twitter/LinkedIn, preview aparece sem imagem ou descricao
**Cause:** Falta de tags Open Graph ou tags com valores vazios/incorretos
**Fix:** Adicionar `og:title`, `og:description`, `og:image` via metadata export ou generateMetadata. Verificar com https://cards-dev.twitter.com/validator

### Title duplicado ou generico no Google
**Symptom:** Google mostra title diferente do configurado ou igual para todas as paginas
**Cause:** Title identico em todas as paginas ou faltando configuracao especifica por rota
**Fix:** Configurar metadata unica por pagina usando `export const metadata` ou `generateMetadata` com dados dinamicos

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-o-que-e-seo/references/deep-explanation.md) — O instrutor explica SEO usando a analogia de um sistema de pontuacao (score). Os motores de busca — 
- [code-examples.md](../../../data/skills/next-js/rs-next-js-o-que-e-seo/references/code-examples.md) — Esta aula e conceitual/teorica — nao contem exemplos de codigo diretos. O instrutor menciona que a i
