# Code Examples: Onde o N8N Entra na Stack

## Arquitetura visual apresentada na aula

### Diagrama 1: Estrutura basica de um aplicativo

```
┌─────────────────────────────────────────────┐
│              APLICATIVO                      │
│                                              │
│  ┌─────────────┐    ┌─────────────────────┐ │
│  │  FRONTEND   │───▶│     BACKEND         │ │
│  │             │    │                     │ │
│  │ - Botoes    │    │ - Processa dados    │ │
│  │ - Telas     │    │ - Salva no banco    │ │
│  │ - Interface │    │ - Chama APIs        │ │
│  └─────────────┘    └────────┬────────────┘ │
│                              │               │
│                    ┌─────────┼─────────┐     │
│                    ▼                   ▼     │
│             ┌──────────┐      ┌──────────┐  │
│             │  Banco   │      │  APIs /  │  │
│             │ de Dados │      │ Sistemas │  │
│             └──────────┘      │ Externos │  │
│                               └──────────┘  │
└─────────────────────────────────────────────┘
```

### Diagrama 2: N8N substituindo o backend

```
┌─────────────────────────────────────────────┐
│              APLICATIVO COM N8N              │
│                                              │
│  ┌─────────────┐    ┌─────────────────────┐ │
│  │  FRONTEND   │───▶│       N8N           │ │
│  │             │    │    (Backend)        │ │
│  │ - Qualquer  │    │                     │ │
│  │   interface │    │ - Recebe info       │ │
│  │ - WhatsApp  │    │ - Processa          │ │
│  │ - App       │    │ - Entrega resultado │ │
│  │ - Site      │    │                     │ │
│  └─────────────┘    └────────┬────────────┘ │
│                              │               │
│                    ┌─────────┼─────────┐     │
│                    ▼                   ▼     │
│             ┌──────────┐      ┌──────────┐  │
│             │  Banco   │      │  APIs /  │  │
│             │ de Dados │      │ Sistemas │  │
│             └──────────┘      │ Externos │  │
│                               └──────────┘  │
└─────────────────────────────────────────────┘
```

### Diagrama 3: Linguagens que o n8n pode substituir

```
Camada Backend tradicional:

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Python  │ │   Java   │ │ Node.js  │ │    C#    │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
      │            │            │            │
      └────────────┴────────────┴────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │     N8N      │
                  │  (low-code)  │
                  └──────────────┘
```

## Exemplo pratico: Frontend chamando n8n

### Sem n8n (backend tradicional em Node.js):
```javascript
// Backend em Express.js
app.post('/api/criar-usuario', async (req, res) => {
  const { nome, email } = req.body
  const usuario = await database.insert('usuarios', { nome, email })
  await enviarEmailBoasVindas(email)
  res.json({ usuario })
})
```

### Com n8n (mesmo resultado):
```
Webhook (POST /criar-usuario)
  → Node: Inserir no banco de dados (Postgres/Supabase)
  → Node: Enviar email (Gmail/SendGrid)
  → Respond to Webhook (retorna JSON)
```

### Frontend (identico nos dois casos):
```javascript
// O frontend nao muda — ele so chama um endpoint
const response = await fetch('https://meu-n8n.com/webhook/criar-usuario', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'João', email: 'joao@email.com' })
})
const data = await response.json()
```

## Cenarios de uso mapeados na aula

| Cenario | Fluxo no n8n |
|---------|-------------|
| Front envia dados para salvar | Webhook → Processar → Inserir no banco |
| Front pede dados | Webhook → Consultar banco → Respond |
| Sistema externo envia dados | Webhook → Transformar → Salvar |
| Integracao entre dois sistemas | Trigger Sistema A → Processar → Enviar Sistema B |
| Automacao com WhatsApp | Trigger WhatsApp → Processar → Responder |