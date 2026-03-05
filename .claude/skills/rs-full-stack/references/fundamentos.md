---
name: rs-full-stack-fundamentos-css-texto
description: "Enforces CSS font and text layout best practices when styling typography in HTML/CSS. Use when user asks to 'style text', 'change font', 'align text', 'set line-height', 'adjust letter-spacing', or any CSS typography task. Applies separation between font properties (family, size, weight, style) and text layout properties (line-height, letter-spacing, text-align). Make sure to use this skill whenever writing CSS that involves text or font styling. Not for CSS layout (flexbox, grid), colors, or animations."
---

# Fundamentos de CSS: Fontes e Textos

> Separar mentalmente estilizacao de **fonte** (aparencia dos caracteres) de estilizacao de **layout do texto** (como o texto se distribui no espaco).

## Rules

1. **Separe font props de text layout props** — `font-family`, `font-size`, `font-weight`, `font-style` controlam a fonte; `line-height`, `letter-spacing`, `text-align` controlam o layout do texto, porque sao dois grupos conceituais distintos
2. **Texto so e estilizavel dentro de uma tag** — para estilizar parte de um texto, envolva essa parte em uma tag (`<span>`, `<strong>`, `<em>`), porque CSS se aplica a elementos, nao a trechos soltos
3. **Respeite a direcao do texto** — use `direction` e `writing-mode` quando necessario, porque nem todas as linguas fluem da esquerda para a direita (ex: arabe, hebraico)
4. **Use unidades relativas para font-size** — prefira `rem` ou `em` sobre `px`, porque permite escalonamento acessivel

## How to write

### Propriedades de fonte

```css
.heading {
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  font-style: italic;
}
```

### Propriedades de layout do texto

```css
.paragraph {
  line-height: 1.6;
  letter-spacing: 0.02em;
  text-align: justify;
}
```

### Estilizar parte do texto

```html
<p>Este texto tem uma <span class="highlight">parte destacada</span> no meio.</p>
```

```css
.highlight {
  font-weight: bold;
  font-style: italic;
}
```

## Example

**Before (propriedades misturadas sem organizacao):**

```css
.text {
  text-align: center;
  font-family: Arial;
  letter-spacing: 2px;
  font-size: 16px;
  line-height: 20px;
  font-weight: bold;
}
```

**After (com esta skill aplicada):**

```css
.text {
  /* Font properties */
  font-family: 'Arial', sans-serif;
  font-size: 1rem;
  font-weight: bold;

  /* Text layout properties */
  line-height: 1.25;
  letter-spacing: 0.125em;
  text-align: center;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa mudar aparencia de caracteres | Use propriedades `font-*` |
| Precisa mudar distribuicao/espacamento do texto | Use `line-height`, `letter-spacing`, `text-align` |
| Precisa estilizar apenas uma palavra no paragrafo | Envolva em `<span>` e aplique CSS no span |
| Texto para idioma RTL (arabe, hebraico) | Use `direction: rtl` ou `dir="rtl"` no HTML |
| Definindo tamanho de fonte | Use `rem` como unidade padrao |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `font-size: 16px` (fixo) | `font-size: 1rem` (relativo) |
| Tentar estilizar texto sem tag envolvente | Envolver parte do texto em `<span>` |
| `line-height: 20px` (valor absoluto) | `line-height: 1.6` (valor sem unidade, relativo ao font-size) |
| Misturar font props e text layout props sem separacao | Agrupar e comentar por categoria |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a separacao fonte vs layout e direcionalidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-fundamentos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-fundamentos/references/code-examples.md)
