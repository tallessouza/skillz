# Deep Explanation: CSS Animation — Propriedades Avançadas

## O modelo mental da linha do tempo

A animação CSS é uma **linha do tempo linear**: vai do keyframe 0% ao 100%. Todas as propriedades avançadas manipulam COMO essa timeline é percorrida.

### Direction — invertendo a timeline

- `normal`: 0% → 100% (padrão)
- `reverse`: 100% → 0% — a animação começa do estado final e vai ao inicial
- `alternate`: 0% → 100% → 0% → 100%... — alterna ida e volta a cada iteração
- `alternate-reverse`: 100% → 0% → 100%... — alternate começando do fim

**Insight do instrutor:** quando você usa `reverse`, o conceito de "início" e "fim" se inverte. Isso afeta diretamente qual fill-mode faz sentido. Se antes `forwards` mantinha o estado final, com `reverse` o "final" é o 0%. Isso gera confusão mental — por isso a recomendação de usar `both` como padrão seguro.

### Fill Mode — o que acontece FORA da timeline

O fill-mode controla o estado do elemento **antes** da animação começar e **depois** dela terminar:

- `none` (padrão): elemento volta ao estado CSS normal fora da animação
- `forwards`: mantém o estado do último keyframe após terminar
- `backwards`: aplica o estado do primeiro keyframe durante o delay (antes de começar)
- `both`: aplica backwards + forwards — cobre início E fim

**Analogia do instrutor:** imagine que a animação é um trem. `forwards` diz "fique na estação de destino". `backwards` diz "vá para a estação de partida antes do trem sair". `both` diz "faça os dois".

**O "pulo" visual:** sem fill-mode, o elemento está na posição CSS normal, depois "pula" para o primeiro keyframe quando a animação inicia, e "pula" de volta quando termina. `both` elimina ambos os pulos.

### A confusão reverse + fill-mode

Com `direction: reverse`:
- O "primeiro keyframe aplicado" agora é o 100% (porque a timeline está invertida)
- `backwards` vai aplicar o estado do 100% durante o delay
- `forwards` vai manter o estado do 0% após terminar

Isso é contra-intuitivo. O instrutor enfatiza: **use `both` e não pense nisso**. É a abordagem pragmática.

### Iteration Count — repetições

- Número inteiro: `2`, `3`, `10` — executa N vezes
- `infinite` — nunca para
- Funciona em conjunto com `alternate`: com count 3 e alternate, são 3 percursos da timeline (ida, volta, ida)

### Play State — controle externo

- `running` (padrão): animação ativa
- `paused`: congela no frame atual

**Insight crítico do instrutor:** colocar `paused` diretamente no elemento base não faz sentido — a animação nunca vai rodar. Play-state só faz sentido como resposta a um **trigger** (hover, click, scroll, classe JS).

**Ideia de jogo do instrutor:** com `infinite alternate` e `play-state: paused` no hover, o usuário pode "pegar" o elemento em diferentes posições — como um mini-jogo de timing.

### Timing Function — curva de aceleração

Controla a **velocidade ao longo do tempo**:

- `linear`: velocidade constante (mecânico)
- `ease` (padrão): início lento, meio rápido, fim lento (natural)
- `ease-in`: começa lento, acelera
- `ease-out`: começa rápido, desacelera
- `ease-in-out`: lento nas pontas, rápido no meio
- `cubic-bezier(x1, y1, x2, y2)`: curva personalizada

**Observação do instrutor:** o editor de código pode sugerir valores de cubic-bezier. É válido experimentar — pequenas mudanças na curva mudam significativamente a "sensação" da animação.

### Shorthand — a ordem importa (mais ou menos)

```css
animation: name duration timing-function delay iteration-count direction fill-mode play-state;
```

Na prática, a ordem é flexível para a maioria dos valores (o browser identifica pelo tipo). A exceção: **duration deve vir antes de delay** quando ambos são especificados, porque são ambos valores de tempo.

**Abordagem do instrutor:** construir incrementalmente. Comece com `animation: move 200ms`, teste, adicione `both`, teste, adicione `infinite`, teste. Isso evita debugar 8 valores de uma vez.

### Múltiplas animações — composição

Separe animações por vírgula. Cada uma opera independentemente:

```css
animation:
  move 200ms both infinite alternate ease,
  fade 100ms both 10;
```

Cada animação tem seu próprio ciclo de vida, count, direction, etc. Elas rodam **simultaneamente** no mesmo elemento.

**Exemplo do instrutor:** combinar um `move` infinito com um `fade` que pisca 10 vezes — o fade funciona como "aquecimento" enquanto o move continua indefinidamente.

## As 8 propriedades de animation

1. `animation-name` — qual @keyframes usar
2. `animation-duration` — quanto tempo dura um ciclo
3. `animation-timing-function` — curva de aceleração
4. `animation-delay` — tempo antes de iniciar
5. `animation-iteration-count` — quantas vezes repete
6. `animation-direction` — direção da timeline
7. `animation-fill-mode` — estado fora da timeline
8. `animation-play-state` — running ou paused