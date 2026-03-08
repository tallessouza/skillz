---
name: rs-full-stack-letter-spacing-word-spacing
description: "Applies CSS letter-spacing and word-spacing properties when styling text. Use when user asks to 'style text', 'adjust spacing', 'improve typography', 'add letter spacing', or 'change word spacing'. Enforces subtle units, accessibility considerations, and design-driven usage. Make sure to use this skill whenever generating CSS that involves text spacing adjustments. Not for font-size, line-height, or text-align properties."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-styling
  tags: [css, typography, letter-spacing, word-spacing, text-styling]
---

# Letter Spacing e Word Spacing

> Aplique letter-spacing e word-spacing com unidades sutis e apenas quando o design especificar, porque valores agressivos prejudicam legibilidade e acessibilidade.

## Rules

1. **Use unidades sutis** — prefira `em` com valores pequenos (ex: `0.05em`) em vez de pixels grandes, porque unidades relativas escalam com o font-size e evitam espaçamentos agressivos
2. **Nunca aplique sem referência de design** — letter-spacing e word-spacing afetam legibilidade e acessibilidade, só aplique quando o design especificar valores exatos
3. **letter-spacing = espaço entre letras** — propriedade `letter-spacing` controla o espaçamento entre cada caractere individual
4. **word-spacing = espaço entre palavras** — propriedade `word-spacing` controla o espaçamento entre palavras (espaços em branco)
5. **Aceita valores negativos** — ambas propriedades aceitam negativos para aproximar, mas use com extremo cuidado porque pode tornar texto ilegível

## How to write

### Letter Spacing sutil
```css
/* Espaçamento leve para headings — valor pequeno em em */
.heading {
  letter-spacing: 0.05em;
}

/* Para texto uppercase, um leve letter-spacing melhora legibilidade */
.uppercase-label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

### Word Spacing
```css
/* Ajuste sutil entre palavras */
.spaced-text {
  word-spacing: 0.15em;
}
```

## Example

**Before (valores agressivos, sem critério):**
```css
.text {
  letter-spacing: 1rem;
  word-spacing: 40px;
}
```

**After (com esta skill aplicada):**
```css
.text {
  letter-spacing: 0.05em;
  word-spacing: 0.1em;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Heading uppercase | `letter-spacing: 0.05em` a `0.1em` para melhorar legibilidade |
| Body text | Não altere — o padrão do navegador já é otimizado |
| Design especifica spacing | Aplique o valor exato do design |
| Sem referência de design | Não aplique nenhum spacing customizado |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `letter-spacing: 1rem` | `letter-spacing: 0.05em` |
| `word-spacing: 40px` | `word-spacing: 0.15em` |
| Spacing arbitrário sem design | Só aplique com referência de design |
| `letter-spacing: 10px` em body text | Mantenha o padrão do navegador |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Letter-spacing nao aparece visualmente | Valor muito pequeno ou font ja tem spacing natural | Aumente para `0.1em` e compare lado a lado |
| Texto fica ilegivel com spacing aplicado | Valor muito alto ou negativo | Use valores entre `0.02em` e `0.15em` |
| Word-spacing nao funciona em elemento inline | Elemento nao tem espacos entre palavras | Verifique se o conteudo tem multiplas palavras |
| Spacing inconsistente entre breakpoints | Usando `px` que nao escala | Troque para `em` que escala com font-size |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre acessibilidade e impacto na leitura
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações