# Code Examples: Componente OpenAI no n8n

## Exemplo 1: Chamada de texto simples

No n8n, o no OpenAI configurado para texto:

```json
{
  "node": "OpenAI",
  "resource": "Text",
  "operation": "Message a Model",
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Classifique o seguinte texto como positivo, negativo ou neutro: {{$json.texto}}"
    }
  ]
}
```

### Variacao com system prompt

```json
{
  "messages": [
    {
      "role": "system",
      "content": "Voce e um classificador de sentimentos. Responda apenas: positivo, negativo ou neutro."
    },
    {
      "role": "user",
      "content": "{{$json.texto}}"
    }
  ]
}
```

## Exemplo 2: Geracao de imagem

```json
{
  "node": "OpenAI",
  "resource": "Image",
  "operation": "Create",
  "prompt": "crie uma imagem do cachorro surfando",
  "model": "dall-e-3"
}
```

## Exemplo 3: Text-to-Speech (TTS)

```json
{
  "node": "OpenAI",
  "resource": "Audio",
  "operation": "Generate",
  "text": "Bem-vindo ao nosso sistema automatizado.",
  "voice": "alloy",
  "speed": 1.0
}
```

## Exemplo 4: Transcricao de audio

```json
{
  "node": "OpenAI",
  "resource": "Audio",
  "operation": "Transcribe",
  "inputDataFieldName": "audio_file"
}
```

## Exemplo 5: Upload de arquivo para fine-tuning

```json
{
  "node": "OpenAI",
  "resource": "File",
  "operation": "Upload",
  "purpose": "fine-tune",
  "inputDataFieldName": "training_data"
}
```

## Padrao de workflow completo: Classificacao de texto

```
[Trigger] → [OpenAI (Text)] → [IF] → [Acao positiva / Acao negativa]
```

1. Trigger recebe o texto (webhook, planilha, email)
2. OpenAI node classifica o texto
3. IF node roteia baseado na classificacao
4. Acoes diferentes para cada resultado

## Padrao de workflow: Geracao de conteudo multimidia

```
[Trigger] → [OpenAI (Text)] → [OpenAI (Image)] → [OpenAI (Audio TTS)] → [Output]
```

1. Gera texto com o modelo de texto
2. Usa o texto para gerar imagem com DALL-E
3. Converte o texto em audio com TTS
4. Salva todos os outputs