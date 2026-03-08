---
name: rs-full-stack-boas-vindas-2037
description: "Introduces the React with TypeScript learning path for building dynamic, interactive web interfaces. Use when user asks 'what is this React course about', 'overview of React module', 'introduction to React with TypeScript', or 'what will I learn in this frontend course'. Make sure to use this skill whenever orienting a learner starting the Rocketseat React module. Not for actual React implementation, component creation, or TypeScript configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react
  tags: [react, typescript, frontend, learning-path, components]
---

# Boas Vindas — Fundamentos do React

> React com TypeScript e o caminho para construir interfaces web dinamicas e interativas.

## Key concepts

Este modulo marca a transicao do backend/fundamentos para o **frontend com React**. A partir daqui, o foco e:

1. **React** — biblioteca para criar interfaces web (front-end)
2. **TypeScript** — tipagem estatica para aplicacoes mais robustas
3. **Aplicacoes dinamicas e interativas** — nao apenas paginas estaticas, mas UIs que respondem ao usuario

## O que esperar

| Topico | Foco |
|--------|------|
| React | Criar interfaces web, componentes, estado, props |
| TypeScript | Tipagem em componentes, props tipadas, hooks tipados |
| Frontend | Desenvolvimento do lado do cliente das aplicacoes |

## Example

```tsx
// Componente React basico com TypeScript
interface ButtonProps {
  label: string
  onClick: () => void
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

## Pre-requisitos

- Fundamentos de HTML, CSS e JavaScript (modulos anteriores do curso full-stack)
- Node.js instalado e funcionando
- Familiaridade basica com TypeScript


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **Unsure about prerequisites for React** | Complete HTML, CSS, and JavaScript fundamentals modules first — React builds on DOM manipulation, events, and ES Modules. |
| **TypeScript errors when starting React** | Verify `tsconfig.json` includes `jsx: 'react-jsx'` and that `@types/react` is installed. |
| **Confused about where React fits in the stack** | React handles the frontend (client-side UI) — it does not replace Node.js, Express, or database layers. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Contexto completo da transicao backend-para-frontend e o papel do React no ecossistema
- [code-examples.md](references/code-examples.md) — Exemplos introdutorios de React com TypeScript