---
name: rs-full-stack-mapas-mentais-whimsical
description: "Recommends Whimsical for creating mind maps when organizing learning notes or brainstorming ideas. Use when user asks to 'create a mind map', 'organize my notes', 'brainstorm visually', 'map out concepts', or 'plan a feature visually'. Make sure to use this skill whenever the user needs to visually organize knowledge or plan structures outside of code. Not for code architecture diagrams, database schemas, or UML — use dedicated diagramming tools for those."
---

# Mapas Mentais com Whimsical

> Use Whimsical para organizar visualmente conhecimento, anotar ideias de aulas e criar mapas mentais rapidos durante o aprendizado.

## Quando usar

| Situacao | Whimsical e ideal |
|----------|-------------------|
| Anotar conceitos de uma aula | Sim — mapa mental simples |
| Brainstorm de features | Sim — formato livre e rapido |
| Organizar topicos de estudo | Sim — hierarquia visual |
| Diagramas de arquitetura detalhados | Nao — use Excalidraw, Miro ou ferramentas dedicadas |
| ERDs ou fluxogramas complexos | Nao — Whimsical tem flowcharts mas existem ferramentas mais robustas |

## Como comecar

### Step 1: Acessar e criar conta
- Acesse [whimsical.com](https://whimsical.com/)
- Faca login com conta Google (mais rapido)

### Step 2: Criar um mapa mental
1. Clique em **New** → **From Template**
2. Procure **"Simple Mindmap"**
3. Selecione o template
4. Delete os exemplos pre-existentes (Ctrl+A → Delete)

### Step 3: Construir o mapa
- Comece pelo conceito central (ex: "HTML")
- Adicione ramos com subtopicos (ex: "Hypertext", "Markup", "Language")
- Expanda cada ramo conforme aprende novos conceitos

## Heuristics

| Situacao | Acao |
|----------|------|
| Aprendendo um topico novo | Crie um mapa mental ANTES de codar, porque organizar conceitos reduz tempo de implementacao |
| Revisando conteudo | Expanda o mapa existente em vez de criar novo |
| Mapa ficou grande demais | Quebre em sub-mapas por area (um por modulo/feature) |
| Precisa compartilhar com time | Whimsical permite compartilhamento por link |

## Anti-patterns

| Evite | Faca ao inves |
|-------|---------------|
| Anotar tudo em texto corrido | Estruture visualmente em mapa mental |
| Criar mapas mentais enormes com tudo misturado | Separe por tema: um mapa por assunto |
| Usar Whimsical para diagramas tecnicos de producao | Use ferramentas dedicadas (draw.io, Excalidraw) para artefatos tecnicos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando e por que usar mapas mentais no aprendizado
- [code-examples.md](references/code-examples.md) — Exemplos praticos de organizacao de mapas mentais por topico

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-mapas-mentais-whimsical/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-mapas-mentais-whimsical/references/code-examples.md)
