# Code Examples: Memória para Agentes de IA no n8n

## Estrutura do Chat Trigger Output

O Chat Trigger node produz este formato de dados:

```json
{
  "sessionId": "unique-session-id",
  "action": "sendMessage",
  "chatInput": "Oi, tudo bem?"
}
```

## Referência no Agent Node

O User Message no agente referencia o input do bloco anterior:

```
{{ $json.chatInput }}
```

Isso conecta a mensagem do usuário ao prompt do agente.

## Composição do prompt enviado à API

O agente combina duas camadas num único prompt:

```
System Message: "Você é um assistente útil..."  (configurado no agent node)
User Message: "Eu sou o Bruno"                   (vem de $json.chatInput)
```

Sem memória, apenas essas duas camadas são enviadas. Com memória (Redis), o histórico da conversa é adicionado entre elas.

## Logs do Agent Node

Ao inspecionar o agent node, os logs mostram:

```json
{
  "input": {
    "messages": [
      { "role": "system", "content": "Você é um assistente útil..." },
      { "role": "user", "content": "Eu sou o Bruno" }
    ]
  },
  "output": {
    "content": "Olá Bruno, como posso te ajudar hoje?"
  }
}
```

## Configuração de credenciais Redis no n8n

Campos necessários para a credencial Redis:

```yaml
Nome: "Redis Aula"
Password: "<senha configurada no EasyPanel>"
Host: "aula-aula"           # host interno do EasyPanel
Port: 6379                   # porta padrão Redis
Database: 0                  # padrão
```

Se o usuário está em branco, deixar vazio (default user).

## Fluxo visual do n8n

```
[Chat Trigger] → [AI Agent] → [Chat Output]
                      │
                      ├── [OpenAI Chat Model] (subcamada: modelo)
                      └── [Redis Memory]       (subcamada: memória)
```

O Chat Trigger é o input, o AI Agent processa (combinando modelo + memória), e o resultado volta ao chat.

## Demonstração da falha sem memória

Sequência de mensagens que expõe a falta de memória:

```
Usuário: "Eu sou o Bruno"
Agente:  "Olá Bruno, como posso te ajudar hoje?"

Usuário: "Qual a capital do Japão?"
Agente:  "A capital do Japão é Tóquio"

Usuário: "Qual é meu nome?"
Agente:  "Desculpe, mas eu não tenho como saber seu nome"
```

Cada mensagem é uma chamada isolada à API — o agente não tem acesso às mensagens anteriores.