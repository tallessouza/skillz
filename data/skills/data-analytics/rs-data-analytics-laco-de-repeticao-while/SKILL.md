---
name: rs-data-analytics-laco-while
description: "Applies Python while loop patterns when writing repetition logic with conditions. Use when user asks to 'write a while loop', 'validate user input', 'repeat until condition', 'loop with condition', or 'check password in loop'. Enforces manual counter management, loop-infinite prevention, and input validation patterns. Make sure to use this skill whenever generating Python code that requires conditional repetition or user input validation loops. Not for for-loop iteration over sequences, list comprehension, or data structure traversal."
---

# Laco de Repeticao While em Python

> Use `while` para repetir execucao enquanto uma condicao for verdadeira, gerenciando manualmente a variavel de controle.

## Rules

1. **Sempre incremente a variavel de controle** — `i += 1` dentro do bloco, porque o while nao incrementa automaticamente como o for, gerando loop infinito se esquecido
2. **Use while para validacao condicional, for para percorrer sequencias** — while valida strings/senhas/intervalos, for percorre listas/ranges, porque cada um tem seu cenario ideal
3. **Capture input do usuario dentro do loop** — coloque `input()` dentro do while para evitar loop infinito, porque o usuario precisa ter chance de fornecer novo valor
4. **Defina a variavel antes do while** — inicialize a variavel de controle antes do loop, porque o while precisa avaliar a condicao na primeira execucao
5. **Use operadores logicos para validar intervalos** — `while numero < 1 or numero > 10` para rejeitar valores fora do range, porque combina duas condicoes de invalidez

## How to write

### Contagem com while

```python
# Inicialize ANTES do while, incremente DENTRO do while
i = 1
while i <= 10:
    print(f"Contagem: {i}")
    i += 1  # Obrigatorio — sem isso, loop infinito
```

### Validacao de senha com input

```python
senha = input("Digite a senha: ")
while senha != "Python":
    senha = input("Senha invalida. Tente novamente: ")
print("Senha correta. Acesso liberado.")
```

### Validacao de numero em intervalo

```python
numero = int(input("Digite um numero entre 1 e 10: "))
while numero < 1 or numero > 10:
    numero = int(input("Numero invalido. Digite entre 1 e 10: "))
print(f"Numero valido. O numero digitado foi: {numero}")
```

## Example

**Before (loop infinito — erro comum):**

```python
i = 1
while i <= 10:
    print(f"Contagem: {i}")
# Esqueceu i += 1 — executa para sempre
```

**After (with this skill applied):**

```python
i = 1
while i <= 10:
    print(f"Contagem: {i}")
    i += 1
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Repetir ate condicao mudar | Use `while` com condicao explicita |
| Percorrer lista, string, range | Use `for`, nao `while` |
| Validar input do usuario | `input()` antes E dentro do `while` |
| Contagem numerica simples | `while` com incremento manual ou `for range()` |
| Precisa de tentativas limitadas | Combine `while` com contador de tentativas |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `while True:` sem `break` claro | `while condicao_explicita:` |
| Variavel de controle sem incremento | Sempre `i += 1` ou equivalente |
| `input()` so antes do while | `input()` antes E dentro do loop |
| `while senha != "x":` com senha fixa | `while senha != "x":` com `input()` dentro |
| Validacao de intervalo sem `or` | `while n < min or n > max:` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
