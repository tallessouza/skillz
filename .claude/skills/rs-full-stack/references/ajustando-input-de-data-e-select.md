---
name: rs-full-stack-ajustando-input-data-select
description: "Applies cross-browser styling techniques for date inputs and select dropdowns in HTML forms. Use when user asks to 'style a date picker', 'customize select arrow', 'cross-browser form styling', 'replace calendar icon', or 'style form inputs'. Covers pseudo-element replacement, opacity trick for native pickers, CSS calc positioning, and vertical centering with translate. Make sure to use this skill whenever styling native HTML date or select inputs. Not for JavaScript date picker libraries, custom dropdown components, or form validation logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [css, forms, date-input, select, cross-browser]
---

# Estilizando Inputs de Data e Select

> Substitua indicadores nativos do browser por icones customizados usando pseudo-elementos e opacity, mantendo a funcionalidade nativa intacta.

## Rules

1. **Nunca use Display None no calendar picker** — use `opacity: 0` porque Display None remove a funcionalidade do picker nativo, e o usuario perde o calendário clicável
2. **Use pseudo-elemento (::before) para o icone customizado** — porque o seletor `webkit-calendar-picker-indicator` nao funciona no Safari, entao esconda o nativo e crie seu proprio elemento visual
3. **Centralize elementos absolutos com top 50% + translateY(-50%)** — porque top 50% posiciona o topo do elemento no meio, e translateY(-50%) recua metade da altura do proprio elemento para centralizar perfeitamente
4. **Use CSS calc() para posicionamento preciso** — `calc(100% - 1rem)` em vez de chutar porcentagens como 95%, porque calc garante espaçamento exato e consistente
5. **Remova appearance nativo antes de estilizar** — `appearance: none` no select remove a seta padrao do browser, permitindo icone customizado via background-image
6. **Use background shorthand para icones em select** — combine `url()`, `no-repeat`, e posição em uma unica declaração de background

## How to write

### Esconder picker nativo e substituir por icone

```css
/* Esconde o indicador nativo (webkit) mas mantém clicavel */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
}

/* Pseudo-elemento com icone customizado */
input[type="date"]::before {
  content: "";
  background: url("../assets/icons/calendar-03.svg") no-repeat center;
  background-size: contain;
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}
```

### Select com seta customizada

```css
select {
  appearance: none;
  background: url("../assets/icons/arrow-down.svg") no-repeat calc(100% - 1rem) center;
}
```

## Example

**Before (seta nativa do browser, icone de calendario padrao):**
```css
input[type="date"] {
  /* Nenhuma customizacao — cada browser mostra seu proprio icone */
}

select {
  /* Seta nativa diferente em cada browser */
}
```

**After (icones customizados, cross-browser consistente):**
```css
input[type="date"] {
  position: relative;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
}

input[type="date"]::before {
  content: "";
  background: url("../assets/icons/calendar-03.svg") no-repeat center;
  background-size: contain;
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

select {
  appearance: none;
  background: url("../assets/icons/arrow-down.svg") no-repeat calc(100% - 1rem) center;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa esconder elemento nativo mas manter funcionalidade | `opacity: 0` em vez de `display: none` |
| Centralizar elemento com position absolute | `top: 50%` + `transform: translateY(-50%)` |
| Posicionar icone com margem exata da borda | `calc(100% - Xrem)` em vez de porcentagem aproximada |
| Estilizar seta do select | `appearance: none` + background-image |
| Icone precisa funcionar em Safari e Chrome/Edge | Pseudo-elemento (::before/::after) em vez de seletor webkit |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `display: none` no calendar picker | `opacity: 0` no calendar picker |
| `background-position: 95%` | `background-position: calc(100% - 1rem)` |
| Estilizar apenas `::-webkit-calendar-picker-indicator` | Esconder webkit + usar `::before` para cross-browser |
| `right: 16px` para posicionar icone | `right: 1rem` para consistencia com rem |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Ícone customizado não aparece no Safari | Usou apenas `::-webkit-calendar-picker-indicator` | Use pseudo-elemento `::before` como alternativa cross-browser |
| Calendário nativo não abre ao clicar | Usou `display: none` no picker indicator | Use `opacity: 0` para esconder mantendo funcionalidade |
| Ícone descentralizado verticalmente | Faltou `transform: translateY(-50%)` com `top: 50%` | Combine ambas as propriedades no pseudo-elemento |
| Seta do select não some | Faltou `appearance: none` | Adicione `appearance: none` antes do background-image |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cross-browser, analogia do top 50%, e edge cases Safari vs Edge
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações