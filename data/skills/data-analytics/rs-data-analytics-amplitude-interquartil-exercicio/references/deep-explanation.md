# Deep Explanation: Amplitude Interquartil — Exercicio

## O que e um grafico de pontos

O instrutor destaca que o grafico de pontos pode causar estranheza inicial. E uma representacao onde o eixo X mostra os valores possiveis e cada ponto (bolinha) acima de um valor representa uma ocorrencia daquele valor no conjunto de dados.

Nem todo valor no eixo X tem ocorrencias — valores sem pontos simplesmente nao fazem parte do conjunto. No exemplo, 6, 11 e 13 estao no eixo mas nao tem pontos, entao nao entram no conjunto de dados.

## Por que contar os elementos primeiro

O instrutor enfatiza a importancia de contar os dados antes de calcular: "Para saber se eu vou ter logo um valor mediano de cara ou se vou precisar fazer a media entre os dois centrais."

- **Par (10 elementos no exemplo):** nao existe um numero central unico, precisa fazer media dos dois centrais
- **Impar (5 elementos em cada metade):** o valor central esta "logo ali disponivel", sem precisar calcular media

## Logica de divisao em metades

Com 10 elementos, o instrutor divide visualmente: "5 numeros para um lado, 5 numeros para o outro." Essa divisao clara ajuda a visualizar que:

1. Nao existe um numero central (quantidade par)
2. A mediana fica "entre" os dois valores centrais
3. Cada metade tem 5 elementos (impar), entao Q1 e Q3 sao valores diretos: "dois para um lado, dois para o outro e voce vai ter o terceiro numero"

## Raciocinio do instrutor sobre Q1

"Como eu tenho 5 numeros, o que eu vou ter? Uma quantidade impar. Entao, o meu valor mediano desses 50%, o meu Q1, vai estar logo ali disponivel."

Metade inferior: 7, 8, **8**, 9, 10 → Q1 = 8 (terceiro valor, com dois de cada lado)

## Raciocinio sobre Q3

Mesma logica aplicada a metade superior: 10, 10, **12**, 12, 14 → Q3 = 12

O instrutor reforça que quando a metade tem quantidade impar, o calculo e direto, "sem precisar calcular a media dos dois centrais."

## Resultado final

IQR = Q3 - Q1 = 12 - 8 = 4

O instrutor nota que e "bem simples" e que o exercicio mostra como calcular a amplitude interquartil a partir de uma representacao visual diferente (grafico de pontos), nao apenas de um conjunto numerico dado diretamente.