# Code Examples: Tipos de Demandas de Dados

## Framework de Classificacao de Demandas

Este skill e conceitual, nao de codigo. Abaixo, exemplos praticos de como aplicar a classificacao em cenarios reais.

### Exercicios do instrutor com classificacao

```
Demanda: "Queremos saber quais produtos tem menor giro de estoque"
Classificacao: EXPLORATORIA
Razao: Analisa a natureza dos dados, nao investiga causa nem preve futuro

Demanda: "Nosso site teve queda no trafego, qual foi o motivo?"
Classificacao: DIAGNOSTICA
Razao: Pergunta no passado, busca causa de um evento

Demanda: "Se ajustarmos o preco em 10%, qual sera o impacto nas vendas?"
Classificacao: PREDITIVA
Razao: Pergunta sobre o futuro, requer estimativa/previsao

Demanda: "Como podemos reduzir o custo de aquisicao de cliente (CAC)?"
Classificacao: PRESCRITIVA
Razao: Pede recomendacao de acao, nao apenas previsao

Demanda: "Qual dia da semana tem maior volume de transacoes bancarias?"
Classificacao: EXPLORATORIA
Razao: Explora composicao dos dados, identifica padroes gerais
```

### Hipoteses para demanda diagnostica (exemplo vendas)

```
Pergunta de negocio: "Houve queda de vendas neste mes. Por que?"

Hipoteses a investigar:
1. Outlier no mes anterior inflou a comparacao?
2. Sazonalidade de mercado (data especial, feriado)?
3. Questao politica/economica afetando B2B?
4. Mudanca em descontos ou politica de precos?
5. Problema tecnico no canal de vendas?
6. Mudanca no mix de produtos ofertados?
```

### Tecnicas por tipo de demanda

```
EXPLORATORIA:
- Valores nulos, duplicados, outliers
- Media, mediana, desvio padrao
- Distribuicao de variaveis
- Correlacoes iniciais

DESCRITIVA:
- Dashboards com KPIs
- Reportes mensais/financeiros
- Metricas agregadas

DIAGNOSTICA:
- KPIs especificos, crescimento YoY
- Segmentacao por periodo/canal/produto
- Analise de sazonalidade
- Comparacao entre periodos

PREDITIVA:
- Regressao linear/logistica
- Series temporais
- Machine learning (classificacao, clustering)
- Modelagem de risco (ex: inadimplencia bancaria)

PRESCRITIVA:
- Sistemas de recomendacao
- Otimizacao de rotas (Uber, iFood)
- Analise a priori (market basket)
- Motor de regras de negocio
```

### Fluxo de trabalho recomendado

```
1. Receber demanda do stakeholder
2. Classificar tipo (exploratoria/descritiva/diagnostica/preditiva/prescritiva)
3. Se a pergunta esta vaga → minerar mais detalhes com o stakeholder
4. Levantar hipoteses, premissas, restricoes, deadlines
5. Traduzir problema de negocio → problema de dados
6. Executar analise exploratoria (EDA) como base
7. Aplicar tecnicas especificas do tipo de demanda
8. Apresentar resultados com contexto adequado
```