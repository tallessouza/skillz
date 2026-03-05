# Code Examples: N8N AI Agent Tools

## Exemplo 1: Configuracao completa da Tool de Cotacao

### URL da API
```
GET https://economia.awesomeapi.com.br/last/{moeda}
```

### Configuracao no N8N

**Nome da Tool:** `cotacao`
**Descricao da Tool:** `Busca cotacao de moeda`
**Metodo:** `GET`
**URL:**
```
https://economia.awesomeapi.com.br/last/{{ $fromAI('moeda', 'Codigo da moeda que o usuario informar. No formato BRL, USD') }}
```

### System Prompt do Agente
```
Voce eh um assistente especialista financeiro que fala tudo sobre cambio.
Use a tool cotacao sempre que o usuario perguntar sobre a cotacao de alguma moeda.
```

## Exemplo 2: Sintaxe $fromAI() — Variantes

### Basico (campo + descricao)
```
{{ $fromAI('moeda', 'Codigo da moeda que o usuario informar. No formato BRL, USD') }}
```

### Com tipo explicito
```
{{ $fromAI('moeda', 'Codigo da moeda que o usuario informar. No formato BRL, USD', 'string') }}
```

### Outros cenarios de uso
```
# CEP em API de enderecos
https://viacep.com.br/ws/{{ $fromAI('cep', 'CEP informado pelo usuario no formato 00000000 sem hifen') }}/json/

# ID de produto
https://api.loja.com/products/{{ $fromAI('productId', 'ID do produto que o usuario mencionou') }}

# Cidade para previsao do tempo
https://api.weather.com/forecast/{{ $fromAI('city', 'Nome da cidade em ingles') }}
```

## Exemplo 3: Query Parameters com IA (metodo visual)

```yaml
Tool: HTTP Request
Metodo: GET
URL: https://api.exemplo.com/search
Query Parameters:
  - Nome: q
    Valor: [AI habilitado]
    Descricao AI: "Termo de busca que o usuario quer pesquisar"
  - Nome: limit
    Valor: 10  # fixo, sem AI
```

## Exemplo 4: Body Parameters com IA (POST)

```yaml
Tool: HTTP Request
Metodo: POST
URL: https://api.exemplo.com/analyze
Body (JSON):
  - Nome: text
    Valor: [AI habilitado]
    Descricao AI: "Texto que o usuario quer analisar"
  - Nome: language
    Valor: [AI habilitado]
    Descricao AI: "Idioma do texto no formato ISO 639-1 (pt, en, es)"
```

## Exemplo 5: Fluxo completo de execucao

### Input do usuario
```
"Qual a cotacao do dolar?"
```

### Agente processa
1. Identifica intencao: pergunta sobre cotacao → acionar tool `cotacao`
2. `$fromAI('moeda', ...)` converte "dolar" → `USD`
3. URL montada: `https://economia.awesomeapi.com.br/last/USD`

### JSON de retorno da API
```json
{
  "USDBRL": {
    "code": "USD",
    "codein": "BRL",
    "name": "Dólar Americano/Real Brasileiro",
    "high": "5.7891",
    "low": "5.7123",
    "bid": "5.7456",
    "ask": "5.7489",
    "timestamp": "1709145600"
  }
}
```

### Resposta do agente (gerada automaticamente)
```
A cotação do dólar americano (USD) em relação ao real brasileiro (BRL) é:
- Compra: R$ 5,7456
- Venda: R$ 5,7489
- Máxima do dia: R$ 5,7891
- Mínima do dia: R$ 5,7123
```

## Exemplo 6: Arquitetura visual dos 5 blocos

```
[Chat Trigger] → [AI Agent] → [Chat Output]
                     |
              ┌──────┼──────┐
              ↓      ↓      ↓
         [OpenAI] [Memory] [HTTP Request Tool]
                              |
                              ↓
                     [API Externa]
```