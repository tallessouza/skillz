---
name: rs-data-analytics-conceitos-importantes
description: "Applies foundational statistics concepts when analyzing datasets or writing data analysis code. Use when user asks to 'analyze data', 'calculate mean', 'work with samples', 'classify variables', or 'explore a dataset'. Enforces correct distinction between population and sample, qualitative and quantitative variables, and sample representativeness checks. Make sure to use this skill whenever performing exploratory data analysis or statistical calculations. Not for machine learning, hypothesis testing, or advanced inferential statistics."
---

# Conceitos Fundamentais de Estatística Descritiva

> Antes de calcular qualquer métrica, identifique se os dados representam população ou amostra e classifique cada variável corretamente.

## Rules

1. **Distinga população de amostra antes de calcular** — população é o conjunto total, amostra é uma parcela, porque usar a fórmula errada (desvio padrão com n vs n-1) produz resultados incorretos
2. **Avalie representatividade da amostra** — verifique se a amostra cobre os segmentos relevantes (gênero, idade, região), porque amostras enviesadas produzem conclusões inválidas
3. **Classifique variáveis antes de operar** — determine se cada coluna é qualitativa ou quantitativa, porque calcular média de variáveis qualitativas é um erro lógico
4. **Número nem sempre é quantitativo** — matrícula, CEP, código de produto são números mas representam categorias, porque não faz sentido calcular "média de CEPs"
5. **Variáveis podem mudar de classificação conforme o uso** — data de nascimento é quantitativa por natureza mas vira qualitativa quando usada para categorizar por signo ou período, porque a classificação depende da análise pretendida
6. **Cada coluna é uma variável, cada linha é um indivíduo** — use essa terminologia consistentemente, porque alinha a comunicação com a linguagem estatística padrão

## Decision Framework

| Pergunta | Se SIM | Se NÃO |
|----------|--------|--------|
| Posso somar/calcular média desse valor? | Quantitativa | Qualitativa |
| O número representa uma categoria/código? | Qualitativa (apesar de ser número) | Quantitativa |
| Estou categorizando um valor numérico? | Tratando como qualitativa nesse contexto | Manter como quantitativa |
| Estou analisando todos os indivíduos? | População | Amostra |

## How to classify

### Variáveis qualitativas (categorias)
```python
# Representam categorias — NÃO calcule média/soma
qualitative_columns = ['nome', 'sexo', 'cidade', 'produto_mais_comprado', 'signo']

# Operações válidas: contagem, moda, frequência
df['cidade'].value_counts()
df['sexo'].mode()
```

### Variáveis quantitativas (valores numéricos mensuráveis)
```python
# Representam quantidades — PODE calcular média/soma
quantitative_columns = ['idade', 'valor_compra', 'salario', 'altura']

# Operações válidas: média, mediana, soma, desvio padrão
df['idade'].mean()
df['valor_compra'].median()
```

### Variáveis ambíguas (número que é categoria)
```python
# CUIDADO: números que representam códigos/identificadores
# NÃO são quantitativos — trate como categóricos
df['matricula'] = df['matricula'].astype(str)  # Force categorical
df['cep'] = df['cep'].astype(str)
# NUNCA: df['cep'].mean()  — sem sentido
```

## Example

**Before (erro comum):**
```python
# Calculando média de tudo que é número
print(df.describe())  # Inclui matrícula, CEP, código_produto na média
mean_birthday = df['data_nascimento'].mean()  # Sem contexto do porquê
```

**After (com classificação correta):**
```python
# 1. Classificar variáveis
quantitative = ['idade', 'valor_compra', 'salario']
qualitative = ['nome', 'sexo', 'cidade', 'matricula']  # matricula é código!

# 2. Verificar representatividade da amostra
print(f"Total registros: {len(df)} (amostra de ~200k população)")
print(f"Distribuição sexo:\n{df['sexo'].value_counts(normalize=True)}")

# 3. Aplicar operações corretas por tipo
print(df[quantitative].describe())       # Média, mediana só para quantitativas
print(df[qualitative].describe())         # Contagem, moda para qualitativas
```

## Heuristics

| Situação | Faça |
|----------|------|
| Dataset novo, primeira análise | Classifique TODAS as colunas antes de qualquer cálculo |
| Coluna numérica com poucos valores únicos | Provavelmente é categórica (ex: rating 1-5) |
| Data/timestamp | Quantitativa por natureza, mas avalie o uso pretendido |
| Amostra muito pequena ou muito específica | Alerte sobre possível falta de representatividade |
| Usuário pede "média de tudo" | Filtre apenas colunas genuinamente quantitativas |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `df.describe()` sem filtrar colunas | `df[quantitative_cols].describe()` |
| Média de CEP, matrícula, código | `value_counts()` para códigos |
| Assumir amostra = população | Perguntar qual é o universo total |
| Classificar por tipo Python (int = quantitativo) | Classificar pelo significado semântico |
| Ignorar como a variável será usada na análise | Reclassificar conforme o contexto de uso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
