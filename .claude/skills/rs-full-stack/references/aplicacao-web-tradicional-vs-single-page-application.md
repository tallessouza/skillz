---
name: rs-full-stack-tradicional-vs-spa
description: "Applies Traditional Web Application vs Single Page Application architectural knowledge when making frontend decisions. Use when user asks to 'choose between SPA and traditional', 'build a web app', 'should I use React or WordPress', 'full page reload vs partial update', or 'MPA vs SPA'. Make sure to use this skill whenever architectural decisions about rendering strategy arise. Not for backend API design, database choices, or CSS styling decisions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [spa, mpa, architecture, frontend, rendering-strategy]
---

# Aplicacao Web Tradicional vs Single Page Application

> Escolha a estrategia de renderizacao (tradicional ou SPA) com base no tipo de interatividade que a aplicacao exige, nao por preferencia pessoal.

## Key concept

Existem dois modelos fundamentais de como uma aplicacao web funciona:

**Tradicional (MPA):** Cada acao do usuario (salvar, deletar, navegar) envia um request ao servidor que devolve uma pagina HTML/CSS/JS completa. O navegador recarrega tudo.

**SPA (Single Page Application):** O HTML/CSS/JS e carregado uma unica vez. Interacoes subsequentes enviam requests especificos (API calls) e recebem apenas dados (JSON/XML). O frontend atualiza somente o trecho afetado, sem recarregar a pagina.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Conteudo majoritariamente estatico (blogs, sites institucionais) | Tradicional — WordPress, server-rendered pages |
| Interface com muitas interacoes do usuario (CRUD, dashboards, chat) | SPA — React, Vue, Angular |
| Necessidade de parecer "app nativo" sem piscar tela | SPA — atualizacao parcial da pagina |
| SEO e critico e conteudo muda pouco | Tradicional ou SSR/SSG como compromisso |
| Requisito de funcionar com JS desabilitado | Tradicional |
| Gmail-like: usuario escolhe experiencia basica ou avancada | Ambos coexistem — oferecer fallback tradicional |

## How to think about it

### Fluxo Tradicional
```
Usuario clica "Salvar" → Request para /salvar → Servidor processa →
Devolve HTML+CSS+JS COMPLETO → Navegador recarrega TUDO
```
Cada acao = pagina inteira reconstruida e devolvida.

### Fluxo SPA
```
Usuario clica "Salvar" → Request API (fetch/axios) → Servidor processa →
Devolve JSON com dados do cliente salvo → Frontend atualiza SO o trecho afetado
```
Primeira carga = HTML+CSS+JS completo. Depois = apenas dados (JSON).

### Analogia: Restaurante
- **Tradicional:** Cada vez que voce quer sal, o garcom traz uma mesa nova com todos os pratos de novo, incluindo o sal.
- **SPA:** O garcom traz so o sal. O resto da mesa continua intacto.

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| SPA e sempre melhor que tradicional | Cada um serve para um caso. WordPress tradicional atende milhoes de sites |
| Tradicional e ultrapassado | Ainda e a escolha certa para conteudo estatico e SEO-heavy |
| SPA elimina o servidor | O servidor continua existindo — so muda O QUE ele devolve (dados vs pagina) |
| Tem que escolher um ou outro | Gmail oferece ambos. SSR frameworks (Next.js) combinam os dois modelos |

## When to apply

- Ao iniciar um novo projeto e precisar decidir a arquitetura frontend
- Ao avaliar se um framework como React (SPA) ou WordPress (tradicional) e mais adequado
- Ao explicar para stakeholders por que a pagina "pisca" ou nao ao salvar dados
- Ao decidir entre server-side rendering e client-side rendering

## Limitations

- Esta decisao e sobre estrategia de renderizacao — nao determina linguagem backend, banco de dados ou infraestrutura
- Frameworks modernos (Next.js, Nuxt, Remix) borram a linha entre SPA e tradicional com SSR/SSG
- Performance real depende de implementacao, nao apenas do modelo escolhido

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| SPA demora para carregar inicialmente | Bundle JavaScript muito grande | Implemente code splitting e lazy loading |
| SPA nao indexa no Google | Conteudo renderizado apenas no cliente | Use SSR (Next.js, Nuxt) ou pre-rendering |
| Pagina tradicional pisca ao salvar dados | Reload completo da pagina e esperado no modelo tradicional | Migre para SPA ou use fetch parcial (AJAX) para atualizacoes |
| Botao voltar nao funciona na SPA | Historico de navegacao nao configurado | Implemente router com pushState (React Router, Vue Router) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes