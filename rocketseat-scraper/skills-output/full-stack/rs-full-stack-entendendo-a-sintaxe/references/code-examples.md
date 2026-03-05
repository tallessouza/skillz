# Code Examples: Media Queries — Sintaxe Completa

## Exemplo base: variavel CSS com breakpoint

```css
:root {
  --bg-color: rebeccapurple;
}

body {
  background-color: var(--bg-color);
  color: white;
}

/* A partir de 576px, muda a cor de fundo */
@media (width >= 576px) {
  :root {
    --bg-color: orangered;
  }
}
```

**Comportamento:** Abaixo de 576px a tela fica roxa. A partir de 576px, muda para laranja-vermelho.

## Exemplo com screen explicito (desnecessario)

```css
/* Funciona, mas screen e redundante */
@media screen and (min-width: 576px) {
  :root {
    --bg-color: orangered;
  }
}

/* Equivalente e mais limpo */
@media (width >= 576px) {
  :root {
    --bg-color: orangered;
  }
}
```

## Exemplo com orientation

```css
@media (orientation: portrait) {
  :root {
    --bg-color: orangered;
  }
}
```

**Comportamento:** Quando a viewport e mais alta que larga (retrato), aplica. Quando mais larga que alta (paisagem), nao aplica.

## Exemplo com unidade flexivel (em)

```css
@media (width >= 20em) {
  :root {
    --bg-color: orangered;
  }
}
```

**Nota:** 20em = 20 × tamanho da fonte base (geralmente 16px = 320px).

## Exemplo com AND para definir intervalo (sintaxe antiga)

```css
@media (min-width: 400px) and (max-width: 500px) {
  :root {
    --bg-color: orangered;
  }
}
```

**Comportamento:**
- < 400px: roxo (nao aplica)
- 400px-500px: laranja (aplica)
- > 500px: roxo (nao aplica)

## Mesmo exemplo com range syntax moderna

```css
@media (400px <= width <= 500px) {
  :root {
    --bg-color: orangered;
  }
}
```

## Exemplo com NOT (inversao de logica)

```css
@media not ((width >= 400px) and (width <= 500px)) {
  :root {
    --bg-color: orangered;
  }
}
```

**Comportamento (invertido):**
- < 400px: laranja (aplica — inverteu)
- 400px-500px: roxo (nao aplica — inverteu)
- > 500px: laranja (aplica — inverteu)

## Exemplo com prefers-color-scheme

```css
:root {
  --bg-color: rebeccapurple;
}

body {
  background-color: var(--bg-color);
  color: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: orangered;
  }
}
```

**Comportamento:** Se o sistema do usuario esta em dark mode, fundo laranja. Se esta em light mode, fundo roxo. Muda automaticamente quando o usuario troca a preferencia no SO.

## Exemplo com NOT screen (para print)

```css
@media not screen {
  /* Estilos para tudo que NAO e tela (print, etc.) */
  body {
    background: white;
    color: black;
  }
}
```

## Variacoes de range syntax

```css
/* A partir de (inclusive) */
@media (width >= 768px) { }

/* Ate (inclusive) */
@media (width <= 768px) { }

/* Maior que (exclusivo) */
@media (width > 768px) { }

/* Menor que (exclusivo) */
@media (width < 768px) { }

/* Intervalo fechado */
@media (768px <= width <= 1024px) { }

/* Intervalo aberto */
@media (768px < width < 1024px) { }
```

## Breakpoints comuns para referencia

```css
/* Mobile first approach */
/* Base: mobile (sem media query) */

@media (width >= 576px) {
  /* Small devices (landscape phones) */
}

@media (width >= 768px) {
  /* Medium devices (tablets) */
}

@media (width >= 992px) {
  /* Large devices (desktops) */
}

@media (width >= 1200px) {
  /* Extra large devices (large desktops) */
}
```