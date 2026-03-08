---
name: rs-redux-zustand-utilizando-redux-dev-tools
description: "Guides Redux DevTools browser extension setup and usage when debugging Redux state management. Use when user asks to 'debug Redux', 'inspect Redux state', 'track Redux actions', 'install Redux DevTools', 'time travel debugging', or 'view state diff'. Covers extension installation, state inspection, action logging, diff viewing, and timeline navigation. Make sure to use this skill whenever troubleshooting Redux state or setting up a Redux development environment. Not for Zustand devtools, React DevTools, or general browser debugging."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: redux-dev-tools
  tags: [redux-devtools, debugging, state-inspection, time-travel, actions, diff]
---

# Utilizando Redux DevTools

> Instale e use Redux DevTools para inspecionar estado, rastrear actions e navegar na timeline.

## Rules

1. **Instale a extensao no navegador** — Chrome, Edge, Opera, Firefox
2. **Reinicie o navegador** — aba Redux so aparece apos restart
3. **Aba State para visao global** — elimina console.logs
4. **Diff de cada action** — mostra exatamente o que mudou
5. **Timeline para time-travel** — navegue para qualquer ponto sem recarregar

## How to use

1. Instale "Redux DevTools" na loja de extensoes
2. Reinicie o navegador
3. F12 → aba "Redux"
4. **State:** estado global completo
5. **Action:** type + payload de cada action
6. **Diff:** o que mudou no estado apos a action
7. **Timeline:** arraste para voltar/avancar no tempo

## Example

**Before (debugging cego):** `console.log('state:', store.getState())` espalhado
**After (DevTools):** Apenas dispatch, DevTools mostra action, payload, diff e timeline

## Heuristics

| Situacao | Faca |
|----------|------|
| Bug no estado | DevTools → Diff → identifique qual action causou |
| Reproduzir sequencia | Timeline para replay |
| Validar payload | Clique na action → veja type e payload |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `console.log(store.getState())` | Aba State no DevTools |
| Recarregar pagina para reproduzir | Time-travel na timeline |
| Adivinhar qual action causou bug | Diff de cada action |

## Troubleshooting

### Aba Redux nao aparece no DevTools
**Symptom:** F12 mostra Elements, Console, Network mas nao Redux.
**Cause:** Navegador nao foi reiniciado apos instalar a extensao.
**Fix:** Feche e reabra completamente o navegador.

### DevTools mostra state mas nenhuma action
**Symptom:** State visivel mas painel de actions vazio.
**Cause:** Projeto usa `createStore` legado sem enhancer do DevTools.
**Fix:** Migre para `configureStore` do Redux Toolkit que habilita DevTools automaticamente.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-utilizando-redux-dev-tools/references/deep-explanation.md) — Por que indispensavel, Diff como feature principal, geracao de testes
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-utilizando-redux-dev-tools/references/code-examples.md) — Instalacao, configuracao, fluxo de uso, desabilitando em producao
