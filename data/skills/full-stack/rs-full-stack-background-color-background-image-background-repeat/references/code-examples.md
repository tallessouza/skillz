# Code Examples: Background Color, Background Image, Background Repeat

## Exemplo 1: Cor de fundo no body

```css
body {
  background-color: coral;
}
```

A cor cobre toda a página porque o body ocupa o viewport inteiro.

## Exemplo 2: Cor de fundo com RGB

```css
body {
  background-color: rgb(30, 30, 60);
}
```

Mesmo resultado, formato diferente. Escolha o formato padrão do projeto.

## Exemplo 3: Cor de fundo numa div com dimensões

```html
<div class="box"></div>
```

```css
.box {
  width: 200px;
  height: 200px;
  background-color: coral;
}
```

A cor fica contida nos 200x200 pixels da div.

## Exemplo 4: Imagem de fundo (repetindo por padrão)

```css
.box {
  width: 200px;
  height: 200px;
  background-image: url("https://example.com/pattern.png");
}
```

Se a imagem for menor que 200x200, ela repete automaticamente para preencher o espaço.

## Exemplo 5: Imagem de fundo sem repetição

```css
.box {
  width: 200px;
  height: 200px;
  background-image: url("https://example.com/logo.png");
  background-repeat: no-repeat;
}
```

A imagem aparece uma única vez, posicionada no canto superior esquerdo por padrão.

## Exemplo 6: Repetição apenas horizontal

```css
.divider {
  width: 100%;
  height: 20px;
  background-image: url("dash.png");
  background-repeat: repeat-x;
}
```

Útil para criar bordas decorativas ou separadores.

## Exemplo 7: Repetição apenas vertical

```css
.sidebar-decoration {
  width: 30px;
  height: 100%;
  background-image: url("stripe.png");
  background-repeat: repeat-y;
}
```

## Exemplo 8: Background no body com imagem externa

```css
body {
  background-image: url("https://images.unsplash.com/photo-example");
  background-repeat: no-repeat;
}
```

A imagem aparece uma vez no canto superior esquerdo do body. Para cobrir toda a tela, seria necessário `background-size: cover` (conteúdo avançado).

## Variações de sintaxe para url()

```css
/* Todas válidas */
background-image: url(image.png);
background-image: url("image.png");
background-image: url('image.png');

/* URL externa */
background-image: url("https://cdn.example.com/bg.jpg");

/* Caminho relativo local */
background-image: url("../images/bg.jpg");
```