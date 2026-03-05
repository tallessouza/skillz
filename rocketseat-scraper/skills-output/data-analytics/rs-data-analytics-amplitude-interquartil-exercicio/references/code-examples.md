# Code Examples: Amplitude Interquartil

## Exemplo da aula: Grafico de pontos

### Dados extraidos do grafico

```
Eixo X:  6   7   8   9   10  11  12  13  14
Pontos:  0   1   2   1   3   0   2   0   1
```

### Conversao para conjunto numerico

```python
# Leitura do grafico de pontos
frequencias = {7: 1, 8: 2, 9: 1, 10: 3, 12: 2, 14: 1}
# Valores sem pontos (6, 11, 13) nao entram

dados = []
for valor, freq in sorted(frequencias.items()):
    dados.extend([valor] * freq)

# Resultado: [7, 8, 8, 9, 10, 10, 10, 12, 12, 14]
```

### Calculo passo a passo

```python
dados = [7, 8, 8, 9, 10, 10, 10, 12, 12, 14]
n = len(dados)  # 10 (par)

# Passo 1: Q2 (mediana)
# Par → media dos dois centrais (posicoes 4 e 5, indice 0-based)
q2 = (dados[4] + dados[5]) / 2  # (10 + 10) / 2 = 10.0

# Passo 2: Dividir em metades
metade_inferior = dados[:5]   # [7, 8, 8, 9, 10]
metade_superior = dados[5:]   # [10, 10, 12, 12, 14]

# Passo 3: Q1 (mediana da metade inferior)
# 5 elementos (impar) → valor central direto (indice 2)
q1 = metade_inferior[2]  # 8

# Passo 4: Q3 (mediana da metade superior)
# 5 elementos (impar) → valor central direto (indice 2)
q3 = metade_superior[2]  # 12

# Passo 5: IQR
iqr = q3 - q1  # 12 - 8 = 4
print(f"Q1={q1}, Q2={q2}, Q3={q3}, IQR={iqr}")
# Q1=8, Q2=10.0, Q3=12, IQR=4
```

### Usando numpy para verificacao

```python
import numpy as np

dados = [7, 8, 8, 9, 10, 10, 10, 12, 12, 14]
q1 = np.percentile(dados, 25, interpolation='midpoint')
q3 = np.percentile(dados, 75, interpolation='midpoint')
iqr = q3 - q1
print(f"Q1={q1}, Q3={q3}, IQR={iqr}")
```

### Variacao: conjunto impar de dados

```python
# Se tivessemos 9 elementos
dados_impar = [7, 8, 8, 9, 10, 10, 12, 12, 14]
n = 9  # impar

# Q2 direto: posicao central (indice 4)
q2 = dados_impar[4]  # 10

# Metade inferior (sem incluir Q2): [7, 8, 8, 9]
# 4 elementos (par) → media dos centrais
q1 = (8 + 8) / 2  # 8.0

# Metade superior (sem incluir Q2): [10, 12, 12, 14]
# 4 elementos (par) → media dos centrais
q3 = (12 + 12) / 2  # 12.0

iqr = q3 - q1  # 4.0
```

### Funcao generica reutilizavel

```python
def iqr_manual(dados):
    """Calcula IQR passo a passo, como ensinado na aula."""
    dados = sorted(dados)
    n = len(dados)
    
    def mediana(arr):
        m = len(arr)
        if m % 2 == 0:
            return (arr[m//2 - 1] + arr[m//2]) / 2
        return arr[m//2]
    
    q2 = mediana(dados)
    metade_inf = dados[:n//2]
    metade_sup = dados[n//2:] if n % 2 == 0 else dados[n//2 + 1:]
    
    q1 = mediana(metade_inf)
    q3 = mediana(metade_sup)
    iqr = q3 - q1
    
    return {
        'dados_ordenados': dados,
        'n': n,
        'q1': q1,
        'q2': q2,
        'q3': q3,
        'iqr': iqr
    }

# Teste com dados da aula
resultado = iqr_manual([7, 8, 8, 9, 10, 10, 10, 12, 12, 14])
print(resultado)
# {'dados_ordenados': [7, 8, 8, 9, 10, 10, 10, 12, 12, 14],
#  'n': 10, 'q1': 8, 'q2': 10.0, 'q3': 12, 'iqr': 4}
```