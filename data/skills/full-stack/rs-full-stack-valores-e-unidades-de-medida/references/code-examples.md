# Code Examples: Valores e Unidades de Medida no CSS

## Exemplo base da aula

O instrutor usa um `h1` para demonstrar os diferentes tipos de dados:

```css
h1 {
  color: blue;                /* tipo: <color> — named color */
  font-size: 24px;            /* tipo: <length> — numero + unidade */
  letter-spacing: 7;          /* tipo: <number> — numero puro */
  text-transform: uppercase;  /* tipo: <keyword> — palavra-chave */
}
```

## Variacoes de `<color>`

```css
/* Named color */
h1 { color: blue; }
h1 { color: tomato; }
h1 { color: rebeccapurple; }

/* Hex color */
h1 { color: #0000ff; }
h1 { color: #00f; }         /* shorthand */
h1 { color: #0000ff80; }    /* com alpha */

/* RGB */
h1 { color: rgb(0, 0, 255); }
h1 { color: rgba(0, 0, 255, 0.5); }

/* HSL */
h1 { color: hsl(240, 100%, 50%); }
h1 { color: hsla(240, 100%, 50%, 0.5); }
```

## Variacoes de `<length>`

```css
/* Pixels — unidade absoluta */
h1 { font-size: 24px; }
h1 { margin: 16px; }
h1 { padding: 8px; }

/* Rem — relativo ao root */
h1 { font-size: 1.5rem; }
h1 { margin: 1rem; }

/* Em — relativo ao pai */
h1 { font-size: 1.2em; }
h1 { padding: 0.5em; }

/* Viewport units */
h1 { font-size: 5vw; }
h1 { width: 100vh; }

/* Zero nao precisa de unidade */
h1 { margin: 0; }
```

## Variacoes de `<keyword>` em text-transform

```css
/* Todas as keywords aceitas */
h1 { text-transform: none; }         /* valor padrao */
h1 { text-transform: capitalize; }   /* Primeira Letra Maiuscula */
h1 { text-transform: uppercase; }    /* TUDO MAIUSCULO */
h1 { text-transform: lowercase; }    /* tudo minusculo */

/* Keywords globais (funcionam em qualquer propriedade) */
h1 { text-transform: inherit; }
h1 { text-transform: initial; }
h1 { text-transform: unset; }
```

## Font-size com diferentes tipos de dados

```css
/* <absolute-size> keywords */
h1 { font-size: xx-small; }
h1 { font-size: small; }
h1 { font-size: medium; }
h1 { font-size: large; }
h1 { font-size: xx-large; }

/* <relative-size> keywords */
h1 { font-size: smaller; }
h1 { font-size: larger; }

/* <length> */
h1 { font-size: 24px; }
h1 { font-size: 1.5rem; }
h1 { font-size: 1.2em; }

/* <percentage> */
h1 { font-size: 80%; }
h1 { font-size: 120%; }

/* calc() — math value */
h1 { font-size: calc(1rem + 2vw); }
```

## Demonstracao de como o editor ajuda

Ao passar o mouse sobre uma propriedade no VS Code:

```
/* Hover sobre "color" mostra: */
/* Syntax: <color> */

/* Hover sobre "font-size" mostra: */
/* Syntax: <absolute-size> | <relative-size> | <length-percentage> | math */

/* Hover sobre "text-transform" mostra: */
/* Syntax: none | capitalize | uppercase | lowercase | full-width | ... */
```

Essa tooltip e o primeiro recurso antes de ir na MDN.