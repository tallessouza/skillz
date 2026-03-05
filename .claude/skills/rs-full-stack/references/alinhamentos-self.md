---
name: rs-full-stack-alinhamentos-self
description: "Applies CSS Grid self-alignment properties (align-self, justify-self, place-self) when positioning individual grid items. Use when user asks to 'align a single item', 'position one element in grid', 'center a specific child', or 'move just this element'. Ensures correct axis mapping and place-self shorthand usage. Make sure to use this skill whenever aligning individual grid items differently from siblings. Not for container-level alignment (align-content/items), Flexbox, or non-grid layouts."
---

# Alinhamentos Self no CSS Grid

> Use align-self, justify-self e place-self para posicionar um item individual dentro da sua celula grid, independente dos demais.

## Rules

1. **align-self controla o eixo Y (bloco)** — posiciona o item verticalmente dentro da celula, porque align sempre opera no eixo de bloco
2. **justify-self controla o eixo X (inline)** — posiciona o item horizontalmente dentro da celula, porque justify sempre opera no eixo inline
3. **place-self e o shorthand** — `place-self: <align-self> <justify-self>`, porque segue o padrao CSS de bloco primeiro, inline depois
4. **Self se aplica no ITEM, nao no container** — a propriedade vai no elemento filho, porque "self" significa "ele mesmo", o proprio item
5. **Diferencie content vs items vs self** — content move todo o conteudo do grid, items configura o padrao para todos os filhos, self sobrescreve para um item especifico

## How to write

### Posicionar um item individual

```css
/* Item centralizado na celula */
.grid-item:nth-child(2) {
  align-self: center;    /* centro vertical */
  justify-self: center;  /* centro horizontal */
}

/* Shorthand equivalente */
.grid-item:nth-child(2) {
  place-self: center center;
}
```

### Combinacoes comuns

```css
/* Canto inferior esquerdo */
.item { align-self: end; justify-self: start; }

/* Canto inferior centro */
.item { align-self: end; justify-self: center; }

/* Centro direita */
.item { align-self: center; justify-self: end; }
```

## Example

**Before (tentando alinhar item via container):**
```css
.grid-container {
  align-items: center; /* afeta TODOS os items */
}
```

**After (alinhamento individual com self):**
```css
.grid-item:nth-child(2) {
  place-self: end center; /* so este item: bottom-center */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Todos os items com mesmo alinhamento | Use align-items/justify-items no container |
| Um item diferente dos demais | Use align-self/justify-self no item |
| Ambos os eixos no mesmo item | Use place-self como shorthand |
| Precisa posicionar em canto especifico | Combine align-self + justify-self com start/center/end |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Colocar align-self no container | Colocar align-self no item filho |
| Mudar align-items so por causa de 1 item | Usar align-self naquele item especifico |
| `place-self: center` sem saber os eixos | Pensar: primeiro valor = Y, segundo = X |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre content vs items vs self e modelo mental dos eixos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de posicionamento com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-alinhamentos-self/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-alinhamentos-self/references/code-examples.md)
