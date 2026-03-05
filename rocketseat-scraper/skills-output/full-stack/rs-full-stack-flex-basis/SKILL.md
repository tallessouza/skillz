---
name: rs-full-stack-flex-basis
description: "Applies correct flex-basis usage when writing CSS Flexbox layouts. Use when user asks to 'create a layout', 'style with flexbox', 'set item sizes', 'make responsive grid', or any CSS sizing task. Enforces flex-basis over width in flex contexts, axis-aware sizing, and understanding flex-basis as desired/ideal size. Make sure to use this skill whenever generating flexbox CSS code. Not for CSS Grid, non-flex positioning, or JavaScript logic."
---

# Flex Basis — Sizing no Flexbox

> Usar flex-basis em vez de width/height para definir o tamanho desejado de itens flex, sempre relativo ao eixo principal.

## Rules

1. **Use flex-basis em vez de width dentro de flex containers** — `flex-basis: 120px` nao `width: 120px`, porque flex-basis respeita o eixo principal e se adapta quando o eixo inverte
2. **flex-basis e relativo ao eixo principal** — em `flex-direction: row` equivale a width, em `flex-direction: column` equivale a height, porque o flexbox opera sempre no eixo principal
3. **flex-basis e o tamanho desejado, nao garantido** — o valor e o "ideal" que o item quer ter, mas grow e shrink podem alterar o resultado final, porque o container distribui espaco disponivel
4. **Valor padrao e `auto`** — significa "use width/height como fallback". `0` significa "nao desejo tamanho base nenhum". Escolha conscientemente
5. **Aceita qualquer unidade** — px, %, rem, vh, fr-like behavior com grow. Use a unidade adequada ao contexto (% para proporcional, px para fixo)

## How to write

### Tamanho base em flex container

```css
.container {
  display: flex;
}

.item {
  /* Correto: usar flex-basis */
  flex-basis: 120px;
}
```

### Eixo invertido muda o significado

```css
.container {
  display: flex;
  flex-direction: column;
}

.item {
  /* Agora flex-basis controla a ALTURA, nao a largura */
  flex-basis: 200px;
}
```

### Proporcional com porcentagem

```css
.item {
  flex-basis: 10%; /* 10% do container no eixo principal */
}
```

## Example

**Before (ignorando flex-basis):**
```css
.container {
  display: flex;
}

.item {
  width: 120px;
  height: 80px;
}
```

**After (com flex-basis):**
```css
.container {
  display: flex;
}

.item {
  flex-basis: 120px; /* tamanho desejado no eixo principal */
  height: 80px;      /* altura e independente quando eixo e row */
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Item dentro de flex container | Usar flex-basis em vez de width |
| flex-direction: column | flex-basis controla altura |
| Tamanho nao esta sendo aplicado | Verificar grow/shrink — eles redistribuem espaco |
| Valor maior que container | O item vai encolher por causa de shrink padrao |
| Quer desativar tamanho base | Usar `flex-basis: 0` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `width: 200px` em flex item | `flex-basis: 200px` |
| `flex-basis: 120%` sem entender shrink | Verificar se grow/shrink permitem o tamanho |
| Confiar que flex-basis = tamanho final | Lembrar que e o tamanho *desejado* |
| Mudar height quando eixo invertido | Usar flex-basis que se adapta ao eixo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre sizing, analogia do desejável vs real, e interação com grow/shrink
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações de eixo e unidades