# Deep Explanation: Quartil para Dados Agrupados em Intervalos

## Recapitulacao conceitual

Quartil vem de "quantil de quatro partes". A ideia fundamental e dividir 100% dos dados em 4 partes iguais de 25% cada:

- **Q1** = 25% dos dados (1/4 do total)
- **Q2** = 50% dos dados (mediana, 1/2 do total)
- **Q3** = 75% dos dados (3/4 do total)

O instrutor enfatiza que Q1 e "uma mediana da metade inferior" e Q3 e "uma mediana da metade superior". Q2 e a propria mediana.

## Por que a formula existe

Quando os dados estao agrupados em intervalos (classes), voce nao tem acesso aos valores individuais. Voce sabe que 7 pessoas tem entre 160cm e 164cm, mas nao sabe os valores exatos. A formula de interpolacao estima onde dentro do intervalo o quartil cai, assumindo distribuicao uniforme dentro da classe.

## Logica da posicao (K * ΣFi)

O instrutor faz uma analogia com a mediana simples: "quando eu tinha la a minha mediana, 1, 2, 3, 4, 5 — o 3 esta na terceira posicao". Da mesma forma, K * ΣFi encontra em que "posicao" da distribuicao acumulada o quartil se encontra.

- Para Q1: 1/4 * 40 = 10 → o decimo elemento
- Para Q2: 1/2 * 40 = 20 → o vigesimo elemento
- Para Q3: 3/4 * 40 = 30 → o trigesimo elemento

## Identificacao da classe correta

Apos encontrar a posicao, voce olha a frequencia acumulada (Fac) para descobrir em qual classe aquela posicao cai:

- Fac = [7, 11, 16, 24, 40]
- Posicao 10: passou dos 7 primeiros (classe 1), mas esta dentro dos 11 primeiros (classe 2) → classe 2
- Posicao 20: passou dos 16 primeiros (classe 3), esta dentro dos 24 primeiros (classe 4) → classe 4
- Posicao 30: passou dos 24 primeiros (classe 4), esta dentro dos 40 primeiros (classe 5) → classe 5

## Por que Fac ANTERIOR e nao a atual

O instrutor destaca: "frequencia acumulada anterior a linha que voce esta analisando". Isso porque a formula calcula quantas posicoes voce precisa "andar" dentro da classe atual. Se a posicao e 10 e a Fac anterior e 7, voce precisa andar 3 posicoes dentro da classe. Se usasse a Fac atual (11), o calculo seria negativo e sem sentido.

## Amplitude (h)

A amplitude e simplesmente o tamanho de cada intervalo. No exemplo: 164 - 160 = 4. O instrutor nota que "no caso aqui, todos iguais — minha amplitude de 4". Em tabelas com classes desiguais, h muda para cada classe.

## Simplificacoes algebricas

O instrutor mostra que frequentemente Fi e h se cancelam ou simplificam. Por exemplo, no Q1: (3/4)*4 = 3. No Q3: (6/16)*4 simplifica cortando 16 com 4, resultando em 6/4 = 1.5.