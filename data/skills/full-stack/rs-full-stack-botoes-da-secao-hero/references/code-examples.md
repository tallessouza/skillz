# Code Examples: Botões Interativos da Seção Hero

## HTML completo da estrutura

```html
<div class="buttons">
  <a class="button button-buy shadow" href="#">
    Comprar agora
    <img src="./assets/icons/shopping-bag.svg" alt="Ícone sacola" />
  </a>
  <a class="button button-play" href="#">
    <span class="shadow">
      <img src="./assets/icons/play.svg" alt="Ícone play" />
    </span>
    Veja em Ação
  </a>
</div>
```

## CSS completo passo a passo

### Container dos botões

```css
.buttons {
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
}
```

### Estilo base de cada botão

```css
.button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 5rem;
  transition: scale 350ms;
}
```

### Botão "Comprar" (buy)

```css
.button.button-buy {
  padding: 1.5rem 3rem;
  background-color: var(--any-tap-sun);
}
```

Nota: `.button.button-buy` sem espaço — seleciona elemento com ambas as classes.

### Botão "Play" — span circular

```css
.button.button-play span {
  display: flex;
  padding: 1.5rem;
  border-radius: 50%;
  background-color: white;
}
```

### Classe utilitária de sombra

```css
.shadow {
  box-shadow:
    0 2px 5px rgb(0 0 0 / 0.1),
    0 9px 9px rgb(0 0 0 / 0.09),
    0 0.5px 20px rgb(0 0 0 / 0.05),
    0 1px 15px rgb(0 0 0 / 0.01);
}
```

### Hover com escala

```css
.button:hover {
  scale: 1.1;
}
```

## Variação: fallback para browsers antigos

```css
.button {
  transition: transform 350ms;
}
.button:hover {
  transform: scale(1.1);
}
```

## Variação: sombra mais sutil (2 camadas)

```css
.shadow-light {
  box-shadow:
    0 1px 3px rgb(0 0 0 / 0.08),
    0 4px 12px rgb(0 0 0 / 0.04);
}
```

## Variação: sombra colorida (baseada na cor do botão)

```css
.shadow-colored {
  box-shadow:
    0 2px 5px rgb(255 165 0 / 0.2),
    0 8px 15px rgb(255 165 0 / 0.1);
}
```

## Variação: múltiplos efeitos no hover

```css
.button {
  transition: scale 350ms, box-shadow 350ms;
}
.button:hover {
  scale: 1.05;
  box-shadow:
    0 4px 8px rgb(0 0 0 / 0.15),
    0 12px 20px rgb(0 0 0 / 0.1);
}
```

## Box-shadow — anatomia dos valores

```
box-shadow: [offset-x] [offset-y] [blur-radius] [color];

Exemplo detalhado:
  0        — offset-x (sem deslocamento horizontal)
  2px      — offset-y (2px para baixo)
  5px      — blur-radius (suavização de 5px)
  rgb(0 0 0 / 0.1) — cor preta com 10% opacidade
```

## Padrão completo reutilizável

```css
/* Container */
.hero-buttons {
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
}

/* Base */
.hero-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 5rem;
  text-decoration: none;
  color: inherit;
  transition: scale 350ms;
}

/* Primário */
.hero-btn--primary {
  padding: 1.5rem 3rem;
  background-color: var(--color-primary);
}

/* Ícone circular */
.hero-btn__icon {
  display: flex;
  padding: 1.5rem;
  border-radius: 50%;
  background-color: white;
}

/* Sombra reutilizável */
.shadow {
  box-shadow:
    0 2px 5px rgb(0 0 0 / 0.1),
    0 9px 9px rgb(0 0 0 / 0.09),
    0 0.5px 20px rgb(0 0 0 / 0.05),
    0 1px 15px rgb(0 0 0 / 0.01);
}

/* Hover */
.hero-btn:hover {
  scale: 1.1;
}
```