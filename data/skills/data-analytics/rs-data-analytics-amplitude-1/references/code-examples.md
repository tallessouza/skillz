# Code Examples: Amplitude (Range)

## Exemplo 1: Cálculo básico (do transcript)

### Empresa A
```
Valores: [2800, 2900, 3100, 3200]
Média: (2800 + 2900 + 3100 + 3200) / 4 = 3000
Amplitude: 3200 - 2800 = 400
```

### Empresa B
```
Valores: [1000, 2000, 4000, 5000]
Média: (1000 + 2000 + 4000 + 5000) / 4 = 3000
Amplitude: 5000 - 1000 = 4000
```

## Exemplo 2: Python com pandas

```python
import pandas as pd

# Dados das empresas
empresa_a = pd.Series([2800, 2900, 3100, 3200])
empresa_b = pd.Series([1000, 2000, 4000, 5000])

# Amplitude
amplitude_a = empresa_a.max() - empresa_a.min()  # 400
amplitude_b = empresa_b.max() - empresa_b.min()  # 4000

# Comparação completa
for nome, dados in [("Empresa A", empresa_a), ("Empresa B", empresa_b)]:
    print(f"{nome}:")
    print(f"  Média: R$ {dados.mean():,.0f}")
    print(f"  Amplitude: R$ {dados.max() - dados.min():,.0f}")
    print()
```

## Exemplo 3: SQL comparando grupos

```sql
SELECT
    empresa,
    AVG(salario) AS media_salarial,
    MAX(salario) - MIN(salario) AS amplitude,
    MIN(salario) AS menor_salario,
    MAX(salario) AS maior_salario
FROM funcionarios
WHERE cargo = 'analista_dados'
GROUP BY empresa
ORDER BY amplitude ASC;  -- Mais concentrado primeiro
```

## Exemplo 4: Função reutilizável

```python
def analisar_dispersao(nome: str, valores: list[float]) -> dict:
    """Calcula média e amplitude de um conjunto de dados."""
    media = sum(valores) / len(valores)
    amplitude = max(valores) - min(valores)

    return {
        "grupo": nome,
        "media": media,
        "amplitude": amplitude,
        "min": min(valores),
        "max": max(valores),
        "concentracao": "alta" if amplitude < media * 0.2 else "baixa",
    }
```

## Exemplo 5: Interpretação visual (texto)

```
Empresa A: |----[==*==]----| amplitude = 400
Empresa B: |[=======*=======]| amplitude = 4000

* = média (3000 em ambas)
[ ] = range dos dados
```

A visualização mostra que, apesar do mesmo centro (média), a dispersão é radicalmente diferente.