# Code Examples: Probabilidade Aplicada a Negócios

## Exemplo completo da aula: Campanha de Email Marketing

### Dados do cenário

```python
# Cenário apresentado pelo instrutor
emails_enviados = 1000
pessoas_clicaram = 200
pessoas_compraram = 50
```

### Pergunta 1: Probabilidade de clique

```python
# "Qual é a probabilidade de um cliente aleatório ter clicado no e-mail?"
# Espaço amostral (N_S) = 1000 (todos que receberam)
# Casos favoráveis (N_E) = 200 (quem clicou)

p_clique = 200 / 1000
# = 0.20
# = 20%

# Simplificação mostrada pelo instrutor: 200/1000 → 20/100 → 20%
```

### Pergunta 2: Probabilidade de compra

```python
# "Qual é a probabilidade de um cliente aleatório ter feito uma compra?"
# Espaço amostral (N_S) = 1000 (todos que receberam)
# Casos favoráveis (N_E) = 50 (quem comprou)

p_compra = 50 / 1000
# = 0.05
# = 5%
```

### Pergunta 3: Probabilidade condicional — compra dado clique

```python
# "Entre os clientes que clicaram, quantos acabaram comprando?"
# ATENÇÃO: espaço amostral MUDOU! Agora é só quem clicou.
# Espaço amostral (N_S) = 200 (quem clicou — condição)
# Casos favoráveis (N_E) = 50 (quem comprou)

p_compra_dado_clique = 50 / 200
# = 0.25
# = 25%
```

### Análise de funil completa

```python
# Construção do funil como apresentado na aula
total = 1000
cliques = 200
compras = 50

# Métricas do funil
ctr = cliques / total                    # 20% — taxa de clique
taxa_nao_clicou = 1 - ctr               # 80% — abandonaram no email
taxa_conversao = compras / total         # 5% — conversão geral
conversao_pos_clique = compras / cliques # 25% — conversão após clique

print(f"Funil da Campanha:")
print(f"  Enviados:           {total}")
print(f"  Clicaram:           {cliques} ({ctr:.0%} CTR)")
print(f"  Não clicaram:       {total - cliques} ({taxa_nao_clicou:.0%})")
print(f"  Compraram:          {compras} ({taxa_conversao:.0%} do total)")
print(f"  Conversão pós-clique: {conversao_pos_clique:.0%}")
```

Saída:
```
Funil da Campanha:
  Enviados:           1000
  Clicaram:           200 (20% CTR)
  Não clicaram:       800 (80%)
  Compraram:          50 (5% do total)
  Conversão pós-clique: 25%
```

### Variação: aplicando a outros cenários

```python
def analisar_funil(enviados, cliques, compras):
    """Aplica a mesma análise de probabilidade a qualquer campanha."""
    ctr = cliques / enviados
    conversao_total = compras / enviados
    conversao_pos_clique = compras / cliques if cliques > 0 else 0
    
    return {
        "ctr": ctr,
        "conversao_total": conversao_total,
        "conversao_pos_clique": conversao_pos_clique,
        "taxa_abandono": 1 - ctr,
        "analise": {
            "publico_ruim": ctr < 0.10,          # menos de 10% clicou
            "oferta_fraca": conversao_pos_clique < 0.05,  # menos de 5% converteu após clique
            "campanha_ok": conversao_total >= 0.03,  # pelo menos 3% de conversão
        }
    }

# Cenário da aula
resultado = analisar_funil(1000, 200, 50)

# Outro cenário para comparação
resultado2 = analisar_funil(5000, 250, 100)
# CTR = 5%, conversão total = 2%, conversão pós-clique = 40%
# Interpretação: público mal segmentado (CTR baixo), mas oferta boa (40% converte)
```

### Três formatos de saída (como enfatizado na aula)

```python
# O instrutor sempre mostra os três formatos
valor = 200 / 1000

fracao = f"200/1000"           # Fração original
decimal = f"{valor}"           # 0.2
porcentagem = f"{valor:.0%}"   # 20%

print(f"Fração: {fracao}")
print(f"Decimal: {decimal}")
print(f"Porcentagem: {porcentagem}")
```