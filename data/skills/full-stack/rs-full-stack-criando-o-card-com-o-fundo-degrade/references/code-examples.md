# Code Examples: Card com Fundo Degradê

## Exemplo base da aula

### HTML
```html
<div class="card">
  <img src="image.jpg" alt="Noticia" />
  <div class="card-content">
    <h3>Titulo da noticia</h3>
  </div>
</div>
```

### CSS completo
```css
.card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  & img {
    width: 100%;
    display: block;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 0%, #1a1a1a 100%);
  }
}
```

## Variacoes de direcao do degradê

### De baixo para cima (0deg)
```css
background: linear-gradient(0deg, transparent 0%, #1a1a1a 100%);
```

### Da esquerda para direita (90deg)
```css
background: linear-gradient(90deg, transparent 0%, #1a1a1a 100%);
```

### Diagonal (45deg)
```css
background: linear-gradient(45deg, transparent 0%, #1a1a1a 100%);
```

## Variacao: degradê comecando no meio

O instrutor mencionou que no design o degradê comeca a partir do meio do card:

```css
&::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, #1a1a1a 100%);
}
```

Alternativa usando inset parcial:
```css
&::before {
  content: "";
  position: absolute;
  inset: 50% 0 0 0;
  background: linear-gradient(180deg, transparent 0%, #1a1a1a 100%);
}
```

## Variacao: degradê com multiplos stops

```css
background: linear-gradient(
  180deg,
  transparent 0%,
  rgba(0, 0, 0, 0.3) 50%,
  #1a1a1a 100%
);
```

## Evolucao que o instrutor mostrou

### Passo 1: pseudo-elemento com cor solida (debug)
```css
&::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: white; /* so pra ver o elemento */
}
```

### Passo 2: trocar cor solida por degradê
```css
&::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, #1a1a1a 100%);
}
```

## Problema demonstrado: overflow sem hidden

```css
/* PROBLEMA: border-radius no card mas filhos transbordam */
.card {
  border-radius: 8px;
  /* sem overflow: hidden → imagem e ::before ignoram o arredondamento */
}

/* SOLUCAO */
.card {
  border-radius: 8px;
  overflow: hidden; /* agora tudo respeita o arredondamento */
}
```

## Problema demonstrado: absolute sem relative no pai

```css
/* PROBLEMA: ::before se espalha pela pagina */
.card {
  /* sem position: relative */

  &::before {
    position: absolute;
    inset: 0; /* ocupa o viewport inteiro! */
  }
}

/* SOLUCAO */
.card {
  position: relative; /* agora ::before fica contido no card */

  &::before {
    position: absolute;
    inset: 0;
  }
}
```