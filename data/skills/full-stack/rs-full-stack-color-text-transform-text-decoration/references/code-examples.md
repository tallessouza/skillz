# Code Examples: Color, Text-Transform e Text-Decoration

## Setup HTML usado na aula

```html
<h1>Título</h1>
<p>Parágrafo de texto</p>
<mark>Texto marcado</mark>
<a href="#">Link de exemplo</a>
```

## Color

```css
/* Cor aplicada globalmente */
body {
  color: #333;
}

/* Cor específica num elemento */
h1 {
  color: red;
}

/* Formatos aceitos */
p { color: red; }              /* keyword */
p { color: #ff0000; }          /* hex */
p { color: rgb(255, 0, 0); }   /* rgb */
p { color: hsl(0, 100%, 50%); } /* hsl */
```

## Text-Transform

```css
/* Uppercase — "título" vira "TÍTULO" */
h1 {
  text-transform: uppercase;
}

/* Lowercase — "TÍTULO" vira "título" */
h1 {
  text-transform: lowercase;
}

/* Capitalize — "meu título legal" vira "Meu Título Legal" */
h1 {
  text-transform: capitalize;
}

/* None — sem transformação (padrão) */
h1 {
  text-transform: none;
}
```

### Aplicação no mark da aula

```css
mark {
  text-transform: uppercase;
}
```

## Text-Decoration — Variações completas

### Overline

```css
/* Linha por cima, vermelha */
a {
  text-decoration: overline red;
}
```

### Line-through

```css
/* Linha pelo meio */
a {
  text-decoration: line-through;
}

/* Linha pelo meio, double */
a {
  text-decoration: line-through double;
}

/* Linha pelo meio, dashed */
a {
  text-decoration: line-through dashed;
}

/* Linha pelo meio, dotted */
a {
  text-decoration: line-through dotted;
}
```

### Combinando propriedades

```css
/* Linha + cor */
a {
  text-decoration: overline red;
}

/* Linha + estilo */
a {
  text-decoration: line-through dashed;
}

/* Linha + estilo + cor */
a {
  text-decoration: underline wavy red;
}

/* Linha + cor + estilo + thickness */
a {
  text-decoration: underline red dashed 3px;
}
```

### Thickness (espessura)

```css
a { text-decoration: underline 1px; }
a { text-decoration: underline 3px; }
a { text-decoration: underline 5px; }
a { text-decoration: underline 1rem; } /* grosso! */
```

### Sub-propriedades separadas

```css
/* Quando precisa alterar apenas uma sub-propriedade */
a {
  text-decoration-line: underline;
  text-decoration-color: red;
  text-decoration-style: wavy;
  text-decoration-thickness: 2px;
}
```

## Removendo decoração de links

```css
/* Padrão recomendado: remover com alternativa visual */
a {
  text-decoration: none;
  color: #2563eb;
}

a:hover {
  text-decoration: underline;
}
```

## Dica Emmet

```
tt  → text-transform: ;
td  → text-decoration: ;
c   → color: ;
tdn → text-decoration: none;
ttu → text-transform: uppercase;
```