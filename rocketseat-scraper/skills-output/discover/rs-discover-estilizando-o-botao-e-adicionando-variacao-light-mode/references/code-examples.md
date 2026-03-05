# Code Examples: Estilizando Botao de Toggle com Light/Dark Mode

## Exemplo 1: HTML do switch

```html
<div class="switch">
  <button></button>
</div>
```

O botao nao tem conteudo textual — o icone e puramente visual via CSS.

## Exemplo 2: CSS completo do botao (evolucao passo a passo)

### Passo 1 — Dimensoes e forma

```css
.switch button {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
}
```

### Passo 2 — Background image (problema: repete)

```css
.switch button {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background-image: url('./assets/moon-stars.svg');
}
/* O SVG vai repetir preenchendo todo o botao */
```

### Passo 3 — Corrigindo repeticao e posicao

```css
.switch button {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: white url('./assets/moon-stars.svg') no-repeat center;
}
```

### Passo 4 — Usando variavel para troca de tema

```css
:root {
  --switch-bg-url: url('./assets/moon-stars.svg');
}

.light {
  --switch-bg-url: url('./assets/sun.svg');
}

.switch button {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: white var(--switch-bg-url) no-repeat center;
}
```

## Exemplo 3: Arquivo SVG (sun.svg)

Extraido do prototipo Figma via Copy/Paste SVG:

```svg
<!-- assets/sun.svg -->
<svg>...</svg>
```

O instrutor navega no Figma clicando ate isolar o icone do sol, copia como SVG, e salva em `assets/sun.svg`.

## Exemplo 4: Variacao com tamanhos diferentes

```css
/* Botao maior (48px) — border-radius 50% continua funcionando */
.switch button {
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 50%;
  background: white var(--switch-bg-url) no-repeat center;
}
```

## Exemplo 5: Teste rapido de troca de tema

Para testar sem JavaScript, basta adicionar/remover a classe `.light` no elemento pai:

```html
<!-- Dark mode (padrao) — mostra moon-stars -->
<body>
  <div class="switch"><button></button></div>
</body>

<!-- Light mode — mostra sun -->
<body class="light">
  <div class="switch"><button></button></div>
</body>
```

## Exemplo 6: Organizacao CSS por secoes

```css
/* ============================== */
/* PROFILE                        */
/* ============================== */
#container .profile { ... }

/* ============================== */
/* SWITCH                         */
/* ============================== */
.switch button {
  width: 32px;
  height: 32px;
  background: white var(--switch-bg-url) no-repeat center;
  border: 0;
  border-radius: 50%;
}

/* ============================== */
/* SOCIAL LINKS                   */
/* ============================== */
.social-links { ... }
```