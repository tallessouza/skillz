# Code Examples: CSS Background com Imagens

## Exemplo 1: Propriedades separadas (passo a passo da aula)

```css
/* Passo 1: Adicionar a imagem */
body {
  background-image: url(./assets/bg-mobile.png);
}
/* Resultado: imagem aparece mas REPETE em tiles */

/* Passo 2: Remover repeticao */
body {
  background-image: url(./assets/bg-mobile.png);
  background-repeat: no-repeat;
}
/* Resultado: imagem nao repete, mas fica no canto superior esquerdo */

/* Passo 3: Centralizar */
body {
  background-image: url(./assets/bg-mobile.png);
  background-repeat: no-repeat;
  background-position: center;
}
/* Resultado: centraliza em ambos eixos — pode nao ser ideal */

/* Passo 4: Posicionar com eixos explicitos */
body {
  background-image: url(./assets/bg-mobile.png);
  background-repeat: no-repeat;
  background-position: top center;
}
/* Resultado: Y=top, X=center — imagem comeca do topo, centralizada */

/* Passo 5: Cobrir toda area visivel */
body {
  background-image: url(./assets/bg-mobile.png);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
}
/* Resultado: imagem preenche toda a tela, sem espacos em branco */
```

## Exemplo 2: Shorthand final (resultado da aula)

```css
body {
  /* ordem: image repeat position / size */
  background: url(./assets/bg-mobile.png) no-repeat top center / cover;
}
```

## Exemplo 3: Shorthand com cor de fallback

```css
body {
  /* cor aparece enquanto imagem carrega ou se falhar */
  background: #121214 url(./assets/bg-mobile.png) no-repeat top center / cover;
}
```

## Exemplo 4: Contain vs Cover

```css
/* Cover — preenche tudo, pode cortar bordas */
.hero {
  background: url(./assets/hero.jpg) no-repeat center center / cover;
}

/* Contain — mostra imagem inteira, pode ter espacos */
.logo-area {
  width: 200px;
  height: 200px;
  background: url(./assets/logo.png) no-repeat center center / contain;
}
```

## Exemplo 5: Posicionamentos variados

```css
/* Imagem no topo centralizada (usado na aula) */
background-position: top center;

/* Imagem no centro absoluto */
background-position: center center;

/* Imagem no canto inferior direito */
background-position: bottom right;

/* Posicao com valores numericos */
background-position: 50% 20%;

/* Offset a partir de uma borda */
background-position: right 10px top 20px;
```

## Exemplo 6: Estrategia responsiva (mencionada na aula)

```css
/* Mobile first */
body {
  background: url(./assets/bg-mobile.png) no-repeat top center / cover;
}

/* Desktop — troca a imagem */
@media (min-width: 768px) {
  body {
    background: url(./assets/bg-desktop.png) no-repeat top center / cover;
  }
}
```

## Exemplo 7: Comentarios para estudo (recomendado pelo instrutor)

```css
body {
  /* shorthand: color image repeat position / size */
  background: url(./assets/bg-mobile.png) no-repeat top center / cover;

  /* equivalente a:
  background-image: url(./assets/bg-mobile.png);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  */
}
```