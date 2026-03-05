---
name: rs-full-stack-bg-image-container
description: "Applies CSS background-image and container page styling patterns when writing HTML/CSS layouts. Use when user asks to 'add background image', 'style a container', 'center a page wrapper', 'fix box-sizing', or any CSS layout task with background and containment. Enforces cover background, border-box sizing, Figma-to-CSS translation, and centered fixed-width containers. Make sure to use this skill whenever creating page layouts with background images or fixed-width centered containers. Not for JavaScript logic, animations, or responsive grid systems."
---

# Imagem de Fundo e Container Page

> Ao estilizar uma pagina, configure o background-image no body com cover e construa o container centralizado com box-sizing: border-box.

## Rules

1. **Use background-image com url() no body** — `background-image: url(./assets/bg.jpg)` nao `<img>` inline, porque imagens de fundo sao decorativas e pertencem ao CSS
2. **Sempre defina background-size: cover** — porque cover garante que a imagem cobre toda a area visivel independente do tamanho da tela, eliminando repeticoes visiveis
3. **Aplique box-sizing: border-box no container** — porque sem isso, padding soma na largura declarada (800px + 24px + 24px = 848px), quebrando o layout
4. **Centralize com margin: vertical auto** — `margin: 48px auto` centraliza horizontalmente e define espaco vertical, porque margin auto distribui espaco igual nos lados
5. **Organize CSS na ordem do HTML** — body primeiro, depois page, depois image, porque facilita a leitura e manutencao do codigo
6. **Extraia valores do Figma antes de codar** — padding, width, border-radius, cores — porque valores inventados geram retrabalho

## How to write

### Background no body

```css
body {
  background-image: url(./assets/bg.jpg);
  background-size: cover;
}
```

### Container page centralizado

```css
#page {
  width: 800px;
  padding: 24px;
  background-color: #36393B;
  border-radius: 24px;
  margin: 48px auto;
  box-sizing: border-box;
}
```

## Example

**Before (problema classico — container estoura largura):**

```css
body {
  background-image: url(./assets/bg.jpg);
}

#page {
  width: 800px;
  padding: 24px;
  background-color: #36393B;
  border-radius: 24px;
  margin: 48px auto;
}
/* Resultado: largura real = 848px (800 + 24 + 24) */
```

**After (com box-sizing e background-size):**

```css
body {
  background-image: url(./assets/bg.jpg);
  background-size: cover;
}

#page {
  width: 800px;
  padding: 24px;
  background-color: #36393B;
  border-radius: 24px;
  margin: 48px auto;
  box-sizing: border-box;
}
/* Resultado: largura real = 800px (padding incluso) */
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Imagem decorativa de pagina inteira | `background-image` no body com `cover` |
| Container com largura fixa no Figma | `width: Xpx` + `box-sizing: border-box` |
| Elemento precisa de espaco interno | Defina padding E adicione `box-sizing: border-box` |
| Centralizar container horizontalmente | `margin: Ypx auto` (Y = espaco vertical do Figma) |
| Imagem repete no fundo | Adicionar `background-size: cover` resolve |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `width: 800px` sem box-sizing (estoura com padding) | `width: 800px` + `box-sizing: border-box` |
| `background-size: 100%` para cobrir tela | `background-size: cover` |
| `margin-left: auto; margin-right: auto` verbose | `margin: 48px auto` (shorthand) |
| CSS em ordem aleatoria | CSS na ordem que aparece no HTML |
| Valores de padding/cor inventados | Valores extraidos do Figma |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre box model, background-size options e fluxo Figma-to-CSS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes