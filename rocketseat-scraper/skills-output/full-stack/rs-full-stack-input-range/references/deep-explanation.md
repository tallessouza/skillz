# Deep Explanation: Input Range

## O que e o input range

O input type="range" e um controle HTML nativo para selecao de valor numerico. Visualmente, ele renderiza como um **slider** (barra deslizante). O instrutor destaca que e "muito semelhante ao input number, so que com um controle diferente" — a diferenca e puramente de interface, ambos lidam com valores numericos.

## Comportamento padrao

Sem atributos adicionais, o range opera de **0 a 100** com step de 1. O valor inicial (sem `value` definido) e o ponto medio do range: `(min + max) / 2`. Isso significa que um range 0-100 sem value comeca em 50.

## Atributos fundamentais

### min e max
Definem os limites do slider. O instrutor demonstra mudando para `min="20" max="200"`, mostrando que qualquer faixa numerica e possivel.

### step
Controla a granularidade — o "passo" entre valores. Com `step="20"` e range 0-200, os valores possiveis sao: 0, 20, 40, 60... 200. O instrutor destaca visualmente como o slider "vai pulando" entre os valores, nao permitindo selecionar intermediarios.

### value
Define o valor inicial (padrao). Sem ele, o browser usa o ponto medio. O instrutor demonstra: `value="200"` faz o slider comecar no maximo, `value="0"` no minimo, `value="40"` um pouco acima do inicio.

## Analogia com input number

O instrutor faz a conexao direta: range e number compartilham os mesmos atributos (min, max, step, value). A unica diferenca e o controle visual — slider vs campo numerico. Isso significa que tudo que se aplica a validacao numerica de number tambem se aplica a range.

## Envio de dados no form

O valor selecionado e enviado como par name=value no submit do formulario. O instrutor demonstra submetendo o form e mostrando o valor na URL (GET): `?total=79`, `?total=100`, `?total=0`. Sem `name`, o valor nao seria enviado.