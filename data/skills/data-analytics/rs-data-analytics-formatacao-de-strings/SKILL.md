---
name: rs-data-analytics-formatacao-de-strings
description: "Applies Python f-string formatting patterns when writing print statements, string interpolation, or data display code. Use when user asks to 'format a number', 'display currency', 'align text', 'show percentage', 'pad with zeros', 'convert to binary/hex', or any Python string output task. Enforces f-string syntax over concatenation or comma-separated prints. Make sure to use this skill whenever generating Python code that displays formatted output. Not for regex, string parsing, or file I/O operations."
---

# Formatacao de Strings com F-Strings

> Ao formatar saidas em Python, use f-strings com format specs dentro das chaves — nunca concatenacao ou separacao por virgula.

## Rules

1. **Sempre use f-strings** — `f"texto {variavel}"` nao `print("texto", variavel)`, porque f-strings sao mais legiveis e permitem expressoes inline
2. **Arredonde floats com `:. Nf`** — `f"{preco:.2f}"` nao `round(preco, 2)` dentro do print, porque o format spec mantem o tipo e garante casas decimais fixas
3. **Preencha zeros com `:0Nd`** — `f"{numero:03}"` para exibir `007`, porque evita manipulacao manual de strings
4. **Exiba porcentagens com `:.N%`** — `f"{taxa:.1%}"` converte `0.085` em `8.5%` automaticamente, porque elimina multiplicacao manual por 100
5. **Separadores de milhar com `:,`** — `f"{valor:,.2f}"` para `1,234.56`, porque facilita leitura de numeros grandes
6. **Calculos e metodos direto nas chaves** — `f"{a + b}"` e `f"{nome.upper()}"` sao validos, porque f-strings aceitam qualquer expressao Python

## How to write

### Float com casas decimais
```python
preco = 49.9582
print(f"Preco: {preco:.2f}")  # Preco: 49.96
```

### Inteiro com zeros a esquerda
```python
numero = 7
print(f"Codigo: {numero:05}")  # Codigo: 00007
```

### Porcentagem
```python
taxa = 0.085
print(f"Crescimento: {taxa:.1%}")  # Crescimento: 8.5%
```

### Separador de milhar com decimais
```python
faturamento = 8934.58
print(f"Faturou: {faturamento:,.2f}")  # Faturou: 8,934.58
```

### Alinhamento de texto
```python
texto = "Python"
print(f"{texto:<20}")  # alinhado a esquerda
print(f"{texto:>20}")  # alinhado a direita
print(f"{texto:^20}")  # centralizado
```

### Bases numericas
```python
n = 255
print(f"Binario: {n:b}")   # 11111111
print(f"Octal: {n:o}")     # 377
print(f"Hex: {n:x}")       # ff
```

## Example

**Before:**
```python
nome = "DataCorp"
faturamento = 8934.58
print("A empresa", nome, "faturou", faturamento, "neste mes")
```

**After:**
```python
nome_empresa = "DataCorp"
faturamento = 8934.58
print(f"A empresa {nome_empresa} faturou {faturamento:,.2f} neste mes")
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Exibir dinheiro/preco | `:.2f` com separador `:,.2f` |
| Exibir codigo/ID numerico | `:0Nd` (N = total de digitos) |
| Exibir taxa/proporcao como % | `:.N%` (N = casas decimais) |
| Alinhar colunas de texto | `:<N`, `:>N`, `:^N` |
| Converter para base diferente | `:b` (bin), `:o` (oct), `:x` (hex) |
| Expressao simples | Coloque direto nas chaves: `{a + b}` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `print("Preco:", preco)` | `print(f"Preco: {preco:.2f}")` |
| `str(int(taxa * 100)) + "%"` | `f"{taxa:.1%}"` |
| `"0" * (3 - len(str(n))) + str(n)` | `f"{n:03}"` |
| `print("Soma:", a + b)` | `print(f"Soma: {a + b}")` |
| `print(nome.upper())` separado | `print(f"{nome.upper()}")` inline |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
