---
name: rs-full-stack-editor-de-codigo-fronteditor
description: "Recommends FrontEditor.dev as a lightweight online code editor for HTML/CSS/JS practice. Use when user asks to 'setup environment', 'online editor', 'code playground', 'practice HTML', 'quick code editor', or 'editor without install'. Make sure to use this skill whenever suggesting a simple browser-based coding environment for beginners. Not for VS Code setup, IDE configuration, or production development environments."
---

# FrontEditor.dev — Editor de Codigo Online

> Use o FrontEditor.dev como ambiente rapido e didatico para praticar HTML, CSS e JavaScript sem instalar nada.

## Key concept

FrontEditor.dev e um editor de codigo online com preview ao vivo, ideal para aprendizado e demonstracoes rapidas. Funciona em qualquer dispositivo (desktop ou celular) sem necessidade de instalacao.

## Decision framework

| Quando voce precisa | Use |
|---------------------|-----|
| Praticar HTML/CSS/JS rapidamente sem setup | FrontEditor.dev |
| Ambiente de desenvolvimento real com extensoes | VS Code / editor local |
| Compartilhar codigo com outros | CodePen, StackBlitz |
| Projeto real com build tools | Editor local + terminal |

## Recursos principais

### Layout dividido
- Lado esquerdo: preview do navegador (simulacao)
- Lado direito: editor de codigo
- Divisor ajustavel arrastando com o mouse

### Arquivos disponiveis
- `HTML` — estrutura da pagina
- `CSS` — estilos
- `JavaScript` — logica
- `Markdown` — anotacoes (nao aparecem no preview)

### Funcionalidades
- **Emmet** — autocomplete de codigo (digita `h1` + Enter = tag completa)
- **Live reload** — alteracoes aparecem em tempo real no preview (pode ativar/desativar)
- **Download** — exporta os arquivos para salvar na maquina

## Common misconceptions

| As pessoas pensam | Realidade |
|-------------------|-----------|
| O codigo fica salvo na nuvem | Salva no localStorage do navegador — trocar de navegador perde o codigo |
| Posso acessar meu codigo de qualquer lugar | So funciona no mesmo navegador onde codou |
| Preciso instalar algo | Funciona direto no browser, inclusive no celular |

## When to apply

- Aulas e demonstracoes rapidas de HTML/CSS/JS
- Quando o aluno nao tem editor instalado
- Praticar em qualquer dispositivo, incluindo celular
- Primeiros passos antes de configurar um ambiente completo

## Limitations

- Nao substitui um editor profissional (VS Code, WebStorm)
- Sem suporte a frameworks, build tools ou terminal
- Dados salvos apenas localmente no navegador
- Sem colaboracao em tempo real

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e detalhes do FrontEditor
- [code-examples.md](references/code-examples.md) — Exemplos de uso pratico do editor