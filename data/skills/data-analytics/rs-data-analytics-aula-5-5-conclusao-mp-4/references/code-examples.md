# Code Examples: Matemática como Ferramenta do Analista de Dados

Esta aula é uma conclusão conceitual do módulo de matemática para analistas de dados, sem exemplos de código. Os conceitos matemáticos mencionados (estatística, probabilidade e álgebra linear) foram cobertos nas aulas anteriores do módulo.

## Onde a matemática aparece "por trás dos panos"

### Estatística em pandas
```python
# O analista vê uma linha simples
df['vendas'].describe()

# Por trás: média, desvio padrão, quartis — tudo estatística
# Entender esses conceitos permite interpretar o output corretamente
```

### Probabilidade em análise de dados
```python
# Calcular a probabilidade de um evento
conversao = usuarios_convertidos / total_usuarios

# Entender probabilidade permite saber se essa taxa é significativa
# ou apenas variação aleatória
```

### Álgebra linear em transformações
```python
import numpy as np

# Multiplicação de matrizes — base de muitas transformações
# O analista pode não ver, mas modelos de ML dependem disso
X = np.array([[1, 2], [3, 4]])
y = np.array([5, 6])
resultado = X @ y  # Álgebra linear em ação
```

Esses exemplos ilustram o ponto central da aula: a matemática está presente mesmo quando o analista não a vê diretamente na interface.