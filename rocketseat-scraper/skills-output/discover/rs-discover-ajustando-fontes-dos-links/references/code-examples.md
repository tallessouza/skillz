# Code Examples: Ajustando Fontes dos Links

## Exemplo principal da aula

### CSS do elemento `a` (link como botao)

```css
/* Antes — link com estilos padrao do browser */
a {
  /* underline visivel, font-weight 400 (normal) */
}

/* Depois — link estilizado */
a {
  text-decoration: none;
  font-weight: 500;
}
```

## Variacoes de text-decoration

```css
/* Sem decoracao — para links de navegacao */
.nav-link {
  text-decoration: none;
}

/* Underline — para links dentro de texto corrido */
.content a {
  text-decoration: underline;
}

/* Line-through — para preco antigo */
.old-price {
  text-decoration: line-through;
}

/* Overline — raramente usado */
.overlined {
  text-decoration: overline;
}
```

## Font-weight com Google Fonts

```css
/* Import no HTML */
/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet"> */

/* Uso correto — valores que correspondem ao import */
body {
  font-family: 'Inter', sans-serif;
  /* font-weight: 400 e o padrao, nao precisa declarar */
}

a {
  font-weight: 500; /* Especifico, corresponde ao peso importado */
}

/* Uso incorreto */
a {
  font-weight: bold; /* Resolve para 700, que NAO foi importado */
}
```

## Exemplo completo de link estilizado como botao

```css
a {
  text-decoration: none;
  font-weight: 500;
  color: #8257e5;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## Quando NAO remover valores padrao

```css
/* ERRADO — declarando valores que ja sao padrao */
a {
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;      /* desnecessario */
  line-height: 24px;    /* desnecessario */
}

/* CORRETO — apenas o que muda */
a {
  text-decoration: none;
  font-weight: 500;
}
```