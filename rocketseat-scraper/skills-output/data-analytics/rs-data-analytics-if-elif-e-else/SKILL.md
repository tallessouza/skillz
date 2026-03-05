---
name: rs-data-analytics-if-elif-e-else
description: "Enforces correct Python if/elif/else conditional structures when writing decision logic. Use when user asks to 'write a conditional', 'check multiple conditions', 'classify values', 'add elif', or 'handle cases in Python'. Applies rules: proper indentation, elif for 3+ conditions, else as final fallback without condition, logical operators with and/not for compound checks. Make sure to use this skill whenever generating Python code with multiple condition branches. Not for loops, list comprehensions, match/case statements, or error handling."
---

# If, Elif e Else em Python

> Estruturas condicionais classificam valores testando condicoes em sequencia — da mais especifica para a mais geral, com else como fallback final.

## Rules

1. **Use elif para 3+ condicoes** — `if/elif/elif/else` nao `if/if/if/else`, porque cada `if` isolado e avaliado independentemente, enquanto `elif` so e testado se os anteriores falharam
2. **else nunca tem condicao** — `else:` nao `else idade >= 65:`, porque else captura tudo que nao foi coberto pelos testes anteriores
3. **Ordene do mais restritivo para o menos** — teste `< 10` antes de `< 18` antes de `< 65`, porque a primeira condicao verdadeira encerra a cadeia
4. **Indentacao de 4 espacos define o bloco** — codigo dentro do if/elif/else deve estar indentado, porque Python usa indentacao como delimitador de bloco (nao chaves)
5. **Combine condicoes com operadores logicos** — `and`, `or`, `not` para verificacoes compostas, porque evita aninhamento excessivo de ifs
6. **else como fallback implicito** — se todas as condicoes anteriores cobrem os casos, o else captura o restante sem necessidade de teste explicito

## How to write

### Classificacao por faixas

```python
idade = 25

if idade < 10:
    print("Voce e uma crianca")
elif idade < 18:
    print("Voce e um adolescente")
elif idade < 65:
    print("Voce e um adulto")
else:
    print("Voce e um idoso")
```

### Condicoes compostas com operadores logicos

```python
idade = 28
tem_carteira = True

if idade >= 18 and tem_carteira:
    print("Voce pode dirigir")
elif idade >= 18 and not tem_carteira:
    print("Voce nao pode dirigir")
elif idade < 18 and tem_carteira:
    print("Voce nao pode dirigir por conta da idade")
else:
    print("Voce nao pode dirigir pela idade e por nao ter carteira")
```

## Example

**Before (ifs independentes — bug logico):**
```python
idade = 5
if idade < 10:
    print("crianca")
if idade < 18:
    print("adolescente")  # tambem imprime! 5 < 18 e verdadeiro
if idade < 65:
    print("adulto")       # tambem imprime! 5 < 65 e verdadeiro
```

**After (cadeia elif — mutuamente exclusivo):**
```python
idade = 5
if idade < 10:
    print("crianca")      # so este imprime
elif idade < 18:
    print("adolescente")
elif idade < 65:
    print("adulto")
else:
    print("idoso")
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Apenas 2 caminhos (verdadeiro/falso) | `if/else` simples |
| 3+ faixas de valor | `if/elif/elif/.../else` |
| Duas variaveis combinadas | Use `and`, `or`, `not` no mesmo if |
| Ultimo caso e "todo o resto" | Use `else` sem condicao explicita |
| Faixas numericas | Ordene do menor para o maior |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `if x < 10: ... if x < 18:` (ifs separados para faixas) | `if x < 10: ... elif x < 18:` |
| `else x >= 65:` (condicao no else) | `else:` |
| `elif idade >= 10 and idade < 18:` (redundante) | `elif idade < 18:` (ja sabemos que >= 10) |
| Aninhar 4 ifs dentro de ifs | Combinar com `and`/`or` no mesmo nivel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
