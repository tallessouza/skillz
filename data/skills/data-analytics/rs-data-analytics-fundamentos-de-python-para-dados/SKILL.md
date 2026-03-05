---
name: rs-data-analytics-fundamentos-python-dados
description: "Applies Python ecosystem knowledge for data projects, selecting appropriate libraries by data volume and use case. Use when user asks to 'choose a Python library for data', 'work with pandas', 'process large datasets', 'start a data project in Python', or 'pick between pandas and pyspark'. Make sure to use this skill whenever recommending Python tools for data workflows. Not for general Python syntax, web development with Django/Flask, or game development."
---

# Fundamentos de Python para Dados

> Selecionar a ferramenta Python correta depende do volume de dados e do tipo de projeto — Pandas para volumes menores, PySpark para clusters e grandes volumes.

## Key concept

Python domina a area de dados por combinar sintaxe proxima do ingles (alto nivel) com um ecossistema massivo de bibliotecas especializadas. Ser interpretada permite debugar e testar incrementalmente — essencial em exploracao de dados onde o ciclo escrever-testar-iterar e constante.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Volume de dados cabe na memoria (< ~10GB) | Pandas — limpeza, transformacao, analise exploratoria |
| Operacoes numericas pesadas, arrays, algebra linear | NumPy — base de calculo para outras bibliotecas |
| Volume massivo de dados, processamento distribuido | PySpark — cluster de computadores, escala horizontal |
| Machine learning e modelos preditivos | scikit-learn, TensorFlow, PyTorch |
| Analise de dados clinicos ou pesquisa cientifica | Pandas + SciPy + bibliotecas especializadas do dominio |
| Sistema de recomendacao | Python + ML frameworks (collaborative filtering, etc.) |

## How to think about it

### Escala progressiva

Comece com Pandas para projetos simples. Quando o volume crescer alem da memoria de uma maquina, migre para PySpark. A sintaxe e similar o suficiente para que a transicao seja suave — o investimento em Python se preserva.

### Python como linguagem unica

A versatilidade do Python significa que o mesmo profissional de dados pode: extrair dados (requests, scrapy), limpar e transformar (Pandas), analisar (NumPy, statsmodels), criar modelos (scikit-learn), e servir resultados (FastAPI, Django). Uma linguagem, pipeline inteiro.

## Bibliotecas-chave para dados

| Biblioteca | Foco | Quando usar |
|-----------|------|-------------|
| **Pandas** | Manipulacao de dados tabulares | Limpeza, transformacao, analise exploratoria |
| **NumPy** | Computacao numerica | Arrays, operacoes matematicas, base para outras libs |
| **PySpark** | Big data distribuido | Datasets que nao cabem na memoria, clusters |
| **Matplotlib/Seaborn** | Visualizacao | Graficos, dashboards estaticos |
| **scikit-learn** | Machine learning | Modelos preditivos, classificacao, clustering |

## Casos reais de referencia

| Empresa | Uso de Python em dados |
|---------|----------------------|
| Google (Ads) | Analise de dados, machine learning |
| Netflix | Algoritmo de recomendacao de conteudo |
| Pfizer | Analise de dados clinicos, pesquisa de medicamentos |
| Amazon | Previsao de demanda, otimizacao logistica, personalizacao |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Pandas serve para qualquer volume | Pandas tem limite pratico de memoria — use PySpark para big data |
| Python e lento, entao nao serve para dados | Bibliotecas como NumPy e PySpark usam C/Rust por baixo — Python orquestra |
| Preciso aprender varias linguagens para dados | Python cobre extracoes, transformacao, analise, ML e deploy |

## Limitations

- Para dashboards interativos em producao, considere ferramentas especializadas (Metabase, Looker) alem de Python
- Para streaming em tempo real com latencia ultra-baixa, avalie Rust/Go para os componentes criticos
- Python puro (sem bibliotecas C-backed) pode ser lento para loops numericos — sempre prefira operacoes vetorizadas

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
