---
name: rs-data-analytics-probabilidade-condicional
description: "Applies conditional probability reasoning when analyzing user behavior, conversion funnels, churn prediction, or A/B tests. Use when user asks to 'calculate probability', 'analyze conversion rate', 'predict churn', 'funnel analysis', or 'A/B test probability'. Ensures correct sample space definition given a condition. Make sure to use this skill whenever computing probabilities from filtered datasets or conditional scenarios. Not for descriptive statistics, combinatorics without conditions, or basic counting."
---

# Probabilidade Condicional

> Ao calcular probabilidades condicionais, defina primeiro o espaco amostral correto — ele muda conforme a condicao imposta.

## Rules

1. **Identifique a condicao antes de calcular** — P(A|B) significa "probabilidade de A dado que B ja aconteceu", porque o espaco amostral nao e o total, e sim o subconjunto onde B ocorreu
2. **Redefina o espaco amostral** — o denominador da fracao e o total do evento condicionante (B), nao o total geral, porque ignorar isso infla ou deflaciona a probabilidade
3. **Separe evento de condicao** — evento = o que quero saber, condicao = o que ja aconteceu, porque confundir os dois inverte o calculo
4. **Combine calculo com bom senso** — como Laplace disse, probabilidade e "bom senso reduzido ao calculo", porque um numero sem contexto de negocio nao gera insight
5. **Aplique em cenarios reais** — funis de conversao, churn, testes A/B e modelos preditivos sao todos probabilidade condicional, porque analisam comportamento futuro dado comportamento passado

## How to write

### Calculo basico de P(A|B)

```python
# P(compra | colocou no carrinho)
# Espaco amostral = quem colocou no carrinho (condicao)
# Evento = quem finalizou a compra

carrinho = 300
compras = 90
probabilidade = compras / carrinho  # 0.30 = 30%
```

### Em pandas com dados reais

```python
# Filtrar pelo evento condicionante PRIMEIRO, depois calcular
usuarios_carrinho = df[df["adicionou_carrinho"] == True]
taxa_conversao = usuarios_carrinho["comprou"].mean()
# Isso e P(compra | carrinho) — o .mean() sobre booleanos da a proporcao
```

### Churn condicional

```python
# P(churn | usuario inativo ha 30 dias)
inativos_30d = df[df["dias_sem_login"] >= 30]
prob_churn = inativos_30d["churned"].mean()
```

## Example

**Before (erro comum — espaco amostral errado):**
```python
# "Qual a chance de comprar dado que colocou no carrinho?"
visitantes = 1000
compras = 90
prob = compras / visitantes  # 0.09 = 9% — ERRADO
# Usou o total de visitantes como denominador
```

**After (com probabilidade condicional correta):**
```python
# Espaco amostral = quem colocou no carrinho (a condicao)
carrinho = 300
compras = 90
prob = compras / carrinho  # 0.30 = 30% — CORRETO
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Pergunta contem "dado que", "sabendo que", "entre os que" | Use probabilidade condicional — redefina o espaco amostral |
| Funil de conversao (visita → carrinho → compra) | Cada etapa e uma P(A\|B) com denominador = etapa anterior |
| Teste A/B | P(conversao \| grupo_tratamento) vs P(conversao \| grupo_controle) |
| Modelo preditivo de churn | P(saida \| comportamentos passados) — condicione nos comportamentos |
| Resultado parece contraintuitivo | Verifique se o espaco amostral esta correto antes de questionar o dado |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `compras / total_visitantes` quando a pergunta e sobre quem adicionou ao carrinho | `compras / usuarios_com_carrinho` |
| Ignorar a condicao e usar `len(df)` como denominador | Filtrar o df pela condicao primeiro, depois calcular |
| Reportar probabilidade sem contexto de negocio | Acompanhar o numero com interpretacao: "30% dos que adicionam ao carrinho compram" |
| Confundir P(A\|B) com P(B\|A) | Verificar: quem e o evento e quem e a condicao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
