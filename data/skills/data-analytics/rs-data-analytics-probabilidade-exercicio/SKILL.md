---
name: rs-data-analytics-probabilidade-exercicio
description: "Applies probability analysis to real-world business scenarios like email marketing campaigns. Use when user asks to 'calculate probability', 'analyze conversion rates', 'build a marketing funnel', 'analyze campaign performance', or 'calculate CTR'. Covers sample space identification, favorable cases, conditional probability, and funnel analysis. Make sure to use this skill whenever analyzing campaign metrics or computing event probabilities from business data. Not for statistical modeling, hypothesis testing, or machine learning."
---

# Probabilidade Aplicada a Negócios

> Identifique o espaço amostral e os casos favoráveis antes de calcular qualquer probabilidade — o erro mais comum é usar o denominador errado.

## Rules

1. **Defina o espaço amostral primeiro** — antes de qualquer cálculo, pergunte: "qual é o universo total?", porque usar o denominador errado invalida toda a análise
2. **Identifique os casos favoráveis explicitamente** — nomeie o evento buscado antes de dividir, porque confundir "clicou" com "comprou" gera métricas falsas
3. **Reconheça probabilidade condicional** — quando a pergunta contém "entre os que X, quantos Y?", o espaço amostral muda para X, porque a condição restringe o universo
4. **Expresse em três formatos** — fração, decimal (0 a 1) e porcentagem, porque cada stakeholder prefere um formato diferente
5. **Construa o funil de conversão** — organize as probabilidades em etapas sequenciais (envio → clique → compra), porque o funil revela onde está o gargalo
6. **Questione os resultados** — após calcular, pergunte "por quê?" para cada taxa baixa, porque probabilidade sem análise crítica não gera ação

## How to write

### Cálculo básico de probabilidade

```python
# P(E) = casos favoráveis / espaço amostral
emails_enviados = 1000  # espaço amostral
cliques = 200           # casos favoráveis

probabilidade_clique = cliques / emails_enviados  # 0.20 = 20%
```

### Probabilidade condicional (espaço amostral reduzido)

```python
# "Entre os que clicaram, quantos compraram?"
# Espaço amostral agora = quem clicou (200), NÃO o total (1000)
cliques = 200    # novo espaço amostral (condição)
compras = 50     # casos favoráveis

prob_compra_dado_clique = compras / cliques  # 0.25 = 25%
```

### Análise de funil

```python
funil = {
    "enviados": 1000,
    "clicaram": 200,
    "compraram": 50,
}

ctr = funil["clicaram"] / funil["enviados"]           # 20%
taxa_conversao_total = funil["compraram"] / funil["enviados"]  # 5%
conversao_pos_clique = funil["compraram"] / funil["clicaram"]  # 25%
abandono = 1 - ctr                                      # 80%
```

## Example

**Before (análise sem estrutura):**
```python
# "50 de 1000 compraram, taxa = 5%"
taxa = 50 / 1000  # Correto, mas incompleto — sem funil, sem condicional
```

**After (análise completa com funil):**
```python
# Espaço amostral e eventos definidos explicitamente
total_emails = 1000
cliques = 200
compras = 50

# Probabilidades em cada etapa do funil
prob_clique = cliques / total_emails          # 0.20 → 20% CTR
prob_compra_total = compras / total_emails    # 0.05 → 5% conversão geral
prob_compra_dado_clique = compras / cliques   # 0.25 → 25% conversão pós-clique

# Análise crítica: onde está o gargalo?
taxa_abandono_email = 1 - prob_clique  # 80% não clicou → revisar assunto/público
# 25% dos que clicaram compraram → público qualificado, mas volume baixo
```

## Heuristics

| Situação | Faça |
|----------|------|
| Pergunta usa "de todos" ou "aleatório" | Espaço amostral = total geral |
| Pergunta usa "entre os que X" ou "dado que X" | Probabilidade condicional — espaço amostral = X |
| Taxa muito baixa (<5%) | Investigue o gargalo: público errado? Mensagem ruim? |
| Taxa alta numa etapa mas baixa na seguinte | O problema está na etapa seguinte, não na anterior |
| Precisa apresentar para stakeholders | Use funil visual com % em cada etapa |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Calcular compras/total sem analisar cliques | Construa o funil completo etapa por etapa |
| Usar total como denominador em pergunta condicional | Identifique a condição e reduza o espaço amostral |
| Mostrar só a porcentagem final | Mostre fração, decimal e porcentagem |
| Apresentar números sem análise crítica | Questione cada taxa: "por que 80% não clicou?" |
| Analisar baseado em achismo | Calcule a probabilidade, depois investigue |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
