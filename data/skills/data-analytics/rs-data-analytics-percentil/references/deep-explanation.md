# Deep Explanation: Percentil

## Relação entre medidas de posição

O instrutor enfatiza a família de medidas de posição como divisões progressivas do conjunto de dados:

- **Quartil**: divide em 4 partes (Q1, Q2, Q3)
- **Decil**: divide em 10 partes (D1 a D9)
- **Percentil**: divide em 100 partes (P1 a P99)

A insight chave é que todas usam a **mesma fórmula**. A única coisa que muda é o valor de K:
- Q1 → K = 1/4 = 25/100
- D3 → K = 3/10 = 30/100
- P20 → K = 20/100

Isso significa que P25 = Q1, P50 = Mediana = Q2, P75 = Q3. São nomes diferentes para a mesma operação matemática.

## Por que converter porcentagem em fração

O instrutor mostra que 20% equivale a 20/100, e essa fração é o K da fórmula. A simplificação aritmética (cortar zeros) facilita o cálculo manual: 20/100 × 40 simplifica cortando os zeros para 2 × 4 = 8.

## Interpretação do resultado

O instrutor enfatiza: o resultado do percentil é um **limiar**, não uma contagem. P20 = 165 não significa "8 pessoas têm 165". Significa que **20% dos pesquisados têm valores abaixo de 165**, considerando que os dados estão organizados em ordem crescente.

## Analogia visual do instrutor

O instrutor descreve o percentil como pegar toda a pesquisa e dividir com "tracinhos" em 100 pedaços. Cada pedacinho é um percentil (P1, P2, ..., P99, P100). É como uma régua de 100 marcações sobre a distribuição dos dados.

## Localização da classe

O passo crítico é achar a posição (K × Σf) e depois procurar na frequência acumulada qual classe contém essa posição. No exemplo:
- Posição 8
- Acumulada até a primeira classe: 7 (não contém 8)
- Acumulada até a segunda classe: 11 (contém 8, pois 8 ≤ 11)
- Portanto, a classe do P20 é a segunda classe (164 |— 168)

## Fórmula detalhada

```
P_k = LI + ((Posição - F_ant) / f_i) × h
```

Cada componente tem um papel:
- `LI`: ponto de partida — onde a classe começa
- `Posição - F_ant`: quantas posições "dentro" da classe precisamos avançar
- `f_i`: total de elementos na classe (normaliza o avanço)
- `h`: amplitude da classe (converte proporção em unidades reais)

A fração `(Posição - F_ant) / f_i` é a proporção de "avanço" dentro da classe. Multiplicada pela amplitude, dá o deslocamento real a partir do LI.