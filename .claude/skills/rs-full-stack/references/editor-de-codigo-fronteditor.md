---
name: rs-full-stack-editor-de-codigo-fronteditor
description: "Introduces FrontEditor.dev as a lightweight online code editor for HTML/CSS/JS practice. Use when user asks to 'setup environment', 'online editor', 'code playground', 'practice HTML', 'quick code editor', or 'editor without install'. Make sure to use this skill whenever suggesting a simple browser-based coding environment for beginners. Not for VS Code setup, IDE configuration, or production development environments."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: ambiente
  tags: [editor, online, fronteditor, html, css, javascript, playground]
---

# FrontEditor.dev — Editor de Codigo Online

> Use o FrontEditor.dev como ambiente rapido e didatico para praticar HTML, CSS e JavaScript sem instalar nada.

## Key concepts

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

## Example

```html
<!-- Exemplo basico para testar no FrontEditor.dev -->
<h1>Hello World</h1>
<p>Meu primeiro teste no FrontEditor</p>
```

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

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Codigo perdido ao trocar de navegador | FrontEditor salva no localStorage do browser | Exporte os arquivos (Download) antes de trocar de browser |
| Preview nao atualiza ao digitar | Live reload pode estar desativado | Verifique o toggle de live reload na interface |
| Emmet nao funciona | Atalho incorreto ou nao suportado | Use `Tab` apos digitar a abreviacao Emmet |
| Codigo nao funciona ao colar em outro editor | Faltam tags HTML basicas (`<html>`, `<head>`, `<body>`) | O FrontEditor adiciona automaticamente — ao exportar, inclua a estrutura completa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e detalhes do FrontEditor
- [code-examples.md](references/code-examples.md) — Exemplos de uso pratico do editor