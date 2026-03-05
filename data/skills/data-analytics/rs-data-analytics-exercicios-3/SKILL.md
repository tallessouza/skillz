---
name: rs-data-analytics-exercicios-3
description: "Applies descriptive statistics analysis workflow (min, max, amplitude, mean, mode, median, variance, standard deviation) to business datasets. Use when user asks to 'analyze sales data', 'calculate descriptive statistics', 'understand data dispersion', 'summarize dataset', or 'interpret variance'. Make sure to use this skill whenever performing exploratory data analysis on numeric datasets. Not for inferential statistics, hypothesis testing, or machine learning tasks."
---

# Analise Descritiva Completa de Dados

> Ao analisar um dataset numerico, calcule todas as medidas de tendencia central e dispersao antes de interpretar, porque conclusoes isoladas enganam.

## Steps

### Step 1: Identificar Min, Max e Amplitude

```python
minimo = min(dados)
maximo = max(dados)
amplitude = maximo - minimo
# Amplitude pequena = dados pouco dispersos = estabilidade
```

### Step 2: Calcular Media, Moda e Mediana

```python
media = sum(dados) / len(dados)
moda = max(set(dados), key=dados.count)
mediana = sorted(dados)[len(dados) // 2]  # para n impar
```

### Step 3: Calcular Variancia e Desvio Padrao

```python
variancia = sum((x - media) ** 2 for x in dados) / len(dados)
desvio_padrao = variancia ** 0.5
```

Elevar ao quadrado elimina valores negativos da diferenca — esse e o proposito.

### Step 4: Interpretar o Conjunto

| Indicador | Sinal positivo | Sinal de alerta |
|-----------|---------------|-----------------|
| Media ≈ Moda ≈ Mediana | Dados concentrados, estabilidade | — |
| Amplitude pequena | Pouca dispersao entre extremos | — |
| Variancia/desvio baixos | Valores proximos da media | — |
| Media ≠ Mediana | — | Dados assimetricos, outliers provaveis |
| Amplitude grande | — | Valores muito dispersos |

## Example

**Dados:** vendas diarias = [10, 12, 8, 10, 10]

**Analise completa:**
```
Min: 8 | Max: 12 | Amplitude: 4
Media: 10 | Moda: 10 | Mediana: 10
Variancia: 1.6 | Desvio padrao: ≈1.26

Interpretacao: Media, moda e mediana identicas (10) indicam
dados muito concentrados. Amplitude de apenas 4 e variancia
de 1.6 confirmam estabilidade. Cenario favoravel para previsao
de estoque e planejamento de acoes comerciais.
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Media = Moda = Mediana | Relatar concentracao e estabilidade dos dados |
| Variancia baixa | Destacar previsibilidade — bom para planejamento |
| Amplitude grande com variancia baixa | Outliers isolados — investigar extremos |
| Dados de vendas/estoque | Conectar conclusao a decisoes de negocio (estoque, acoes) |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Calcular so a media e concluir | Calcular media + mediana + moda + variancia antes de concluir |
| Ignorar valores zero na variancia | Incluir todos os desvios na media, mesmo os zeros |
| Interpretar variancia sem contexto | Comparar variancia com a escala dos dados originais |
| Apresentar numeros sem interpretacao | Sempre explicar o que os numeros significam para o negocio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
