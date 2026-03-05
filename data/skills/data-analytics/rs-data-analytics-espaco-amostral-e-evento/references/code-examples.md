# Code Examples: Espaço Amostral e Evento

## Exemplo 1: Dado de 6 faces

### Definindo o espaço amostral
```python
# Espaço amostral de um dado
S = {1, 2, 3, 4, 5, 6}
```

### Definindo eventos
```python
# Evento 1: face par
E1 = {x for x in S if x % 2 == 0}  # {2, 4, 6}

# Evento 2: face 5
E2 = {5}

# Evento 3: face ímpar
E3 = {x for x in S if x % 2 != 0}  # {1, 3, 5}
```

### Calculando probabilidades
```python
def probabilidade(evento, espaco_amostral):
    return len(evento) / len(espaco_amostral)

P_E1 = probabilidade(E1, S)  # 3/6 = 0.5
P_E2 = probabilidade(E2, S)  # 1/6 ≈ 0.167
P_E3 = probabilidade(E3, S)  # 3/6 = 0.5
```

### Verificando complementaridade
```python
def sao_complementares(e1, e2, s):
    intersecao_vazia = len(e1 & e2) == 0
    uniao_igual_s = (e1 | e2) == s
    return intersecao_vazia and uniao_igual_s

sao_complementares(E1, E3, S)  # True (par e ímpar são complementares)
sao_complementares(E1, E2, S)  # False (par e {5} não cobrem todo S)
```

### Classificando eventos
```python
def classificar_evento(evento, espaco_amostral):
    if evento == espaco_amostral:
        return "Evento Certo (P=1)"
    elif len(evento) == 0:
        return "Evento Impossível (P=0)"
    else:
        p = len(evento) / len(espaco_amostral)
        return f"Evento Comum (P={p:.4f})"

# Evento certo: sair número natural
E_natural = {x for x in S if x > 0}  # {1,2,3,4,5,6} = S
classificar_evento(E_natural, S)  # "Evento Certo (P=1)"

# Evento impossível: sair 7
E_sete = {x for x in S if x == 7}  # set()
classificar_evento(E_sete, S)  # "Evento Impossível (P=0)"
```

## Exemplo 2: Moeda

```python
S_moeda = {"cara", "coroa"}
E_cara = {"cara"}

P_cara = probabilidade(E_cara, S_moeda)  # 1/2 = 0.5 = 50%
```

## Exemplo 3: Aplicação em SQL (Data Analytics)

```sql
-- Espaço amostral: todos os pedidos
-- Evento: pedidos com valor > 1000

-- Probabilidade de um pedido aleatório ter valor > 1000
SELECT
  COUNT(*) FILTER (WHERE valor > 1000)::decimal / COUNT(*) AS probabilidade
FROM pedidos;

-- Verificar que P(valor > 1000) + P(valor <= 1000) = 1 (complementares)
SELECT
  COUNT(*) FILTER (WHERE valor > 1000)::decimal / COUNT(*) AS p_maior,
  COUNT(*) FILTER (WHERE valor <= 1000)::decimal / COUNT(*) AS p_menor_igual,
  1.0 AS soma_esperada
FROM pedidos;
```