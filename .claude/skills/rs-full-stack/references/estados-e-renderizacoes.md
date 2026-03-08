---
name: rs-full-stack-estados-e-renderizacoes
description: "Enforces correct understanding of React state and rendering lifecycle when building components, managing state updates, or debugging re-renders. Use when user asks to 'create a component with state', 'fix re-rendering', 'optimize React performance', 'understand useState', or 'debug component updates'. Applies the 3-phase render model: trigger, render, commit. Make sure to use this skill whenever working with React state or investigating why components re-render. Not for CSS styling, API routes, or non-React frameworks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-state-rendering
  tags: [react, state, rendering, useState, virtual-dom, lifecycle, re-render]
---

# Estados e Renderizações no React

> Estado não é uma variável comum — estado é um gatilho que aciona o ciclo de renderização do componente.

## Key concept

O React renderiza componentes em 3 etapas sequenciais: **Acionar → Renderizar → Confirmar (Commit)**. Componentes são como cozinheiros preparando pratos (com propriedades como ingredientes), e o React é o garçom que gerencia pedidos e entregas. O React só toca na DOM real se houver diferença entre a DOM virtual e a real, garantindo performance.

## Decision framework

| Quando você encontrar | Aplique |
|----------------------|---------|
| Componente aparece pela primeira vez na tela | Renderização inicial — React chama o componente raiz e monta toda a árvore |
| Estado de um componente muda via setState | Re-renderização — React chama o componente cuja atualização acionou o gatilho |
| Componente pai re-renderiza | Componentes filhos aninhados são verificados recursivamente |
| Resultado da renderização é idêntico ao anterior | React NÃO toca na DOM — nenhuma atualização visual acontece |
| Variável comum muda (let/const sem useState) | Nenhuma re-renderização acontece — a tela não atualiza |

## How to think about it

### As 3 etapas do ciclo de renderização

**Etapa 1 — Acionar (Trigger):** Dois motivos disparam renderização:
1. Renderização inicial (componente aparece pela primeira vez)
2. Estado do componente muda (setState é chamado)

**Etapa 2 — Renderizar (Render):** React chama a função do componente para descobrir o que exibir. Na renderização inicial, chama o componente raiz. Na re-renderização, chama o componente específico cujo estado mudou. Processo é recursivo — desce pelos componentes aninhados até saber exatamente o que mudou.

**Etapa 3 — Confirmar (Commit):** React modifica a DOM real. Na renderização inicial, usa a API DOM para criar todos os nós. Na re-renderização, aplica apenas as operações mínimas necessárias, comparando DOM virtual com DOM real.

### Por que estado ≠ variável comum

```typescript
// Variável comum — NÃO aciona re-renderização
let count = 0
count = count + 1 // tela NÃO atualiza

// Estado — ACIONA re-renderização
const [count, setCount] = useState(0)
setCount(count + 1) // React aciona o ciclo: trigger → render → commit
```

### DOM Virtual vs DOM Real

React mantém duas representações: a DOM virtual (em memória, rápida de comparar) e a DOM real (o que o usuário vê). Na re-renderização, React compara as duas e só altera os nós que de fato mudaram. Se nada mudou, a DOM real não é tocada.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Mudar qualquer variável atualiza a tela | Apenas mudanças de estado (useState/useReducer) acionam re-renderização |
| Re-renderização sempre é lenta | React compara DOM virtual vs real e aplica apenas o mínimo necessário |
| Todo componente na tela re-renderiza sempre | React só re-renderiza componentes cujo estado mudou (e seus filhos, recursivamente) |
| Re-renderização significa que a DOM real inteira é recriada | React só toca nos nós da DOM real que de fato diferem da DOM virtual |

## When to apply

- Ao decidir entre variável local e estado (useState)
- Ao debugar por que um componente não atualiza na tela
- Ao otimizar performance evitando re-renderizações desnecessárias
- Ao entender por que componentes filhos re-renderizam quando o pai muda

## Limitations

- Este modelo mental cobre o ciclo básico — efeitos colaterais (useEffect) acontecem DEPOIS do commit
- Concurrent features (React 18+) adicionam nuances ao modelo de 3 etapas
- React.memo, useMemo e useCallback são otimizações que modificam o comportamento padrão de re-renderização

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Tela nao atualiza ao mudar variavel | Usando variavel comum (`let`) em vez de estado | Substituir por `useState` para acionar re-renderizacao |
| Componente re-renderiza infinitamente | `setState` chamado diretamente no corpo do componente | Mover para dentro de `useEffect` com array de dependencias |
| Estado anterior aparece apos `setState` | Estado e assincrono — valor atualiza na proxima renderizacao | Usar callback `setState(prev => prev + 1)` para calculos baseados no anterior |
| Componentes filhos re-renderizam sem necessidade | Pai re-renderiza e filhos seguem automaticamente | Usar `React.memo` nos filhos que nao dependem do estado do pai |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo com analogia do restaurante, edge cases e explicação detalhada do ciclo
- [code-examples.md](references/code-examples.md) — Exemplos de código mostrando estado vs variável, re-renderização e DOM virtual