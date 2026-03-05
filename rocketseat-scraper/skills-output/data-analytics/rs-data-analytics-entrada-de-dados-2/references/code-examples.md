# Code Examples: Entrada de Dados em Python

## Exemplo 1: Leitura basica de texto

```python
nome = input("Digite o seu nome: ")
print(nome)
# Verificando o tipo
print(type(nome))  # <class 'str'>
```

## Exemplo 2: Leitura de inteiro (demonstrando o problema)

```python
# SEM cast — parece funcionar mas o tipo esta errado
idade = input("Digite a sua idade: ")
print(idade)        # 26
print(type(idade))  # <class 'str'> — PROBLEMA!
```

```python
# COM cast — tipo correto
idade = int(input("Digite a sua idade: "))
print(idade)        # 25
print(type(idade))  # <class 'int'> — CORRETO
```

## Exemplo 3: Leitura de float

```python
altura = float(input("Digite a sua altura: "))
print(altura)        # 1.88
print(type(altura))  # <class 'float'>
```

## Exemplo 4: Programa completo — Cadastro de produto

```python
produto = input("Digite o nome do produto: ")
preco = float(input("Digite o preco do produto: "))
quantidade = int(input("Digite a quantidade do produto em estoque: "))

print("Nome do produto:", produto)
print("Preco:", preco)
print("Quantidade em estoque:", quantidade)
```

**Execucao:**
```
Digite o nome do produto: Celular
Digite o preco do produto: 3499.00
Digite a quantidade do produto em estoque: 10
Nome do produto: Celular
Preco: 3499.0
Quantidade em estoque: 10
```

## Variacoes uteis

### Calculo com valores lidos

```python
preco = float(input("Preco unitario: "))
quantidade = int(input("Quantidade: "))
total = preco * quantidade
print(f"Total: R${total:.2f}")
```

### Multiplas leituras do mesmo tipo

```python
nota1 = float(input("Nota 1: "))
nota2 = float(input("Nota 2: "))
media = (nota1 + nota2) / 2
print(f"Media: {media:.1f}")
```