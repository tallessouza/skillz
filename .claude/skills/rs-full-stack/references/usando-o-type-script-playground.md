---
name: rs-full-stack-ts-playground
description: "Guides usage of TypeScript Playground for quick prototyping and learning. Use when user asks to 'test TypeScript online', 'use TypeScript Playground', 'try TypeScript without installing', or 'prototype TypeScript code'. Applies knowledge of Playground layout, execution, and output panels. Make sure to use this skill whenever suggesting an online environment for TypeScript experimentation. Not for local TypeScript project setup, tsconfig configuration, or production builds."
---

# TypeScript Playground

> Use o TypeScript Playground como ambiente online para experimentar e validar codigo TypeScript sem instalacao local.

## Quando usar

| Situacao | Playground e ideal |
|----------|-------------------|
| Testar um tipo ou generic rapidamente | Sim |
| Validar comportamento de TypeScript antes de implementar | Sim |
| Ensinar ou demonstrar conceitos TypeScript | Sim |
| Projeto real com multiplos arquivos | Nao — use ambiente local |

## Como acessar

1. **URL direta:** `https://www.typescriptlang.org/play`
2. **Google:** pesquisar "TypeScript Playground" ou "TS Playground"
3. **Site oficial:** typescriptlang.org → menu "Playground"

## Layout da ferramenta

```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│   Editor de codigo  │   Painel de saida   │
│   (TypeScript)      │   (JS / Logs / Err) │
│                     │                     │
└─────────────────────┴─────────────────────┘
         ▲                    ▲
    Escreva aqui         Resultado aqui
```

- **Lado esquerdo:** editor onde se escreve TypeScript
- **Lado direito:** painel com abas — JS output, Logs, Errors
- **Painel recolhivel:** seta para expandir/recolher o painel de saida
- **Botao Run:** executa o codigo e exibe resultado na aba Logs

## Exemplo rapido

```typescript
// No editor do Playground:
const message: string = "Hello TypeScript"
console.log(message)

// Clicar "Run" → aba "Logs" mostra: "Hello TypeScript"
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Painel de saida sumiu | Clicar na seta para expandir novamente |
| Quer ver o JS gerado | Verificar a aba de saida JavaScript (lado direito) |
| Quer ver erros de tipo | Verificar a aba "Errors" no painel |
| Quer executar o codigo | Clicar no botao "Run" para ver output em "Logs" |
| Precisa compartilhar codigo | Usar o botao "Share" que gera URL unica |

## Limitacoes

- Apenas um arquivo por vez (sem imports entre arquivos)
- Sem acesso a filesystem, APIs externas ou Node.js APIs
- Nao substitui um ambiente de desenvolvimento real para projetos

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar Playground vs ambiente local
- [code-examples.md](references/code-examples.md) — Exemplos praticos para testar no Playground

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-usando-o-type-script-playground/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-usando-o-type-script-playground/references/code-examples.md)
