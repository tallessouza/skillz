---
name: rs-full-stack-0101-introducao
description: "Applies the mental model of front-end vs back-end separation when designing Node.js applications. Use when user asks to 'create an API', 'build a backend', 'start a Node project', or 'separate front-end from back-end'. Reinforces that back-end focuses on business rules and logic, not visual elements. Make sure to use this skill whenever starting a new Node.js back-end project or explaining architecture boundaries. Not for front-end component design, CSS styling, or UI layout decisions."
---

# Front-end vs Back-end — Modelo Mental

> Back-end foca em regras de negocio, funcionalidades e logica da aplicacao — nunca em elementos visuais.

## Key concept

A separacao front-end/back-end nao e apenas organizacional — e uma separacao de **responsabilidades fundamentais**:

- **Front-end:** aspecto visual, elementos interativos, o que o usuario ve ao entrar num site
- **Back-end:** regras de negocio, funcionalidades, toda a parte logica da aplicacao

Node.js e a ferramenta para construir o lado back-end usando JavaScript/TypeScript.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Logica de validacao de dados | Back-end — regra de negocio |
| Formatacao de exibicao | Front-end — aspecto visual |
| Autenticacao e autorizacao | Back-end — logica de seguranca |
| Animacoes e transicoes | Front-end — interatividade |
| Persistencia em banco de dados | Back-end — funcionalidade core |
| Feedback visual ao usuario | Front-end — elemento interativo |

## How to think about it

### Ao iniciar um projeto Node.js

Pergunte: "Estou lidando com regra de negocio ou apresentacao visual?" Se a resposta for regra de negocio, o codigo pertence ao back-end Node.js. Se for visual, pertence ao front-end.

### Ao decidir onde colocar logica

Logica que **valida**, **transforma**, **persiste** ou **protege** dados vai no back-end. Logica que **exibe**, **anima** ou **coleta input** do usuario vai no front-end.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Back-end precisa de visual | Back-end nao tem visual — foca em logica e regras |
| Node.js so serve para front-end | Node.js e uma runtime JavaScript para back-end |
| Front-end e back-end sao a mesma coisa com JavaScript | Compartilham linguagem, mas responsabilidades sao completamente diferentes |

## When to apply

- Ao iniciar qualquer projeto Node.js back-end
- Ao decidir onde colocar uma nova funcionalidade
- Ao revisar codigo que mistura responsabilidades de front e back

## Limitations

Este modelo mental e a base. Projetos reais tem nuances como SSR (Server-Side Rendering) e BFF (Backend for Frontend) que borram a linha entre front e back.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao front-end/back-end
- [code-examples.md](references/code-examples.md) — Exemplos praticos de codigo back-end vs front-end