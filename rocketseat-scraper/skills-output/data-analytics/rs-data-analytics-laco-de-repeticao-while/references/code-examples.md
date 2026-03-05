# Code Examples: Laco de Repeticao While

## Exemplo 1: Sintaxe basica do while

```python
# Sintaxe do while
# while condicao:
#     bloco de comandos (com indentacao obrigatoria)
```

O while exige indentacao assim como o for, porque define um bloco de comandos.

## Exemplo 2: Contagem de 1 a 10

```python
i = 1
while i <= 10:
    print(f"Contagem: {i}")
    i += 1
```

**Saida:**
```
Contagem: 1
Contagem: 2
Contagem: 3
...
Contagem: 10
```

Quando `i` chega a 11, a condicao `i <= 10` e falsa e o loop para.

## Exemplo 3: Loop infinito (o que NAO fazer)

```python
# PERIGO: Loop infinito
i = 1
while i <= 10:
    print(f"Contagem: {i}")
# Sem i += 1, imprime "Contagem: 1" para sempre
```

O instrutor executou isso ao vivo para mostrar o efeito. O programa trava imprimindo 1 indefinidamente.

## Exemplo 4: Validacao de senha (versao com loop infinito)

```python
# Versao problematica — gera loop infinito com senha errada
senha = ""
while senha != "Python":
    print("Senha errada. Tente novamente.")
    senha = "ABC"  # Valor fixo, nunca muda
print("Senha correta. O acesso foi liberado.")
```

O problema: a senha nunca muda porque esta hardcoded. O loop nunca para.

## Exemplo 5: Validacao de senha (versao correta com input)

```python
# Versao correta — usuario digita a senha
senha = input("Digite a senha de acesso ao sistema: ")
while senha != "Python":
    senha = input("Senha invalida. Tente novamente: ")
print("Senha correta. O acesso foi liberado.")
```

**Execucao:**
```
Digite a senha de acesso ao sistema: ABC
Senha invalida. Tente novamente: Java
Senha invalida. Tente novamente: Python
Senha correta. O acesso foi liberado.
```

O `input()` dentro do loop permite que o usuario forneca um novo valor a cada iteracao.

## Exemplo 6: Validacao de numero em intervalo (1 a 10)

```python
numero = int(input("Digite um numero entre 1 e 10: "))
while numero < 1 or numero > 10:
    numero = int(input("Numero invalido. Digite um numero entre 1 e 10: "))
print(f"Numero valido. O numero digitado foi: {numero}")
```

**Execucao:**
```
Digite um numero entre 1 e 10: -10
Numero invalido. Digite um numero entre 1 e 10: 50
Numero invalido. Digite um numero entre 1 e 10: 5
Numero valido. O numero digitado foi: 5
```

Usa `or` para rejeitar valores fora do intervalo: menor que 1 **ou** maior que 10.

## Variacoes adicionais

### Contagem regressiva

```python
i = 10
while i >= 1:
    print(f"Contagem: {i}")
    i -= 1
print("Fim!")
```

### Contagem com passo de 2

```python
i = 0
while i <= 20:
    print(i)
    i += 2
```

### Validacao com numero maximo de tentativas

```python
senha = input("Digite a senha: ")
tentativas = 1
while senha != "Python" and tentativas < 3:
    senha = input("Senha invalida. Tente novamente: ")
    tentativas += 1
if senha == "Python":
    print("Acesso liberado.")
else:
    print("Numero maximo de tentativas excedido.")
```