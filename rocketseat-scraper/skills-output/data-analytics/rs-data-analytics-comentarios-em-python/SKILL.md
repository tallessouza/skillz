---
name: rs-data-analytics-comentarios-python
description: "Enforces proper commenting practices when writing Python code for data analytics. Use when user asks to 'write Python code', 'add comments', 'document code', 'explain this code', or any Python data task. Applies rules: comment complex logic only, use # for single-line, triple quotes for multi-line, comments explain WHY not WHAT. Make sure to use this skill whenever generating Python code that contains non-trivial logic. Not for docstrings, API documentation, or README files."
---

# Comentarios em Python

> Comente apenas logica complexa, explicando o PORQUÊ e nao o QUÊ — codigo limpo se auto-documenta, comentarios salvam contexto.

## Rules

1. **Comente logica complexa, nao codigo obvio** — `x = 5` nao precisa de comentario, mas um filtro com 3 condicoes sim, porque o obvio polui e o complexo sem explicacao bloqueia outros programadores
2. **Use `#` para comentarios de uma linha** — posicione antes da linha ou apos o comando na mesma linha, porque e o padrao universal Python
3. **Use `#` repetido para blocos curtos (2-3 linhas)** — um `#` por linha, porque mantem consistencia e permite comentar/descomentar individualmente
4. **Use triple quotes para blocos longos** — `'''` ou `"""` para comentarios de varias linhas, porque evita repetir `#` em textos extensos
5. **Explique o PORQUÊ, nao o QUÊ** — `# Filtra inativos para evitar cobranca duplicada` e util, `# filtra lista` e ruido, porque o codigo ja diz o que faz
6. **Comente pensando no proximo programador** — voce nunca trabalha sozinho, o comentario deve permitir que outro dev entenda sua logica sem perguntar

## How to write

### Comentario inline (apos comando)

```python
print("Olá")  # Mensagem de boas-vindas ao usuario
```

### Comentario de linha inteira

```python
# Calcula desconto progressivo baseado no volume de compras
desconto = calcular_desconto(volume, categoria)
```

### Bloco com multiplos #

```python
# Conecta ao banco de dados de producao
# Usa pool de conexoes para evitar timeout
# Retry automatico em caso de falha
conexao = criar_conexao(config)
```

### Bloco com triple quotes

```python
'''
Pipeline de limpeza de dados:
1. Remove duplicatas por ID
2. Preenche valores nulos com mediana
3. Normaliza colunas de texto para lowercase
'''
dados_limpos = pipeline_limpeza(dados_brutos)
```

## Example

**Before (comentarios inuteis):**

```python
# Define x como 10
x = 10
# Faz um print
print(x)
# Cria uma lista
lista = [1, 2, 3]
```

**After (comentarios com proposito):**

```python
x = 10
print(x)

# Amostra de IDs para teste de integracao com API externa
lista_ids_teste = [1, 2, 3]
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Codigo trivial (atribuicao, print simples) | Nao comente |
| Logica com mais de 2 condicoes | Comente o objetivo do bloco |
| Workaround ou hack temporario | Comente o motivo e link do issue |
| Bloco de transformacao de dados (pandas, numpy) | Comente o que cada etapa produz |
| Codigo que outro dev vai manter | Comente decisoes de design |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `# Incrementa x` acima de `x += 1` | (nao comente — e obvio) |
| `# TODO` sem contexto | `# TODO(seu-nome): migrar para v2 apos release 3.1` |
| Comentario desatualizado que contradiz o codigo | Atualize ou remova o comentario |
| Triple quotes como comentario dentro de funcao (vira docstring) | Use `#` dentro de funcoes, reserve `"""` para docstrings reais |
| Codigo comentado deixado "para depois" | Delete — o git guarda o historico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
