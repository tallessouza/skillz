---
name: rs-data-analytics-introducao-ao-colab
description: "Applies Google Colab notebook best practices when user asks to 'create a notebook', 'set up Colab', 'organize a notebook', 'start a data analysis project', or 'configure Colab environment'. Enforces cell organization, Markdown documentation, Drive mounting, and library placement conventions. Make sure to use this skill whenever creating or reviewing Jupyter/Colab notebooks for data analysis. Not for VS Code setup, local Jupyter configuration, or general Python coding outside notebooks."
---

# Google Colab — Boas Praticas para Notebooks

> Organizar notebooks com celulas pequenas, texto explicativo entre cada etapa, e bibliotecas instaladas no inicio.

## Rules

1. **Monte o Google Drive antes de comecar** — execute a montagem do Drive no inicio do notebook, porque o ambiente virtual do Colab e temporario e arquivos nao salvos no Drive serao perdidos
2. **Quebre celulas em partes pequenas** — cada celula deve fazer uma unica operacao logica, porque celulas grandes dificultam debug e reexecucao parcial
3. **Documente cada etapa com celulas de texto** — adicione uma celula Markdown antes de cada bloco de codigo explicando o que sera feito e por que, porque notebooks sao documentos vivos que outros (e voce no futuro) precisam entender
4. **Use hierarquia de titulos para organizar secoes** — `#` para secao principal, `##` para subsecao, `###` para detalhes, porque cria um indice navegavel no painel lateral
5. **Instale bibliotecas na primeira celula de codigo** — todas as instalacoes (`!pip install`) devem estar no topo, porque evita erros de importacao ao executar celulas fora de ordem
6. **Nomeie notebooks sem espacos nem caracteres especiais** — use `snake_case` e minusculas, porque garante compatibilidade entre sistemas operacionais e facilita referencia programatica

## How to write

### Estrutura padrao de notebook

```python
# Celula 1 (texto): Titulo e descricao
# # Analise de Vendas Q1 2026
# Objetivo: identificar tendencias de vendas por regiao.

# Celula 2 (codigo): Instalacao de bibliotecas
!pip install pandas matplotlib seaborn -q

# Celula 3 (codigo): Montagem do Drive
from google.colab import drive
drive.mount('/content/drive')

# Celula 4 (codigo): Imports
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Celula 5 (texto): ## Carregamento dos Dados
# Celula 6 (codigo): leitura do CSV
# Celula 7 (texto): ## Analise Exploratoria
# ...
```

### Celulas de texto com Markdown

```markdown
# Titulo Principal
## Subsecao
### Detalhe

**Texto em negrito** para destaques

*Texto em italico* para observacoes

`codigo_inline` para referencias a variaveis

- Item de lista 1
- Item de lista 2
```

## Example

**Before (notebook desorganizado):**
```python
# Uma unica celula gigante
import pandas as pd
!pip install seaborn
import seaborn as sns
df = pd.read_csv('dados.csv')
df.head()
df.describe()
df.groupby('regiao').sum()
sns.barplot(data=df, x='regiao', y='vendas')
```

**After (com esta skill aplicada):**
```python
# Celula texto: # Analise de Vendas por Regiao
# Celula texto: Objetivo: comparar volume de vendas entre regioes.

# Celula codigo 1:
!pip install seaborn -q

# Celula codigo 2:
import pandas as pd
import seaborn as sns

# Celula texto: ## Carregamento dos Dados

# Celula codigo 3:
df = pd.read_csv('dados.csv')
df.head()

# Celula texto: ## Estatisticas Descritivas

# Celula codigo 4:
df.describe()

# Celula texto: ## Vendas por Regiao

# Celula codigo 5:
vendas_por_regiao = df.groupby('regiao').sum()
sns.barplot(data=df, x='regiao', y='vendas')
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Inicio de qualquer notebook | Montar Drive + instalar bibliotecas nas 2 primeiras celulas |
| Celula com mais de 15 linhas | Quebrar em celulas menores com texto entre elas |
| Codigo que sera compartilhado | Adicionar celula texto no topo com objetivo, autor e data |
| Analise exploratoria | Uma celula por visualizacao ou transformacao |
| Notebook importante | Fazer download como backup alem do salvamento automatico |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| Instalar biblioteca no meio do notebook | Instalar tudo na primeira celula de codigo |
| Uma celula com toda a analise | Uma operacao logica por celula |
| Notebook sem nenhum texto explicativo | Celula Markdown antes de cada etapa |
| Nome `Análise Final (v2).ipynb` | Nome `analise_final_v2.ipynb` |
| Confiar apenas no salvamento automatico | Montar Drive + download de backups |
| Celula de codigo sem contexto | Celula de texto acima explicando o proposito |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
