# Code Examples: Laco de Repeticao FOR

## Exemplo 1: FOR com string

```python
# Percorre cada caractere da string, incluindo espacos
for x in "Python para Dados":
    print(x)
```

**Saida:**
```
P
y
t
h
o
n

p
a
r
a

D
a
d
o
s
```

## Exemplo 2: FOR com lista de nomes

```python
nomes = ["Joana", "Osvaldo", "Murilo", "Leticia"]

# Printando a lista diretamente — mostra a estrutura
print(nomes)  # ['Joana', 'Osvaldo', 'Murilo', 'Leticia']

# Printando nome por nome com for
for i in nomes:
    print(i)
```

**Saida do for:**
```
Joana
Osvaldo
Murilo
Leticia
```

## Exemplo 3: range com 1 argumento

```python
# Apenas fim: inicia em 0, passo 1, vai ate 9
for i in range(10):
    print(i)
```

**Saida:** 0, 1, 2, 3, 4, 5, 6, 7, 8, 9

## Exemplo 4: range com 2 argumentos

```python
# Inicio e fim: comeca em 2, vai ate 20 (21-1), passo padrao 1
for x in range(2, 21):
    print(x)
```

**Saida:** 2, 3, 4, 5, ..., 20

## Exemplo 5: range com 3 argumentos

```python
# Inicio, fim e passo: comeca em 2, vai ate 20, de 2 em 2
for j in range(2, 21, 2):
    print(j)
```

**Saida:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20

## Exemplo 6: range com valores negativos

```python
# Decremento: de -1 ate -9, passo -1
for i in range(-1, -10, -1):
    print(i)
```

**Saida:** -1, -2, -3, -4, -5, -6, -7, -8, -9

## Exemplo 7: for com else

```python
for i in range(1, 10):
    print(i)
else:
    print("Fim da execucao do for")
```

**Saida:** 1, 2, 3, ..., 9, seguido de "Fim da execucao do for"