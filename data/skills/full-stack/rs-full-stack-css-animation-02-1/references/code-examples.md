# Code Examples: CSS Animation — Propriedades Avançadas

## 1. Direction — todas as variações

```css
@keyframes move {
  from { transform: translateX(0); }
  to { transform: translateX(400px); }
}

/* Normal: esquerda → direita */
.box-normal {
  animation: move 1s both;
  animation-direction: normal;
}

/* Reverse: direita → esquerda */
.box-reverse {
  animation: move 1s both;
  animation-direction: reverse;
}

/* Alternate: esquerda → direita → esquerda... */
.box-alternate {
  animation: move 1s both infinite;
  animation-direction: alternate;
}

/* Alternate-reverse: direita → esquerda → direita... */
.box-alt-reverse {
  animation: move 1s both infinite;
  animation-direction: alternate-reverse;
}
```

## 2. Fill Mode — comparação visual

```css
/* Sem fill-mode: elemento "pula" */
.no-fill {
  animation: move 1s;
  animation-direction: reverse;
  /* Começa na posição CSS, pula para 400px, anima até 0 */
}

/* Com forwards: mantém estado final */
.with-forwards {
  animation: move 1s forwards;
}

/* Com backwards: aplica primeiro keyframe durante delay */
.with-backwards {
  animation: move 1s backwards;
  animation-delay: 2s;
  /* Durante os 2s de delay, já está na posição do from */
}

/* Com both: cobre tudo */
.with-both {
  animation: move 1s both;
  animation-direction: reverse;
  /* Sem pulo no início, mantém posição no fim */
}
```

## 3. Iteration Count + Alternate

```css
/* 2 iterações com alternate: ida e volta */
.two-alternate {
  animation: move 1s both;
  animation-direction: alternate;
  animation-iteration-count: 2;
  /* Vai (1) e volta (2) */
}

/* 3 iterações com alternate: ida, volta, ida */
.three-alternate {
  animation: move 1s both;
  animation-direction: alternate;
  animation-iteration-count: 3;
  /* Vai (1), volta (2), vai (3) */
}

/* Infinito com alternate */
.infinite-alternate {
  animation: move 1s both infinite alternate;
  /* Vai e volta para sempre */
}
```

## 4. Play State como trigger

```css
/* Animação roda normalmente */
.animated-box {
  animation: move 1s both infinite alternate ease;
}

/* Pausa no hover */
.animated-box:hover {
  animation-play-state: paused;
}
```

### Variação: iniciar pausado e rodar no hover

```css
.start-paused {
  animation: move 1s both infinite alternate ease;
  animation-play-state: paused;
}

.start-paused:hover {
  animation-play-state: running;
}
```

## 5. Timing Functions — comparação

```css
.box-linear     { animation: move 1s linear both; }
.box-ease       { animation: move 1s ease both; }       /* padrão */
.box-ease-in    { animation: move 1s ease-in both; }
.box-ease-out   { animation: move 1s ease-out both; }
.box-ease-inout { animation: move 1s ease-in-out both; }
.box-bezier     { animation: move 1s cubic-bezier(.17,.67,.83,.67) both; }
```

## 6. Shorthand — construção progressiva

```css
/* Passo 1: nome + duração */
animation: move 200ms;

/* Passo 2: + fill-mode (elimina pulo) */
animation: move 200ms both;

/* Passo 3: + infinite (repete) */
animation: move 200ms both infinite;

/* Passo 4: + delay (1s antes de começar) */
animation: move 200ms both infinite 1s;

/* Passo 5: + alternate (vai e volta) */
animation: move 200ms both infinite 1s alternate;

/* Passo 6: + timing function */
animation: move 200ms both infinite 1s alternate ease;
```

## 7. Múltiplas animações

```css
@keyframes move {
  from { transform: translateX(0); }
  to { transform: translateX(400px); }
}

@keyframes fade {
  50% { opacity: 0; }
}

/* Duas animações simultâneas com controles independentes */
.multi {
  animation:
    move 200ms both infinite alternate ease,
    fade 100ms both 10;
  /* move: vai e volta para sempre */
  /* fade: pisca 10 vezes e para */
}
```

### Variação: fade como aquecimento + move contínuo

```css
.warmup-then-move {
  animation:
    move 1s both infinite alternate ease,
    fade 200ms both 5;
  /* 5 piscadas rápidas como "aquecimento" enquanto move roda */
}
```

## 8. Exemplo completo — todas as propriedades separadas

```css
.full-control {
  animation-name: move;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-fill-mode: both;
  animation-play-state: running;
}

/* Equivalente em shorthand: */
.full-control-short {
  animation: move 1s ease 0s infinite alternate both running;
}
```