---
name: rs-full-stack-especificidade-1
description: "Enforces CSS specificity awareness when writing or debugging stylesheets. Use when user asks to 'style a component', 'fix CSS not applying', 'debug styles', 'write CSS selectors', or 'why is my style not working'. Applies specificity weight system: element=001, class=010, ID=100, combined selectors sum weights. Make sure to use this skill whenever writing CSS selectors or debugging style conflicts. Not for JavaScript logic, HTML structure, or CSS animations."
---

# Especificidade CSS

> Ao escrever seletores CSS, considere o peso de cada seletor — a soma dos pesos determina qual declaracao vence, nao a ordem no arquivo.

## Rules

1. **Seletor de elemento pesa 001** — `p`, `div`, `h1` pesam 1, porque sao os menos especificos e qualquer classe ou ID os sobrepoe
2. **Seletor de classe pesa 010** — `.green`, `.header` pesam 10, porque identificam um grupo mais especifico que tags genericas
3. **Seletor de ID pesa 100** — `#text`, `#main` pesam 100, porque IDs sao unicos no documento e tem prioridade maxima entre seletores
4. **Seletores combinados somam pesos** — `p#text.green` = 001 + 100 + 010 = 111, porque o navegador soma todos os pesos do seletor composto
5. **Cascata so decide entre pesos iguais** — quando dois seletores tem o mesmo peso, o ultimo no arquivo vence; quando tem pesos diferentes, o mais pesado sempre vence
6. **Ao debugar, verifique especificidade primeiro** — se um estilo nao aplica, provavelmente existe outro seletor com peso maior, nao um bug no CSS

## How to write

### Seletores com peso crescente

```css
/* Peso 001 — seletor de elemento */
p { color: red; }

/* Peso 010 — seletor de classe (vence o elemento) */
.green { color: green; }

/* Peso 100 — seletor de ID (vence classe e elemento) */
#text { color: blue; }
```

### Seletores combinados

```css
/* Peso 111 — ID(100) + classe(010) + elemento(001) */
p#text.green { color: black; }
```

## Example

**Before (confuso — por que o red nao aplica?):**

```css
p { color: red; }
.highlight { color: green; }
#title { color: blue; }
```

```html
<p class="highlight" id="title">Texto</p>
<!-- Resultado: blue (ID peso 100 vence classe peso 010 e elemento peso 001) -->
```

**After (com entendimento de especificidade):**

```css
/* Sei que ID vence, entao uso classe para manter flexibilidade */
.highlight { color: green; }

/* Ou se preciso sobrepor, combino seletores conscientemente */
p.highlight { color: red; } /* peso 011 — vence .highlight sozinho (010) */
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estilo nao esta aplicando | Verifique se outro seletor com peso maior existe |
| CSS grande e confuso | Passe o mouse no seletor no editor para ver a especificidade |
| Precisa sobrepor um ID | Combine seletores ou refatore para usar classes |
| Dois estilos conflitam | Compare os pesos: 001 vs 010 vs 100 |
| Mesmo peso, ordem importa | O ultimo seletor no arquivo vence (cascata) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Usar `!important` para forcar estilo | Aumentar especificidade do seletor combinando seletores |
| Usar IDs em todo lugar para "garantir" | Usar classes e combinar quando precisar mais peso |
| Ignorar especificidade e culpar "bug do CSS" | Inspecionar peso dos seletores no editor ou DevTools |
| Duplicar estilos para "sobrepor" | Ajustar o seletor para ter o peso correto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cascata vs especificidade, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-especificidade-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-especificidade-1/references/code-examples.md)
