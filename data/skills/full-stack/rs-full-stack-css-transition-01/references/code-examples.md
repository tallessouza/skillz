# Code Examples: CSS Transitions

## Setup base usado na aula

```html
<div></div>

<style>
  body {
    background-color: mediumpurple;
  }

  div {
    background-color: white;
    width: 4rem;
    height: 4rem;
    opacity: 0.6;
  }
</style>
```

## Exemplo 1: Transicao de opacidade apenas

```css
div {
  background-color: white;
  width: 4rem;
  height: 4rem;
  opacity: 0.6;
  transition-property: opacity;
  transition-duration: 1s;
}

div:hover {
  opacity: 1;
}
```

**Comportamento:** Ao passar o mouse, opacidade vai de 0.6 a 1 em 1 segundo. Ao tirar o mouse, volta de 1 a 0.6 em 1 segundo.

## Exemplo 2: Duas propriedades com duracoes diferentes

```css
div {
  background-color: white;
  width: 4rem;
  height: 4rem;
  opacity: 0.6;
  transition-property: opacity, transform;
  transition-duration: 1s, 200ms;
}

div:hover {
  opacity: 1;
  transform: translateX(20px);
}
```

**Comportamento:** O transform (movimento horizontal) completa em 200ms (rapido), enquanto a opacidade leva 1 segundo (devagar). Cria um efeito onde o elemento "pula" para a posicao e depois gradualmente fica mais visivel.

## Exemplo 3: Com delay uniforme

```css
div {
  transition-property: opacity, transform;
  transition-duration: 1s, 200ms;
  transition-delay: 1s;
}

div:hover {
  opacity: 1;
  transform: translateX(20px);
}
```

**Comportamento:** Ao passar o mouse, nada acontece por 1 segundo. Depois de 1 segundo, ambas as transicoes iniciam. Ao tirar o mouse, espera 1 segundo e depois volta.

## Exemplo 4: Com delays diferentes por propriedade

```css
div {
  transition-property: opacity, transform;
  transition-duration: 1s, 200ms;
  transition-delay: 1s, 10ms;
}

div:hover {
  opacity: 1;
  transform: translateX(20px);
}
```

**Comportamento:** O transform inicia quase imediatamente (10ms), enquanto a opacidade espera 1 segundo. Cria um efeito sequencial: primeiro move, depois aparece.

## Exemplo 5: Usando `all` (nao recomendado para producao)

```css
div {
  transition-property: all;
  transition-duration: 1s;
}

div:hover {
  opacity: 1;
  transform: translateX(20px);
}
```

**Comportamento:** Funciona, mas aplica a mesma duracao a todas as propriedades e pode causar problemas de performance.

## Variacoes praticas

### Hover com mudanca de cor e escala

```css
.button {
  background-color: #3b82f6;
  color: white;
  transition-property: background-color, transform;
  transition-duration: 300ms, 150ms;
}

.button:hover {
  background-color: #2563eb;
  transform: scale(1.05);
}
```

### Card com elevacao no hover

```css
.card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition-property: box-shadow, transform;
  transition-duration: 200ms;
}

.card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}
```

### Fade-in com delay intencional

```css
.tooltip {
  opacity: 0;
  transition-property: opacity;
  transition-duration: 200ms;
  transition-delay: 500ms; /* espera meio segundo antes de mostrar */
}

.trigger:hover .tooltip {
  opacity: 1;
}
```