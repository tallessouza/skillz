# Code Examples: CSS Transition Timing Function

## Exemplo 1: Comparando todas as timing functions

```css
/* Setup base do instrutor */
.element {
  transition-duration: 200ms;
  /* transition-delay comentado para nao interferir */
}

/* Linear — velocidade constante */
.element-linear {
  transition-timing-function: linear;
}

/* Ease — curva padrao do browser */
.element-ease {
  transition-timing-function: ease;
}

/* Ease-in — comeca devagar, termina rapido */
.element-ease-in {
  transition-timing-function: ease-in;
}

/* Ease-out — comeca rapido, termina devagar */
.element-ease-out {
  transition-timing-function: ease-out;
}

/* Ease-in-out — suave nos dois extremos */
.element-ease-in-out {
  transition-timing-function: ease-in-out;
}
```

## Exemplo 2: Cubic-bezier customizado

```css
/* Curva personalizada copiada de cubicbezier.com */
.element {
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Equivalentes dos atalhos em cubic-bezier */
.linear    { transition-timing-function: cubic-bezier(0, 0, 1, 1); }
.ease      { transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1); }
.ease-in   { transition-timing-function: cubic-bezier(0.42, 0, 1, 1); }
.ease-out  { transition-timing-function: cubic-bezier(0, 0, 0.58, 1); }
.ease-in-out { transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1); }
```

## Exemplo 3: Steps

```css
/* 2 passos — um, dois, chegou */
.element-2steps {
  transition-timing-function: steps(2);
}

/* 5 passos — um, dois, tres, quatro, cinco */
.element-5steps {
  transition-timing-function: steps(5);
}
```

## Exemplo 4: Steps com acessibilidade

```css
.sprite-animation {
  transition-timing-function: steps(5);
  transition-duration: 0.5s;
}

/* Respeitar preferencia do usuario */
@media (prefers-reduced-motion: reduce) {
  .sprite-animation {
    transition-timing-function: ease-out;
    transition-duration: 0.01ms;
  }
}
```

## Exemplo 5: Aplicacao pratica — card hover

```css
.card {
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

## Exemplo 6: Bounce effect com cubic-bezier

```css
/* Y ultrapassa 1 = overshoot (bounce) */
.bounce-button {
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.bounce-button:hover {
  transform: scale(1.1);
}
```

## Exemplo 7: Usando DevTools para editar curvas

O instrutor demonstra no Chrome DevTools:
1. Inspecionar o elemento animado
2. Na aba **Styles**, localizar `transition-timing-function`
3. Clicar no icone da curva (pequeno quadrado ao lado do valor)
4. Editor visual abre com presets: FastOut, LinearIn, EasyOut, OutSine, OutQuadratic, OutCubic
5. Arrastar os pontos de controle gera automaticamente o valor `cubic-bezier()`
6. Qualquer curva customizada vira `cubic-bezier()` automaticamente

## Exemplo 8: Shorthand completo

```css
/* transition: property duration timing-function delay */
.element {
  transition: opacity 0.3s ease-in-out 0s;
}

/* Multiplas propriedades com timings diferentes */
.element {
  transition:
    transform 0.3s ease-out,
    opacity 0.2s linear,
    background-color 0.5s ease-in-out;
}
```