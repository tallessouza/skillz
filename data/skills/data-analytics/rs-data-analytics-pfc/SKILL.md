---
name: rs-data-analytics-pfc
description: "Applies the Fundamental Counting Principle (PFC) when solving combinatorics problems in code or data analysis. Use when user asks to 'calculate combinations', 'count possibilities', 'how many ways', 'permutations', or 'combinatorics'. Enforces correct use of multiplication (AND/simultaneous) vs addition (OR/exclusive) principles. Make sure to use this skill whenever computing total outcomes or possibility counts. Not for probability calculations, statistical distributions, or advanced permutation formulas."
---

# Princípio Fundamental da Contagem (PFC)

> Ao calcular possibilidades, identifique se os eventos sao simultaneos (E = multiplica) ou exclusivos (OU = soma).

## Rules

1. **E significa multiplicacao** — quando eventos acontecem juntos (camisa E calca E calcado), multiplique as opcoes, porque cada combinacao gera uma possibilidade distinta
2. **OU significa soma** — quando eventos sao exclusivos (sapato azul OU verde OU laranja), some as opcoes, porque voce so escolhe um
3. **Decomponha trajetos em etapas** — quebre problemas complexos em sub-caminhos independentes, multiplique dentro de cada caminho (E), some entre caminhos alternativos (OU)
4. **Nunca liste elemento por elemento** — use o PFC para calcular o total diretamente, porque listar nao escala
5. **Valide com o teste do "ao mesmo tempo"** — se voce pode usar dois elementos ao mesmo tempo, e multiplicacao; se escolhe um OU outro, e soma

## How to write

### Principio Multiplicativo (E)
```python
# Eventos simultaneos: camisa E calca E calcado
camisas = 3
calcas = 2
calcados = 4
total = camisas * calcas * calcados  # 24 possibilidades
```

### Principio Aditivo (OU)
```python
# Eventos exclusivos: sapato azul OU verde OU laranja
azul = 2
verde = 3
laranja = 5
total = azul + verde + laranja  # 10 possibilidades
```

### Combinando ambos (trajetos)
```python
# Caminhos alternativos (OU) com etapas internas (E)
caminho_abe = 3 * 3        # A->B E B->E = 9
caminho_ace = 2 * 3        # A->C E C->E = 6
caminho_acde = 2 * 2 * 2   # A->C E C->D E D->E = 8
caminho_ade = 2 * 2        # A->D E D->E = 4

# Caminhos sao exclusivos (OU), entao soma
total = caminho_abe + caminho_ace + caminho_acde + caminho_ade  # 27
```

## Example

**Before (erro comum — confundir E com OU):**
```python
# ERRADO: somando quando deveria multiplicar
opcoes_roupa = camisas + calcas + calcados  # 9 (incorreto)

# ERRADO: multiplicando quando deveria somar
opcoes_calcado = azul * verde * laranja  # 30 (incorreto)
```

**After (com PFC aplicado corretamente):**
```python
# CORRETO: camisa E calca E calcado = multiplica
opcoes_roupa = camisas * calcas * calcados  # 24

# CORRETO: azul OU verde OU laranja = soma
opcoes_calcado = azul + verde + laranja  # 10
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elementos usados juntos (roupa completa) | Multiplique (E) |
| Escolha exclusiva entre grupos | Some (OU) |
| Caminho com etapas sequenciais | Multiplique etapas internas |
| Multiplos caminhos alternativos | Some os resultados de cada caminho |
| Duvida se E ou OU | Pergunte: "uso os dois ao mesmo tempo?" Sim=multiplica, Nao=soma |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Somar opcoes simultaneas | Multiplicar opcoes simultaneas |
| Multiplicar escolhas exclusivas | Somar escolhas exclusivas |
| Listar todas as combinacoes manualmente | Aplicar PFC e calcular diretamente |
| Misturar E e OU sem decompor o problema | Separar em sub-caminhos, resolver cada um, depois combinar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
