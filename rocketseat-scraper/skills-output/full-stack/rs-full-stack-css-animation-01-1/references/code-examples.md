# Code Examples: CSS Animations com @keyframes

## Exemplo 1: Setup basico do botao

```html
<button>Faladev</button>
```

```css
button {
  background-color: hotpink;
  color: white;
  width: 200px;
  height: 50px;
  border: none;
  border-radius: 8px;
}
```

## Exemplo 2: Animacao simples com from/to

```css
@keyframes move {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(300px);
  }
}

button {
  animation-name: move;
  animation-duration: 1s;
}
```

**Comportamento:** O botao desce 300px em 1 segundo e depois volta ao estado original.

## Exemplo 3: Omitindo o from (estado padrao)

```css
@keyframes move {
  100% {
    transform: translateY(300px);
  }
}

button {
  animation-name: move;
  animation-duration: 1s;
}
```

**Comportamento:** Identico ao exemplo 2 — o browser usa translateY(0) como ponto de partida porque e o padrao.

## Exemplo 4: Ponto intermediario unico (50%)

```css
@keyframes move {
  50% {
    transform: translateY(300px);
  }
}

button {
  animation-name: move;
  animation-duration: 1s;
}
```

**Comportamento:** Em 500ms o botao chega a 300px, nos proximos 500ms volta a 0. Efeito de ida-e-volta.

## Exemplo 5: Dois pontos com retorno (50%, 100%)

```css
@keyframes move {
  50% {
    transform: translateY(300px);
  }
  100% {
    transform: translateY(300px);
  }
}

button {
  animation-name: move;
  animation-duration: 1s;
}
```

**Comportamento:** Em 500ms chega a 300px, fica parado la dos 50% aos 100%, depois volta ao estado original.

## Exemplo 6: Bounce com multiplas porcentagens

```css
@keyframes bounce {
  25% { transform: translateY(300px); }
  30% { transform: translateY(0); }
  50% { transform: translateY(300px); }
  60% { transform: translateY(0); }
}

button {
  animation-name: bounce;
  animation-duration: 1s;
}
```

**Comportamento detalhado:**
- 0%→25% (0ms→250ms): desce de 0 a 300px
- 25%→30% (250ms→300ms): sobe de 300px a 0
- 30%→50% (300ms→500ms): desce de 0 a 300px
- 50%→60% (500ms→600ms): sobe de 300px a 0
- 60%→100% (600ms→1000ms): fica em 0 (estado padrao)

Resultado visual: duas "picadinhas" rapidas.

## Exemplo 7: animation-delay

```css
@keyframes slide {
  100% {
    transform: translateX(300px);
  }
}

button {
  animation-name: slide;
  animation-duration: 1s;
  animation-delay: 1s;
}
```

**Comportamento:** Espera 1 segundo, depois desliza para a direita em 1 segundo, volta ao inicio.

## Exemplo 8: fill-mode backwards

```css
@keyframes slide {
  0% {
    background-color: blue;
  }
  100% {
    transform: translateX(300px);
  }
}

button {
  animation-name: slide;
  animation-duration: 1s;
  animation-delay: 5s;
  animation-fill-mode: backwards;
}
```

**Comportamento:** O botao fica azul IMEDIATAMENTE (puxou do 0%), espera 5s, anima o translate em 1s, depois volta a cor original e posicao original.

## Exemplo 9: fill-mode forwards

```css
@keyframes slide {
  100% {
    transform: translateX(300px);
  }
}

button {
  animation-name: slide;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
```

**Comportamento:** Desliza para 300px em 1s e FICA la permanentemente.

## Exemplo 10: fill-mode both

```css
@keyframes slide {
  0% {
    background-color: blue;
  }
  100% {
    transform: translateX(300px);
  }
}

button {
  animation-name: slide;
  animation-duration: 1s;
  animation-delay: 200ms;
  animation-fill-mode: both;
}
```

**Comportamento:** Botao fica azul imediatamente (backwards), espera 200ms, anima translate + transiciona cor em 1s, fica na posicao final de 300px (forwards). A cor volta ao original porque o 100% nao define background-color.

## Exemplo 11: both com cor persistente

```css
@keyframes slide {
  0% {
    background-color: blue;
  }
  100% {
    transform: translateX(300px);
    background-color: blue;
  }
}

button {
  animation-name: slide;
  animation-duration: 1s;
  animation-fill-mode: both;
}
```

**Comportamento:** Botao fica azul o tempo inteiro — tanto antes (backwards) quanto depois (forwards) da animacao, porque ambos os extremos definem blue.

## Variacoes praticas

### Fade-in com delay seguro

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.card {
  animation-name: fadeIn;
  animation-duration: 300ms;
  animation-delay: 500ms;
  animation-fill-mode: both;
  /* both: invisivel durante o delay (backwards), visivel apos animar (forwards) */
}
```

### Slide-in da esquerda e fica

```css
@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.panel {
  animation-name: slideIn;
  animation-duration: 400ms;
  animation-fill-mode: both;
}
```

### Shake (multiplas porcentagens)

```css
@keyframes shake {
  10% { transform: translateX(-10px); }
  20% { transform: translateX(10px); }
  30% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  50% { transform: translateX(0); }
}

.error-input {
  animation-name: shake;
  animation-duration: 500ms;
}
```