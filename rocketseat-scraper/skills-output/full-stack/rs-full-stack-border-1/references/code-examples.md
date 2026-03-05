# Code Examples: CSS Border

## Setup da aula

O instrutor criou dois elementos para comparar comportamento block vs inline:

```html
<div class="border">Elemento block</div>
<span class="border">Elemento inline</span>
```

## Exemplo 1: Apenas border-style (minimo necessario)

```css
.border {
  border-style: solid;
}
```

Resultado: borda preta fina (width padrao = medium, color padrao = currentColor/preto).

## Exemplo 2: Shorthand com ordem variada

```css
/* Todas equivalentes */
.border { border: 1px solid red; }
.border { border: solid 1px red; }
.border { border: red solid 1px; }
.border { border: solid red; }     /* width usa default medium */
```

## Exemplo 3: border-style com multiplos valores

```css
/* 2 valores: vertical | horizontal */
.border {
  border-style: dotted solid;
  border-width: 4px;
}
/* top/bottom = dotted, left/right = solid */

/* 3 valores: top | horizontal | bottom */
.border {
  border-style: dotted solid double;
  border-width: 4px;
}
/* top = dotted, left/right = solid, bottom = double */

/* 4 valores: top | right | bottom | left */
.border {
  border-style: dotted solid double dashed;
  border-width: 4px;
}
/* top = dotted, right = solid, bottom = double, left = dashed */
```

## Exemplo 4: border-width com multiplos valores

```css
.border {
  border-style: solid;
  /* 2 valores: vertical | horizontal */
  border-width: 4px 2px;
}

.border {
  border-style: solid;
  /* 3 valores: top | horizontal | bottom */
  border-width: 4px 2px 6px;
}

.border {
  border-style: solid;
  /* 4 valores: sentido horario */
  border-width: 4px 2px 6px 15px;
}
```

## Exemplo 5: border-color com multiplos valores

```css
.border {
  border-style: solid;
  border-width: 4px;
  /* 4 valores: top | right | bottom | left */
  border-color: red green blue black;
}
```

## Exemplo 6: Bordas individuais

```css
/* Apenas borda inferior */
.border {
  border-bottom-style: solid;
}

/* Shorthand do lado individual */
.border {
  border-bottom: 1px solid red;
}

/* Propriedades individuais do lado */
.border {
  border-bottom-style: solid;
  border-bottom-color: blue;
  border-bottom-width: 3px;
}
```

## Exemplo 7: Bordas diferentes por lado (propriedades individuais)

```css
.border {
  border-left: 3px solid blue;
  border-right: 3px solid blue;
  border-bottom: 2px solid red;
}
```

## Variacoes praticas comuns

### Separador visual (underline)
```css
.section-title {
  border-bottom: 2px solid #333;
  padding-bottom: 8px;
}
```

### Card com borda sutil
```css
.card {
  border: 1px solid #e0e0e0;
}
```

### Destaque lateral (accent border)
```css
.alert {
  border-left: 4px solid #ff9800;
  padding-left: 12px;
}
```

### Input com foco
```css
.input {
  border: 1px solid #ccc;
}
.input:focus {
  border: 1px solid #2196f3;
}
```

### Tabela com bordas
```css
table {
  border: 1px solid #ddd;
}
td, th {
  border-bottom: 1px solid #ddd;
}
```