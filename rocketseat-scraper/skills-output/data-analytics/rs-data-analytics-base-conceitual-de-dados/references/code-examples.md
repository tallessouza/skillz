# Code Examples: Base Conceitual de Dados

## Exemplo 1: Impacto de outlier na media vs mediana

```python
import numpy as np

# Sala com 10 jovens
idades_jovens = [18, 19, 20, 21, 22, 22, 23, 24, 24, 25]

media_sem_outlier = np.mean(idades_jovens)
mediana_sem_outlier = np.median(idades_jovens)
print(f"Sem outlier - Media: {media_sem_outlier:.1f}, Mediana: {mediana_sem_outlier:.1f}")
# Sem outlier - Media: 21.8, Mediana: 22.0

# Entra a senhora (outlier)
idades_com_outlier = idades_jovens + [65]

media_com_outlier = np.mean(idades_com_outlier)
mediana_com_outlier = np.median(idades_com_outlier)
print(f"Com outlier - Media: {media_com_outlier:.1f}, Mediana: {mediana_com_outlier:.1f}")
# Com outlier - Media: 25.7, Mediana: 22.0

# A media saltou de 21.8 para 25.7 (distorcao de ~18%)
# A mediana permaneceu em 22.0 (resistente ao outlier)
```

## Exemplo 2: Classificando tipo de analise pela pergunta

```python
def classificar_analise(pergunta: str) -> dict:
    """
    Classifica o tipo de analise com base na pergunta de negocio.
    """
    pergunta_lower = pergunta.lower()

    if any(word in pergunta_lower for word in ["o que aconteceu", "quanto vendemos", "qual foi", "resumo"]):
        return {
            "tipo": "descritiva",
            "complexidade": "baixa",
            "entrega": "Relatorio ou dashboard com metricas historicas"
        }
    elif any(word in pergunta_lower for word in ["por que", "causa", "motivo", "razao"]):
        return {
            "tipo": "diagnostica",
            "complexidade": "media",
            "entrega": "Analise de causas com correlacoes e segmentacoes"
        }
    elif any(word in pergunta_lower for word in ["vai acontecer", "previsao", "projecao", "tendencia"]):
        return {
            "tipo": "preditiva",
            "complexidade": "alta",
            "entrega": "Modelo preditivo com projecoes e intervalos de confianca"
        }
    elif any(word in pergunta_lower for word in ["o que fazer", "recomendar", "acao", "estrategia"]):
        return {
            "tipo": "prescritiva",
            "complexidade": "muito alta",
            "entrega": "Recomendacoes de acao baseadas em cenarios simulados"
        }

    return {"tipo": "indefinido", "complexidade": "avaliar", "entrega": "Refinar a pergunta de negocio"}


# Exemplos de uso
print(classificar_analise("Quanto vendemos no Q4?"))
# {'tipo': 'descritiva', ...}

print(classificar_analise("Por que o churn aumentou em janeiro?"))
# {'tipo': 'diagnostica', ...}

print(classificar_analise("Qual a projecao de receita para o proximo trimestre?"))
# {'tipo': 'preditiva', ...}

print(classificar_analise("O que fazer para reduzir o churn em 20%?"))
# {'tipo': 'prescritiva', ...}
```

## Exemplo 3: Classificando nivel de estruturacao

```python
def classificar_estruturacao(fonte: str) -> dict:
    """
    Classifica o nivel de estruturacao de uma fonte de dados.
    """
    estruturados = [".csv", ".xlsx", ".parquet", "sql", "tabela", "banco de dados"]
    semi_estruturados = [".json", ".xml", ".yaml", "log", "api"]
    nao_estruturados = [".txt", ".pdf", ".mp4", ".mp3", ".wav", "video", "audio", "imagem", ".png", ".jpg"]

    fonte_lower = fonte.lower()

    if any(ext in fonte_lower for ext in estruturados):
        return {"nivel": "estruturado", "dificuldade": "baixa", "acao": "Carregar direto para analise"}
    elif any(ext in fonte_lower for ext in semi_estruturados):
        return {"nivel": "semi-estruturado", "dificuldade": "media", "acao": "Parsear e transformar para tabular"}
    elif any(ext in fonte_lower for ext in nao_estruturados):
        return {"nivel": "nao-estruturado", "dificuldade": "alta", "acao": "Extrair features ou usar NLP/CV"}

    return {"nivel": "desconhecido", "dificuldade": "avaliar", "acao": "Investigar formato da fonte"}
```

## Exemplo 4: Checklist de validacao estatistica (inspirado na analogia do instrutor)

```python
def validar_metrica(dados: list, metrica: str = "media") -> dict:
    """
    Antes de reportar qualquer metrica, investigue o comportamento dos dados.
    'Torne-se a melhor amiga dos seus dados' — instrutor Rocketseat.
    """
    import numpy as np

    arr = np.array(dados)

    # Calcular estatisticas basicas
    q1, q3 = np.percentile(arr, [25, 75])
    iqr = q3 - q1
    outlier_mask = (arr < q1 - 1.5 * iqr) | (arr > q3 + 1.5 * iqr)

    return {
        "media": float(np.mean(arr)),
        "mediana": float(np.median(arr)),
        "moda": float(max(set(dados), key=dados.count)),
        "minimo": float(np.min(arr)),
        "maximo": float(np.max(arr)),
        "outliers_detectados": int(outlier_mask.sum()),
        "valores_outlier": arr[outlier_mask].tolist(),
        "alerta": "Media pode estar distorcida por outliers!" if outlier_mask.any() else "Distribuicao parece saudavel",
        "recomendacao": "Use mediana em vez de media" if outlier_mask.any() else f"Seguro usar {metrica}"
    }


# Exemplo da aula: sala com jovens + senhora
idades = [18, 19, 20, 21, 22, 22, 23, 24, 24, 25, 65]
resultado = validar_metrica(idades)
print(resultado)
# {'outliers_detectados': 1, 'valores_outlier': [65], 
#  'alerta': 'Media pode estar distorcida por outliers!',
#  'recomendacao': 'Use mediana em vez de media'}
```

## Exemplo 5: Pipeline CRISP-DM como checklist

```python
CRISP_DM_PIPELINE = [
    {
        "etapa": "Compreensao do negocio",
        "pergunta_chave": "Qual a pergunta de negocio que estamos respondendo?",
        "validacao": "A pergunta esta conectada a uma decisao real?"
    },
    {
        "etapa": "Compreensao dos dados",
        "pergunta_chave": "Quais dados temos disponiveis? Qual o nivel de estruturacao?",
        "validacao": "Os dados sao suficientes para responder a pergunta?"
    },
    {
        "etapa": "Tratamento dos dados",
        "pergunta_chave": "Que limpeza e transformacao sao necessarias?",
        "validacao": "Outliers foram investigados? Valores nulos tratados?"
    },
    {
        "etapa": "Modelagem",
        "pergunta_chave": "Que tipo de analise/modelo aplicar?",
        "validacao": "O tipo de analise (descritiva/diagnostica/preditiva/prescritiva) esta correto?"
    },
    {
        "etapa": "Validacao",
        "pergunta_chave": "Os resultados fazem sentido no contexto de negocio?",
        "validacao": "Alguem de negocios revisou as conclusoes?"
    },
    {
        "etapa": "Deploy",
        "pergunta_chave": "Como entregar para quem vai tomar a decisao?",
        "validacao": "A visualizacao/relatorio esta clara para o publico-alvo?"
    }
]
```