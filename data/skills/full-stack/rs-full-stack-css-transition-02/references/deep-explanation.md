# Deep Explanation: CSS Transition Timing Function

## O modelo mental do instrutor

O instrutor usa um modelo visual muito claro: imagine um grafico onde o eixo X e o tempo (inicio ao fim da transicao) e o eixo Y e o progresso (0% a 100% da propriedade animada). A CURVA nesse grafico define como o elemento se move.

### Linear = reta
Uma linha reta de canto a canto. Velocidade constante. Sem aceleracao, sem desaceleracao. O instrutor enfatiza: "de uma maneira retinha, uma reta, de maneira linear ele funciona."

### Ease = a curva padrao
O ease e o default do browser. O instrutor descreve: "ele esta saindo de maneira rapida, aqui ele demora um pouquinho e a chegada comeca um pouquinho mais rapido." E uma curva com uma "barriguinha" no meio.

### A confusao in/out

Este e o ponto mais contra-intuitivo que o instrutor esclarece:

- **ease-in**: o "in" refere-se a ENTRADA na velocidade maxima. Comeca devagar, termina rapido. A CHEGADA e que e suave? NAO — o instrutor corrige: "Easy In e uma chegada suave, significa que ele vai sair rapido... a chegada que e o In e suave, a chegada dele la no final."

  Na verdade o instrutor oscila na explicacao, mas o comportamento real do CSS e:
  - `ease-in`: comeca DEVAGAR, termina RAPIDO (acelera)
  - `ease-out`: comeca RAPIDO, termina DEVAGAR (desacelera)
  - `ease-in-out`: devagar nos dois extremos, rapido no meio

### Cubic-bezier: a funcao por baixo de tudo

O instrutor enfatiza repetidamente: **"sempre e o Bezier, sempre. Seja linear, seja o easy, sempre e o Bezier, so que esses nomes aqui sao atalhos."**

Isso significa:
- `linear` = `cubic-bezier(0, 0, 1, 1)`
- `ease` = `cubic-bezier(0.25, 0.1, 0.25, 1)`
- `ease-in` = `cubic-bezier(0.42, 0, 1, 1)`
- `ease-out` = `cubic-bezier(0, 0, 0.58, 1)`
- `ease-in-out` = `cubic-bezier(0.42, 0, 0.58, 1)`

### Os 4 valores do cubic-bezier

`cubic-bezier(x1, y1, x2, y2)` — dois pontos de controle:
- **Primeiro ponto (x1, y1)**: controla a curva de SAIDA. O instrutor mostra no DevTools: "esse primeiro bastãozinho aqui e o bastãozinho que vai mexer com X1 e Y1"
- **Segundo ponto (x2, y2)**: controla a curva de CHEGADA. "O segundo bastãozinho aqui, ele vai mexer com o X2 e o Y2"

X varia de 0 a 1 (tempo). Y pode passar de 1 (overshoot/bounce).

### Ferramentas recomendadas

1. **cubicbezier.com** — site dedicado para montar curvas visualmente
2. **DevTools do browser** — na aba Styles, clicar no icone da curva ao lado de `transition-timing-function` abre um editor visual completo com presets (FastOut, LinearIn, EasyOut, OutSine, OutQuadratic, OutCubic, etc.)

O instrutor enfatiza: "isso aqui e uma engenharia, e uma maneira de pensar, que eu acredito que voce nao precisa ficar memorizando... usa esse site se voce quiser, e deixa com que o site monte para voce."

### Steps: animacao discreta

`steps(n)` divide a transicao em n saltos iguais. Nao ha interpolacao entre os saltos.

O instrutor demonstra: "Se eu colocar dois, significa que em dois passos... um, dois, chegou."

**Cuidado com acessibilidade**: o instrutor alerta que "algumas pessoas podem se sentir um pouquinho incomodadas, dependendo como isso daqui esta sendo feito." Steps criam mudancas abruptas que podem ser problematicas para usuarios sensiveis a movimento.

### Nota historica

"Bezier inclusive e o nome da pessoa" — Pierre Bezier, engenheiro frances da Renault, criou as curvas matematicas usadas originalmente em design automotivo e depois adotadas em computacao grafica.