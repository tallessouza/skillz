---
name: rs-full-stack-nome-cores-hexadecimal
description: "Applies CSS color value conventions when writing stylesheets or UI code. Use when user asks to 'style a component', 'change colors', 'set background', 'add transparency', or any CSS color task. Enforces correct hex notation (3, 4, 6, 8 digits), named colors usage, and alpha channel patterns. Make sure to use this skill whenever generating CSS color values. Not for JavaScript color manipulation libraries or design token architecture."
---

# Cores CSS: Named Colors e RGB Hexadecimal

> Ao definir cores em CSS, use a notacao correta entre named colors e hexadecimal conforme o contexto, e nunca confunda os formatos de digitos.

## Rules

1. **Use named colors apenas para cores obvias** — `red`, `white`, `black`, porque named colors como `aliceblue` sao dificeis de lembrar e imprecisas para design systems
2. **Prefira hex de 6 digitos para cores exatas** — `#FD059A` nao `#F09`, porque 6 digitos dao controle granular (16 milhoes de cores vs 4096)
3. **Use hex de 3 digitos apenas quando os pares repetem** — `#F09` equivale a `#FF0099`, porque 3 digitos sao atalho onde cada digito duplica
4. **Adicione transparencia com 4 ou 8 digitos** — `#F098` ou `#FF009988`, porque o ultimo canal e o alfa (0 = totalmente transparente, F = totalmente opaco)
5. **Lembre que 0 = ausencia e F = maximo da cor** — hex vai de 0-9 e A-F (16 valores por digito), porque e base 16, nao base 10

## How to write

### Named colors (casos simples)
```css
color: red;
background-color: white;
border-color: black;
```

### Hex 6 digitos (controle granular)
```css
/* RR GG BB — cada par de 00 a FF */
color: #FD059A;
background-color: #1A1A2E;
```

### Hex 3 digitos (atalho quando pares repetem)
```css
/* R G B — cada digito duplica: F=FF, 0=00, 9=99 */
color: #F09; /* equivale a #FF0099 */
```

### Hex com transparencia
```css
/* 4 digitos: R G B A */
color: #F098; /* equivale a #FF009988 */

/* 8 digitos: RR GG BB AA */
color: #FD059A80; /* 50% de opacidade */
```

## Example

**Before (inconsistente):**
```css
.card {
  color: aliceblue;
  background: #F09;
  border-color: #FD059A;
  opacity: 0.5;
}
```

**After (com esta skill aplicada):**
```css
.card {
  color: #F0F8FF; /* hex exato em vez de named color obscura */
  background-color: #FF0099; /* 6 digitos para clareza */
  border-color: #FD059A;
  border-color: #FD059A80; /* transparencia no proprio hex, sem opacity separado */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Cor de prototipo rapido | Named color (`red`, `blue`) |
| Cor vinda do design/Figma | Hex 6 digitos exato |
| Cor com transparencia | Hex 8 digitos ou 4 digitos |
| Preto e branco | `#000` e `#FFF` (3 digitos OK) |
| Cor em design token/variavel | Hex 6 digitos, transparencia via separado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `color: aliceblue` em producao | `color: #F0F8FF` |
| `#F09` quando a cor exata importa | `#FF0099` (6 digitos) |
| `opacity: 0.5` para cor unica | `#FD059A80` (alfa no hex) |
| Memorizar named colors | Usar o color picker do editor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre sistema hexadecimal, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes