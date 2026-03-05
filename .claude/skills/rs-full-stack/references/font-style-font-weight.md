---
name: rs-full-stack-font-style-font-weight
description: "Applies correct CSS font-style and font-weight properties when styling text. Use when user asks to 'style text', 'make text bold', 'add italic', 'change font weight', 'customize typography', or any CSS text styling task. Enforces numeric weight values, font-dependent awareness, and proper use of italic vs oblique. Make sure to use this skill whenever generating CSS that involves text appearance or typography. Not for font-family selection, font-size, or text-decoration."
---

# Font Style e Font Weight

> Ao estilizar texto com CSS, use font-style para italico e font-weight com valores numericos conscientes das limitacoes da fonte.

## Rules

1. **Use font-style apenas para italico ou normal** — `italic` e `normal` sao os unicos valores praticos, porque `oblique` com angulacao depende de suporte da fonte e raramente se aplica
2. **Prefira valores numericos para font-weight** — `font-weight: 600` em vez de `font-weight: bold`, porque numeros dao controle granular e explicitam a intencao
3. **Respeite os pesos disponiveis na fonte** — nem toda fonte suporta todos os pesos (100-900), porque aplicar um peso inexistente faz o browser arredondar silenciosamente
4. **Use font-weight normal para remover bold de elementos que ja vem bold** — `h1 { font-weight: normal }` remove o bold padrao, porque headings tem bold por default do user-agent stylesheet
5. **Nunca aplique propriedades redundantes** — nao adicione `font-style: normal` em texto que ja e normal, porque e codigo sem efeito

## How to write

### Remover bold de heading

```css
/* Headings vem com bold por padrao — remova explicitamente quando necessario */
h1 {
  font-weight: 400; /* 400 = normal */
}
```

### Aplicar pesos com valores numericos

```css
.subtitle {
  font-weight: 300; /* light — se a fonte suportar */
}

.emphasis {
  font-weight: 600; /* semi-bold */
}

.strong-emphasis {
  font-weight: 900; /* extra-bold — se a fonte suportar */
}
```

### Italico simples

```css
.citation {
  font-style: italic;
}
```

## Example

**Before (impreciso):**
```css
h1 {
  font-weight: bold;
}
.light-text {
  font-weight: lighter;
}
.tilted {
  font-style: oblique 40deg;
}
```

**After (com esta skill aplicada):**
```css
h1 {
  font-weight: 700;
}
.light-text {
  font-weight: 300; /* verificar se a fonte suporta */
}
.citation {
  font-style: italic;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de italico | `font-style: italic` — unico valor pratico alem de `normal` |
| Precisa remover bold de heading | `font-weight: 400` |
| Precisa de bold | `font-weight: 700` (equivale a `bold`) |
| Precisa de variacao fina de peso | Use valores numericos (100-900) e verifique a fonte |
| Fonte so tem normal e bold | Use apenas `400` ou `700`, valores intermediarios serao arredondados |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `font-style: oblique 40deg` | `font-style: italic` |
| `font-weight: bolder` sem checar fonte | `font-weight: 800` com fonte que suporte |
| `font-style: normal` em texto ja normal | Remova a declaracao |
| `font-weight: lighter` sem contexto | `font-weight: 300` com valor explicito |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-font-style-font-weight/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-font-style-font-weight/references/code-examples.md)
