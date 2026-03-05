# Code Examples: Fundamentos de Python para Data Analytics

## Nota

Esta aula e uma apresentacao do modulo, sem codigo demonstrado. Os exemplos abaixo ilustram os topicos que serao cobertos nas proximas aulas, servindo como preview do que sera aprendido.

## Preview dos topicos mencionados

### Comentarios
```python
# Isso e um comentario — use para documentar seu raciocinio
preco = 49.90  # preco do produto em reais
```

### Variaveis e tipos de dados
```python
nome = "Bismarck"        # str
idade = 30               # int
salario = 8500.50         # float
ativo = True              # bool
```

### Operadores aritmeticos e logicos
```python
# Aritmeticos
total = preco * quantidade
media = soma / contagem

# Logicos
if idade >= 18 and ativo:
    print("Usuario ativo e maior de idade")
```

### Estruturas de selecao (if/elif/else)
```python
if nota >= 7:
    status = "Aprovado"
elif nota >= 5:
    status = "Recuperacao"
else:
    status = "Reprovado"
```

### Laco while com contador
```python
contador = 0
while contador < 10:
    print(f"Iteracao {contador}")
    contador += 1
```

### While true
```python
while True:
    entrada = input("Digite 'sair' para encerrar: ")
    if entrada == "sair":
        break
```

### For com range
```python
for i in range(5):
    print(f"Numero: {i}")
```

### For percorrendo strings
```python
nome = "Python"
for caractere in nome:
    print(caractere)
```

### Metodos de string
```python
texto = "  Dados Sujos  "
texto.strip()        # "Dados Sujos"
texto.lower()        # "  dados sujos  "
texto.upper()        # "  DADOS SUJOS  "
texto.replace("Sujos", "Limpos")  # "  Dados Limpos  "
texto.split()        # ["Dados", "Sujos"]
```