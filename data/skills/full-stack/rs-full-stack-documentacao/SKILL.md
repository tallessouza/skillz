---
name: rs-full-stack-documentacao
description: "Guides developers to use MDN and DevDocs as primary documentation sources when learning or researching web technologies. Use when user asks 'where to find docs', 'how to learn CSS/HTML/JS', 'documentation reference', 'look up a property', or 'research a web technology'. Make sure to use this skill whenever recommending documentation sources for web development. Not for API-specific docs, framework tutorials, or video course recommendations."
---

# Documentacao — Fontes de Referencia para Programacao Web

> Ao pesquisar qualquer tecnologia web, consulte primeiro o MDN e o DevDocs antes de qualquer outra fonte.

## Key concept

O MDN (developer.mozilla.org) e o DevDocs (devdocs.io) sao as duas fontes primarias de documentacao para desenvolvimento web. O MDN e a referencia canonica para HTML, CSS e JavaScript. O DevDocs agrega documentacao de 673+ tecnologias num unico lugar, incluindo o proprio MDN, com busca unificada e suporte offline.

## Decision framework

| Quando voce precisa | Use |
|---------------------|-----|
| Propriedade CSS, API JavaScript, elemento HTML | MDN diretamente (`MDN {termo}` no Google) |
| Comparar ou buscar entre multiplas tecnologias | DevDocs (busca unificada) |
| Documentacao em portugues | MDN (trocar idioma quando disponivel) |
| Trabalhar sem internet | DevDocs (modo offline instalado) |
| Framework/lib especifica (Astro, React, etc.) | DevDocs (agrega docs oficiais) |

## How to think about it

### Pesquisa rapida no MDN

Busque no Google com prefixo: `MDN background CSS`. Clique no resultado do `developer.mozilla.org`. O MDN oferece traducao para portugues em muitas paginas — troque no seletor de idioma. Se nao houver portugues disponivel, a versao em ingles e a unica opcao.

### Pesquisa multi-tecnologia no DevDocs

Abra `devdocs.io`, use a barra de busca. Observe o "selinho" (badge) que indica de qual tecnologia e o resultado — importante porque `background` pode aparecer em CSS, React Native, etc. Ative apenas as tecnologias que voce usa para filtrar ruido.

### DevDocs como agregador

O DevDocs nao cria documentacao propria. Para tecnologias cobertas pelo MDN (CSS, HTML, JS), ele exibe o conteudo do MDN. Para outras (Astro, Node, etc.), puxa da documentacao oficial do projeto.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Preciso ser fluente em ingles para programar | Nao — voce desenvolve "ingles instrumental" naturalmente ao estudar programacao |
| MDN tem tudo | MDN cobre HTML/CSS/JS/Web APIs, mas nao frameworks como Astro ou React |
| DevDocs e uma documentacao propria | DevDocs agrega documentacoes de outras fontes, nao cria conteudo |
| Preciso aprender 673 tecnologias | Foque nas que voce usa — o DevDocs permite habilitar/desabilitar tecnologias |

## When to apply

- Ao recomendar onde um iniciante deve buscar informacao sobre propriedades CSS, elementos HTML ou APIs JavaScript
- Ao sugerir fontes de consulta para qualquer tecnologia web
- Quando o usuario expressa preocupacao com ingles — tranquilize e sugira MDN em portugues como ponto de partida

## Limitations

- MDN nao cobre frameworks/libs de terceiros (React, Vue, Astro)
- A traducao do MDN para portugues nao existe para todos os termos
- DevDocs e somente em ingles, sem opcao de troca de idioma

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ingles instrumental e estrategia de aprendizado
- [code-examples.md](references/code-examples.md) — Exemplos praticos de como buscar documentacao eficientemente