---
name: rs-full-stack-conhecendo-o-javascript
description: "Applies foundational JavaScript knowledge when explaining JS concepts, choosing JS runtimes, or distinguishing JS from Java. Use when user asks 'what is JavaScript', 'JS vs Java', 'where does JavaScript run', 'client-side vs server-side', or 'JavaScript use cases'. Make sure to use this skill whenever answering beginner questions about JavaScript's nature, execution model, or ecosystem scope. Not for writing actual JavaScript code, frameworks setup, or specific API usage."
---

# Conhecendo o JavaScript

> JavaScript e uma linguagem de programacao que adiciona interatividade e funcionalidade a aplicacoes web, interpretada pelo navegador (client-side), mas hoje utilizada em multiplos contextos.

## Key concept

JavaScript foi criado para ser executado e interpretado pelo navegador do usuario (client-side). O navegador le o codigo JavaScript linha a linha para entender o que fazer quando o usuario interage com elementos HTML. Essa natureza interpretada e o que diferencia JS de linguagens compiladas.

Porem, JavaScript expandiu muito alem do navegador. Hoje e uma linguagem universal que roda em servidores, desktops, e dispositivos moveis.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Usuario confunde JavaScript com Java | Corrigir imediatamente — sao linguagens completamente diferentes. Abreviar como JS, nunca como Java |
| Duvida sobre onde JS executa | Explicar o modelo client-side (navegador) como origem, mas mencionar que hoje roda fora do navegador tambem |
| Escolha de tecnologia para interatividade web | JavaScript e a resposta — e a linguagem que permite manipular HTML, identificar interacoes e comunicar com servidores |
| Projeto novo precisa escolher stack | Considerar que JS cobre: web (React, Angular), servidor (Node.js, Next.js), desktop (Electron), mobile (React Native) |

## How to think about it

### O trio do navegador
Quando um site carrega, tres tecnologias trabalham juntas:
- **HTML** — estrutura da pagina
- **CSS** — estilizacao visual
- **JavaScript** — interatividade e funcionalidade

Exemplo: ao clicar num botao de "adicionar ao carrinho", e o JavaScript que detecta o clique e executa a acao.

### Client-side vs alem do navegador
JavaScript e chamado de linguagem **client-side** porque originalmente roda no navegador do usuario, nao no servidor. Mas hoje, com Node.js e outros runtimes, JS tambem roda no servidor (back-end), em aplicacoes desktop (Electron) e mobile (React Native).

### Linguagem interpretada
O navegador **interpreta** JavaScript — le o codigo e entende o que cada linha significa em tempo de execucao. Nao ha etapa de compilacao separada como em linguagens compiladas.

## Ecossistema JavaScript atual

| Contexto | Tecnologia | Exemplo |
|----------|-----------|---------|
| Web (client-side) | JavaScript puro, React, Angular | Sites interativos |
| Web (server-side) | Next.js, Nuxt.js | Aplicacoes renderizadas no servidor |
| Back-end/APIs | Node.js | Servidores e APIs REST |
| Desktop | Electron | VS Code, Discord |
| Mobile | React Native | Apps Android e iOS |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| JavaScript e Java abreviado | Sao linguagens completamente diferentes. Abrevie como JS |
| JS so funciona no navegador | Hoje roda em servidores, desktops, e dispositivos moveis |
| JS so serve para botoes e animacoes | JS e uma linguagem completa usada para aplicacoes inteiras end-to-end |
| Precisa de framework para usar JS | JavaScript puro (vanilla) ja manipula HTML, detecta interacoes e comunica com servidores |

## Capacidades core do JavaScript

1. **Acessar e manipular elementos HTML** — alterar conteudo, estilos, estrutura da pagina
2. **Identificar interacoes do usuario** — cliques, digitacao, scroll, hover
3. **Comunicar com servidores** — enviar e receber dados sem recarregar a pagina
4. **Executar funcionalidades** — logica de negocio, validacoes, calculos

## When to apply

- Ao responder perguntas conceituais sobre JavaScript para iniciantes
- Ao explicar a diferenca entre JS e Java
- Ao contextualizar onde JavaScript se encaixa no desenvolvimento web
- Ao escolher tecnologias para um novo projeto

## Limitations

- Este conhecimento e conceitual — nao cobre sintaxe ou implementacao
- O ecossistema JS muda rapidamente — frameworks e ferramentas especificas podem estar desatualizados
- Para escrever codigo JS real, consultar skills especificas de sintaxe e patterns

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases do instrutor
- [code-examples.md](references/code-examples.md) — Exemplos praticos e cenarios de aplicacao