# Deep Explanation: Amplitude (Range)

## A analogia das duas empresas

O instrutor apresenta um cenário decisório poderoso: você foi aprovado em duas empresas para a mesma vaga de analista de dados. Ambas ligam dizendo que a média salarial é R$ 3.000. Qual escolher?

Esse é o ponto central: **a média sozinha cria uma imagem que "não é 100% verdadeira"**. Ela esconde como os dados estão distribuídos.

## Por que a média engana

Na Empresa A, os salários variam de R$ 2.800 a R$ 3.200 — todos próximos da média. Você sabe aproximadamente quanto vai ganhar.

Na Empresa B, os salários variam de R$ 1.000 a R$ 5.000. Você pode ser a pessoa nº 4 (R$ 5.000) ou a pessoa nº 1 (R$ 1.000). A mesma média de R$ 3.000, mas com uma incerteza enorme.

Como o instrutor destaca: "quanto maior essa discrepância, essa dispersão, mais incerteza me traz."

## O conceito de amplitude

A amplitude é definida como: **a diferença entre o maior valor e o menor elemento do conjunto de dados**.

- Empresa A: 3.200 - 2.800 = R$ 400
- Empresa B: 5.000 - 1.000 = R$ 4.000

A amplitude da Empresa B é 10 vezes maior que a da Empresa A, revelando uma realidade completamente diferente do que a média sugeria.

## Regra fundamental

- **Menor amplitude → dados mais concentrados** (próximos da média)
- **Maior amplitude → dados mais distantes** (espalhados da média)

## Limitações da amplitude

O instrutor menciona que amplitude é apenas a "primeira ferramenta" de medida de dispersão. Ela tem limitações:

1. **Sensível a outliers** — um único valor extremo distorce completamente a amplitude
2. **Usa apenas dois valores** — ignora toda a distribuição intermediária
3. **Não indica onde os dados se concentram** — apenas a extensão total

Por isso existem outras medidas (desvio padrão, variância) que serão vistas nas aulas seguintes.

## Contexto na análise de dados

A amplitude é o ponto de entrada para entender dispersão. É rápida de calcular e intuitiva de interpretar, mas deve ser complementada com medidas mais robustas para análises profundas.