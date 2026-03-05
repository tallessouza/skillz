# Deep Explanation: Grafico BoxPlot — Exercicio Pratico

## Raciocinio do Instrutor

### Por que a ordem importa tanto?

O instrutor enfatiza que a **primeira coisa** a fazer com qualquer conjunto de dados e organizar em ordem crescente (o "roll"). Isso nao e opcional — quartis sao medidas de **posicao**, entao sem ordenacao, as posicoes nao fazem sentido.

### O erro classico dos limites

O instrutor antecipa um erro comum dos alunos: olhar para os dados (0 a 100) e imediatamente assumir que o limite inferior e 0 e o superior e 100. Ele corrige isso enfaticamente:

> "Rodolfo, o meu limite inferior vai ser 0 e o meu limite superior vai ser 100. Nao, ja vimos isso na ultima aula que eu nao posso determinar isso sem antes fazer a conta."

A licao e: os limites do boxplot NAO sao os extremos dos dados. Sao calculados a partir da AIQ. So depois de calcular e que voce compara com os dados reais.

### A logica do 1.5x AIQ

O fator 1.5 define o que e "normal" vs "discrepante". Uma caixa e meia para cada lado:
- 1 caixa (AIQ) = a dispersao central dos dados
- Meia caixa extra = margem de tolerancia

O instrutor explica de forma intuitiva: "Se o tamanho da minha caixa e 30, uma caixa e meia para frente. Uma caixa daria mais 30, mais metade de uma caixa, mais 15. Entao, 45 para frente."

### Quando o limite calculado excede os dados

No exercicio, o limite superior calculado e 125, mas o maior dado e 100. Nesse caso, o bigode do boxplot para em 100 (o maior dado dentro dos limites). O mesmo principio se aplica ao limite inferior: calculado como 5, mas o dado 0 esta abaixo disso, entao 0 vira outlier e o bigode para no 5 (ou no proximo dado >= 5).

### Outliers como "valores discrepantes"

O instrutor define outliers como valores que estao "para fora dos meus limites" — sao marcados como pontos isolados no grafico. No exercicio, apenas o valor 0 e outlier (abaixo do limite inferior de 5). Nenhum valor esta acima do limite superior de 125.

### Conexao com aulas anteriores

O instrutor reforça que o boxplot e uma integracao de conceitos ja vistos:
- **Mediana** (aula de medidas de posicao)
- **Quartis** (Q1, Q2, Q3)
- **Amplitude interquartil** (medida de dispersao)

O boxplot e a representacao visual que unifica todos esses conceitos.

## Nomenclaturas importantes

- **Roll** = dados organizados em ordem crescente
- **Q2 = Mediana** = divide dados em 50% menor e 50% maior
- **Q1** = mediana da metade inferior
- **Q3** = mediana da metade superior
- **AIQ** = Q3 - Q1 (tamanho da caixa)
- **Outlier** = valor fora dos limites (discrepante)