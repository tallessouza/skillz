---
name: rs-full-stack-adicionando-o-rodape
description: "Applies HTML footer structure and SVG icon alignment techniques when building page footers or aligning inline images with text. Use when user asks to 'create a footer', 'add a footer', 'align an icon with text', 'use vertical-align', or 'add SVG icons'. Covers footer semantics, SVG format benefits, vertical-align property, and why flexbox replaces it professionally. Make sure to use this skill whenever creating footers or aligning inline icons with text. Not for complex layouts, navigation bars, or flexbox-based implementations."
---

# Footer com Alinhamento de Icones SVG

> Construa footers semanticos com icones SVG alinhados ao texto usando vertical-align, sabendo que flexbox sera a abordagem profissional futura.

## Rules

1. **Use a tag `<footer>` semantica** — envolva o conteudo do rodape em `<footer>`, porque semantica HTML melhora acessibilidade e SEO
2. **Use SVG para icones** — SVG nao perde qualidade em nenhum nivel de zoom, diferente de JPG/PNG que pixelam ao ampliar
3. **Alinhe icones inline com `vertical-align: middle`** — posiciona o icone no centro vertical da linha de texto, porque e a forma mais simples sem flexbox
4. **Centralize texto de footer com `text-align: center`** — footers tipicamente tem conteudo centralizado
5. **Use `padding-bottom` para espacamento inferior** — nao `margin-bottom`, para manter o espacamento dentro do elemento
6. **Saiba que `flex` substitui `vertical-align` profissionalmente** — vertical-align funciona, mas no mercado flexbox e o padrao para alinhar elementos em containers

## How to write

### Estrutura HTML do footer

```html
<footer>
  Feito com <img src="assets/heart.svg" alt="coracao"> pela Skillz
</footer>
```

### CSS do footer

```css
footer {
  color: #7B7B7B;
  text-align: center;
  padding-bottom: 48px;
  font-size: 16px;
  line-height: 150%;
}

footer img {
  vertical-align: middle;
}
```

## Example

**Before (icone desalinhado, sem estilizacao):**

```html
<footer>
  Feito com <img src="assets/heart.svg"> pela Skillz
</footer>
```
```css
/* Sem CSS — icone fica no baseline, texto sem centralizacao */
```

**After (com esta skill aplicada):**

```html
<footer>
  Feito com <img src="assets/heart.svg" alt="coracao"> pela Skillz
</footer>
```
```css
footer {
  color: #7B7B7B;
  text-align: center;
  padding-bottom: 48px;
  font-size: 16px;
  line-height: 150%;
}

footer img {
  vertical-align: middle;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Icone pequeno inline com texto | `vertical-align: middle` na imagem |
| Ja conhece flexbox | Use `display: flex; align-items: center` no container |
| Icone decorativo (logo, coracao) | Formato SVG, sempre |
| Espacamento abaixo do footer | `padding-bottom`, nao `margin-bottom` |
| Precisa de qualidade em zoom | SVG — formato vetorial, nao perde qualidade |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `<div>` para rodape | `<footer>` semantico |
| Icone em PNG/JPG | Icone em SVG |
| `<img>` sem `alt` | `<img alt="descricao">` |
| `margin-bottom` no footer | `padding-bottom` no footer |
| Ignorar alinhamento vertical do icone | `vertical-align: middle` ou flexbox |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre SVG vs raster, vertical-align vs flexbox, e anatomia do footer
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes