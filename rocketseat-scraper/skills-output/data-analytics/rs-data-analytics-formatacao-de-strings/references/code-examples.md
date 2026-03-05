# Code Examples: Formatacao de Strings com F-Strings

## 1. Forma antiga vs f-string

```python
# Forma antiga (separacao por virgula)
nome = input("Digite o seu nome: ")
idade = input("Digite a sua idade: ")
print("O seu nome é", nome, "e a sua idade é", idade)

# Com f-string
nome = input("Digite o seu nome: ")
idade = input("Digite a sua idade: ")
print(f"O seu nome é {nome} e a sua idade é {idade}")
```

## 2. Arredondamento de floats

```python
preco = 49.95823
print(f"O preço do produto é {preco:.2f}")  # 49.96
```

## 3. Preenchimento com zeros a esquerda

```python
numero = 7
print(f"O número é {numero:03}")  # 007
print(f"O número é {numero:07}")  # 0000007
```

## 4. Alinhamento de texto

```python
texto = "Python"
print(f"{texto:<10}")  # "Python    " (esquerda)
print(f"{texto:>10}")  # "    Python" (direita)
print(f"{texto:^10}")  # "  Python  " (centro)
```

## 5. Separador de milhar

```python
valor = 1234567
print(f"Valor formatado: {valor:,}")  # 1,234,567
```

## 6. Porcentagem

```python
taxa = 0.085
print(f"Taxa de crescimento: {taxa:.1%}")  # 8.5%
print(f"Taxa de crescimento: {taxa:.2%}")  # 8.50%
```

## 7. Bases numericas

```python
numero = 255
print(f"Binário: {numero:b}")       # 11111111
print(f"Octal: {numero:o}")         # 377
print(f"Hexadecimal: {numero:x}")   # ff
```

## 8. Calculos dentro das chaves

```python
a = 5
b = 3
print(f"A soma entre os números {a} mais {b} é igual a {a + b}")  # 8
```

## 9. Metodos de string nas chaves

```python
nome = "python"
print(f"Nome em maiúsculo: {nome.upper()}")  # PYTHON
```

## 10. Exemplo integrado — faturamento de empresa

```python
nome_empresa = "DataCorp"
faturamento = 8934.58
print(f"A empresa {nome_empresa} faturou {faturamento:,.2f} neste mês")
# A empresa DataCorp faturou 8,934.58 neste mês

# Com 1 casa decimal
print(f"A empresa {nome_empresa} faturou {faturamento:,.1f} neste mês")
# A empresa DataCorp faturou 8,934.6 neste mês
```

## Variacoes adicionais

### Combinando alinhamento com preenchimento customizado
```python
texto = "Python"
print(f"{texto:*^20}")  # *******Python*******
print(f"{texto:-<20}")  # Python--------------
```

### Formatando dinheiro brasileiro (workaround)
```python
valor = 1234567.89
# Python usa , como separador de milhar por padrao
# Para formato brasileiro (1.234.567,89):
formatado = f"{valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
print(f"R$ {formatado}")  # R$ 1.234.567,89
```

### Tabela formatada com alinhamento
```python
produtos = [("Notebook", 4599.90), ("Mouse", 89.90), ("Teclado", 259.90)]
print(f"{'Produto':<15} {'Preço':>10}")
print("-" * 25)
for nome, preco in produtos:
    print(f"{nome:<15} {preco:>10,.2f}")
# Produto              Preço
# -------------------------
# Notebook          4,599.90
# Mouse                89.90
# Teclado             259.90
```