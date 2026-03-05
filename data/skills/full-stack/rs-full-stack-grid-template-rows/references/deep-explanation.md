# Deep Explanation: Grid Template Rows

## Principio fundamental: altura e diferente de largura no CSS

O instrutor enfatiza um ponto critico que muitos iniciantes ignoram: **largura e automaticamente 100% do pai (block elements), mas altura e automatica (baseada no conteudo)**. Isso significa que `grid-template-columns` com `fr` funciona "de graca" porque o container ja tem largura definida. Mas `grid-template-rows` com `fr` ou `%` precisa de uma altura explicita no container, caso contrario o navegador nao tem referencia para calcular as fracoes.

### Analogia: o Grid como uma moldura

Imagine o grid como uma moldura de quadro. As colunas sao como divisorias verticais — a moldura ja tem largura, entao voce pode dividir. Mas as linhas sao divisorias horizontais — se a moldura nao tem altura definida, ela "encolhe" para caber so o conteudo, e as fracoes perdem sentido.

## Rows nao definidas sao automaticas

Quando voce define `grid-template-rows: 200px 50%` mas tem 4 filhos, as linhas 3 e 4 recebem altura automatica (baseada no conteudo). O CSS Grid e inteligente o suficiente para criar linhas implicitas. Voce so precisa definir explicitamente as linhas que quer controlar.

## O combo columns + rows

O instrutor mostra que o verdadeiro poder aparece quando voce combina `grid-template-columns` e `grid-template-rows` juntos. Isso cria uma "grade" completa onde voce controla tanto a largura quanto a altura de cada celula. Exemplo: `repeat(3, 1fr)` em ambos cria um grid 3x3 perfeitamente simetrico.

## Visualizacao no DevTools

O instrutor recomenda usar F12 > inspecionar o elemento grid para ver as linhas numeradas (1, 2, 3, 4) que o navegador cria. Essas linhas sao a base para o proximo passo: posicionar elementos com `grid-row` e `grid-column`.

## O que vem depois

O grid-template-rows e grid-template-columns definem apenas o "molde" (template) do grid — o container pai. Os filhos por padrao preenchem sequencialmente. O proximo passo e usar propriedades nos filhos (`grid-row`, `grid-column`) para posiciona-los em celulas especificas, fazendo um elemento ocupar multiplas linhas ou colunas.

## Propriedades alem do basico

O instrutor menciona que alem de `repeat()`, existem funcoes como `minmax()` e muitas outras. O importante e dominar os fundamentos (px, fr, %, repeat) antes de explorar funcoes avancadas. CSS Grid tem profundidade enorme — nao tente aprender tudo de uma vez.

## Margens padrao do body

O overflow que aparece ao usar `height: 100vh` no grid e causado pelas margens padrao do `<body>` e `<html>`. A solucao e o reset: `body { margin: 0 }`. Isso e um padrao necessario para qualquer layout full-viewport.