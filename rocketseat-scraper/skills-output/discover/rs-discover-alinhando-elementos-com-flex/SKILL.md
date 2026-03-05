---
name: rs-discover-alinhando-elementos-com-flex
description: "Applies CSS Flexbox alignment patterns when writing HTML/CSS code. Use when user asks to 'center an element', 'align items', 'use flexbox', 'layout with flex', or any CSS positioning task. Enforces correct use of display:flex, justify-content, align-items, and avoids redundant flex properties. Make sure to use this skill whenever generating CSS layout code involving centering or alignment. Not for grid layout, animations, or responsive breakpoints."
---

# Alinhando Elementos com Flexbox

> Ao usar flexbox, aplique apenas as propriedades que produzem efeito visivel no contexto atual — propriedades sem efeito sao ruido.

## Rules

1. **`display: flex` muda o comportamento do elemento** — faz o elemento ocupar todo o espaco disponivel, porque transforma o contexto de layout
2. **Nao declare `flex-direction: row`** — ja e o padrao, porque declarar o padrao e redundancia sem efeito
3. **`gap` so funciona com multiplos filhos** — se ha apenas um conteudo filho, gap nao produz efeito visivel, porque gap define espaco *entre* itens
4. **`justify-content` alinha no eixo principal (main axis)** — a linha virtual horizontal que corta o container ao meio
5. **`align-items` alinha no eixo cruzado (cross axis)** — a linha virtual vertical, so visivel quando o container tem altura explicita ou padding
6. **Nao existe um unico jeito certo** — o jeito certo e o que resolve o problema; `text-align: center` em `display: block` tambem centraliza texto

## How to write

### Centralizacao completa com flex

```css
.container {
  display: flex;
  justify-content: center; /* centraliza no eixo horizontal */
  align-items: center;     /* centraliza no eixo vertical */
  padding: 16px 24px;      /* da altura ao container para align-items funcionar */
}
```

### Link centralizado com flex

```css
a {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
}
```

## Example

**Before (propriedades redundantes sem efeito):**

```css
a {
  display: flex;
  flex-direction: row;     /* redundante — ja e padrao */
  gap: 8px;                /* sem efeito — so tem 1 filho */
  justify-content: center;
  align-items: center;
}
```

**After (apenas propriedades com efeito real):**

```css
a {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Centralizar texto em bloco simples | `text-align: center` basta — nao precisa de flex |
| Centralizar elemento filho horizontal e verticalmente | `display: flex` + `justify-content: center` + `align-items: center` |
| `align-items: center` sem efeito visivel | Verifique se o container tem altura (height ou padding vertical) |
| Apenas 1 filho dentro do flex container | Remova `gap` e `flex-direction: row` — nao produzem efeito |
| Duvida entre flex e text-align | Ambos funcionam para texto — o certo e o que resolve |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `flex-direction: row` (sem motivo) | Omita — row ja e o padrao |
| `gap: 8px` com filho unico | Remova — sem efeito visivel |
| `align-items: center` sem altura no container | Adicione `height`, `min-height` ou `padding` vertical |
| Flex so para centralizar texto simples | `display: block` + `text-align: center` resolve |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Modelo mental dos eixos do flexbox, analogias visuais e filosofia "o certo e o que resolve"
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes e anotacoes