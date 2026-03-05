# Code Examples: Quartis

## Exemplo da aula (passo a passo)

**Dados originais:** 8, 4, 10, 2, 9, 15, 17, 10, 5

### Passo 1: Ordenar
```
2, 4, 5, 8, 8, 9, 10, 10, 15, 17
```
*(O instrutor lista 9 valores: 2, 4, 5, 8, 8, 9, 10, 10, 17 — conferindo a transcricao, o 15 aparece na lista original)*

### Passo 2: Q2 (mediana)
- 9 elementos (impar)
- Posicao central: 5a posicao
- Valor: **8**
- Metade inferior: [2, 4, 5, 8]
- Metade superior: [9, 10, 10, 17]

### Passo 3: Q1
- Metade inferior: [2, 4, 5, 8] — 4 elementos (par)
- Valores centrais: 4 e 5
- Q1 = (4 + 5) / 2 = **4.5**

### Passo 4: Q3
- Metade superior: [9, 10, 10, 17] — 4 elementos (par)
- Valores centrais: 10 e 10
- Q3 = (9 + 10) / 2 = **9.5**

## Implementacao Python completa

```python
def calcular_quartis(dados_brutos: list[float]) -> dict[str, float]:
    """Calcula Q1, Q2, Q3 pelo metodo da mediana das metades."""
    dados = sorted(dados_brutos)
    n = len(dados)

    def mediana(arr):
        m = len(arr)
        if m % 2 == 1:
            return arr[m // 2]
        return (arr[m // 2 - 1] + arr[m // 2]) / 2

    q2 = mediana(dados)

    if n % 2 == 1:
        inferior = dados[:n // 2]
        superior = dados[n // 2 + 1:]
    else:
        inferior = dados[:n // 2]
        superior = dados[n // 2:]

    q1 = mediana(inferior)
    q3 = mediana(superior)

    return {"Q1": q1, "Q2": q2, "Q3": q3}


# Exemplo da aula
resultado = calcular_quartis([8, 4, 10, 2, 9, 15, 17, 10, 5])
print(resultado)  # {'Q1': 4.5, 'Q2': 8, 'Q3': 9.5}
```

## Variacao: conjunto par de elementos

```python
dados = [3, 7, 8, 12, 15, 20]
# N = 6 (par)
# Q2 = (8 + 12) / 2 = 10.0
# Metade inferior: [3, 7, 8] → Q1 = 7
# Metade superior: [12, 15, 20] → Q3 = 15

resultado = calcular_quartis(dados)
print(resultado)  # {'Q1': 7, 'Q2': 10.0, 'Q3': 15}
```

## SQL: Quartis com funcoes de janela

```sql
SELECT
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY valor) AS q1,
    PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY valor) AS q2,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY valor) AS q3
FROM medidas;
```

**Nota:** `PERCENTILE_CONT` usa interpolacao linear, que pode dar resultados ligeiramente diferentes do metodo manual para conjuntos pequenos.