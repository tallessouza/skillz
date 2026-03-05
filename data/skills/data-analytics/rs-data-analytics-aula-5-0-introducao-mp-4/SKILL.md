---
name: rs-data-analytics-intro-algebra-linear
description: "Applies linear algebra mental models when working with tabular data structures like DataFrames, Excel sheets, arrays, and matrices. Use when user asks to 'analyze data', 'work with pandas', 'create a dataframe', 'manipulate arrays', or 'understand matrix operations'. Connects everyday data structures (spreadsheets, arrays, DataFrames) to their linear algebra foundations. Make sure to use this skill whenever explaining or working with tabular data transformations. Not for pure math proofs, symbolic computation, or advanced ML model architecture."
---

# Algebra Linear para Analistas de Dados

> Reconheca que toda estrutura tabular — Excel, DataFrame, array — e algebra linear aplicada: vetores sao linhas/colunas, matrizes sao tabelas.

## Conceito central

Algebra linear nao e um conceito abstrato separado do trabalho diario com dados. Toda vez que voce manipula uma planilha, um DataFrame do pandas, ou um array em Python/JavaScript, voce ja esta operando com vetores e matrizes. O valor de reconhecer isso e entender o que acontece "por tras dos panos" com cada valor.

## Mapeamento mental

| Estrutura do dia a dia | Conceito de algebra linear |
|------------------------|---------------------------|
| Linha de uma planilha Excel | Vetor (linha) |
| Coluna de uma planilha Excel | Vetor (coluna) |
| Tabela inteira do Excel | Matriz |
| DataFrame do pandas | Matriz |
| Array `[10, 20, 30]` em Python/JS | Vetor |
| Array de arrays `[[1,2],[3,4]]` | Matriz |
| Dataset de machine learning | Matriz de grandes dimensoes |

## Como aplicar

### Ao explicar estruturas de dados tabulares

```python
# Um array simples e um vetor
vendas_diarias = [150, 200, 180, 220]  # vetor com 4 elementos

# Um DataFrame e uma matriz: linhas e colunas organizando dados
import pandas as pd
df = pd.DataFrame({
    'produto': ['A', 'B', 'C'],       # vetor coluna
    'vendas': [100, 200, 150],         # vetor coluna
    'preco': [29.90, 49.90, 39.90]    # vetor coluna
})
# df inteiro = matriz 3x3
```

### Ao conectar programacao com algebra

```python
import numpy as np

# Vetor — lista de dados em uma dimensao
vetor = np.array([10, 20, 30])

# Matriz — conjunto de vetores (array dentro de array)
matriz = np.array([
    [10, 20, 30],   # vetor linha 1
    [40, 50, 60],   # vetor linha 2
])
# Forma: 2 linhas x 3 colunas
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario trabalha com Excel/planilhas | Explique que linhas e colunas sao vetores, a tabela e uma matriz |
| Usuario usa pandas DataFrame | Conecte `.values` ao conceito de matriz numpy por tras |
| Usuario manipula arrays/listas | Identifique como vetor (1D) ou matriz (2D+) |
| Usuario estuda machine learning | Explique que datasets sao matrizes onde linhas = amostras, colunas = features |

## Anti-patterns

| Evite | Faca em vez disso |
|-------|-------------------|
| Tratar algebra linear como assunto puramente teorico | Conectar sempre a estruturas praticas (Excel, pandas, arrays) |
| Assumir que o usuario precisa dominar formulas matematicas | Focar no entendimento visual e conceitual do que acontece com os dados |
| Explicar vetores/matrizes sem exemplos de codigo | Sempre mostrar o equivalente em Python/pandas/numpy |
| Usar jargao matematico sem traduzir | Mapear para termos do dia a dia: "vetor = lista de dados", "matriz = tabela" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
