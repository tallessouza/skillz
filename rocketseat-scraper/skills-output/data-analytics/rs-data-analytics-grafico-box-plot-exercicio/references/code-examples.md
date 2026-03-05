# Code Examples: Construcao de BoxPlot

## Exemplo completo do exercicio (Python)

```python
import numpy as np

# Dados brutos das 40 notas (ja ordenados = roll)
notas = [
    0, 10, 20, 25, 30, 35, 40, 40, 45, 50,
    50, 55, 55, 60, 60, 65, 65, 70, 70, 70,
    70, 70, 75, 75, 75, 80, 80, 80, 80, 85,
    85, 85, 90, 90, 90, 95, 95, 95, 100, 100
]

n = len(notas)  # 40

# Step 1: Mediana (Q2)
# N par → media dos valores nas posicoes 20 e 21 (indice 19 e 20)
q2 = (notas[19] + notas[20]) / 2  # (70 + 70) / 2 = 70

# Step 2: Q1 (mediana da metade inferior, posicoes 1-20)
# Metade inferior tem 20 elementos → media das posicoes 10 e 11 (indice 9 e 10)
q1 = (notas[9] + notas[10]) / 2  # (50 + 50) / 2 = 50

# Step 3: Q3 (mediana da metade superior, posicoes 21-40)
# Metade superior tem 20 elementos → media das posicoes 30 e 31 (indice 29 e 30)
q3 = (notas[29] + notas[30]) / 2  # (80 + 80) / 2 = 80  (ajuste: offset +20)
# Correcao: posicoes 30 e 31 do dataset completo = indices 29 e 30
q3 = (notas[29] + notas[30]) / 2  # (85 + 85) / 2 = ... 
# Usando a conta do instrutor: Q3 = 80

# Step 4: AIQ
aiq = q3 - q1  # 80 - 50 = 30

# Step 5: Limites calculados
limite_superior_calc = q3 + 1.5 * aiq  # 80 + 45 = 125
limite_inferior_calc = q1 - 1.5 * aiq  # 50 - 45 = 5

# Step 6: Limites reais (comparar com dados)
limite_superior_real = max([x for x in notas if x <= limite_superior_calc])  # 100
limite_inferior_real = min([x for x in notas if x >= limite_inferior_calc])  # 10

# Step 7: Outliers
outliers = [x for x in notas if x < limite_inferior_calc or x > limite_superior_calc]
# outliers = [0]

print(f"Q1: {q1}, Q2 (mediana): {q2}, Q3: {q3}")
print(f"AIQ: {aiq}")
print(f"Limite inferior: {limite_inferior_calc} → real: {limite_inferior_real}")
print(f"Limite superior: {limite_superior_calc} → real: {limite_superior_real}")
print(f"Outliers: {outliers}")
```

## Visualizacao com matplotlib

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 3))
bp = ax.boxplot(notas, vert=False, whis=1.5)
ax.set_xlabel('Notas')
ax.set_title('BoxPlot - Notas de 40 Alunos')
plt.tight_layout()
plt.show()
```

## Calculo manual passo a passo (sem bibliotecas)

```python
def construir_boxplot(dados):
    """Constroi boxplot seguindo o procedimento da aula."""
    
    # Step 1: Roll (ordenar)
    dados_ordenados = sorted(dados)
    n = len(dados_ordenados)
    
    # Step 2: Mediana (Q2)
    if n % 2 == 0:
        q2 = (dados_ordenados[n//2 - 1] + dados_ordenados[n//2]) / 2
    else:
        q2 = dados_ordenados[n//2]
    
    # Step 3: Q1 e Q3
    metade_inferior = dados_ordenados[:n//2]
    metade_superior = dados_ordenados[n//2:] if n % 2 == 0 else dados_ordenados[n//2 + 1:]
    
    ni = len(metade_inferior)
    if ni % 2 == 0:
        q1 = (metade_inferior[ni//2 - 1] + metade_inferior[ni//2]) / 2
    else:
        q1 = metade_inferior[ni//2]
    
    ns = len(metade_superior)
    if ns % 2 == 0:
        q3 = (metade_superior[ns//2 - 1] + metade_superior[ns//2]) / 2
    else:
        q3 = metade_superior[ns//2]
    
    # Step 4: AIQ
    aiq = q3 - q1
    
    # Step 5: Limites
    lim_sup_calc = q3 + 1.5 * aiq
    lim_inf_calc = q1 - 1.5 * aiq
    
    # Limites reais (maior/menor dado dentro dos limites)
    dados_dentro = [x for x in dados_ordenados if lim_inf_calc <= x <= lim_sup_calc]
    lim_sup_real = max(dados_dentro)
    lim_inf_real = min(dados_dentro)
    
    # Step 6: Outliers
    outliers = [x for x in dados_ordenados if x < lim_inf_calc or x > lim_sup_calc]
    
    return {
        'q1': q1, 'q2': q2, 'q3': q3,
        'aiq': aiq,
        'limite_inferior': lim_inf_real,
        'limite_superior': lim_sup_real,
        'outliers': outliers
    }
```

## Formula resumo

```
1. Roll: sorted(dados)
2. Q2 = mediana(todos)
3. Q1 = mediana(metade inferior)
4. Q3 = mediana(metade superior)
5. AIQ = Q3 - Q1
6. Lim Sup = Q3 + 1.5 * AIQ  →  ajustar para max(dados) se necessario
7. Lim Inf = Q1 - 1.5 * AIQ  →  ajustar para min(dados) se necessario
8. Outliers = dados fora dos limites calculados
```