# Code Examples: Introducao ao Google Colab

## Exemplo 1: Primeiro comando Python no Colab

O instrutor demonstra o comando mais basico — imprimir texto na tela:

```python
print("Introdução ao Google Colab")
```

**Saida:**
```
Introdução ao Google Colab
```

Para executar: `Ctrl+Enter` ou clicar no botao play.

## Exemplo 2: Montagem do Google Drive

```python
from google.colab import drive
drive.mount('/content/drive')
```

Apos executar, o Colab solicita autorizacao para acessar sua conta Google. Uma vez autorizado, os arquivos do Drive ficam acessiveis em `/content/drive/My Drive/`.

Os notebooks sao salvos automaticamente em:
```
/content/drive/My Drive/Colab Notebooks/
```

## Exemplo 3: Estrutura de Markdown para celulas de texto

### Titulo principal
```markdown
# Fundamentos de Python
```

### Subtitulos
```markdown
## Carregamento dos Dados
### Detalhes da Limpeza
```

### Formatacao de texto
```markdown
**texto em negrito**
*texto em italico*
`variavel_em_codigo`
```

### Listas
```markdown
- Primeiro item
- Segundo item
- Terceiro item
```

## Exemplo 4: Template completo de notebook organizado

```markdown
# [Celula texto] Titulo do Projeto
Descricao breve do objetivo da analise.
```

```python
# [Celula codigo] Instalacao de dependencias
!pip install pandas numpy matplotlib seaborn -q
```

```python
# [Celula codigo] Montagem do Drive
from google.colab import drive
drive.mount('/content/drive')
```

```python
# [Celula codigo] Imports
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
```

```markdown
## [Celula texto] Carregamento dos Dados
Carregando o dataset de vendas armazenado no Google Drive.
```

```python
# [Celula codigo] Leitura
caminho = '/content/drive/My Drive/datasets/vendas.csv'
df = pd.read_csv(caminho)
df.head()
```

```markdown
## [Celula texto] Analise Exploratoria
Verificando distribuicao e estatisticas descritivas.
```

```python
# [Celula codigo] Estatisticas
df.describe()
```

```python
# [Celula codigo] Visualizacao
plt.figure(figsize=(10, 6))
sns.barplot(data=df, x='regiao', y='vendas')
plt.title('Vendas por Regiao')
plt.show()
```

## Exemplo 5: Nomeacao correta de notebooks

| Errado | Correto |
|--------|---------|
| `Análise Final.ipynb` | `analise_final.ipynb` |
| `Projeto v2 (cópia).ipynb` | `projeto_v2.ipynb` |
| `Meu Notebook!.ipynb` | `meu_notebook.ipynb` |
| `dados Q1-2026.ipynb` | `dados_q1_2026.ipynb` |

Regras: minusculas, sem acentos, sem espacos (usar `_`), sem caracteres especiais.