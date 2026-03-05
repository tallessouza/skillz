---
name: rs-full-stack-abertura-33
description: "Guides TypeScript learning environment setup using TypeScript Playground for isolated practice. Use when user asks to 'learn TypeScript', 'practice TypeScript online', 'setup TypeScript playground', or 'start TypeScript basics'. Ensures TypeScript is studied in isolation before applying to React or Node. Make sure to use this skill whenever introducing TypeScript concepts without a project context. Not for React with TypeScript, Node with TypeScript, or production TypeScript configuration."
---

# Introdução ao TypeScript

> Estude TypeScript isoladamente antes de aplicar em frameworks — domine a tipagem primeiro, integre depois.

## Key concept

TypeScript adiciona tipagem ao JavaScript. Antes de usar TypeScript com React ou Node, estude-o separadamente para construir uma base sólida. O TypeScript Playground é o ambiente ideal para isso — zero instalação, feedback instantâneo no navegador.

## Decision framework

| Quando você encontrar | Aplique |
|----------------------|---------|
| Primeiro contato com TypeScript | Use o TypeScript Playground, sem setup local |
| Quer testar um tipo ou pattern | Playground primeiro, projeto depois |
| Vai usar TS com React/Node | Domine TS isolado antes de integrar |
| Precisa validar uma tipagem rapidamente | Playground como scratchpad |

## How to think about it

### Aprendizado em camadas

TypeScript é melhor absorvido em 3 fases:

1. **TypeScript isolado** — tipos, interfaces, generics no Playground
2. **TypeScript + React** — tipagem de componentes, props, hooks
3. **TypeScript + Node** — tipagem de APIs, middlewares, banco de dados

Pular direto para fase 2 ou 3 gera confusão entre problemas de TypeScript e problemas do framework.

### TypeScript Playground como ferramenta

O Playground (`typescriptlang.org/play`) oferece:
- Compilação em tempo real (TS → JS visível lado a lado)
- Erros de tipo inline sem configurar `tsconfig.json`
- Compartilhamento de snippets via URL
- Versões do TypeScript selecionáveis

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Precisa instalar TypeScript para aprender | O Playground é suficiente para toda a fase de aprendizado isolado |
| Deve aprender TS junto com React/Node | Misturar conceitos novos com frameworks dificulta o aprendizado |
| TypeScript é uma linguagem separada | TypeScript é JavaScript com tipagem — todo JS válido é TS válido |

## When to apply

- Ao iniciar estudos de TypeScript do zero
- Ao testar conceitos de tipagem rapidamente
- Ao ensinar TypeScript para alguém sem ambiente configurado
- Ao prototipar tipos antes de implementar em projeto real

## Limitations

- O Playground não simula imports de módulos complexos
- Não substitui um projeto real para aprender `tsconfig.json`, build pipelines e integração com bundlers
- Exemplos isolados não cobrem patterns específicos de React ou Node

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre a abordagem de aprendizado em camadas
- [code-examples.md](references/code-examples.md) — Exemplos práticos de uso do TypeScript Playground

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-abertura-33/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-abertura-33/references/code-examples.md)
