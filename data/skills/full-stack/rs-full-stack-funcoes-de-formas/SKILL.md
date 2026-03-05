---
name: rs-full-stack-funcoes-de-formas
description: "Applies CSS clip-path shape functions when styling elements with custom shapes. Use when user asks to 'clip an element', 'create a shape', 'cut element into circle', 'make a polygon shape', 'use clip-path', or any CSS shape clipping task. Enforces correct circle() and polygon() syntax, recommends visual generators for complex polygons. Make sure to use this skill whenever generating CSS that involves non-rectangular element shapes. Not for CSS transforms, border-radius rounding, or SVG shape creation."
---

# CSS Clip-Path — Funcoes de Formas

> Usar `clip-path` para recortar elementos HTML em formas personalizadas como circulos, poligonos e estrelas.

## Rules

1. **Use `clip-path` para recortar, nao para arredondar** — `clip-path` remove visualmente partes do elemento (como uma tesoura), porque `border-radius` apenas arredonda cantos sem recortar conteudo
2. **O elemento original continua ocupando espaco** — o recorte e apenas visual, o box model permanece intacto, porque o layout nao muda ao aplicar clip-path
3. **Prefira `polygon()` para formas complexas** — circulos usam `circle()`, mas estrelas, setas e formas livres exigem `polygon()` com coordenadas percentuais
4. **Use geradores visuais para poligonos** — coordenadas de poligonos complexos sao impossiveis de escrever manualmente, porque cada ponto e um par X/Y percentual
5. **`clip-path` recorta TODO o conteudo** — incluindo bordas, sombras e texto que ultrapassem a forma, porque o recorte age sobre o elemento inteiro

## How to write

### Circulo basico

```css
/* Recorta o elemento em um circulo centralizado */
.avatar {
  clip-path: circle(50%);
}
```

### Poligono personalizado

```css
/* Forma de seta apontando para direita */
.arrow {
  clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
}
```

### Com imagem de fundo

```css
/* Combinar clip-path com background-image para recortes criativos */
.hero-image {
  background-image: url('hero.jpg');
  background-size: cover;
  clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
}
```

## Example

**Before (elemento quadrado sem recorte):**

```css
.box {
  width: 200px;
  height: 200px;
  background: coral;
}
```

**After (com clip-path aplicado):**

```css
.box {
  width: 200px;
  height: 200px;
  background: coral;
  clip-path: circle(50%);
}
/* Resultado: o quadrado e recortado em circulo. Bordas e conteudo fora do circulo ficam invisiveis. */
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Recortar avatar em circulo | `clip-path: circle(50%)` |
| Forma geometrica simples (triangulo, seta) | `clip-path: polygon(...)` com poucos pontos |
| Forma complexa (estrela, balao de fala) | Usar gerador visual (CSS clip-path maker) e copiar o polygon |
| Precisa que sombra apareca | Aplique `filter: drop-shadow()` no elemento PAI, porque clip-path corta box-shadow |
| Quer animacao de forma | `clip-path` aceita `transition`, anime entre formas com mesmo numero de pontos |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Escrever polygon com 10+ pontos manualmente | Usar gerador visual e copiar |
| Esperar que `box-shadow` apareca com clip-path | Usar `filter: drop-shadow()` no pai |
| Usar clip-path so para arredondar cantos | Usar `border-radius` |
| Animar entre polygons com numeros diferentes de pontos | Manter mesmo numero de pontos nas duas formas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre como clip-path funciona internamente e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes