---
name: rs-data-analytics-media-aritmetica
description: "Applies arithmetic mean calculation and interpretation when analyzing datasets in Python, SQL, or spreadsheets. Use when user asks to 'calculate average', 'find the mean', 'summarize data', 'analyze trends', or 'compute central tendency'. Ensures correct formula application and warns about mean limitations with outliers. Make sure to use this skill whenever computing averages or summarizing numeric datasets. Not for median, mode, standard deviation, or advanced statistical analysis."
---

# Média Aritmética

> Ao calcular médias, aplique a fórmula corretamente (soma / quantidade) e sempre alerte sobre suas limitações com outliers.

## Rules

1. **Soma todos os valores e divide pela quantidade** — `media = sum(valores) / len(valores)`, porque essa é a definição exata de média aritmética
2. **Identifique N antes de calcular** — conte quantos valores existem no dataset antes de dividir, porque erros de contagem são a causa mais comum de médias incorretas
3. **Sempre contextualize o resultado** — "média de 198,57 acessos por dia" não apenas "198,57", porque números sem contexto não comunicam nada
4. **Alerte sobre limitações da média** — a média pode ser traiçoeira com outliers (valores extremos distorcem o resultado), porque decisões baseadas apenas na média podem ser enganosas
5. **Arredonde adequadamente ao contexto** — acessos a um site não têm fração, então apresente "aproximadamente 199 acessos" quando comunicar, porque precisão excessiva obscurece a mensagem

## How to write

### Cálculo básico em Python

```python
# Sempre nomeie as variáveis pelo conteúdo
acessos_diarios = [100, 130, 180, 200, 230, 250, 300]
media_acessos = sum(acessos_diarios) / len(acessos_diarios)
# 198.57
```

### Com pandas

```python
import pandas as pd

acessos = pd.Series([100, 130, 180, 200, 230, 250, 300])
media_acessos = acessos.mean()
```

### Em SQL

```sql
SELECT AVG(acessos) AS media_acessos_diarios
FROM site_analytics
WHERE data BETWEEN '2024-01-01' AND '2024-01-07';
```

## Example

**Before (sem contexto, sem alerta):**
```python
nums = [100, 130, 180, 200, 230, 250, 300]
print(sum(nums) / len(nums))  # 198.57142857142858
```

**After (com contexto e comunicação clara):**
```python
acessos_semana = [100, 130, 180, 200, 230, 250, 300]
media_acessos = sum(acessos_semana) / len(acessos_semana)

print(f"Média de acessos diários: {media_acessos:.2f}")
print(f"Aproximadamente {round(media_acessos)} acessos por dia")
# Nota: a média pode ser distorcida por valores extremos.
# Considere também calcular mediana e moda para uma análise mais completa.
```

## Heuristics

| Situação | Ação |
|----------|------|
| Dataset pequeno e sem outliers | Média aritmética é suficiente |
| Dataset com valores extremos | Alertar que a média pode não representar o "típico" — sugerir mediana |
| Comunicando para não-técnicos | Arredondar e contextualizar ("cerca de 200 acessos por dia") |
| Comparando períodos | Calcular média de cada período separadamente |
| Relatório executivo | Apresentar média junto com min/max para dar amplitude |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| `print(198.57)` sem contexto | `print(f"Média: {media:.2f} acessos/dia")` |
| Usar média como única medida | Combinar com mediana e moda |
| Ignorar outliers | Verificar min/max antes de confiar na média |
| Dividir por número errado | Contar `len(valores)` explicitamente |
| Apresentar decimais excessivos | Arredondar ao contexto do negócio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
