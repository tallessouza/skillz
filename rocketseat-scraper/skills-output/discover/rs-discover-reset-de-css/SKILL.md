---
name: rs-discover-reset-de-css
description: "Applies CSS reset patterns when writing HTML/CSS code. Use when user asks to 'create a page', 'start a project', 'write CSS', 'style a component', or 'fix spacing issues'. Enforces universal selector reset (margin/padding zero) and box-sizing: border-box on all elements. Make sure to use this skill whenever generating base CSS or starting new stylesheets. Not for JavaScript logic, backend code, or CSS animations."
---

# Reset de CSS

> Sempre iniciar stylesheets com reset universal de margin, padding e box-sizing para eliminar inconsistencias entre navegadores.

## Rules

1. **Resete margin e padding com seletor universal** — `* { margin: 0; padding: 0; }`, porque navegadores aplicam valores padrao diferentes (ex: body tem 8px de margin, p tem margin vertical) e isso causa espacamentos inesperados
2. **Use box-sizing: border-box em tudo** — `* { box-sizing: border-box; }`, porque sem isso padding e border aumentam o tamanho total da caixa alem do width/height definido, quebrando layouts
3. **Coloque o reset no inicio do CSS** — antes de qualquer outro estilo, porque regras posteriores dependem de um baseline limpo

## How to write

### Reset universal completo

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

## Example

**Before (problema com espacamentos do navegador):**

```css
.container {
  width: 360px;
  padding: 100px;
}
/* Container ultrapassa 360px porque padding soma ao width */
/* Body tem 8px de margin invisivel */
```

**After (com reset aplicado):**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  width: 360px;
  padding: 100px;
}
/* Container mantem 360px — padding e acomodado internamente */
/* Sem margin fantasma no body */
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Novo arquivo CSS | Adicionar reset universal como primeiras linhas |
| Elemento com espacamento inesperado | Verificar se reset esta aplicado |
| Width definido mas caixa maior que esperado | Confirmar que box-sizing: border-box esta ativo |
| Usando framework CSS (Tailwind, Bootstrap) | Reset ja incluso, nao duplicar |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| CSS sem reset no inicio | `* { margin: 0; padding: 0; box-sizing: border-box; }` |
| `box-sizing: content-box` (padrao) | `box-sizing: border-box` |
| Calculos manuais para compensar padding | `box-sizing: border-box` resolve automaticamente |
| Reset apenas no body | Seletor universal `*` para cobrir todos os elementos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre box model e comportamento dos navegadores
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variacoes de reset