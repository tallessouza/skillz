# Deep Explanation: CSS Animation Range

## Mental model — deslocamento do fundo

O `animation-range` trabalha com a ideia de **deslocamento do bottom da viewport**. Quando voce diz `animation-range-start: 10px`, esta dizendo: "comece a animacao quando o elemento estiver a 10 pixels do fundo da viewport". Isso e contra-intuitivo no inicio, mas faz sentido quando voce pensa que elementos entram pela parte de baixo da tela ao scrollar.

## Keywords em profundidade

### Cover (padrao implicito)

Cover e o comportamento que parece ser o padrao do `view()`. Assim que qualquer parte do elemento aparece na viewport, a animacao ja comeca. So termina quando o elemento sai completamente. E o mais "generoso" — comeca cedo, termina tarde.

### Contain (mais restritivo)

Contain exige que o elemento esteja **completamente** dentro da viewport. Se qualquer pedaco sair dos limites, nao conta mais. Isso significa:
- A animacao so comeca quando a borda inferior do elemento ja esta visivel (o elemento inteiro apareceu)
- A animacao termina assim que a borda superior comeca a sair pelo topo

Util para elementos que precisam estar totalmente visiveis para fazer sentido (graficos, dados, imagens importantes).

### Entry (mais intuitivo para a maioria dos casos)

Entry trabalha apenas com o momento de entrada:
- Inicia: elemento comeca a entrar na viewport (borda superior aparece no bottom)
- Finaliza: elemento terminou de entrar (borda inferior ja esta visivel)

Na pratica, o efeito e: o elemento anima enquanto esta "nascendo" na tela. Depois que apareceu inteiro, a animacao ja completou. O instrutor considera esta a mais intuitiva de todas.

### Exit (estranho sozinho, poderoso combinado)

Exit sozinho parece estranho porque a animacao so acontece quando o elemento esta saindo — o usuario ja viu o elemento parado e de repente ele anima ao sair. Parece "bugado".

A solucao e **nunca usar Exit sozinho**. Combine com Entry:
- Animacao 1: `entry` com keyframe de entrada (fade in, slide up)
- Animacao 2: `exit` com keyframe de saida (scale up + fade out)

Isso cria uma experiencia completa: o elemento entra com efeito, fica visivel normalmente, e sai com outro efeito.

## Shorthand — como interpretar

O shorthand `animation-range` muda de comportamento conforme o numero de valores:

### 1 keyword apenas
```css
animation-range: entry;  /* Inicio e fim controlados pela keyword */
```

### 1 valor numerico apenas
```css
animation-range: 100px;
/* Padrao e cover, entao: inicia a 100px do bottom, finaliza ao sair da tela */
```

### Keyword + valor
```css
animation-range: contain 100px;
/* Elemento precisa estar inteiro na tela E a 100px do bottom para iniciar */
```

### 2 valores numericos
```css
animation-range: 100px 200px;
/* Inicia a 100px do bottom, finaliza a 200px do bottom */
/* A "janela" de animacao e entre esses dois pontos de deslocamento */
```

## Edge case importante

Se o elemento nao tem scroll suficiente para completar o range definido, a animacao **nao termina**. Exemplo: se voce define `animation-range: contain` e o ultimo elemento da pagina nao tem scroll suficiente para sair da viewport, a animacao dele fica incompleta.

## Combinando multiplas animacoes

Quando usa `animation-range: entry, exit`, o valor apos a virgula corresponde a **segunda animacao** listada em `animation`. Nao e "entry E exit para a mesma animacao" — sao duas animacoes independentes, cada uma com seu range.

```css
animation: fade linear both, out linear both;
/*         ^primeira              ^segunda         */
animation-timeline: view(), view();
/*                  ^primeira ^segunda             */
animation-range: entry, exit;
/*               ^primeira ^segunda                */
```

## Suporte do navegador

Esta feature ainda esta em fase experimental. O instrutor menciona que "no dia que isso estiver 100%, vou amar" — indicando que o suporte ainda nao e completo em todos os navegadores. Verifique caniuse.com antes de usar em producao.