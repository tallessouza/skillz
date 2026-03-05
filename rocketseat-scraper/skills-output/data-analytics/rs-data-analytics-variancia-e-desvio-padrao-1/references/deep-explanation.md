# Deep Explanation: Variância e Desvio Padrão

## Definição central

O desvio padrão mostra **o quanto, em média, os valores se afastam do centro (da média)**. É uma média de distanciamento da média.

## Por que a média sozinha engana

O instrutor usa o exemplo de um patrão com 3 lojas. Ele diz: "se a média do faturamento estiver acima de 50%, estou contente". As lojas têm:
- Loja A: 10% (quase fechando, "corda no pescoço")
- Loja B: 100% (voando)
- Loja C: 70% (perfeita, "cinco estrelas")

Média: (10 + 100 + 70) / 3 = 60%. Acima de 50%, o patrão ficaria satisfeito. Mas a Loja A está morrendo! Um bom analista não confia só na média.

## Por que elevar ao quadrado — a explicação detalhada

Quando calculamos as diferenças para a média:
- 10 - 60 = **-50**
- 100 - 60 = **40**
- 70 - 60 = **10**

Se tentarmos fazer a média dessas diferenças: 40 + 10 = 50, e 50 - 50 = 0. **Zera!** Não conseguimos calcular média nenhuma.

A solução: elevar ao quadrado. O instrutor faz uma pausa para explicar matemática básica:
- 3² = 3 × 3 = 9 (não é 3 × 2!)
- (-3)² = (-3) × (-3) = +9 (menos × menos = mais)

Elevar ao quadrado **sempre resulta em positivo**, porque multiplicação de sinais iguais dá positivo. Em estatística, ficou definido que sempre elevamos ao quadrado para garantir valores positivos.

## Por que tirar a raiz no final

Ao elevar ao quadrado, distorcemos a unidade de medida. Tínhamos valores como 10, 70, 100 e agora temos 1.400 — "um valor muito fora do que eu tinha". A raiz quadrada é a operação inversa: se 2² = 4, então √4 = 2. Tirando a raiz, "voltamos para números mais familiares".

## Relação variância × desvio padrão

- **Variância** = média dos quadrados das diferenças (etapa intermediária)
- **Desvio padrão** = raiz quadrada da variância (resultado final)
- Fórmula: `desvio_padrão = √variância`

## Interpretação do resultado

No exemplo: desvio padrão ≈ 37%. Isso significa que, em média, os valores se distanciam 37 pontos percentuais da média de 60%. Quanto maior o desvio padrão, mais distante os dados estão da média, e menos confiável ela é como representação do conjunto.

## Conexão com amplitude

A amplitude (aula anterior) era apenas a diferença entre o maior e o menor valor — uma medida simples. O desvio padrão é mais sofisticado: calcula uma **média de distanciamento**, considerando todos os valores, não apenas os extremos.