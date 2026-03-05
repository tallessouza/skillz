---
name: rs-full-stack-font-family-1
description: "Applies CSS font-family conventions when writing stylesheets or component styles. Use when user asks to 'style text', 'change font', 'add typography', 'set font-family', or any CSS text styling task. Enforces fallback chain order: specific font, family alternative, generic category. Make sure to use this skill whenever generating CSS that involves typography, even if the user doesn't mention fonts. Not for importing external/custom fonts (Google Fonts, @font-face) or JavaScript font loading."
---

# Font Family em CSS

> Sempre declare font-family com uma cadeia de fallback: fonte desejada, alternativas da mesma familia, e generico no final.

## Rules

1. **Sempre termine com um generico** — `sans-serif`, `serif`, `monospace`, `fantasy`, `cursive`, porque o browser precisa de um ultimo recurso garantido
2. **Separe fontes com virgula** — cada virgula e um fallback, o browser tenta a primeira, se nao encontrar pula pra proxima
3. **Nomes com espaco vao entre aspas** — `"Lucida Sans"` nao `Lucida Sans`, porque sem aspas o browser nao reconhece o nome composto
4. **Use fontes web-safe como fallback** — fontes disponiveis na maioria dos computadores (Arial, Helvetica, Georgia, Times) antes do generico, porque garante consistencia visual
5. **Conheca a diferenca serif vs sans-serif** — serif tem tracinhos nas extremidades (Times), sans-serif e lisa (Arial/Helvetica), porque isso define a personalidade visual do texto

## How to write

### Cadeia de fallback correta

```css
/* Fonte desejada → alternativa web-safe → generico */
body {
  font-family: "Lucida Sans", Helvetica, sans-serif;
}

h1 {
  font-family: Georgia, "Times New Roman", Times, serif;
}

code {
  font-family: "Courier New", Courier, monospace;
}
```

### Generico sozinho (reset basico)

```css
/* Quando nao precisa de fonte especifica */
body {
  font-family: sans-serif;
}
```

## Example

**Before (sem fallback):**
```css
body {
  font-family: Helvetica;
}
```

**After (com cadeia de fallback):**
```css
body {
  font-family: Helvetica, Arial, sans-serif;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Texto corrido / paragrafos | `sans-serif` como generico (mais legivel em tela) |
| Titulos com personalidade classica | `serif` como generico |
| Blocos de codigo | `monospace` como generico |
| Projeto sem design system definido | Use web-safe fonts com fallback generico |
| Nome da fonte tem espaco | Sempre entre aspas duplas |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `font-family: Lucida Sans;` | `font-family: "Lucida Sans", sans-serif;` |
| `font-family: MyFont;` (sem fallback) | `font-family: MyFont, Arial, sans-serif;` |
| `font-size: sans-serif;` (propriedade errada) | `font-family: sans-serif;` |
| `font-family: serif sans-serif;` (sem virgula) | `font-family: serif;` ou `font-family: Georgia, sans-serif;` |

## Categorias genericas disponiveis

| Generico | Caracteristica | Exemplo visual |
|----------|---------------|----------------|
| `serif` | Tracinhos nas extremidades | Times New Roman |
| `sans-serif` | Lisa, sem tracinhos | Arial, Helvetica |
| `monospace` | Largura fixa por caractere | Courier |
| `fantasy` | Decorativa | — |
| `cursive` | Manuscrita | — |

## Como inspecionar a fonte atual

1. Abrir DevTools (F12)
2. Clicar no elemento de texto
3. Aba **Computed** → buscar `font-family`
4. Mostra qual fonte esta efetivamente renderizada

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre fallback, web-safe fonts e genericos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-font-family-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-font-family-1/references/code-examples.md)
