# Code Examples: Shorthand Font no CSS

## Exemplo 1: Shorthand minimo (obrigatorias apenas)

```css
/* Minimo necessario — font-size + font-family */
p {
  font: 16px sans-serif;
}
```

**Resultado:** Aplica tamanho 16px e fonte sans-serif. Todas as outras propriedades (weight, style, variant) resetam para `normal`.

## Exemplo 2: Shorthand com line-height

```css
p {
  font: 16px/1.5 sans-serif;
}

/* Equivalente a: */
p {
  font-size: 16px;
  line-height: 1.5;
  font-family: sans-serif;
  font-style: normal;
  font-variant: normal;
  font-weight: normal;
}
```

## Exemplo 3: Shorthand completo da aula

```css
p {
  font: italic small-caps bold condensed 16px/1.5 sans-serif;
}

/* Equivalente a: */
p {
  font-style: italic;
  font-variant: small-caps;
  font-weight: bold;
  font-stretch: condensed; /* so funciona se a fonte suporta */
  font-size: 16px;
  line-height: 1.5;
  font-family: sans-serif;
}
```

## Exemplo 4: O erro de omitir font-size

```css
/* ERRADO — nao funciona, browser ignora */
p {
  font: sans-serif;
}

/* CORRETO — use a propriedade individual */
p {
  font-family: sans-serif;
}
```

## Exemplo 5: Propriedades individuais (recomendado)

```css
/* Cenario: so quer mudar o peso */
.bold-text {
  font-weight: bold;
}

/* Cenario: so quer mudar a familia */
.code {
  font-family: 'Fira Code', monospace;
}

/* Cenario: size + line-height */
.body-text {
  font-size: 1rem;
  line-height: 1.6;
}
```

## Exemplo 6: Reset de tipografia com shorthand

```css
/* Caso legitimo para shorthand: reset completo */
.widget {
  font: normal normal normal 14px/1.4 system-ui, sans-serif;
}
```

## Exemplo 7: small-caps em acao

```css
/* Todas as letras maiusculas, primeira maior */
.section-title {
  font-variant: small-caps;
  /* Prefira individual ao inves de font: small-caps 1rem sans-serif */
}
```

## Comparacao: shorthand vs individual

```css
/* Shorthand — define TUDO, reseta o que nao declarou */
.hero {
  font: bold 2rem/1.3 Georgia, serif;
  /* font-style: normal (resetado!) */
  /* font-variant: normal (resetado!) */
}

/* Individual — muda SO o que precisa */
.hero {
  font-weight: bold;
  font-size: 2rem;
  line-height: 1.3;
  font-family: Georgia, serif;
  /* font-style e font-variant NAO sao afetados */
}
```