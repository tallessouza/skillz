---
name: rs-full-stack-introducao-aos-alinhamentos
description: "Applies CSS Grid alignment property selection when writing grid layouts. Use when user asks to 'align grid items', 'center with grid', 'layout with CSS Grid', 'justify grid content', or any grid alignment task. Enforces the 3x3 mental model: align/justify/place x content/items/self. Make sure to use this skill whenever generating CSS Grid code that involves positioning elements. Not for Flexbox alignment, non-grid layouts, or general CSS spacing."
---

# Alinhamento no CSS Grid

> Domine as 9 propriedades de alinhamento do Grid atraves do modelo mental 3x3: eixo (align/justify/place) x alvo (content/items/self).

## Rules

1. **Use o modelo 3x3 para escolher a propriedade** — cruze o eixo (align/justify/place) com o alvo (content/items/self), porque decorar 9 nomes isolados e fragil mas entender a matriz e permanente
2. **Distinga content de items** — content move o grid inteiro dentro do container, items move os elementos dentro de suas celulas, porque confundir os dois causa alinhamento inesperado
3. **Aplique content e items no container (pai)** — 6 propriedades vao no elemento grid container, porque e ele que controla a distribuicao
4. **Aplique self no item (filho)** — as 3 propriedades self sobrescrevem o alinhamento individual do item, porque permite excecoes sem alterar o layout geral
5. **Use place- como shorthand** — `place-content`, `place-items`, `place-self` combinam align + justify, porque reduz duplicacao

## How to write

### Modelo mental 3x3

```
              | content (grid inteiro) | items (cada celula) | self (item unico)
--------------|-----------------------|--------------------|-----------------
align (bloco) | align-content         | align-items        | align-self
justify (inl) | justify-content       | justify-items      | justify-self
place (ambos) | place-content         | place-items        | place-self
```

### Container (pai) — 6 propriedades

```css
.grid-container {
  display: grid;

  /* Move o grid inteiro dentro do espaco disponivel */
  align-content: center;    /* eixo bloco (vertical) */
  justify-content: center;  /* eixo inline (horizontal) */

  /* Move cada item dentro da sua celula */
  align-items: stretch;     /* eixo bloco */
  justify-items: start;     /* eixo inline */
}
```

### Item (filho) — 3 propriedades

```css
.grid-item-especial {
  /* Sobrescreve o alinhamento so para este item */
  align-self: end;
  justify-self: center;
}
```

### Shorthands place-*

```css
.grid-container {
  /* place-content: align-content / justify-content */
  place-content: center / space-between;

  /* place-items: align-items / justify-items */
  place-items: center;  /* mesmo valor para ambos */
}

.grid-item {
  place-self: center / end;
}
```

## Example

**Before (propriedades confusas):**
```css
.container {
  display: grid;
  /* Quer centralizar tudo mas usa a propriedade errada */
  align-items: center;      /* so move dentro da celula */
  justify-items: center;    /* so move dentro da celula */
}
```

**After (modelo 3x3 aplicado):**
```css
.container {
  display: grid;
  /* Centralizar o grid no espaco disponivel = content */
  place-content: center;
  /* Centralizar itens dentro de suas celulas = items */
  place-items: center;
}
```

## Heuristics

| Situacao | Propriedade |
|----------|-------------|
| Centralizar o grid inteiro no viewport | `place-content: center` no container |
| Centralizar todos os itens nas celulas | `place-items: center` no container |
| Um item precisa de alinhamento diferente | `place-self` no item especifico |
| Distribuir espaco entre tracks do grid | `justify-content: space-between` |
| Grid nao ocupa todo o espaco e precisa posicionar | `align-content` / `justify-content` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Confundir `align-items` com `align-content` | content = grid inteiro, items = dentro da celula |
| Usar `justify-content` esperando mover itens na celula | Use `justify-items` para itens dentro das celulas |
| Colocar `align-self` no container | `self` so funciona no item filho |
| Colocar `align-content` no item | `content` so funciona no container pai |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes