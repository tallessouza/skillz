# Code Examples: Análise Combinatória no Dia a Dia

## Python — Implementação dos Cenários da Aula

### Cenário 1: Seleção de Amostras (Combinação)

```python
from math import comb
import random

# Quantas amostras diferentes de 100 pessoas são possíveis em 10.000?
total_combinacoes = comb(10000, 100)
print(f"Combinações possíveis: {total_combinacoes}")
# Número astronomicamente grande — por isso amostragem aleatória é necessária

# Na prática, selecionar a amostra:
banco_clientes = list(range(1, 10001))  # IDs de 1 a 10.000
amostra = random.sample(banco_clientes, 100)  # sem repetição
print(f"Amostra selecionada: {len(amostra)} clientes únicos")
```

### Cenário 2: Cruzamento de Variáveis (Combinação)

```python
from itertools import combinations

variaveis = ["idade", "religiao", "renda", "profissao", "escolaridade"]

# Todas as combinações possíveis de 3 variáveis para cruzamento
cruzamentos = list(combinations(variaveis, 3))
print(f"Total de cruzamentos possíveis: {len(cruzamentos)}")
# C(5,3) = 10

for i, cruzamento in enumerate(cruzamentos, 1):
    print(f"  Visão {i}: {' × '.join(cruzamento)}")
```

**Saída:**
```
Total de cruzamentos possíveis: 10
  Visão 1: idade × religiao × renda
  Visão 2: idade × religiao × profissao
  Visão 3: idade × religiao × escolaridade
  ...
```

### Cenário 3: Planejamento de Campanhas (Princípio Multiplicativo)

```python
from itertools import product

campanhas = ["campanha_A", "campanha_B", "campanha_C"]
canais = ["whatsapp", "email", "telefone", "sms"]
mensagens = ["mensagem_1", "mensagem_2"]

# Princípio multiplicativo: 3 × 4 × 2 = 24
cenarios = list(product(campanhas, canais, mensagens))
print(f"Total de cenários: {len(cenarios)}")

for i, (camp, canal, msg) in enumerate(cenarios, 1):
    print(f"  {i}. {camp} | {canal} | {msg}")
```

### Função Auxiliar: Decidir a Técnica

```python
def escolher_tecnica(ordem_importa: bool, pode_repetir: bool, categorias_independentes: bool) -> str:
    """
    Aplica o framework de decisão da aula.
    """
    if categorias_independentes:
        return "Princípio Fundamental da Contagem (multiplicativo)"
    
    if ordem_importa:
        if pode_repetir:
            return "Arranjo com repetição (n^k)"
        return "Arranjo simples (A(n,k))"
    else:
        if pode_repetir:
            return "Combinação com repetição"
        return "Combinação simples (C(n,k))"

# Cenário 1: amostra de clientes
print(escolher_tecnica(ordem_importa=False, pode_repetir=False, categorias_independentes=False))
# → "Combinação simples (C(n,k))"

# Cenário 2: cruzamento de variáveis
print(escolher_tecnica(ordem_importa=False, pode_repetir=False, categorias_independentes=False))
# → "Combinação simples (C(n,k))"

# Cenário 3: planejamento de campanhas
print(escolher_tecnica(ordem_importa=False, pode_repetir=False, categorias_independentes=True))
# → "Princípio Fundamental da Contagem (multiplicativo)"
```

### SQL — Cruzamento de Variáveis na Prática

```sql
-- Cenário 2 aplicado: gerar visão cruzada de 3 variáveis para dashboard
SELECT 
    faixa_idade,
    faixa_renda,
    profissao,
    COUNT(*) as total_clientes,
    AVG(valor_compra) as ticket_medio
FROM clientes
GROUP BY faixa_idade, faixa_renda, profissao
ORDER BY total_clientes DESC;
```