# Code Examples: Style Guide com Variáveis CSS

## Exemplo base da aula — Definição completa de variáveis

```css
:root {
  /* Brand */
  --brand-color: #5271FF;

  /* Text */
  --text-color-primary: #1A1A2E;
  --text-color-secondary: #ABABAB;

  /* Background */
  --bg-color-primary: #0F0F1A;
  --bg-color-secondary: #1C1C2E;

  /* Shapes */
  --shape-color: #2C2C3E;
  --shape-transparency: #FFFFFF8F; /* branco 56% opacidade */
}
```

## Exemplo da aula — Aplicando no body

```css
body {
  background-color: var(--bg-color-primary);
  color: var(--text-color-secondary);
}
```

O instrutor escolheu `--text-color-secondary` porque, ao analisar o Figma, percebeu que "essa mais clarinha está sendo usada em todos os lugares".

## Variação: Tema claro

```css
:root {
  --brand-color: #5271FF;
  --text-color-primary: #1A1A2E;
  --text-color-secondary: #6B6B80;
  --bg-color-primary: #FFFFFF;
  --bg-color-secondary: #F5F5FA;
  --shape-color: #E8E8F0;
  --shape-transparency: #0000001A; /* preto 10% opacidade */
}
```

Apenas mudando o `:root`, todo o projeto muda de tema escuro para claro.

## Variação: Múltiplos componentes usando variáveis

```css
.header {
  background-color: var(--bg-color-secondary);
  color: var(--text-color-primary);
}

.card {
  background-color: var(--shape-color);
  border: 1px solid var(--shape-transparency);
}

.button {
  background-color: var(--brand-color);
  color: #FFFFFF;
}

.link {
  color: var(--brand-color);
}

.subtitle {
  color: var(--text-color-secondary);
}
```

## Variação: Transparência em diferentes opacidades

```css
:root {
  --overlay-light: #FFFFFF33;    /* branco 20% */
  --overlay-medium: #FFFFFF80;   /* branco 50% */
  --overlay-heavy: #FFFFFFCC;   /* branco 80% */
  --shadow-light: #0000001A;    /* preto 10% */
  --shadow-medium: #00000066;   /* preto 40% */
}
```

## Usando var() com fallback

```css
.element {
  /* Se a variável não existir, usa o fallback */
  color: var(--text-color-accent, #5271FF);
}
```

## Estrutura de arquivos recomendada

```
projeto/
├── assets/          ← exportados do Figma
│   ├── logo.svg
│   ├── icon-home.svg
│   └── avatar.png
├── index.html
└── style.css        ← :root com variáveis aqui
```

## HTML mínimo para teste (como na aula)

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Travelgram</title>
</head>
<body>
  <p>Lorem ipsum dolor sit amet</p>
</body>
</html>
```

O instrutor usou um `<p>` com lorem ipsum apenas para testar visualmente se as variáveis de cor estavam funcionando corretamente no Live Server.