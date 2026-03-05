# Deep Explanation: Tipos de Demandas de Dados

## Por que entender o problema e a etapa mais importante

O instrutor enfatiza que, apesar da tendencia natural de valorizar a parte tecnica, a etapa de compreensao do problema e **crucial**. A analogia usada e de Alice no Pais das Maravilhas: "Se voce nao sabe para onde quer ir, qualquer caminho serve." Se o entendimento do problema for mal feito, nao importa quao brilhante seja a modelagem — voce estara respondendo a pergunta errada.

## O papel do analista na formulacao da pergunta

Um ponto central da aula: **o executivo frequentemente nao sabe o que quer**. O instrutor da o exemplo concreto: um executivo pede uma "avaliacao do porque as vendas aumentaram num determinado mes", mas o que ele realmente queria era uma analise sobre progressao de descontos. O analista nao pode depender de um "input perfeito" — precisa estar apto a minerar por mais detalhes, descricoes, e formular a verdadeira pergunta de dados.

## CRISP-DM como metodologia orientadora

O curso segue a metodologia CRISP-DM (Cross-Industry Standard Process for Data Mining), e este modulo cobre a primeira etapa: **Compreensao de Negocio**. Nesta etapa acontece:
- Levantamento de hipoteses
- Definicao de premissas
- Mapeamento de restricoes e limites
- Identificacao de deadlines
- Traducao do problema de negocio para problema de dados

## A demanda exploratoria como fundacao

A exploratoria e especial porque:
1. Ela **antecede** todas as outras demandas
2. Raramente vem isolada como pedido de executivo
3. Geralmente parte do proprio analista ou de um lider tecnico
4. Ja costuma estar prevista em dashboards existentes
5. E o EDA (Exploratory Data Analysis) — verificar nulos, outliers, duplicados, medias, desvio padrao

O instrutor destaca que quando uma demanda diagnostica chega, a exploratoria ja deveria ter sido feita. Por exemplo, se ha uma queda nas vendas e isso e sazonalidade, a analise exploratoria previa ja deveria ter identificado esse padrao.

## A diferenciacao por tempo verbal

O insight mais pratico do instrutor para classificar demandas rapidamente:
- **Exploratoria**: nao tem tempo definido — e sobre a natureza dos dados ("o que sao os dados")
- **Diagnostica**: tempo **passado** — "por que aconteceu?"
- **Preditiva**: tempo **futuro** — "o que pode acontecer?"
- **Prescritiva**: tempo de **acao** — "o que devemos fazer?" (vai alem de prever, praticamente "escreve" o futuro)

## O conceito de Relatorio Aumentado (Gartner)

O instrutor menciona o conceito de "relatorio aumentado" da Gartner, que transcende o dashboard tradicional: nao apenas mostra indicadores, mas indica **o que fazer** com eles. Isso se conecta diretamente com a analise prescritiva.

## Exemplo pratico: banco e inadimplencia

Bancos usam analise preditiva para avaliar chances de inadimplencia. O metodo: verificar **similaridades comportamentais** entre o cliente atual e clientes que foram inadimplentes no passado. Se o padrao comportamental e similar, o risco e alto.

## Exemplo pratico: e-commerce e combos

Com analise exploratoria, um e-commerce pode descobrir que produtos comprados juntos geram oportunidade de combos promocionais. Isso e pura exploracao — nao olha passado nem futuro, apenas tateia os dados.

## A armadilha da demanda "que parece passado mas nao e"

O instrutor chama atencao para perguntas como "quais produtos tem menor giro de estoque?" — parece passado, mas e **exploratoria**, porque analisa a natureza dos dados, nao investiga uma causa.