# Code Examples: If, Elif e Else

## Exemplo 1: Classificacao de idade (do instrutor)

```python
# Classificacao em 4 faixas etarias
idade = 25

if idade < 10:
    print("Voce e uma crianca")
elif idade < 18:
    print("Voce e um adolescente")
elif idade < 65:
    print("Voce e um adulto")
else:
    print("Voce e um idoso")
# Output: Voce e um adulto
```

### Testes com diferentes valores:
```python
# idade = 5  -> "Voce e uma crianca"
# idade = 16 -> "Voce e um adolescente"
# idade = 25 -> "Voce e um adulto"
# idade = 78 -> "Voce e um idoso"
```

## Exemplo 2: Verificacao de habilitacao (do instrutor)

```python
idade = 28
tem_carteira = True

if idade >= 18 and tem_carteira:
    print("Voce pode dirigir")
elif idade >= 18 and not tem_carteira:
    print("Voce nao pode dirigir")
elif idade < 18 and tem_carteira:
    print("Voce nao pode dirigir por conta da idade")
else:
    print("Voce nao pode dirigir pela idade e por nao ter carteira")
```

### Testes com diferentes combinacoes:
```python
# idade=28, tem_carteira=True  -> "Voce pode dirigir"
# idade=28, tem_carteira=False -> "Voce nao pode dirigir"
# idade=15, tem_carteira=True  -> "Voce nao pode dirigir por conta da idade"
# idade=15, tem_carteira=False -> "Voce nao pode dirigir pela idade e por nao ter carteira"
```

## Exemplo 3: Variacao — classificacao de notas

```python
nota = 7.5

if nota >= 9:
    conceito = "A"
elif nota >= 7:
    conceito = "B"
elif nota >= 5:
    conceito = "C"
elif nota >= 3:
    conceito = "D"
else:
    conceito = "F"

print(f"Conceito: {conceito}")
# Output: Conceito: B
```

## Exemplo 4: Variacao — operadores logicos com or

```python
dia = "sabado"
feriado = False

if dia == "sabado" or dia == "domingo" or feriado:
    print("Dia de descanso")
elif dia == "sexta":
    print("Quase fim de semana")
else:
    print("Dia util")
```

## Exemplo 5: Bug classico — ifs separados vs elif

```python
# ERRADO: cada if e avaliado independentemente
temperatura = 5
if temperatura < 10:
    print("Muito frio")   # imprime
if temperatura < 20:
    print("Frio")          # TAMBEM imprime! Bug.
if temperatura < 30:
    print("Agradavel")     # TAMBEM imprime! Bug.

# CORRETO: elif garante exclusividade
temperatura = 5
if temperatura < 10:
    print("Muito frio")   # so este imprime
elif temperatura < 20:
    print("Frio")
elif temperatura < 30:
    print("Agradavel")
else:
    print("Quente")
```