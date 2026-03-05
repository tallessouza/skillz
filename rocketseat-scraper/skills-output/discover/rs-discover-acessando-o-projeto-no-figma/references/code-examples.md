# Code Examples: Extraindo Informacoes do Figma para CSS

## Exemplo 1: Extraindo cores do Style Guide

No Figma, ao clicar em um retangulo de cor no Style Guide, voce ve no painel direito algo como:
```
Fill: #835AFD
```

Traduzindo para CSS:
```css
:root {
  --color-primary: #835AFD;
  --color-background: #121214;
  --color-text: #E1E1E6;
  --color-surface: #202024;
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
}
```

## Exemplo 2: Extraindo fontes

No Figma, ao clicar em um texto, o painel direito mostra:
```
Font: Inter
Weight: Regular (400)
Size: 16px
Line height: 160%
```

Traduzindo para CSS:
```css
/* Importar a fonte no HTML */
/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet"> */

body {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 160%; /* ou 1.6 */
}
```

## Exemplo 3: Extraindo espacamentos com Alt

Ao selecionar um botao e segurar Alt, voce ve que a distancia ate o elemento acima e 24px e o padding interno e 16px horizontal e 12px vertical.

```css
.button {
  padding: 12px 16px;
  margin-top: 24px;
}
```

## Exemplo 4: Extraindo border-radius

No Figma, ao selecionar um card, o painel direito mostra:
```
Corner radius: 8
```

```css
.card {
  border-radius: 8px;
}
```

## Exemplo 5: Projeto DevLinks — Estrutura basica

Com base no layout do Figma, a estrutura HTML resultante seria algo como:

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevLinks</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="container">
    <header>
      <img src="avatar.png" alt="Foto de perfil">
      <h1>@maykbrito</h1>
    </header>
    <ul>
      <li><a href="#">Link 1</a></li>
      <li><a href="#">Link 2</a></li>
      <li><a href="#">Link 3</a></li>
    </ul>
    <footer>
      <!-- social icons -->
    </footer>
  </div>
</body>
</html>
```

## Fluxo completo: Figma → CSS

```
1. Abrir Style Guide
   └─ Anotar: cores (#hex), fontes (family + weight), tamanhos base

2. Selecionar frame/componente principal
   └─ Ler: width, height, background-color, border-radius

3. Selecionar elementos internos
   └─ Para cada: cor, fonte, tamanho do texto

4. Medir espacamentos (Alt)
   └─ Entre elementos: margin ou gap
   └─ Dentro do elemento: padding

5. Escrever CSS com as propriedades extraidas
```