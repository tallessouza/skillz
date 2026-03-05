---
name: rs-full-stack-text-align-line-height
description: "Applies CSS text-align and line-height best practices when styling text elements. Use when user asks to 'style text', 'align text', 'fix line spacing', 'adjust line-height', or 'format paragraph'. Enforces unitless multiplier for line-height instead of fixed pixels, and correct text-align values. Make sure to use this skill whenever writing CSS that involves text layout or typography. Not for font-family, font-weight, or color styling."
---

# Text Align e Line Height

> Ao estilizar texto, use `text-align` para alinhamento horizontal e `line-height` com multiplicador sem unidade para espaçamento entre linhas.

## Rules

1. **Use multiplicador sem unidade no line-height** — `line-height: 1.5` nao `line-height: 24px`, porque o multiplicador se adapta automaticamente quando o font-size muda
2. **Conheca os 4 valores de text-align** — `left` (padrao), `center`, `right`, `justify`, porque cobrem todos os casos de alinhamento horizontal
3. **Evite justify em textos curtos** — justify forca espacamento irregular entre palavras em blocos pequenos, porque cria lacunas visiveis que prejudicam a leitura
4. **Converta pixels de design para multiplicador** — se o designer pede `line-height: 24px` e o `font-size` e `16px`, use `line-height: 1.5` (24/16), porque mantem proporcionalidade ao mudar a fonte

## How to write

### Text align

```css
/* Alinhamento central — mais comum para titulos */
.title {
  text-align: center;
}

/* Alinhamento a direita — numeros, datas */
.price {
  text-align: right;
}

/* Justificado — paragrafos longos */
.article-body {
  text-align: justify;
}
```

### Line height com multiplicador

```css
/* Multiplicador: se adapta ao font-size automaticamente */
.paragraph {
  font-size: 16px;
  line-height: 1.5; /* = 24px, mas flexivel */
}

/* Se mudar o font-size, o espacamento acompanha */
.paragraph-large {
  font-size: 24px;
  line-height: 1.5; /* = 36px automaticamente */
}
```

## Example

**Before (line-height fixa em pixels):**
```css
.text {
  font-size: 16px;
  line-height: 24px;
}

/* Ao mudar font-size, line-height fica desproporcional */
.text-large {
  font-size: 24px;
  line-height: 24px; /* apertado demais! precisa recalcular */
}
```

**After (multiplicador sem unidade):**
```css
.text {
  font-size: 16px;
  line-height: 1.5;
}

/* Ao mudar font-size, line-height se adapta */
.text-large {
  font-size: 24px;
  line-height: 1.5; /* = 36px, proporcional automaticamente */
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Designer especifica line-height em pixels | Divida pelo font-size para obter o multiplicador |
| Texto de paragrafo longo | `line-height: 1.5` a `1.8` para boa legibilidade |
| Titulo de uma linha | `line-height: 1.2` e suficiente |
| Recebendo layout do Figma | Confira font-size e line-height, converta para multiplicador |
| Texto curto (botao, label) | Evite `text-align: justify` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `line-height: 24px` | `line-height: 1.5` |
| `line-height: 2rem` | `line-height: 2` |
| `line-height: 1em` | `line-height: 1` |
| `text-align: justify` em card pequeno | `text-align: left` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre multiplicadores e heranca de line-height
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-text-align-line-height/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-text-align-line-height/references/code-examples.md)
