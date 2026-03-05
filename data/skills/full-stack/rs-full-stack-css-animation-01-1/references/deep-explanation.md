# Deep Explanation: CSS Animations com @keyframes

## Modelo mental: Linha do tempo

A animacao CSS nao e "mover um elemento" — e uma **linha do tempo com propriedades em pontos especificos**. O instrutor enfatiza: "Pensa sempre nessa linha do tempo. Existe um inicio e existe um fim."

Isso muda como voce pensa sobre animacoes:
- Voce nao esta "movendo um botao para baixo"
- Voce esta dizendo: "aos 0% da timeline, translateY e 0; aos 100%, translateY e 300px; a duracao total e 1s"

O browser interpola os valores entre os pontos que voce definiu.

## Dois passos fundamentais

1. **Criar a timeline** — `@keyframes nome { ... }` (a "at rule" de keyframes)
2. **Usar a timeline** — `animation-name` + `animation-duration` no elemento

Sem esses dois passos, nada acontece. O keyframe sozinho e inerte. O animation-name sem keyframe correspondente e ignorado silenciosamente.

## from/to vs porcentagens

`from` e `to` sao aliases semanticos:
- `from` = `0%`
- `to` = `100%`

A vantagem das porcentagens e permitir **pontos intermediarios**. O instrutor demonstra isso com um efeito de "bounce":
- Aos 25%, o elemento vai a 300px (desce)
- Aos 30%, volta a 0 (sobe)
- Aos 50%, vai a 300px de novo (desce)
- Aos 60%, volta a 0 (sobe)

Resultado: duas "picadinhas" — o elemento desce e sobe duas vezes na primeira metade da animacao, depois fica parado.

### Regra importante sobre lacunas na timeline

Se voce define algo nos 60% mas nao define nada dos 60% aos 100%, o elemento **volta ao estado padrao** durante esse intervalo. O browser interpola do ultimo ponto definido de volta ao estado inicial. O instrutor explica: "Eu nao preciso avisar para ele ficar dos 60% ate os 100%, porque ele ja vai entender isso."

## Omitir o ponto de partida

Se o estado inicial do elemento ja corresponde ao que voce colocaria no `from` ou `0%`, voce pode omiti-lo. O browser usa o estado computado atual como ponto de partida.

Exemplo: se o elemento ja tem `transform: translateY(0)` por padrao, nao precisa declarar `from { transform: translateY(0) }`.

## animation-delay

O delay **so afeta o inicio**. O instrutor e explicito: "O delay e so para o inicio, tempo de inicio." Apos a animacao completar, ela termina imediatamente — o delay nao cria uma pausa no final.

## animation-fill-mode — O conceito mais sutil

Este e o ponto onde o instrutor mais investiu tempo explicando, usando a analogia de "puxar propriedades fisicamente".

### backwards
"Vai pegar o primeiro frame, a primeira ideia, a primeira tela, o primeiro inicio da sua timeline, vai puxar as propriedades que tem aqui."

**Funcao:** Antes da animacao iniciar (durante o delay), aplica as propriedades do `0%`/`from` no elemento.

**Caso de uso critico:** Se voce tem `0% { background-color: blue }` e um delay de 5s, sem `backwards` o elemento fica com a cor original durante os 5s. Com `backwards`, ele ja aparece azul desde o inicio.

### forwards
"Pega tudo que tem no final e mantem."

**Funcao:** Apos a animacao completar, mantem as propriedades do `100%`/`to` no elemento em vez de voltar ao estado original.

**Caso de uso critico:** `translateX(300px)` no final — sem `forwards`, o elemento volta ao inicio. Com `forwards`, fica nos 300px.

### both
Combina `backwards` + `forwards`:
- Puxa propriedades iniciais da timeline antes do inicio
- Mantem propriedades finais apos completar

### Analogia do instrutor
"Imagina que fisicamente ele vai tirar daqui [da timeline] e colocar aqui [no elemento]." — O fill-mode e como se voce estivesse transplantando as propriedades dos extremos da timeline para fora dela.

## Cuidado com transicoes dentro do fill-mode

O instrutor demonstra um caso sutil: se voce usa `both` com `0% { background-color: blue }` mas no `100%` nao mantem o blue, o `backwards` aplica blue antes do inicio, mas durante a animacao a cor transiciona normalmente para o que esta definido no `100%`. O `both` nao "congela" o azul — ele apenas puxa o inicio e mantem o fim.

Se voce quer que o blue persista, precisa declarar `background-color: blue` tambem no `100%`.