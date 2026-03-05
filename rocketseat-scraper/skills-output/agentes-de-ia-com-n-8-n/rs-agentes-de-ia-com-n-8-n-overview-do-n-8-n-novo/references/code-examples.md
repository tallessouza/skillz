# Code Examples: Overview do N8N

## Nota sobre exemplos

Esta aula e uma overview visual/pratica da interface do n8n. Nao ha codigo escrito pelo instrutor. Os exemplos abaixo sao representacoes dos workflows demonstrados.

## Workflow basico demonstrado

```
[Manual Trigger] → [ActiveCampaign: Create Contact]
```

O instrutor criou esse workflow minimo para demonstrar a logica de conexao. Ele ressalta que nao funciona sem configuracao — e apenas visual.

## Configuracao do bloco ActiveCampaign

Campos mostrados na interface:
- Credencial (API key do ActiveCampaign)
- Acao: Create Contact
- Campos do contato (email, nome, etc.)

Sem preencher esses campos, o bloco nao executa.

## Estrutura tipica de um workflow n8n

```
[Trigger]
    │
    ▼
[Processamento/Integracao]
    │
    ▼
[Transformacao de dados] (opcional)
    │
    ▼
[Condicional/Flow] (opcional)
    │
    ├──▶ [Caminho A]
    │
    └──▶ [Caminho B]
```

## Exemplos de triggers mencionados

### Manual Trigger
- Disparo por clique no botao "Execute Workflow"
- Usar para testes e desenvolvimento

### Schedule Trigger
- Disparo periodico (cron-like)
- Exemplo: a cada 5 minutos, a cada hora, todo dia as 8h

### Webhook Trigger
- Disparo por chamada HTTP externa
- URL gerada pelo n8n, sistemas externos chamam essa URL

### Chat Trigger
- Disparo por mensagem recebida
- Usado em integracoes com chatbots

## Nos de IA mencionados

| No | Funcao |
|----|--------|
| AI Agent | Agente autonomo com ferramentas |
| Question and Answer Chain | Perguntas e respostas sobre dados |
| OpenAI / Anthropic / Gemini | Modelos de linguagem como blocos |
| Sentiment Analysis | Analise de sentimento de textos |

## HTTP Request (Core)

O no mais versatil para integracoes sem suporte nativo:

```
[HTTP Request]
- Method: GET / POST / PUT / DELETE
- URL: qualquer endpoint externo
- Headers: autenticacao, content-type
- Body: payload JSON
```

Usar quando o servico desejado nao tem um App Node dedicado no n8n.