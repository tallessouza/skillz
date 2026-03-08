---
name: rs-full-stack-estilizando-navegacao-01
description: "Applies CSS navigation styling patterns when building navbars with Flexbox. Use when user asks to 'style a navbar', 'create navigation layout', 'align nav items', 'space between nav elements', or 'style links'. Covers display flex, justify-content, align-items, list-style reset, pseudo-classes last-child/hover, padding-block, gap, object-fit, and global anchor resets. Make sure to use this skill whenever styling navigation components or horizontal layouts with CSS. Not for JavaScript interactivity, responsive breakpoints, or CSS Grid layouts."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-navigation
  tags: [css, flexbox, navigation, navbar, gap, object-fit, pseudo-classes]
---

# Estilizando Navegacao com CSS Flexbox

> Organize a navegacao separando estilos em arquivo dedicado, use Flexbox para alinhar elementos e reset de estilos padrao do navegador.

## Rules

1. **Separe estilos por componente** — crie `nav.css` e importe no index, porque arquivo limpo facilita manutencao
2. **Use display flex para alinhar horizontalmente** — tanto no `nav` quanto no `ul`, porque elementos inline-block geram espacos indesejados
3. **Remova list-style do ul** — `list-style: none` elimina bullet points que nao pertencem a navegacao
4. **Use pseudo-class last-child para selecionar elementos especificos** — `li:last-child img` em vez de classes extras, porque reduz markup
5. **Defina object-fit: cover em imagens com dimensoes fixas** — porque imagens fora de proporcao ficam esticadas sem isso
6. **Reset global de anchors com color: inherit** — remove azul padrao do navegador e herda cor do pai, aplicavel em todo o projeto
7. **Use padding-block para espacamento vertical** — `padding-block: 20px` aplica em cima e embaixo sem afetar laterais, porque e mais semantico que padding shorthand

## How to write

### Estrutura do nav com Flexbox

```css
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 20px;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  padding-block: 8px;
}
```

### Imagem de perfil com last-child

```css
nav ul li:last-child img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}
```

### Reset global de links

```css
/* global.css — aplicar globalmente porque anchors aparecem em varios lugares */
a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  color: var(--brandColor);
  text-decoration: underline;
}
```

## Example

**Before (HTML sem estilo):**
```css
/* Elementos empilhados verticalmente, bullets visiveis, link azul */
```

**After (com skill aplicada):**
```css
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 20px;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  padding-block: 8px;
}

nav ul li:last-child img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elementos lado a lado | `display: flex` no container |
| Espaco entre grupos de nav | `justify-content: space-between` |
| Alinhamento vertical centralizado | `align-items: center` |
| Espaco entre itens de lista | `gap` no flex container |
| Espaco vertical simetrico | `padding-block` com um valor |
| Espaco vertical assimetrico | `padding-block` com dois valores (topo, base) |
| Imagem com dimensao fixa | Sempre adicionar `object-fit: cover` |
| Imagem redonda | `border-radius: 50%` apos definir largura e altura iguais |
| Selecionar ultimo item de lista | `li:last-child` em vez de classe extra |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `padding: 20px 0` para vertical | `padding-block: 20px` |
| `float: left` para alinhar nav | `display: flex` |
| `.last-item img` com classe manual | `li:last-child img` com pseudo-class |
| `color: blue` reset manual | `color: inherit` para herdar do pai |
| `margin-right: 20px` em cada li | `gap: 20px` no flex container |
| Estilos de nav misturados no global | Arquivo `nav.css` separado |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Itens do nav empilhados verticalmente | Faltou `display: flex` no container | Adicionar `display: flex` no `nav` ou `ul` |
| Bullet points visiveis na lista | `list-style` nao removido | Adicionar `list-style: none` no `ul` |
| Link com cor azul padrao | Reset global de anchor ausente | Adicionar `a { color: inherit; text-decoration: none; }` |
| Imagem de perfil distorcida | `object-fit` nao aplicado | Adicionar `object-fit: cover` com dimensoes fixas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Flexbox, pseudo-classes e organizacao CSS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes