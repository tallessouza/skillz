---
name: rs-data-analytics-entrada-de-dados-2
description: "Enforces correct Python input handling and type casting when writing data entry code. Use when user asks to 'read user input', 'get input from user', 'create a form in Python', 'receive data in Python', or any interactive Python script. Applies rules: always cast input to correct type before calculations, use descriptive prompts inside input(), never assume input returns numbers. Make sure to use this skill whenever generating Python code that reads user input via input(). Not for file I/O, API requests, or database reads."
---

# Entrada de Dados em Python

> Sempre converta o retorno do `input()` para o tipo correto antes de usar o valor, porque `input()` retorna string por padrao.

## Rules

1. **Sempre passe uma mensagem descritiva dentro do `input()`** — `input("Digite seu nome: ")` nao `input()`, porque o usuario precisa saber o que digitar
2. **Faca o cast no momento da leitura** — `int(input("Idade: "))` nao `idade = input(); idade = int(idade)`, porque manter numa unica expressao evita usar o valor string acidentalmente
3. **Use `int()` para numeros inteiros, `float()` para decimais** — escolha o tipo correto para o dominio: idade=int, altura=float, quantidade=int, preco=float
4. **Nunca faca calculos com o retorno direto do `input()`** — `input()` SEMPRE retorna `str`, mesmo que o usuario digite numeros, porque Python nao converte automaticamente
5. **Nomeie variaveis pelo conteudo** — `preco` nao `p`, `quantidade` nao `q`, porque clareza importa mais que economia de caracteres

## How to write

### Leitura de texto
```python
nome = input("Digite seu nome: ")
```

### Leitura de inteiro (cast direto)
```python
idade = int(input("Digite sua idade: "))
```

### Leitura de float (cast direto)
```python
altura = float(input("Digite sua altura: "))
```

### Verificacao de tipo
```python
print(type(idade))  # <class 'int'>
print(type(altura))  # <class 'float'>
```

## Example

**Before (sem cast — bug silencioso):**
```python
preco = input("Preco: ")
quantidade = input("Quantidade: ")
total = preco * quantidade  # TypeError ou resultado errado
```

**After (com cast correto):**
```python
produto = input("Digite o nome do produto: ")
preco = float(input("Digite o preco do produto: "))
quantidade = int(input("Digite a quantidade em estoque: "))

print(f"Produto: {produto}, Preco: {preco}, Quantidade: {quantidade}")
total = preco * quantidade  # Funciona corretamente
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Valor sera usado em calculo | Cast para `int()` ou `float()` no momento da leitura |
| Valor e texto (nome, endereco) | Mantenha como string, sem cast |
| Valor pode ter decimais (preco, altura, peso) | Use `float()` |
| Valor e sempre inteiro (idade, quantidade, ano) | Use `int()` |
| Precisa verificar o tipo | Use `type(variavel)` para confirmar |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `input()` sem mensagem | `input("Digite o valor: ")` |
| `idade = input("Idade: ")` seguido de calculo | `idade = int(input("Idade: "))` |
| `float(input())` sem prompt | `float(input("Digite o preco: "))` |
| `p = float(input("Preco: "))` | `preco = float(input("Digite o preco: "))` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
