---
name: rs-data-analytics-laco-for
description: "Applies Python FOR loop patterns when writing iteration code for data analytics. Use when user asks to 'iterate over a list', 'loop through items', 'print sequence of numbers', 'use range in Python', or 'write a for loop'. Covers for-in with strings/lists, range() with 1-3 arguments, negative steps, and for-else. Make sure to use this skill whenever generating Python loops for data processing. Not for while loops, list comprehensions, or async iteration."
---

# Laco de Repeticao FOR em Python

> Usar `for` para percorrer estruturas de dados (strings, listas) e `for-in-range` para sequencias numericas, sempre respeitando a sintaxe de inicio, fim-1 e passo.

## Rules

1. **Use `for x in sequencia`** para percorrer strings e listas, porque cada elemento e acessado individualmente sem necessidade de indice
2. **Use `for i in range()`** para sequencias numericas, porque range gera a sequencia sob demanda sem criar lista em memoria
3. **O valor de fim no range e exclusivo** — `range(1, 11)` vai de 1 ate 10, porque range sempre para em fim-1
4. **Escolha nomes de variavel descritivos** — `for nome in nomes` nao `for x in nomes`, porque clareza importa em data analytics
5. **Use passo negativo para decrementar** — `range(-1, -10, -1)`, porque o passo deve acompanhar a direcao do intervalo
6. **Respeite a indentacao de 4 espacos** no bloco do for, porque Python usa indentacao como delimitador de bloco

## How to write

### Percorrer string (caractere por caractere)
```python
for caractere in "Python para Dados":
    print(caractere)
```

### Percorrer lista
```python
nomes = ["Joana", "Osvaldo", "Murilo", "Leticia"]
for nome in nomes:
    print(nome)
```

### range() com 1 argumento (0 ate n-1)
```python
for i in range(10):
    print(i)  # 0, 1, 2, ..., 9
```

### range() com 2 argumentos (inicio ate fim-1)
```python
for x in range(2, 21):
    print(x)  # 2, 3, 4, ..., 20
```

### range() com 3 argumentos (inicio, fim-1, passo)
```python
for j in range(2, 21, 2):
    print(j)  # 2, 4, 6, ..., 20
```

### range() com valores negativos
```python
for i in range(-1, -10, -1):
    print(i)  # -1, -2, -3, ..., -9
```

### for com else
```python
for i in range(1, 10):
    print(i)
else:
    print("Fim da execucao do for")
```

## Example

**Before (printando lista diretamente):**
```python
nomes = ["Joana", "Osvaldo", "Murilo"]
print(nomes)  # ['Joana', 'Osvaldo', 'Murilo'] — imprime a estrutura inteira
```

**After (iterando com for):**
```python
nomes = ["Joana", "Osvaldo", "Murilo"]
for nome in nomes:
    print(nome)  # Cada nome separadamente
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Percorrer cada caractere de texto | `for c in texto` |
| Percorrer cada item de lista | `for item in lista` |
| Repetir N vezes | `range(N)` — 1 argumento |
| Sequencia com inicio e fim | `range(inicio, fim+1)` — 2 argumentos |
| Sequencia com saltos (2 em 2, 3 em 3) | `range(inicio, fim+1, passo)` — 3 argumentos |
| Contagem regressiva | `range(inicio, fim-1, -1)` — passo negativo |
| Mensagem ao terminar loop | Adicione `else:` apos o for |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `range(10)` esperando 1-10 | `range(1, 11)` para obter 1-10 |
| `range(1, 10)` esperando 1-10 | `range(1, 11)` porque fim e exclusivo |
| `range(-1, -10, 1)` | `range(-1, -10, -1)` passo deve ser negativo |
| `print(lista)` para ver itens | `for item in lista: print(item)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
