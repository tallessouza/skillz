---
name: rs-full-stack-pseudo-classes-e-pseudo-elements
description: "Applies CSS pseudo-classes and pseudo-elements correctly when writing styles. Use when user asks to 'style a component', 'add hover effect', 'create CSS', 'select elements', or 'add decorative elements'. Covers :hover, :not(), :has(), :nth-child(), ::before, ::after, ::first-letter, and :root. Make sure to use this skill whenever generating CSS that involves element states, structural selection, or generated content. Not for JavaScript event handling, CSS-in-JS runtime logic, or animation keyframes."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-selectors
  tags:
    - css
    - pseudo-classes
    - pseudo-elements
    - selectors
    - hover
---

# Pseudo-classes e Pseudo-elements CSS

> Pseudo-classes selecionam elementos em estados ou posicoes especificas; pseudo-elements criam ou selecionam partes de um elemento.

## Rules

1. **Pseudo-class usa `:` (dois pontos)** — `:hover`, `:not()`, `:has()`, porque e a sintaxe padrao do CSS
2. **Pseudo-element usa `::` (quatro pontos)** — `::before`, `::after`, `::first-letter`, porque diferencia visualmente de pseudo-classes (um `:` funciona mas `::` e o correto)
3. **`:nth-child()` conta TODOS os filhos** — nao apenas os do tipo selecionado, porque a contagem e estrutural no DOM, nao filtrada por tag
4. **`::before` e `::after` exigem `content`** — mesmo que vazio `content: ""`, porque sem content o pseudo-element nao renderiza
5. **Use `:root` em vez de `html`** — `:root` tem maior especificidade que `html`, porque permite sobrescrever estilos base com mais controle
6. **`:has()` seleciona o PAI baseado no filho** — `section:has(div:hover)` aplica estilo na section, porque e seletor relacional que sobe na arvore DOM

## How to write

### Pseudo-class de interacao

```css
div:hover {
  background-color: lightcoral;
}
```

### Pseudo-class funcional :not()

```css
/* Aplica em todas as divs EXCETO as com classe .inactive */
div:not(.inactive) {
  background-color: lightblue;
}
```

### Pseudo-class funcional :has()

```css
/* Section recebe borda quando qualquer div filha recebe hover */
section:has(div:hover) {
  border: 2px solid red;
}
```

### Pseudo-class estrutural :nth-child()

```css
/* Pega o SEGUNDO FILHO da section, independente da tag */
div:nth-child(2) {
  background-color: lightblue;
}
```

### Pseudo-element ::before e ::after

```css
div {
  position: relative;
}

div::before {
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  background-color: red;
  position: absolute;
  top: 0;
  left: 0;
}
```

### Pseudo-element ::first-letter

```css
div::first-letter {
  font-size: 40px;
}
```

## Example

**Before (seletores limitados):**
```css
.highlighted { background-color: lightcoral; }
.section-with-hovered-child { border: 2px solid red; }
/* Precisa de JS para adicionar/remover classes */
```

**After (com pseudo-classes e pseudo-elements):**
```css
div:hover { background-color: lightcoral; }
section:has(div:hover) { border: 2px solid red; }
div:not(.inactive) { background-color: lightblue; }
div::before { content: ""; display: block; width: 100%; height: 2px; background: red; }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Efeito visual ao passar mouse | Use `:hover` |
| Excluir elemento especifico de um estilo | Use `:not(.classe)` |
| Estilizar pai baseado em estado do filho | Use `:has()` |
| Selecionar filho por posicao | Use `:nth-child(n)` |
| Criar elemento decorativo (linha, icone) | Use `::before` ou `::after` com `content: ""` |
| Estilizar primeira letra de um texto | Use `::first-letter` |
| Definir variaveis CSS globais | Use `:root` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `div:nth-child(2)` esperando que conte so divs | Lembre que conta TODOS os filhos — ajuste o numero |
| `div::before { width: 10px; }` sem content | Adicione `content: ""` sempre |
| `div::before { }` sem display block/inline-block | Defina `display: block` para dimensionar o elemento |
| `html { --cor: red; }` para variaveis globais | Use `:root { --cor: red; }` — maior especificidade |
| JavaScript para hover simples | Use `:hover` puro em CSS |
| Classes JS para estilizar pai por estado do filho | Use `:has()` — CSS nativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `::before` ou `::after` nao aparece | Faltou `content` property | Adicione `content: ""` mesmo que vazio |
| `:nth-child(2)` seleciona elemento errado | nth-child conta TODOS os filhos, nao apenas os do tipo | Verifique a posicao real no DOM ou use `:nth-of-type()` |
| `:has()` nao funciona | Navegador antigo sem suporte | Verifique compatibilidade — `:has()` requer browsers modernos (2023+) |

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-pseudo-classes-e-pseudo-elements/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-pseudo-classes-e-pseudo-elements/references/code-examples.md)
