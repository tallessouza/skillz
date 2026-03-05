# Deep Explanation: Medidas de Posicao (Separatrizes)

## Contexto no curriculo de estatistica

O instrutor Rodolfo posiciona as medidas de posicao como o terceiro pilar da estatistica descritiva:

1. **Medidas de tendencia central** — media, moda, mediana (ja estudadas)
2. **Medidas de dispersao** — variancia, desvio padrao, amplitude, maximo, minimo (ja estudadas)
3. **Medidas de posicao (separatrizes)** — mediana (revisitada), quartis, decis, percentis

## A mediana como ponte entre conceitos

O insight principal do instrutor e que a mediana ja foi estudada como medida de tendencia central, mas ela tambem e uma medida de posicao. Isso cria uma ponte conceitual importante: o aluno ja sabe calcular a mediana, e agora vai entender que ela e o caso mais simples de uma familia inteira de medidas.

A logica e: "voce pega todos os seus dados, que representam 100%, e divide ao meio. 50% esta abaixo ou igual, 50% esta acima ou igual." Essa mesma logica se estende para quartis (4 partes), decis (10 partes) e percentis (100 partes).

## Por que "separatrizes"?

O nome alternativo "separatrizes" vem exatamente da funcao: esses valores **separam** os dados em partes. Nao resumem (como a media), nao medem espalhamento (como a variancia). Eles cortam o dataset em fatias.

## Progressao didatica planejada

O instrutor indica que o modulo vai focar em:
- **Quartis** — divisao em 4 partes (mais usado na pratica: box plots, IQR)
- **Percentis** — divisao em 100 partes (usado em benchmarks, SLAs, analises de performance)

Decis sao mencionados mas nao recebem foco especial, pois sao menos comuns na pratica.

## Relacao entre as medidas

Todas as separatrizes sao equivalentes entre si em diferentes granularidades:
- Mediana = Q2 = D5 = P50
- Q1 = P25 = D2.5
- Q3 = P75 = D7.5

Isso significa que dominar o calculo de percentis automaticamente da acesso a todas as outras medidas de posicao.