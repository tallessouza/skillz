---
name: rs-acessibilidade-react-estilos-globais
description: "Applies accessible global CSS reset and base styles when setting up a React application. Use when user asks to 'create global styles', 'reset CSS', 'setup base styles', 'configure fonts', or 'set background color'. Enforces contrast-aware defaults from the start, flags dark backgrounds with light text requirements. Make sure to use this skill whenever generating global CSS for React projects. Not for component-specific styles, CSS modules, or styled-components patterns."
---

# Estilos Globais Acessiveis

> Ao configurar CSS global, garanta reset consistente, fontes legiveis e contraste adequado desde o inicio.

## Rules

1. **Sempre resete margin, padding e box-sizing** — `* { margin: 0; padding: 0; box-sizing: border-box; }`, porque comportamento padrao dos navegadores causa inconsistencias entre elementos
2. **Aplique fontes em todos os elementos de input** — `body, input, button, textarea, select` recebem a mesma font-family, porque elementos de formulario nao herdam fonte do body por padrao
3. **Use fallback generico na font-family** — `font-family: 'Roboto', sans-serif`, porque a fonte pode nao carregar e o fallback garante legibilidade
4. **Verifique contraste ao definir background escuro** — background `#121214` exige texto claro com ratio minimo 4.5:1 (WCAG AA), porque texto preto sobre fundo escuro e inacessivel
5. **Use border-box globalmente** — padding e border nao alteram o tamanho final do elemento, porque `content-box` causa calculos inesperados de layout

## How to write

### Reset global completo

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, input, button, textarea, select {
  font-family: 'Roboto', sans-serif;
}

body {
  background-color: #121214;
  color: #e1e1e6; /* contraste adequado contra fundo escuro */
}
```

## Example

**Before (problema de contraste):**
```css
body {
  background-color: #121214;
  /* sem definir cor do texto — herda preto, contraste ~1.4:1 */
}
```

**After (com contraste acessivel):**
```css
body {
  background-color: #121214;
  color: #e1e1e6; /* ratio ~11:1, WCAG AAA */
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Background escuro definido | Definir `color` claro imediatamente no mesmo seletor |
| Inspecionar elemento mostra aviso de contraste | Ajustar cor do texto ate ratio >= 4.5:1 |
| Fonte customizada (Google Fonts) | Sempre incluir fallback generico (`sans-serif`, `serif`) |
| Elementos de formulario com fonte diferente | Incluir `input, button, textarea, select` na regra de font-family |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `background-color: #121214` sem `color` | `background-color: #121214; color: #e1e1e6;` |
| `body { font-family: 'Roboto' }` (so body) | `body, input, button, textarea, select { font-family: 'Roboto', sans-serif }` |
| `box-sizing` apenas no body | `* { box-sizing: border-box }` global |
| Font-family sem fallback | `font-family: 'Roboto', sans-serif` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
