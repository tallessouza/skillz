# Code Examples: Conceitos Fundamentais de Estatística Descritiva

## Exemplo 1: Classificação automática de variáveis

```python
import pandas as pd

# Dataset exemplo similar ao do instrutor (cadastro de funcionários)
df = pd.DataFrame({
    'nome': ['Amanda', 'Carlos', 'Beatriz', 'Diego'],
    'matricula': [1001, 1002, 1003, 1004],
    'sexo': ['F', 'M', 'F', 'M'],
    'data_nascimento': pd.to_datetime(['1990-03-15', '1985-07-22', '1992-11-08', '1988-01-30']),
    'idade': [35, 40, 33, 38],
    'salario': [5500.00, 7200.00, 6100.00, 8300.00],
    'departamento': ['RH', 'TI', 'TI', 'Financeiro']
})

# Passo 1: Classificar variáveis ANTES de qualquer análise
qualitativas = ['nome', 'matricula', 'sexo', 'departamento']  # matricula é código!
quantitativas = ['idade', 'salario']
ambiguas = ['data_nascimento']  # depende do uso

# Passo 2: Converter identificadores numéricos para string
df['matricula'] = df['matricula'].astype(str)

# Passo 3: Aplicar operações corretas
print("=== Variáveis Quantitativas ===")
print(df[quantitativas].describe())

print("\n=== Variáveis Qualitativas ===")
for col in qualitativas:
    print(f"\n{col}:")
    print(df[col].value_counts())
```

## Exemplo 2: Variável ambígua — data como quantitativa vs qualitativa

```python
# USO QUANTITATIVO: calcular idade a partir da data de nascimento
from datetime import datetime

df['idade_calculada'] = (datetime.now() - df['data_nascimento']).dt.days // 365
print(f"Idade média: {df['idade_calculada'].mean():.1f} anos")
print(f"Diferença entre mais velho e mais novo: {df['idade_calculada'].max() - df['idade_calculada'].min()} anos")

# USO QUALITATIVO: categorizar por signo (mesmo dado, uso diferente)
def get_signo(data):
    signos = [
        (120, 'Capricórnio'), (219, 'Aquário'), (320, 'Peixes'),
        (420, 'Áries'), (521, 'Touro'), (621, 'Gêmeos'),
        (722, 'Câncer'), (823, 'Leão'), (923, 'Virgem'),
        (1023, 'Libra'), (1122, 'Escorpião'), (1222, 'Sagitário'),
        (1231, 'Capricórnio')
    ]
    dia_mes = data.month * 100 + data.day
    for limite, signo in signos:
        if dia_mes <= limite:
            return signo

df['signo'] = df['data_nascimento'].apply(get_signo)

# Agora data_nascimento está sendo usada como QUALITATIVA
print("\nDistribuição por signo:")
print(df['signo'].value_counts())
# Aqui NÃO faz sentido: df['signo'].mean() — é categoria!
```

## Exemplo 3: Verificação de representatividade da amostra

```python
def verificar_representatividade(amostra_df, populacao_total=None, colunas_verificar=None):
    """
    Verifica se a amostra é representativa.
    Aplica o alerta do instrutor: amostra enviesada = conclusões inválidas.
    """
    print("=== Verificação de Representatividade ===\n")
    
    # Tamanho da amostra
    n = len(amostra_df)
    print(f"Tamanho da amostra: {n}")
    if populacao_total:
        pct = (n / populacao_total) * 100
        print(f"Representa {pct:.2f}% da população ({populacao_total})")
        if pct < 1:
            print("⚠ ALERTA: Amostra muito pequena em relação à população")
    
    # Distribuição das variáveis qualitativas
    if colunas_verificar:
        for col in colunas_verificar:
            print(f"\nDistribuição de '{col}':")
            dist = amostra_df[col].value_counts(normalize=True)
            print(dist.apply(lambda x: f"{x:.1%}"))
            
            # Alerta se alguma categoria domina demais
            if dist.max() > 0.8:
                print(f"⚠ ALERTA: '{dist.idxmax()}' representa {dist.max():.0%} da amostra")
                print("  A amostra pode estar enviesada para este grupo")

# Uso
verificar_representatividade(
    df, 
    populacao_total=5000,  # Total de funcionários da empresa
    colunas_verificar=['sexo', 'departamento']
)
```

## Exemplo 4: Pipeline completo — da classificação à análise

```python
def analisar_dataset(df):
    """
    Pipeline que aplica os conceitos do instrutor:
    1. Classificar variáveis
    2. Verificar representatividade
    3. Aplicar operações corretas por tipo
    """
    
    # 1. Classificação automática (ponto de partida — sempre revisar manualmente)
    classificacao = {}
    for col in df.columns:
        if df[col].dtype == 'object':
            classificacao[col] = 'qualitativa'
        elif df[col].dtype in ['datetime64[ns]', 'datetime64']:
            classificacao[col] = 'ambigua (data)'
        elif df[col].nunique() < 10 and df[col].dtype in ['int64', 'int32']:
            classificacao[col] = 'possivelmente qualitativa (poucos valores únicos)'
        else:
            classificacao[col] = 'quantitativa'
    
    print("=== Classificação de Variáveis ===")
    print("(Revisar manualmente — número nem sempre é quantitativo!)\n")
    for col, tipo in classificacao.items():
        print(f"  {col}: {tipo}")
    
    # 2. Separar por tipo
    quant = [c for c, t in classificacao.items() if t == 'quantitativa']
    qual = [c for c, t in classificacao.items() if t == 'qualitativa']
    
    # 3. Métricas corretas por tipo
    if quant:
        print("\n=== Resumo Quantitativo ===")
        print(df[quant].describe())
    
    if qual:
        print("\n=== Resumo Qualitativo ===")
        for col in qual:
            print(f"\n{col} — Moda: {df[col].mode()[0]}")
            print(df[col].value_counts().head(5))
    
    return classificacao

# Uso
classificacao = analisar_dataset(df)
```

## Exemplo 5: Armadilha clássica — describe() sem filtrar

```python
# ERRADO: df.describe() inclui TUDO que é numérico
df_errado = pd.DataFrame({
    'matricula': [1001, 1002, 1003],      # Código, NÃO quantitativo
    'cep': [13045000, 01310100, 22041080], # Código, NÃO quantitativo
    'idade': [25, 30, 35],                 # Quantitativo
    'salario': [3000, 5000, 7000]          # Quantitativo
})

print("ERRADO — média de CEP e matrícula não faz sentido:")
print(df_errado.describe())
# Output inclui média de CEP (11465393) e matrícula (1002) — sem sentido!

print("\nCORRETO — apenas variáveis genuinamente quantitativas:")
print(df_errado[['idade', 'salario']].describe())
```