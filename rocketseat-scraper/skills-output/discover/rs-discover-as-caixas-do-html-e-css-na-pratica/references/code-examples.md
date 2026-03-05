# Code Examples: As Caixas do HTML e CSS

## Exemplo 1: Estrutura HTML basica com container

O ponto de partida do projeto DevLinks:

```html
<!DOCTYPE html>
<html>
<head>
  <title>DevLinks</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="container">
  </div>
</body>
</html>
```

A div esta vazia e **nao aparece na tela** sem estilos.

## Exemplo 2: Tornando o container visivel com borda

```css
#container {
  border: 1px solid;
}
```

Resultado: uma linha fina aparece ao redor do container, mas como nao ha conteudo nem dimensoes definidas, a caixa tem altura zero (ou minima).

## Exemplo 3: Definindo dimensoes fixas

```css
#container {
  width: 360px;
  height: 712px;
  border: 1px solid;
}
```

Resultado: uma caixa visivel de 360px de largura por 712px de altura. Esses valores correspondem a um layout mobile tipico.

## Exemplo 4: Estrutura completa com caixas aninhadas

```html
<div id="container">
  <div id="profile">
    <div id="avatar">
      <img src="avatar.png" alt="Foto de perfil">
    </div>
    <div id="name">
      <p>Mayk Brito</p>
    </div>
  </div>

  <div id="switch">
    <!-- toggle de tema -->
  </div>

  <div id="social-links">
    <a href="#">GitHub</a>
    <a href="#">LinkedIn</a>
    <a href="#">Twitter</a>
    <a href="#">YouTube</a>
  </div>

  <footer>
    <p>Feito com amor</p>
  </footer>
</div>
```

## Exemplo 5: Variacoes de ID (evitando duplicatas)

```html
<!-- ERRADO: IDs duplicados -->
<div id="container">Primeiro</div>
<div id="container">Segundo</div>

<!-- CORRETO: IDs unicos -->
<div id="container-1">Primeiro</div>
<div id="container-2">Segundo</div>

<!-- ALTERNATIVA: usar class quando sao similares -->
<div class="container">Primeiro</div>
<div class="container">Segundo</div>
```

## Exemplo 6: Propriedade border com tres valores

```css
#container {
  /* border: largura estilo cor */
  border: 1px solid black;

  /* Variações: */
  border: 2px dashed red;     /* tracejada vermelha */
  border: 3px dotted blue;    /* pontilhada azul */
  border: 1px solid;          /* cor herda do texto */
}
```

## Exemplo 7: Processo mental — lendo um mockup

```
Passo 1: Identificar a caixa mais externa
  → "container" (engloba tudo)

Passo 2: Identificar caixas de primeiro nivel
  → profile, switch, social-links, footer

Passo 3: Identificar sub-caixas
  → profile contem: avatar, name
  → social-links contem: link, link, link, link

Passo 4: Escrever HTML de fora para dentro
  → container > profile > avatar + name
  → container > switch
  → container > social-links > links
  → container > footer
```