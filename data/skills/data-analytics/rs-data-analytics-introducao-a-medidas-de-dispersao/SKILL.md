---
name: rs-data-analytics-intro-dispersao
description: "Applies dispersion analysis thinking when interpreting datasets or comparing distributions. Use when user asks to 'analyze data', 'compare datasets', 'interpret averages', 'check data spread', or 'understand variance'. Ensures awareness that identical means can hide different distributions. Make sure to use this skill whenever comparing two or more datasets or questioning if a mean is representative. Not for calculating specific dispersion metrics like standard deviation or variance — see dedicated skills for those."
---

# Medidas de Dispersao — Modelo Mental

> Nunca confie apenas na media: dois datasets com a mesma media podem contar historias completamente diferentes dependendo da dispersao dos dados.

## Key concept

A media e uma medida de tendencia central, mas sozinha ela esconde a distribuicao real dos valores. Dados podem estar concentrados perto da media (baixa dispersao) ou muito espalhados (alta dispersao). A dispersao revela a **confiabilidade** da media como representante do dataset.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Dois datasets com medias iguais | Compare a dispersao antes de concluir que sao similares |
| Uma media isolada | Pergunte: "os valores estao concentrados ou espalhados?" |
| Conclusao baseada apenas na media | Alerte: a media pode ser traicoeira sem contexto de dispersao |
| Dados com outliers visiveis | Priorize mediana + dispersao sobre media simples |

## How to think about it

### Mesma media, historias diferentes

Imagine dois times de vendas com media de R$10.000/mes:
- **Time A:** todos vendem entre R$9.000 e R$11.000 (concentrado, previsivel)
- **Time B:** um vende R$2.000 e outro R$18.000 (disperso, imprevisivel)

A media e identica, mas a realidade operacional e completamente diferente. O Time A e estavel; o Time B depende de um unico vendedor.

### Distancia em relacao a tendencia central

Dispersao mede o **espalhamento** dos dados em relacao as medidas de tendencia central (media, mediana). Quanto maior a distancia media dos pontos ao centro, maior a dispersao e menor a confiabilidade da media como resumo.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Media igual = datasets iguais | Media igual pode esconder distribuicoes completamente diferentes |
| Media alta = todos os valores sao altos | Pode haver valores muito baixos compensados por outliers altos |
| So preciso da media para analisar | Media sem dispersao e analise incompleta e potencialmente enganosa |

## When to apply

- Ao comparar performance entre grupos, periodos ou categorias
- Ao reportar metricas de negocio (receita, tempo de resposta, NPS)
- Ao validar se uma media representa bem o dataset
- Ao identificar se dados sao previsiveis ou volateis

## Limitations

- Este modelo mental e a **introducao** — nao calcula metricas especificas
- Para calculos concretos (variancia, desvio padrao, amplitude), use as skills dedicadas do modulo
- Dispersao sozinha tambem nao conta a historia completa — combine com medidas de tendencia central

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
