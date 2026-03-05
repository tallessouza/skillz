# Deep Explanation: Amplitude Interquartil

## Diferenca entre amplitude e amplitude interquartil

O instrutor faz questao de distinguir os dois conceitos logo no inicio. A **amplitude** classica pega o maior valor menos o menor valor do conjunto inteiro — ela mede a dispersao total. Ja a **amplitude interquartil** ignora os extremos e foca nos valores dos quartis, medindo a dispersao dos 50% centrais dos dados.

Essa distincao e crucial porque a amplitude classica e muito sensivel a outliers. Um unico valor extremo distorce completamente a medida. O IQR, por outro lado, e robusto — ele so olha para onde a maioria dos dados esta concentrada.

## Por que Q2 = Mediana

O instrutor reforça que Q2 e mediana sao a mesma coisa. Isso e importante porque:
- Q2 divide o conjunto em duas metades iguais (50% para cada lado)
- Q1 e a mediana da metade inferior (marca os 25%)
- Q3 e a mediana da metade superior (marca os 75%)
- O IQR captura exatamente o intervalo entre 25% e 75%

## O processo de marcacao

Uma dica pratica do instrutor: ao fazer o rol manualmente, **marque cada numero que ja foi posicionado**. Com conjuntos pequenos parece desnecessario, mas com conjuntos grandes, a chance de repetir ou omitir um dado e alta. Essa disciplina evita erros silenciosos.

## Quantidade par vs impar — impacto nos quartis

Quando o conjunto tem quantidade **impar** (como 9 elementos no exemplo), a mediana e um elemento concreto do conjunto. Ao calcular Q1 e Q3, esse elemento central e **excluido** — cada metade fica com 4 elementos.

Quando a quantidade e **par**, nao existe elemento central unico. A mediana e a media dos dois centrais, e o conjunto se divide naturalmente ao meio sem exclusao.

## O caso dos dois valores iguais

No exemplo, Q3 foi calculado como (12 + 12) / 2 = 12. O instrutor reconhece que nao precisava fazer a conta ja que ambos valores sao iguais, mas mostra o calculo completo para manter a consistencia do metodo. Isso e boa pratica pedagogica — seguir o procedimento mesmo quando o resultado e obvio garante que o aluno internaliza o processo.

## Procedimento resumido pelo instrutor

1. Colocar dados em ordem (rol)
2. Achar a mediana (Q2)
3. Achar Q1 (mediana da metade inferior)
4. Achar Q3 (mediana da metade superior)
5. IQR = Q3 - Q1