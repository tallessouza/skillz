---
name: rs-data-analytics-amplitude-1
description: "Applies amplitude (range) calculation as a dispersion measure when analyzing datasets in Python, SQL, or spreadsheets. Use when user asks to 'analyze data spread', 'compare distributions', 'calculate range', 'measure dispersion', or 'check data variability'. Teaches that mean alone is insufficient — amplitude reveals concentration vs spread. Make sure to use this skill whenever comparing groups with similar averages or assessing data predictability. Not for standard deviation, variance, or interquartile range calculations."
---

# Amplitude (Range) — Medida de Dispersão

> Nunca confie apenas na média — calcule a amplitude para revelar o quanto os dados estão dispersos ou concentrados.

## Rules

1. **Amplitude = maior valor - menor valor** — sempre subtraia o mínimo do máximo do conjunto, porque isso revela a extensão total da dispersão
2. **Menor amplitude = dados mais concentrados** — valores próximos entre si indicam previsibilidade, porque a distância entre extremos é pequena
3. **Maior amplitude = dados mais dispersos** — valores espalhados indicam incerteza, porque a diferença entre extremos é grande
4. **Média igual não significa distribuição igual** — dois conjuntos podem ter a mesma média com amplitudes completamente diferentes, porque a média esconde a dispersão
5. **Use amplitude para comparar grupos** — quando dois conjuntos têm médias semelhantes, a amplitude é o primeiro critério de desempate, porque revela qual é mais previsível

## How to calculate

### Python
```python
amplitude = max(dados) - min(dados)
```

### SQL
```sql
SELECT MAX(salario) - MIN(salario) AS amplitude
FROM funcionarios
WHERE cargo = 'analista_dados';
```

### Interpretação
```
Amplitude PEQUENA → dados concentrados → mais previsível
Amplitude GRANDE  → dados dispersos   → menos previsível
```

## Example

**Cenário: Duas empresas com mesma média salarial (R$ 3.000)**

**Empresa A:**
```
Salários: [2800, 2900, 3100, 3200]
Média: 3000
Amplitude: 3200 - 2800 = R$ 400
→ Dados concentrados, salário previsível
```

**Empresa B:**
```
Salários: [1000, 2000, 4000, 5000]
Média: 3000
Amplitude: 5000 - 1000 = R$ 4.000
→ Dados dispersos, salário imprevisível
```

**Conclusão:** Apesar da mesma média, a Empresa A oferece mais previsibilidade (amplitude 10x menor).

## Heuristics

| Situação | Ação |
|----------|------|
| Dois grupos com mesma média | Calcule amplitude de ambos para comparar previsibilidade |
| Amplitude muito grande | Investigue outliers antes de concluir |
| Amplitude zero | Todos os valores são iguais — sem dispersão |
| Precisa de análise mais profunda | Amplitude é o primeiro passo; complemente com desvio padrão e variância |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| Comparar grupos apenas pela média | Comparar média E amplitude juntos |
| Ignorar dispersão ao apresentar dados | Sempre reportar amplitude junto com a média |
| Assumir que média alta = todos ganham bem | Verificar amplitude para entender a distribuição real |
| Usar apenas amplitude para dispersão | Usar amplitude como primeiro indicador, complementar com outras medidas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
