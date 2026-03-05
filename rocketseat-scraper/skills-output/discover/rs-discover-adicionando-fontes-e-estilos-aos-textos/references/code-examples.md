# Code Examples: Fontes e Estilos de Texto com CSS

## Exemplo 1: Importacao da fonte Inter no HTML

Conforme demonstrado na aula, o `<link>` do Google Fonts vai no `<head>`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <!-- Google Fonts - importar ANTES do charset -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Profile</title>
</head>
<body>
  <div class="profile">
    <p>@MikeBrito</p>
  </div>
</body>
</html>
```

## Exemplo 2: CSS global com seletor universal

```css
/* Aplica fonte e cor para TODOS os elementos */
body * {
  font-family: 'Inter', sans-serif;
  color: #FFFFFF;
}
```

## Exemplo 3: Estilizacao do texto do profile

```css
.profile p {
  font-weight: 500;    /* Medium - um pouco mais pesado que regular (400) */
  font-size: 16px;     /* Padrao do navegador, pode omitir */
  line-height: 24px;   /* Proporcao 1.5x do font-size para legibilidade */
}
```

## Exemplo 4: Variacao — Multiplos textos com pesos diferentes

Baseado na aula, o instrutor mostra que o design tinha textos com peso 400 e 500:

```css
/* Texto principal do profile */
.profile-name {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}

/* Texto secundario (descricao, bio) */
.profile-bio {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
```

## Exemplo 5: O que NAO fazer — fixar dimensoes no texto

```css
/* ERRADO - nao fixe width/height em textos */
.profile p {
  width: 200px;
  height: 50px;
  font-weight: 500;
}

/* CORRETO - deixe o texto fluir naturalmente */
.profile p {
  font-weight: 500;
  line-height: 24px;
}
```

## Exemplo 6: Fluxo completo do Figma ao codigo

O instrutor demonstra o fluxo:

1. **No Figma** — Inspect mostra:
   - Font: Inter
   - Weight: 500
   - Size: 16px
   - Line Height: 24px
   - Color: #FFFFFF

2. **No Google Fonts** — Buscar "Inter", selecionar pesos 400 e 500, copiar `<link>`

3. **No HTML** — Colar `<link>` no `<head>`

4. **No CSS** — Traduzir propriedades:

```css
body * {
  font-family: 'Inter', sans-serif;
  color: #FFFFFF;
}

.profile p {
  font-weight: 500;
  /* font-size: 16px; — omitido pois e o padrao */
  line-height: 24px;
}
```

## Exemplo 7: Importando apenas pesos necessarios

```html
<!-- ERRADO - importa TODOS os pesos (pesado, lento) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<!-- CORRETO - importa apenas 400 e 500 que o design usa -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
```