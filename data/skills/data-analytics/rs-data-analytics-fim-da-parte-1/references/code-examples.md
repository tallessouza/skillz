# Code Examples: Análise Combinatória Aplicada a Dados

## Princípio Fundamental da Contagem

### Princípio Multiplicativo (cenários simultâneos)
```python
# Quantos cenários de teste para um formulário?
# 3 tipos de input × 5 valores de teste × 2 estados (válido/inválido)
cenarios_teste = 3 * 5 * 2  # 30 cenários

# Em data analytics: cruzamento de dimensões
# 4 regiões × 12 meses × 3 categorias de produto
cruzamentos = 4 * 12 * 3  # 144 combinações no relatório
```

### Princípio Aditivo (cenários excludentes)
```python
# Fontes de dados alternativas: API OU arquivo OU banco
# API: 3 endpoints, Arquivo: 2 formatos, Banco: 4 tabelas
fontes_possiveis = 3 + 2 + 4  # 9 fontes possíveis (escolher UMA)
```

## Fatorial
```python
from math import factorial

# De quantas formas posso ordenar 5 etapas de um pipeline ETL?
ordens_possiveis = factorial(5)  # 120 ordens

# De quantas formas posso rankear 10 produtos por vendas?
rankings = factorial(10)  # 3.628.800 rankings possíveis
```

## Arranjo (ordem importa, subconjunto)
```python
from math import perm  # Python 3.8+

# Escolher 3 métricas de 10 para um dashboard (posição importa: topo, meio, base)
disposicoes = perm(10, 3)  # 720 arranjos

# Top 5 clientes de um pool de 50 (1º lugar ≠ 5º lugar)
rankings_top5 = perm(50, 5)  # 254.251.200
```

## Permutação (ordem importa, todos os elementos)
```python
from math import factorial

# Ordenar 7 tarefas de análise em sequência
sequencias = factorial(7)  # 5.040 sequências possíveis

# Permutação com repetição: senha de 4 dígitos (0-9, com repetição)
senhas = 10 ** 4  # 10.000 possibilidades
```

## Combinação (ordem NÃO importa, subconjunto)
```python
from math import comb

# Selecionar 3 colunas de 15 para análise (ordem irrelevante)
selecoes = comb(15, 3)  # 455 seleções possíveis

# Selecionar amostra de 100 registros de 10.000
amostras = comb(10000, 100)  # número astronomicamente grande

# Pares de variáveis para correlação
# De 8 métricas, quantos pares únicos posso correlacionar?
pares_correlacao = comb(8, 2)  # 28 pares
```

## Aplicação integrada: Planejamento de teste A/B
```python
from math import comb, prod

# Cenário: testar variações de uma landing page
# 3 headlines, 4 CTAs, 2 cores de botão

# Total de variações (princípio multiplicativo)
variacoes_totais = prod([3, 4, 2])  # 24 variações

# Se só posso testar 2 variações por vez, quantos testes A/B preciso?
testes_necessarios = comb(24, 2)  # 276 pares de teste possíveis

print(f"Variações: {variacoes_totais}")
print(f"Testes A/B possíveis: {testes_necessarios}")
# Insight: impossível testar tudo — precisa priorizar
```

## Aplicação integrada: Seleção de features para modelo
```python
from math import comb

# 20 features disponíveis, quer testar modelos com 5 features
modelos_possiveis = comb(20, 5)  # 15.504 combinações

# Com 10 features, selecionando 3
modelos_menores = comb(10, 3)  # 120 combinações — viável testar todas

print(f"20 choose 5: {modelos_possiveis} — precisa de feature selection automatizado")
print(f"10 choose 3: {modelos_menores} — viável testar exaustivamente")
```