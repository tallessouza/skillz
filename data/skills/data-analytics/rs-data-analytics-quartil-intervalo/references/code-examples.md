# Code Examples: Quartil para Dados Agrupados em Intervalos

## Implementacao completa em Python

```python
def calcular_quartis_intervalo(intervalos, frequencias):
    """
    Calcula Q1, Q2 e Q3 para dados agrupados em intervalos.
    
    Args:
        intervalos: lista de tuplas (limite_inferior, limite_superior)
        frequencias: lista de frequencias (Fi) para cada intervalo
    
    Returns:
        dict com Q1, Q2, Q3
    """
    # Passo 1: Frequencia acumulada
    fac = []
    acumulado = 0
    for f in frequencias:
        acumulado += f
        fac.append(acumulado)
    
    soma_fi = fac[-1]  # ΣFi = ultimo valor da Fac
    
    # Passo 2: Calcular cada quartil
    resultados = {}
    ks = {"Q1": 1/4, "Q2": 1/2, "Q3": 3/4}
    
    for nome, k in ks.items():
        posicao = k * soma_fi
        
        # Encontrar classe
        for i, acum in enumerate(fac):
            if posicao <= acum:
                classe_idx = i
                break
        
        li = intervalos[classe_idx][0]
        h = intervalos[classe_idx][1] - intervalos[classe_idx][0]
        fi = frequencias[classe_idx]
        fac_anterior = fac[classe_idx - 1] if classe_idx > 0 else 0
        
        quartil = li + ((posicao - fac_anterior) / fi) * h
        resultados[nome] = quartil
    
    return resultados


# Exemplo da aula
intervalos = [(160, 164), (164, 168), (168, 172), (172, 176), (176, 180)]
frequencias = [7, 4, 5, 8, 16]

resultado = calcular_quartis_intervalo(intervalos, frequencias)
# {'Q1': 167.0, 'Q2': 174.0, 'Q3': 177.5}
```

## Calculo passo a passo (estilo didatico)

```python
# Dados da pesquisa de alturas
intervalos = [(160,164), (164,168), (168,172), (172,176), (176,180)]
fi = [7, 4, 5, 8, 16]

# 1. Montar frequencia acumulada
fac = [7, 11, 16, 24, 40]
soma_fi = 40

# === Q1 ===
posicao_q1 = (1/4) * 40  # = 10
# Fac: 7 < 10 <= 11 → classe indice 1 (164-168)
li = 164
fac_anterior = 7   # Fac da classe anterior (indice 0)
fi_classe = 4      # Fi da classe atual (indice 1)
h = 168 - 164      # = 4

q1 = 164 + ((10 - 7) / 4) * 4
# q1 = 164 + (3/4) * 4 = 164 + 3 = 167

# === Q2 ===
posicao_q2 = (1/2) * 40  # = 20
# Fac: 16 < 20 <= 24 → classe indice 3 (172-176)
li = 172
fac_anterior = 16
fi_classe = 8
h = 176 - 172  # = 4

q2 = 172 + ((20 - 16) / 8) * 4
# q2 = 172 + (4/8) * 4 = 172 + 2 = 174

# === Q3 ===
posicao_q3 = (3/4) * 40  # = 30
# Fac: 24 < 30 <= 40 → classe indice 4 (176-180)
li = 176
fac_anterior = 24
fi_classe = 16
h = 180 - 176  # = 4

q3 = 176 + ((30 - 24) / 16) * 4
# q3 = 176 + (6/16) * 4 = 176 + 1.5 = 177.5
```

## Versao com tabela formatada

```python
def mostrar_tabela_quartis(intervalos, frequencias):
    """Exibe tabela completa com Fac e calculo dos quartis."""
    fac = []
    acum = 0
    for f in frequencias:
        acum += f
        fac.append(acum)
    
    print(f"{'Intervalo':>12} | {'Fi':>4} | {'Fac':>4}")
    print("-" * 28)
    for i, (intervalo, f) in enumerate(zip(intervalos, frequencias)):
        print(f"{intervalo[0]}-{intervalo[1]:>7} | {f:>4} | {fac[i]:>4}")
    print(f"\nΣFi = {fac[-1]}")
    
    resultado = calcular_quartis_intervalo(intervalos, frequencias)
    print(f"\nQ1 = {resultado['Q1']}")
    print(f"Q2 = {resultado['Q2']}")
    print(f"Q3 = {resultado['Q3']}")
```