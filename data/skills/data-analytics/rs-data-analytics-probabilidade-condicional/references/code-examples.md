# Code Examples: Probabilidade Condicional

## Exemplo 1: Calculo manual do instrutor

Dados do e-commerce:
- 1000 visitantes
- 300 adicionaram ao carrinho
- 90 finalizaram compra

```
P(compra | carrinho) = 90 / 300
                     = 9 / 30      (simplificando por 10)
                     = 3 / 10      (simplificando por 3)
                     = 30 / 100    (multiplicando por 10 para porcentagem)
                     = 30%
```

## Exemplo 2: Funil completo em Python

```python
visitantes = 1000
carrinho = 300
compras = 90

# Probabilidade INCONDICIONAL de compra
p_compra = compras / visitantes  # 9%

# Probabilidade CONDICIONAL de compra dado carrinho
p_compra_dado_carrinho = compras / carrinho  # 30%

# Taxa de adicao ao carrinho
p_carrinho = carrinho / visitantes  # 30%

# Verificacao: P(compra) = P(compra|carrinho) * P(carrinho)
# 0.09 = 0.30 * 0.30 ✓
assert abs(p_compra - p_compra_dado_carrinho * p_carrinho) < 1e-10
```

## Exemplo 3: Com pandas — analise de funil real

```python
import pandas as pd

# Dados de um e-commerce
df = pd.DataFrame({
    "usuario": range(1, 1001),
    "visitou": [True] * 1000,
    "carrinho": [True] * 300 + [False] * 700,
    "comprou": [True] * 90 + [False] * 210 + [False] * 700
})

# P(compra | carrinho) — filtre pela condicao primeiro
usuarios_carrinho = df[df["carrinho"] == True]
p_condicional = usuarios_carrinho["comprou"].mean()
print(f"P(compra | carrinho) = {p_condicional:.0%}")  # 30%

# Compare com P(compra) incondicional
p_incondicional = df["comprou"].mean()
print(f"P(compra) = {p_incondicional:.0%}")  # 9%
```

## Exemplo 4: Churn condicional

```python
# P(churn | inativo 30+ dias)
inativos = df[df["dias_sem_login"] >= 30]
p_churn_inativo = inativos["churned"].mean()

# P(churn | ativo)
ativos = df[df["dias_sem_login"] < 30]
p_churn_ativo = ativos["churned"].mean()

print(f"Churn entre inativos: {p_churn_inativo:.1%}")
print(f"Churn entre ativos: {p_churn_ativo:.1%}")
# A diferenca mostra o impacto da inatividade
```

## Exemplo 5: Teste A/B como probabilidade condicional

```python
# P(conversao | grupo_A) vs P(conversao | grupo_B)
grupo_a = df[df["grupo"] == "A"]
grupo_b = df[df["grupo"] == "B"]

p_conv_a = grupo_a["converteu"].mean()
p_conv_b = grupo_b["converteu"].mean()

lift = (p_conv_b - p_conv_a) / p_conv_a
print(f"Grupo A: {p_conv_a:.1%}")
print(f"Grupo B: {p_conv_b:.1%}")
print(f"Lift: {lift:.1%}")
```

## Exemplo 6: Multiplas condicoes encadeadas (funil)

```python
# Cada etapa do funil e uma probabilidade condicional
etapas = ["visitou", "viu_produto", "carrinho", "checkout", "comprou"]

for i in range(1, len(etapas)):
    anterior = etapas[i - 1]
    atual = etapas[i]
    
    # Filtra por quem completou a etapa anterior (condicao)
    base = df[df[anterior] == True]
    taxa = base[atual].mean()
    
    print(f"P({atual} | {anterior}) = {taxa:.1%}")
```