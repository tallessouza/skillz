---
name: rs-discover-cascata-especificidade
description: "Applies CSS cascade and specificity rules when writing or debugging stylesheets. Use when user asks to 'style a component', 'fix CSS not applying', 'debug CSS specificity', 'write CSS selectors', or 'override styles'. Enforces correct selector weight understanding (element=001, class=010, id=100) and cascade order. Make sure to use this skill whenever generating or reviewing CSS code with competing selectors. Not for JavaScript logic, HTML structure, or CSS layout/positioning."
---

# Cascata e Especificidade CSS

> Quando dois seletores competem, especificidade vence; quando especificidade empata, o ultimo na cascata vence.

## Rules

1. **Cascata: ultimo vence** — entre declaracoes de mesmo peso, o navegador aplica a ultima, porque CSS e lido de cima para baixo
2. **Especificidade supera cascata** — um seletor mais especifico vence mesmo aparecendo antes no codigo, porque peso > ordem
3. **Pesos dos seletores** — elemento=`0,0,1`, classe=`0,1,0`, id=`1,0,0`, porque cada nivel e 10x mais forte que o anterior
4. **Pesos somam** — `p.qualquer` = `0,1,1`, `#unico-1` = `1,0,0`, porque o navegador soma todos os componentes do seletor
5. **Nomes validos** — seletores nao podem comecar com numero nem caractere especial (exceto `_`), porque o CSS parser rejeita silenciosamente

## How to write

### Seletores por peso crescente

```css
/* Elemento: 0,0,1 */
p { color: red; }

/* Classe: 0,1,0 — vence elemento */
.destaque { color: green; }

/* ID: 1,0,0 — vence classe e elemento */
#principal { color: blue; }
```

### Cascata em acao (mesmo peso)

```css
body { background: red; }
body { background: blue; } /* Este vence — ultimo na cascata */
```

## Example

**Before (bug — cor nao aplica):**
```css
#header { color: blue; }
p { color: red; }        /* Dev espera vermelho no #header, mas fica azul */
```

**After (entendendo especificidade):**
```css
/* ID (1,0,0) sempre vence elemento (0,0,1) independente da ordem */
#header { color: blue; } /* Este vence */
p { color: red; }        /* So aplica em <p> sem o id #header */
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estilo nao aplica | Verifique se outro seletor mais especifico compete |
| Dois seletores mesmo peso | O ultimo no arquivo vence |
| Precisa sobrescrever ID | Use outro ID ou refatore para classe (preferivel) |
| Nome de classe/id | Nunca comece com numero; `_` e `-` sao permitidos |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Usar `!important` para forcar | Aumentar especificidade com seletor mais preciso |
| Comecar nome com numero: `1unico` | Usar letra ou underscore: `unico1`, `_unico` |
| Repetir declaracoes achando que "reforça" | A ultima vence, as anteriores sao ignoradas |
| Depender da ordem quando pesos diferem | Confiar no peso do seletor, nao na posicao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cascata vs especificidade, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes