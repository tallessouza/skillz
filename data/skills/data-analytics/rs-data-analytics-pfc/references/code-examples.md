# Code Examples: Princípio Fundamental da Contagem (PFC)

## Exemplo 1: Combinacao de roupas (Principio Multiplicativo)

Direto da aula — o exemplo central do instrutor.

```python
# Contexto: 3 camisas, 2 calcas, 4 calcados
# Pergunta: quantas formas de se vestir?
# Logica: voce usa camisa E calca E calcado (simultaneo)

camisas = 3
calcas = 2
calcados = 4

total_looks = camisas * calcas * calcados
print(f"Total de looks: {total_looks}")  # 24
```

## Exemplo 2: Escolha de calcado (Principio Aditivo)

```python
# Contexto: 2 sapatos azuis, 3 verdes, 5 laranjas
# Pergunta: quantas opcoes de calcado?
# Logica: voce usa azul OU verde OU laranja (exclusivo)

azul = 2
verde = 3
laranja = 5

total_opcoes = azul + verde + laranja
print(f"Total de opcoes: {total_opcoes}")  # 10
```

## Exemplo 3: Caminhos de A ate E (Ambos os principios)

O exemplo mais completo da aula — combina multiplicacao (etapas) com soma (rotas alternativas).

```python
# Grafo de caminhos:
# A -> B: 3 caminhos
# B -> E: 3 caminhos
# A -> C: 2 caminhos
# C -> E: 3 caminhos
# C -> D: 2 caminhos
# D -> E: 2 caminhos
# A -> D: 2 caminhos

# Rotas possiveis (etapas internas = multiplicacao)
rota_abe = 3 * 3      # A->B E B->E = 9
rota_ace = 2 * 3      # A->C E C->E = 6
rota_acde = 2 * 2 * 2 # A->C E C->D E D->E = 8
rota_ade = 2 * 2      # A->D E D->E = 4

# Rotas alternativas = soma (OU)
total_trajetos = rota_abe + rota_ace + rota_acde + rota_ade
print(f"Total de trajetos: {total_trajetos}")  # 27
```

## Exemplo 4: Funcao generica aplicando PFC

```python
from functools import reduce
from operator import mul

def principio_multiplicativo(*opcoes: int) -> int:
    """Calcula total de combinacoes simultaneas (E)."""
    return reduce(mul, opcoes, 1)

def principio_aditivo(*opcoes: int) -> int:
    """Calcula total de escolhas exclusivas (OU)."""
    return sum(opcoes)

# Uso: cardapio de restaurante
# Entrada E prato principal E sobremesa
total_refeicoes = principio_multiplicativo(3, 5, 4)  # 60

# Bebida: suco OU refrigerante OU agua
total_bebidas = principio_aditivo(5, 8, 1)  # 14

# Refeicao completa: refeicao E bebida
total_completo = principio_multiplicativo(total_refeicoes, total_bebidas)
print(f"Refeicoes possiveis: {total_completo}")  # 840
```

## Exemplo 5: Contagem de caminhos em grafo (generalizacao)

```python
from typing import Dict, List, Tuple

def contar_caminhos(
    grafo: Dict[str, List[Tuple[str, int]]],
    origem: str,
    destino: str
) -> int:
    """
    Conta caminhos de origem ate destino usando PFC.
    grafo: {no: [(vizinho, qtd_arestas), ...]}
    Dentro de cada rota: multiplicacao (E)
    Entre rotas: soma (OU)
    """
    if origem == destino:
        return 1

    total = 0  # soma entre rotas alternativas (OU)
    for vizinho, qtd_arestas in grafo.get(origem, []):
        # multiplicacao: qtd_arestas daqui E caminhos restantes
        caminhos_restantes = contar_caminhos(grafo, vizinho, destino)
        total += qtd_arestas * caminhos_restantes

    return total

# Grafo da aula
grafo = {
    'A': [('B', 3), ('C', 2), ('D', 2)],
    'B': [('E', 3)],
    'C': [('D', 2), ('E', 3)],
    'D': [('E', 2)],
}

print(contar_caminhos(grafo, 'A', 'E'))  # 27
```