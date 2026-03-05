# Code Examples: Funções de Cores no CSS

## RGB — Exemplos básicos

```css
/* Vermelho puro */
color: rgb(255, 0, 0);

/* Vermelho com um pouco de verde e azul (tom da aula) */
color: rgb(255, 40, 60);

/* Branco */
color: rgb(255, 255, 255);

/* Preto */
color: rgb(0, 0, 0);

/* RGB com alpha (sintaxe moderna) */
color: rgb(255 40 60 / 0.5);

/* RGB com alpha (sintaxe legacy — ainda funciona) */
color: rgba(255, 40, 60, 0.5);
```

## HSL — Exemplos básicos

```css
/* Vermelho puro */
color: hsl(0, 100%, 50%);

/* Roxinho que o instrutor mostrou */
color: hsl(270, 80%, 50%);

/* Azul totalmente saturado */
color: hsl(240, 100%, 50%);

/* Cinza (saturação 0) */
color: hsl(0, 0%, 50%);

/* Preto (luminosidade 0) */
color: hsl(0, 0%, 0%);

/* Branco (luminosidade 100%) */
color: hsl(0, 0%, 100%);

/* HSL com alpha */
color: hsl(270 80% 50% / 0.5);
```

## Hexadecimal com alpha

```css
/* Hex padrão (6 dígitos) */
color: #ff2840;

/* Hex com alpha (8 dígitos — últimos 2 = alpha) */
color: #ff284080; /* ~50% opacidade */
color: #ff2840cc; /* ~80% opacidade */
color: #ff2840ff; /* 100% opacidade (opaco) */
```

## Color Mix — Mescla de cores

```css
/* Exemplo da aula: vermelho + amarelo = laranja */
background-color: color-mix(in hsl, hsl(0, 100%, 50%), hsl(60, 100%, 50%));

/* Mescla com proporções */
background-color: color-mix(in hsl, hsl(0, 100%, 50%) 30%, hsl(60, 100%, 50%) 70%);
/* 30% vermelho + 70% amarelo = amarelo-alaranjado */

/* Hover state: clarear a cor primária */
.button:hover {
  background-color: color-mix(in hsl, var(--primary), white 20%);
}

/* Escurecer para active state */
.button:active {
  background-color: color-mix(in hsl, var(--primary), black 20%);
}

/* Mescla em sRGB (resultado diferente de HSL) */
background-color: color-mix(in srgb, red, blue);
```

## Aplicação em diferentes propriedades

```css
.card {
  /* Cor do texto */
  color: hsl(220, 15%, 20%);

  /* Background com leve transparência */
  background-color: hsl(220 20% 98% / 0.95);

  /* Borda */
  border: 1px solid hsl(220 15% 85%);

  /* Sombra com cor e alpha */
  box-shadow: 0 2px 8px hsl(220 40% 20% / 0.1);
}
```

## Variações com CSS Custom Properties + HSL

```css
:root {
  --hue-primary: 220;
  --primary: hsl(var(--hue-primary), 80%, 50%);
  --primary-light: hsl(var(--hue-primary), 80%, 70%);
  --primary-dark: hsl(var(--hue-primary), 80%, 30%);
  --primary-muted: hsl(var(--hue-primary), 30%, 50%);
}

/* Mudar o tema inteiro alterando só o hue */
[data-theme="warm"] {
  --hue-primary: 15; /* laranja */
}

[data-theme="cool"] {
  --hue-primary: 200; /* azul claro */
}
```

## Comparação: mesma cor em diferentes notações

```css
/* Todos representam a mesma cor */
color: #e63946;
color: rgb(230, 57, 70);
color: hsl(355, 78%, 56%);

/* Com 50% de opacidade */
color: #e6394680;
color: rgb(230 57 70 / 0.5);
color: hsl(355 78% 56% / 0.5);
```