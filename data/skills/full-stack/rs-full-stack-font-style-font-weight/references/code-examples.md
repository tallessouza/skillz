# Code Examples: Font Style e Font Weight

## Font Style — todos os valores

```css
/* Unico valor pratico alem de normal */
.italic-text {
  font-style: italic;
}

/* Resetar italico (util em elementos que herdam italic) */
em.no-italic {
  font-style: normal;
}

/* Oblique — raramente util */
.oblique-text {
  font-style: oblique;
  /* Equivalente a italic na maioria das fontes */
}

/* Oblique com angulo — requer fonte variavel */
.custom-angle {
  font-style: oblique 14deg;
  /* So funciona com variable fonts que suportem eixo slnt */
}
```

## Font Weight — escala numerica completa

```css
/* Variacao completa de pesos (requer fonte com todos os pesos) */
.weight-100 { font-weight: 100; } /* Thin */
.weight-200 { font-weight: 200; } /* Extra Light */
.weight-300 { font-weight: 300; } /* Light */
.weight-400 { font-weight: 400; } /* Normal (padrao) */
.weight-500 { font-weight: 500; } /* Medium */
.weight-600 { font-weight: 600; } /* Semi Bold */
.weight-700 { font-weight: 700; } /* Bold */
.weight-800 { font-weight: 800; } /* Extra Bold */
.weight-900 { font-weight: 900; } /* Black */
```

## Caso pratico: removendo bold de headings

```css
/* Headings vem com bold do user-agent stylesheet */
/* Para remover: */
h1, h2, h3 {
  font-weight: 400;
}

/* Ou usando o nome: */
h1 {
  font-weight: normal; /* equivale a 400 */
}
```

## Caso pratico: tipografia com Google Fonts

```css
/* Ao importar fonte, especifique os pesos que vai usar */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

.subtitle {
  font-weight: 300; /* Light — disponivel porque importamos wght@300 */
}

.bold-text {
  font-weight: 700; /* Bold — disponivel porque importamos wght@700 */
}

/* Isso NAO vai funcionar como esperado: */
.extra-bold {
  font-weight: 900; /* Nao importamos 900, browser vai arredondar pra 700 */
}
```

## Caso pratico: combinando font-style e font-weight

```css
.blockquote-author {
  font-style: italic;
  font-weight: 300;
}

.highlight {
  font-style: normal;
  font-weight: 700;
}

/* Resetando ambos em contexto herdado */
.reset-text {
  font-style: normal;
  font-weight: 400;
}
```

## Valores relativos: lighter e bolder

```css
/* Contexto: pai tem font-weight: 400 */
.parent {
  font-weight: 400;
}

.parent .bolder-child {
  font-weight: bolder; /* Proximo peso acima: 700 (se disponivel) */
}

.parent .lighter-child {
  font-weight: lighter; /* Proximo peso abaixo: 100 (se disponivel) */
}

/* Preferencia: usar valores numericos explicitos */
.parent .explicit-child {
  font-weight: 700; /* Previsivel, sem depender de heranca */
}
```