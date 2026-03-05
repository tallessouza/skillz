# Code Examples: Background-Position e Background-Size

## Exemplo 1: Posicionamento no eixo X

```css
/* Position X individual */
body {
  background-image: url('imagem.jpg');
  background-repeat: no-repeat;
  background-position-x: right; /* canto direito */
}

body {
  background-image: url('imagem.jpg');
  background-repeat: no-repeat;
  background-position-x: left; /* canto esquerdo */
}
```

## Exemplo 2: Posicionamento no eixo Y

```css
body {
  background-image: url('imagem.jpg');
  background-repeat: no-repeat;
  background-position-y: top;    /* padrão — topo */
}

body {
  background-image: url('imagem.jpg');
  background-repeat: no-repeat;
  background-position-y: bottom; /* vai para baixo */
}
```

## Exemplo 3: Center em ambos os eixos

```css
body {
  background-image: url('imagem.jpg');
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center;
}

/* Equivalente com shorthand — valor único aplica para X e Y */
body {
  background-image: url('imagem.jpg');
  background-repeat: no-repeat;
  background-position: center;
}
```

## Exemplo 4: Shorthand com dois valores

```css
/* X = right, Y = bottom */
body {
  background-image: url('imagem.jpg');
  background-repeat: no-repeat;
  background-position: right bottom;
}

/* X = center, Y = top */
body {
  background-image: url('imagem.jpg');
  background-repeat: no-repeat;
  background-position: center top;
}
```

## Exemplo 5: Background-size com valores fixos

```css
body {
  background-image: url('imagem.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 200px; /* tamanho fixo */
}
```

## Exemplo 6: Background-size com porcentagem

```css
body {
  background-image: url('imagem.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100%; /* 100% do espaço disponível */
}
```

## Exemplo 7: Contain — adapta ao espaço sem cortar

```css
body {
  background-image: url('imagem.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
}
```

## Exemplo 8: Cover — cobre todo o espaço

```css
body {
  background-image: url('imagem.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
```

## Variação: Hero section completa (padrão de produção)

```css
.hero {
  background-image: url('/images/hero.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  min-height: 100vh;
}
```

## Variação: Logo centralizado como background

```css
.logo-section {
  background-image: url('/images/logo.svg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  width: 200px;
  height: 80px;
}
```

## Variação: Imagem decorativa no canto

```css
.decorated-section {
  background-image: url('/images/decoration.png');
  background-repeat: no-repeat;
  background-position: right bottom;
  background-size: 150px;
  padding-bottom: 160px; /* espaço para a decoração */
}
```