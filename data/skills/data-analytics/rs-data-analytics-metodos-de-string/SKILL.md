---
name: rs-data-analytics-metodos-de-string
description: "Applies Python string manipulation methods when writing data processing code. Use when user asks to 'clean strings', 'parse text', 'validate input', 'split data', 'remove spaces', 'replace characters', or any Python string operation. Covers count, find, startswith, endswith, isnumeric, isalpha, isalnum, strip, replace, split. Make sure to use this skill whenever manipulating strings in Python data pipelines. Not for regex, string formatting, or f-strings."
---

# Metodos de String em Python

> Ao manipular strings em Python para dados, use os metodos nativos antes de recorrer a regex — sao mais legiveis e performaticos para operacoes simples.

## Rules

1. **Use `count()` para frequencia** — `email.count("@")` nao loops manuais, porque e O(n) nativo e mais legivel
2. **Use `find()` para posicao** — retorna o indice da primeira ocorrencia (-1 se nao encontrar), porque evita try/except com `index()`
3. **Use `startswith()`/`endswith()` para filtros** — nao fatie strings manualmente (`s[:3] == "abc"`), porque expressa intencao clara
4. **Use `strip()` antes de processar** — dados reais vem com espacos indesejados no inicio e fim, porque evita bugs silenciosos de comparacao
5. **Use `replace()` para substituicoes simples** — nao use regex para trocar caracteres fixos, porque `replace` e mais rapido e legivel
6. **Use `split()` com delimitador explicito** — `split(",")` nao `split()` sem argumento quando o separador nao e espaco, porque torna o parsing previsivel
7. **Use `isnumeric()`/`isalpha()`/`isalnum()` para validacao** — nao use regex para verificar composicao basica, porque Python ja oferece metodos nativos

## How to write

### Contagem e busca
```python
email = "bispo@skillz.com.br"
arroba_count = email.count("@")        # 1
dot_position = email.find(".com")      # 20 (indice base 0)
```

### Validacao de inicio e fim
```python
if email.startswith("bispo"):          # True
    print("Email do bispo")

if email.endswith(".com.br"):          # True
    print("Dominio brasileiro")
```

### Validacao de conteudo
```python
cpf = "12345678900"
cpf.isnumeric()    # True — apenas digitos

texto = "abcdef"
texto.isalpha()    # True — apenas letras

codigo = "abc123"
codigo.isalnum()   # True — letras e numeros, sem especiais
```

### Limpeza de espacos
```python
animal = "      cachorro          "
animal = animal.strip()   # "cachorro" (remove inicio e fim)
```

### Substituicao
```python
transporte = "Helicoptero"
transporte = transporte.replace("H", "G")  # "Gelicoptero"
```

### Split com delimitador
```python
nome = "Joao da Silva Santos Albuquerque"
partes = nome.split()          # ["Joao", "da", "Silva", "Santos", "Albuquerque"]

data = "28/02/2026"
dia, mes, ano = data.split("/")  # "28", "02", "2026"
```

## Example

**Before (manipulacao manual):**
```python
# Verificar dominio
if email[-7:] == ".com.br":
    pass

# Limpar string
cleaned = ""
for c in text:
    if c != " ":
        cleaned += c

# Verificar se e numero
try:
    int(cpf)
    is_number = True
except:
    is_number = False
```

**After (com metodos nativos):**
```python
if email.endswith(".com.br"):
    pass

cleaned = text.strip()

is_number = cpf.isnumeric()
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados vindos de CSV/input externo | Sempre `strip()` antes de processar |
| CPF, CEP, telefone (numeros como string) | Use `isnumeric()` para validar |
| Filtrar emails por dominio | Use `endswith("@dominio.com")` |
| Separar data em partes | `split("/")` ou `split("-")` conforme formato |
| Contar ocorrencias de caractere | `count()` direto, sem loop |
| Buscar posicao de substring | `find()` retorna -1 se nao achar (seguro) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `email[-7:] == ".com.br"` | `email.endswith(".com.br")` |
| `email[:5] == "bispo"` | `email.startswith("bispo")` |
| `re.match(r"^\d+$", cpf)` | `cpf.isnumeric()` |
| `text.replace(" ", "")` para limpar bordas | `text.strip()` |
| `for c in s: if c != " ": ...` | `s.strip()` |
| `s.split()` quando delimitador e virgula | `s.split(",")` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
