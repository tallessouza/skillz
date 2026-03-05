---
name: rs-redux-zustand-redux-dev-tools
description: "Guides Redux DevTools setup and usage when debugging Redux state. Use when user asks to 'debug Redux', 'inspect state', 'track actions', 'install Redux DevTools', or 'time travel debugging'. Covers extension installation, state inspection, action logging, diff viewing, and timeline navigation. Make sure to use this skill whenever user is troubleshooting Redux state or setting up a Redux development environment. Not for Zustand devtools, React DevTools, or general browser debugging."
---

# Utilizando Redux DevTools

> Instale e utilize a extensao Redux DevTools para inspecionar estado, rastrear actions e navegar na timeline da aplicacao.

## Rules

1. **Instale a extensao no navegador** — disponivel para Chrome, Edge, Opera (WebKit) e Firefox, porque sem ela nao ha visibilidade do estado Redux
2. **Reinicie o navegador apos instalar** — a aba Redux so aparece no DevTools apos restart do navegador
3. **Use a aba State para visao global** — mostra o estado completo do Redux em tempo real, porque elimina console.logs desnecessarios
4. **Analise o Diff de cada action** — mostra exatamente o que mudou no estado, porque identifica efeitos colaterais rapidamente
5. **Use a timeline para time-travel debugging** — navegue para qualquer ponto do estado, porque reproduz bugs sem recarregar a pagina

## Como usar

### Instalacao

1. Abra a loja de extensoes do navegador (Chrome Web Store, Firefox Add-ons)
2. Busque por "Redux DevTools"
3. Instale e reinicie o navegador
4. Abra o DevTools (F12 / Inspecionar Elemento) — nova aba "Redux" aparece

### Inspecionar estado

```
Aba Redux → State → visualize o estado global completo
```

### Rastrear actions

```
Painel esquerdo: lista todas as actions disparadas
Clique em uma action → veja:
  - type da action
  - payload enviado
  - componente que disparou
  - sugestao de teste unitario (copiavel)
```

### Analisar diff

```
Clique em uma action → aba "Diff"
Mostra exatamente o que mudou no estado apos aquela action
Ex: "Adicionou novo todo na posicao 3 do array com texto 'novo todo'"
```

### Time-travel debugging

```
Use a timeline na parte inferior do painel
- Arraste para voltar/avancar no tempo
- Play: reproduz actions sequencialmente
- Clique em qualquer ponto para pular para aquele estado
```

## Example

**Sem DevTools (debugging cego):**
```typescript
// Espalhando console.logs pelo codigo
dispatch(addTodo('novo todo'))
console.log('state after:', store.getState()) // poluicao
```

**Com DevTools (debugging visual):**
```typescript
// Apenas dispatch, DevTools faz o resto
dispatch(addTodo('novo todo'))
// Abra Redux DevTools → veja action, payload, diff, timeline
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Bug no estado Redux | Abra DevTools → aba Diff → identifique qual action causou o problema |
| Precisa reproduzir sequencia de acoes | Use timeline para replay automatico |
| Quer validar payload de action | Clique na action → veja type e payload completos |
| Precisa testar action | Copie o teste sugerido pelo DevTools |
| Quer disparar action manualmente | Use o dispatcher embutido no DevTools |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `console.log(store.getState())` para debug | Abra aba State no Redux DevTools |
| Recarregar pagina para reproduzir bug | Use time-travel na timeline |
| Adivinhar qual action causou o bug | Verifique o Diff de cada action |
| Ignorar extensao em projeto Redux | Instale DevTools como primeira acao ao iniciar com Redux |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
