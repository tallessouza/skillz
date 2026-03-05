---
name: rs-data-analytics-exercicios-fundamentos-python
description: "Guides Python fundamentals practice exercises setup and execution using Jupyter notebooks. Use when user asks to 'practice Python basics', 'run exercises in Colab', 'setup notebook for Python practice', or 'execute Python fundamentals exercises'. Applies workflow for downloading, uploading, and running exercise notebooks in Google Colab, VS Code, or Cursor. Make sure to use this skill whenever setting up Python practice environments with Jupyter notebooks. Not for teaching Python syntax, data analysis, or pandas/numpy concepts."
---

# Exercicios de Fundamentos de Python

> Configure e execute notebooks de exercicios de Python em qualquer ambiente (Colab, VS Code, Cursor).

## Prerequisites

- Google Colab (browser) OU VS Code/Cursor com extensao Jupyter instalada
- Ambiente Python configurado (se usar VS Code/Cursor)
- Notebook de exercicios baixado do repositorio

## Steps

### Step 1: Obter o notebook

Baixar o notebook `.ipynb` do repositorio:
- [Exercicios](https://github.com/skillz-education/data-analytics/blob/c33654e0cccac6ee2855dd738614e38eefe030a5/python_fundamentos/exercicios.ipynb)
- [Gabarito](https://github.com/skillz-education/data-analytics/blob/c33654e0cccac6ee2855dd738614e38eefe030a5/python_fundamentos/gabarito.ipynb)

### Step 2: Escolher ambiente de execucao

| Ambiente | Setup necessario |
|----------|-----------------|
| Google Colab | Abrir colab.research.google.com → Upload de notebook |
| VS Code | Extensao Jupyter + Python instalado |
| Cursor | Extensao Jupyter + Python instalado |

### Step 3: Executar no Google Colab

1. Abrir [Google Colab](https://colab.research.google.com)
2. Clicar em **Arquivo → Upload de notebook**
3. Selecionar o `.ipynb` baixado
4. Executar cada celula sequencialmente — ler a questao, escrever o codigo abaixo

### Step 4: Executar no VS Code/Cursor

1. Abrir o arquivo `.ipynb` diretamente no editor
2. Selecionar o kernel Python no canto superior direito
3. Executar celulas com `Shift+Enter`

## Heuristics

| Situacao | Faca |
|----------|------|
| Sem Python local instalado | Use Google Colab — zero config |
| Precisa de ambiente offline | Configure VS Code + extensao Jupyter |
| Quer comparar com gabarito | Abra exercicios e gabarito lado a lado |

## Verification

- Todas as celulas executam sem erro
- Cada exercicio tem resposta escrita pelo aluno antes de consultar gabarito

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
