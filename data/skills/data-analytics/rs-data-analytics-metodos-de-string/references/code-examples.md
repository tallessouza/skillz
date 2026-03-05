# Code Examples: Metodos de String

## count() — Contar ocorrencias

```python
email = "bispo@skillz.com.br"

print(email.count("@"))   # 1
print(email.count("m"))   # 4
print(email.count("a"))   # 2
```

## find() — Encontrar posicao

```python
email = "bispo@skillz.com.br"

print(email.find(".com"))  # 20 (indice base 0)
print(email.find("xyz"))   # -1 (nao encontrado)
```

## startswith() — Verificar inicio

```python
email = "bispo@skillz.com.br"

print(email.startswith("bispo"))  # True
print(email.startswith("will"))   # False
```

## endswith() — Verificar fim

```python
email = "bispo@skillz.com.br"

print(email.endswith(".br"))      # True
print(email.endswith(".com"))     # False
print(email.endswith(".com.br"))  # True
```

## isnumeric() — Verificar se e numerico

```python
cpf = "12345678900"
print(type(cpf))            # <class 'str'>
print(cpf.isnumeric())     # True

cpf_invalido = "1234567890a"
print(cpf_invalido.isnumeric())  # False
```

## isalpha() — Verificar se e apenas letras

```python
texto = "abcdef"
print(texto.isalpha())     # True

texto2 = "abcdef1"
print(texto2.isalpha())    # False
```

## isalnum() — Verificar se e alfanumerico

```python
animal = "cachorro"
print(animal.isalnum())    # True

animal2 = "cachorro123"
print(animal2.isalnum())   # True

animal3 = "cachorro*"
print(animal3.isalnum())   # False — caractere especial
```

## strip() — Remover espacos das bordas

```python
animal = "      cachorro          "
print(animal)              # "      cachorro          "
print(len(animal))         # 24

animal = animal.strip()
print(animal)              # "cachorro"
print(len(animal))         # 8
```

## replace() — Substituir caracteres

```python
transporte = "Helicoptero"
print(transporte)          # "Helicoptero"

transporte = transporte.replace("H", "G")
print(transporte)          # "Gelicoptero"
```

Nota: Python e case sensitive — `replace("H", "G")` so afeta H maiusculo.

## split() — Dividir string em lista

### Sem delimitador (usa espaco)
```python
nome_completo = "Joao da Silva Santos Albuquerque"
print(nome_completo)
# "Joao da Silva Santos Albuquerque"

nome_completo = nome_completo.split()
print(nome_completo)
# ["Joao", "da", "Silva", "Santos", "Albuquerque"]
```

### Com delimitador especifico
```python
nome_completo = "Joao,da,Silva,Santos,Albuquerque"
nome_completo = nome_completo.split(",")
print(nome_completo)
# ["Joao", "da", "Silva", "Santos", "Albuquerque"]
```

### Caso pratico: datas
```python
data = "28/02/2026"
dia, mes, ano = data.split("/")
# dia = "28", mes = "02", ano = "2026"

data_iso = "2026-02-28"
ano, mes, dia = data_iso.split("-")
```

## Combinando metodos (pipeline de limpeza)

```python
# Dado bruto vindo de um CSV
raw_email = "   Bispo@Skillz.COM.BR   "

# Pipeline de limpeza
clean_email = raw_email.strip().lower()
# "bispo@skillz.com.br"

# Validacoes
has_single_at = clean_email.count("@") == 1
is_brazilian = clean_email.endswith(".com.br")
domain = clean_email.split("@")[1]
# "skillz.com.br"
```