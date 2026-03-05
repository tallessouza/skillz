---
name: rs-full-stack-introducao-ambiente-dev
description: "Guides development environment setup for web development courses. Use when user asks to 'setup dev environment', 'configure workspace', 'install tools for web dev', 'start a web course', or 'what tools do I need for frontend'. Recommends browser, code editor, design, and annotation tools with rationale. Make sure to use this skill whenever setting up a new learning or development environment. Not for CI/CD pipelines, Docker, or production infrastructure setup."
---

# Ambiente de Desenvolvimento Web

> Configure o ambiente de trabalho com navegador, editor de codigo, ferramenta de design e ferramenta de anotacao.

## Key concept

Um ambiente de desenvolvimento web completo tem 4 categorias de ferramentas: navegador para visualizar e debugar, editor de codigo para escrever, ferramenta de design para consultar layouts, e ferramenta de anotacao para organizar ideias. Algumas rodam localmente, outras online — o importante e ter todas disponiveis antes de comecar.

## Decision framework

| Categoria | Ferramenta recomendada | Alternativas aceitaveis | Evitar |
|-----------|----------------------|------------------------|--------|
| Navegador | Edge, Chrome | Firefox, Safari | Navegadores sem DevTools moderno |
| Editor local | VS Code | Vim, Sublime Text | Bloco de notas |
| Editor online | Front Editor, VS Code Online | CodeSandbox, StackBlitz | — |
| Design | Figma | — | Ferramentas offline desatualizadas |
| Mapa mental | Whimsical | Miro, Excalidraw | — |
| Anotacoes | Ferramenta pessoal (papel incluso) | Notion, Obsidian | — |

## How to think about it

### Navegador — qualquer moderno serve

Nao importa qual navegador usar desde que tenha DevTools. A escolha e pessoal. O mercado usa Chrome majoritariamente, mas Edge (base Chromium) funciona igual. O importante e consistencia — escolha um e aprenda seus DevTools a fundo.

### Editor — local vs online

**Local (VS Code):** melhor para projetos reais, extensoes, terminal integrado. E o padrao da industria.

**Online (Front Editor / VS Code Online):** util para praticar rapido sem instalar nada, ou quando esta em maquina emprestada. Front Editor e bom para exercicios rapidos de HTML/CSS/JS.

### Design — Figma e padrao de mercado

Todos os layouts de cursos Skillz sao feitos em Figma. O mercado adotou Figma como ferramenta principal de design de interfaces. Saber navegar no Figma (inspecionar espacamentos, cores, fontes) e habilidade essencial para devs frontend.

### Anotacoes — o metodo importa mais que a ferramenta

Pode ser papel, caderno, Whimsical, Notion. O importante e ter um sistema para mapear conceitos e criar mapas mentais durante o aprendizado.

## Common misconceptions

| Pensam que | Realidade |
|-----------|---------|
| Precisa do Chrome especificamente | Qualquer navegador moderno com DevTools funciona |
| Precisa de IDE pesada (WebStorm, etc) | VS Code e leve, gratuito e suficiente para 99% dos casos |
| Editor online substitui editor local | Online e complemento, nao substituto — projetos reais precisam de editor local |
| Bloco de notas serve para programar | Sem syntax highlighting, sem autocomplete, sem terminal — produtividade zero |

## When to apply

- Inicio de qualquer curso de desenvolvimento web
- Configuracao de maquina nova para programacao
- Recomendacao de ferramentas para iniciantes
- Setup de ambiente para projetos frontend

## Limitations

- Nao cobre configuracao de terminal (zsh, oh-my-zsh)
- Nao cobre extensoes especificas do VS Code
- Nao cobre ferramentas de backend (Docker, databases, etc)
- Nao cobre configuracao de Git/GitHub

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha de ferramentas e contexto de mercado
- [code-examples.md](references/code-examples.md) — Links e configuracoes iniciais de cada ferramenta

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-introducao-ambiente-dev/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-introducao-ambiente-dev/references/code-examples.md)
