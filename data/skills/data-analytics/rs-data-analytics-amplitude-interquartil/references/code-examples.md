# Code Examples: Amplitude Interquartil

## Exemplo da aula — passo a passo

### Dados originais
```
5, 5, 7, 10, 12, 12, 14, 11, 8
```

### Passo 1: Rol (ordenacao crescente)
```
5, 5, 7, 8, 10, 11, 12, 12, 14
```
9 elementos no total.

### Passo 2: Encontrar Q2 (mediana)
```
9 elementos → impar → elemento central = posicao 5
Posicoes: 1:5, 2:5, 3:7, 4:8, [5:10], 6:11, 7:12, 8:12, 9:14
Q2 = 10
```

### Passo 3: Encontrar Q1
```
Metade inferior (posicoes 1-4): 5, 5, 7, 8
4 elementos → par → media dos dois centrais
Q1 = (5 + 7) / 2 = 12 / 2 = 6
```

### Passo 4: Encontrar Q3
```
Metade superior (posicoes 6-9): 11, 12, 12, 14
4 elementos → par → media dos dois centrais
Q3 = (12 + 12) / 2 = 24 / 2 = 12
```

### Passo 5: IQR
```
IQR = Q3 - Q1 = 12 - 6 = 6
```

## Implementacao em Python (completa)

```python
def calcular_iqr_manual(dados):
    """Calcula IQR seguindo o metodo ensinado na aula."""
    # Passo 1: Rol
    rol = sorted(dados)
    n = len(rol)
    
    # Passo 2: Q2 (mediana)
    if n % 2 != 0:
        # Impar: elemento central
        pos_mediana = n // 2
        q2 = rol[pos_mediana]
        metade_inferior = rol[:pos_mediana]
        metade_superior = rol[pos_mediana + 1:]
    else:
        # Par: media dos dois centrais
        pos1 = n // 2 - 1
        pos2 = n // 2
        q2 = (rol[pos1] + rol[pos2]) / 2
        metade_inferior = rol[:n // 2]
        metade_superior = rol[n // 2:]
    
    # Passo 3: Q1 (mediana da metade inferior)
    q1 = _mediana(metade_inferior)
    
    # Passo 4: Q3 (mediana da metade superior)
    q3 = _mediana(metade_superior)
    
    # Passo 5: IQR
    iqr = q3 - q1
    
    return {
        "rol": rol,
        "Q1": q1,
        "Q2": q2,
        "Q3": q3,
        "IQR": iqr
    }


def _mediana(valores):
    """Calcula mediana de uma lista ordenada."""
    n = len(valores)
    if n % 2 != 0:
        return valores[n // 2]
    else:
        return (valores[n // 2 - 1] + valores[n // 2]) / 2


# Teste com os dados da aula
resultado = calcular_iqr_manual([5, 5, 7, 10, 12, 12, 14, 11, 8])
print(resultado)
# {'rol': [5, 5, 7, 8, 10, 11, 12, 12, 14], 'Q1': 6.0, 'Q2': 10, 'Q3': 12.0, 'IQR': 6.0}
```

## Variacao: conjunto com quantidade par

```python
dados_par = [3, 7, 8, 12, 15, 20]
# Rol: 3, 7, 8, 12, 15, 20 (ja ordenado)
# 6 elementos → par
# Q2 = (8 + 12) / 2 = 10
# Metade inferior: 3, 7, 8 → Q1 = 7
# Metade superior: 12, 15, 20 → Q3 = 15
# IQR = 15 - 7 = 8
```

## Aplicacao: deteccao de outliers com IQR

```python
def detectar_outliers(dados):
    resultado = calcular_iqr_manual(dados)
    q1, q3, iqr = resultado["Q1"], resultado["Q3"], resultado["IQR"]
    
    limite_inferior = q1 - 1.5 * iqr
    limite_superior = q3 + 1.5 * iqr
    
    outliers = [x for x in dados if x < limite_inferior or x > limite_superior]
    
    return {
        "limites": (limite_inferior, limite_superior),
        "outliers": outliers
    }
```