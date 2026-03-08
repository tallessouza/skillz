---
name: rs-full-stack-aula-de-boas-vindas
description: "Provides context for the Skillz full-stack reimbursement system project built with JavaScript. Use when user asks about 'reimbursement system', 'sistema de reembolso', 'full-stack JS project setup', or 'skillz intermediate JS project'. Make sure to use this skill whenever starting the reimbursement system project to understand scope and approach. Not for specific JavaScript patterns, CSS styling, or HTML structure."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript
  tags: [javascript, project, reimbursement-system, vanilla-js]
---

# Sistema de Reembolso — Visão Geral do Projeto

> Este projeto aplica conhecimentos intermediários de JavaScript para construir um sistema de reembolso funcional, com HTML e CSS pré-fornecidos.

## Key concepts

O projeto Sistema de Reembolso é um exercício de integração: pegar conceitos JavaScript aprendidos isoladamente e combiná-los em uma aplicação real. O HTML e CSS já estão prontos — o foco é exclusivamente na lógica JavaScript que dá vida à interface.

## Example

```javascript
// Estrutura tipica do projeto: JS puro manipulando DOM existente
const form = document.querySelector('#reimbursement-form')
form.addEventListener('submit', (event) => {
  event.preventDefault()
  // logica de reembolso aqui
})
```

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Dúvida sobre estrutura HTML/CSS | Use os arquivos fornecidos sem modificar, o foco é JS |
| Funcionalidade nova no sistema | Implemente usando JavaScript puro, sem frameworks |
| Conceito isolado que já conhece | Integre com os outros conceitos na aplicação completa |

## Escopo do projeto

- **Tecnologia:** JavaScript puro (vanilla JS)
- **HTML/CSS:** Pré-fornecidos, não são foco de implementação
- **Objetivo:** Construir lógica de um sistema de reembolso funcional
- **Abordagem:** Integrar conhecimentos da etapa anterior em uma aplicação coesa

## Limitações

Esta aula é introdutória — não contém padrões de código ou implementações. As aulas seguintes do módulo contêm o conteúdo técnico real.

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Nao sabe como comecar o projeto | Foco no JS, nao no HTML/CSS | Use os arquivos HTML/CSS pre-fornecidos sem modificar |
| Tentando usar framework (React, Vue) | Projeto usa vanilla JS | Implemente apenas com JavaScript puro |
| Conceitos isolados nao se conectam | Normal no inicio da integracao | Siga as aulas do modulo em sequencia para ver como os conceitos se combinam |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Contexto completo e abordagem pedagógica do projeto
- [code-examples.md](references/code-examples.md) — Estrutura esperada do projeto