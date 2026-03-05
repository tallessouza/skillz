# Code Examples: Percentil

## Exemplo completo da aula

### Dados da tabela de frequência

| Classe | f_i | F_ac |
|--------|-----|------|
| 160 \|— 164 | 7 | 7 |
| 164 \|— 168 | 4 | 11 |
| 168 \|— 172 | 5 | 16 |
| 172 \|— 176 | 8 | 24 |
| 176 \|— 180 | 16 | 40 |
| **Total** | **40** | |

### Cálculo do P20 (passo a passo)

```
1. K = 20/100

2. Posição = K × Σf = (20/100) × 40
   Simplificando: cortar zeros → 2 × 4 = 8
   Posição = 8

3. Localizar classe:
   F_ac = 7  → posição 8 NÃO está aqui (7 < 8)
   F_ac = 11 → posição 8 ESTÁ aqui (8 ≤ 11) ✓
   Classe: 164 |— 168

4. Extrair valores:
   LI = 164
   F_ant = 7 (acumulada da classe anterior)
   f_i = 4 (frequência da classe)
   h = 168 - 164 = 4

5. Aplicar fórmula:
   P20 = 164 + ((8 - 7) / 4) × 4
   P20 = 164 + (1/4) × 4
   P20 = 164 + 1
   P20 = 165

6. Interpretação:
   20% dos pesquisados têm valores abaixo de 165.
```

## Implementação em Python

```python
def calcular_percentil(classes, frequencias, percentil):
    """
    Calcula percentil para dados agrupados em classes.
    
    Args:
        classes: lista de tuplas (limite_inferior, limite_superior)
        frequencias: lista de frequências absolutas
        percentil: valor do percentil desejado (1 a 99)
    
    Returns:
        tuple: (valor_percentil, interpretacao)
    """
    soma_freq = sum(frequencias)
    k = percentil / 100
    posicao = k * soma_freq
    
    # Frequência acumulada
    freq_acumulada = []
    acumulado = 0
    for f in frequencias:
        acumulado += f
        freq_acumulada.append(acumulado)
    
    # Localizar classe
    for i, f_ac in enumerate(freq_acumulada):
        if posicao <= f_ac:
            li = classes[i][0]
            h = classes[i][1] - classes[i][0]
            f_i = frequencias[i]
            f_ant = freq_acumulada[i - 1] if i > 0 else 0
            
            valor = li + ((posicao - f_ant) / f_i) * h
            interpretacao = (
                f"P{percentil} = {valor:.2f} → "
                f"{percentil}% dos dados estão abaixo de {valor:.2f}"
            )
            return valor, interpretacao
    
    return None, "Erro: posição fora do alcance"


# Exemplo da aula
classes = [(160, 164), (164, 168), (168, 172), (172, 176), (176, 180)]
frequencias = [7, 4, 5, 8, 16]

valor, interpretacao = calcular_percentil(classes, frequencias, 20)
print(interpretacao)
# P20 = 165.00 → 20% dos dados estão abaixo de 165.00
```

## Variações: outros percentis com os mesmos dados

```python
# P50 (Mediana)
valor, interp = calcular_percentil(classes, frequencias, 50)
# Posição = 0.5 × 40 = 20 → Classe 172|—176
# P50 = 172 + ((20 - 16) / 8) × 4 = 172 + 2 = 174

# P25 (= Q1)
valor, interp = calcular_percentil(classes, frequencias, 25)
# Posição = 0.25 × 40 = 10 → Classe 164|—168
# P25 = 164 + ((10 - 7) / 4) × 4 = 164 + 3 = 167

# P75 (= Q3)
valor, interp = calcular_percentil(classes, frequencias, 75)
# Posição = 0.75 × 40 = 30 → Classe 176|—180
# P75 = 176 + ((30 - 24) / 16) × 4 = 176 + 1.5 = 177.5

# P90
valor, interp = calcular_percentil(classes, frequencias, 90)
# Posição = 0.9 × 40 = 36 → Classe 176|—180
# P90 = 176 + ((36 - 24) / 16) × 4 = 176 + 3 = 179
```

## Equivalências entre medidas de posição

```
P25  = Q1  = D2.5  (primeiro quartil)
P50  = Q2  = D5    (mediana)
P75  = Q3  = D7.5  (terceiro quartil)
P10  = D1           (primeiro decil)
P20  = D2           (segundo decil)
P30  = D3           (terceiro decil)
```