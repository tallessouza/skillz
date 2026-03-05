---
name: rs-discover-estilizando-o-track
description: "Applies CSS track styling patterns when building toggle switches or slider tracks with fixed dimensions. Use when user asks to 'style a track', 'create a toggle', 'build a switch component', or 'style a slider track'. Enforces display block for span elements, CSS variables for design tokens, webkit prefixes for backdrop-filter, and high border-radius for pill shapes. Make sure to use this skill whenever styling track-like UI elements. Not for JavaScript toggle logic, animations, or accessibility attributes."
---

# Estilizando o Track (CSS)

> Ao estilizar um track, use dimensoes fixas, variaveis CSS para cores do design system, e display block em spans para aceitar width/height.

## Rules

1. **Use variaveis CSS para cores** — `var(--surface-color)` nao valores hardcoded, porque segue o design token e facilita dark mode
2. **Span precisa de display block** — span e inline por padrao e ignora width/height silenciosamente, quebrando o layout sem erro visivel
3. **Prefixe backdrop-filter com -webkit-** — `backdrop-filter` sozinho nao funciona em todos os navegadores, sempre adicione `-webkit-backdrop-filter`
4. **Use border-radius alto para pill shape** — `border-radius: 9999px` cria formato arredondado independente das dimensoes do elemento
5. **Copie propriedades do design e substitua por variaveis** — ao extrair do Figma, troque valores brutos por `var(--token-name)` imediatamente

## How to write

### Track com dimensoes fixas e variaveis

```css
.switch span {
  display: block; /* span e inline por padrao — sem isso, width/height sao ignorados */
  width: 52px;
  height: 32px;
  background-color: var(--surface-color);
  border: 1px solid var(--stroke-color);
  border-radius: 9999px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px); /* compatibilidade webkit */
}
```

## Example

**Before (erro silencioso — span inline):**
```css
.switch span {
  width: 52px;
  height: 32px;
  background-color: #1a1a2e;
  border: 1px solid #333;
  border-radius: 9999px;
}
/* width e height sao IGNORADOS — span e inline */
```

**After (com esta skill aplicada):**
```css
.switch span {
  display: block;
  width: 52px;
  height: 32px;
  background-color: var(--surface-color);
  border: 1px solid var(--stroke-color);
  border-radius: 9999px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Elemento span/a/em com width/height | Adicione `display: block` ou `display: inline-block` |
| Cor vinda do Figma com valor hex | Substitua por `var(--token-name)` do design system |
| Usando `backdrop-filter` | Sempre duplique com `-webkit-backdrop-filter` |
| Precisa de formato pill/capsula | `border-radius: 9999px` — funciona em qualquer dimensao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `background: #1a1a2e` (hardcoded) | `background-color: var(--surface-color)` |
| span com width sem display block | `display: block` antes do width |
| `backdrop-filter` sem prefixo | Adicione `-webkit-backdrop-filter` junto |
| `border-radius: 50%` para pill | `border-radius: 9999px` (50% cria circulo, nao pill) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre display inline vs block e variaveis CSS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes