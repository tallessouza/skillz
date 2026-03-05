# Code Examples: Estruturas Condicionais em Python

## Exemplo 1: Sintaxe basica do if (comentario didatico)

```python
# Sintaxe:
# if condição:
#     executa esse bloco de comando

# A condição pode ser uma variável booleana
# ou uma expressão com operadores de comparação
```

## Exemplo 2: if simples — verificar maioridade

```python
idade = 25

if idade >= 18:
    print("Você é maior de idade")

# Output: Você é maior de idade
# Porque: 25 >= 18 é True, entra no if
```

### Variacao: condicao falsa

```python
idade = 15

if idade >= 18:
    print("Você é maior de idade")

# Output: (nada)
# Porque: 15 >= 18 é False, não entra no if
```

## Exemplo 3: Demonstracao de indentacao (dentro vs fora do bloco)

### Ambos os prints DENTRO do if:

```python
idade = 19

if idade >= 18:
    print("Você é maior de idade")
    print("indentação")

# Output:
# Você é maior de idade
# indentação
# Ambos executam porque ambos estão indentados (dentro do if)
```

### Segundo print FORA do if:

```python
idade = 15

if idade >= 18:
    print("Você é maior de idade")
print("indentação")

# Output:
# indentação
# O primeiro print NÃO executa (está dentro do if, condição falsa)
# O segundo print EXECUTA (está fora do if, sem indentação)
```

**Insight do instrutor:** "Justamente porque a indentação é obrigatória no Python, se eu não dei o espaçamento para dizer que esse comando estava dentro da minha estrutura if... ele não está dentro do if, ele está fora."

## Exemplo 4: if + else — maioridade completa

```python
idade = 25

if idade >= 18:
    print("Você é maior de idade")
else:
    print("Você é menor de idade")

# Output: Você é maior de idade
```

### Variacao com idade menor:

```python
idade = 13

if idade >= 18:
    print("Você é maior de idade")
else:
    print("Você é menor de idade")

# Output: Você é menor de idade
```

## Exemplo 5: Erro de indentacao

```python
idade = 13

if idade >= 18:
    print("Você é maior de idade")
else:
print("Você é menor de idade")  # SEM indentação

# Result: IndentationError
# O Python exige indentação após else:
```

## Padroes expandidos (baseados nos conceitos da aula)

### Multiplas acoes dentro de um bloco:

```python
idade = 20

if idade >= 18:
    print("Você é maior de idade")
    print("Pode tirar carteira de motorista")
    print("Pode votar facultativamente")
else:
    print("Você é menor de idade")
    print("Precisa de responsável legal")
```

### Usando variavel booleana como condicao:

```python
is_maior_de_idade = True

if is_maior_de_idade:
    print("Acesso liberado")
else:
    print("Acesso negado")
```

### Condicao com diferentes operadores:

```python
temperatura = 38

if temperatura > 37.5:
    print("Paciente com febre")
else:
    print("Temperatura normal")
```