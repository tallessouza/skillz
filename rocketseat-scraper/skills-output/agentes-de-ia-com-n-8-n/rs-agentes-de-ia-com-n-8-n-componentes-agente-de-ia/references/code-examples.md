# Code Examples: Componentes de Agente de IA no N8N

## Estrutura basica de um workflow com AI Agent

```
[Trigger] → [AI Agent]
                ├── Chat Model (ex: OpenAI GPT-4)
                ├── Memory (ex: Window Buffer Memory)
                └── Tools (ex: HTTP Request, Code, etc)
```

## Configuracao do AI Agent node

### Campo: Source for Prompt
```
Source for prompt: Connected trigger
```
O AI Agent espera que o trigger anterior envie a mensagem do usuario.

### Campo: User Message (variavel padrao)
```
{{ $json.chatInput }}
```
Essa e a variavel que o AI Agent automaticamente espera. O trigger deve enviar a mensagem neste formato.

### Campo: System Message (dentro de Options)
```
Voce e um assistente especializado em [dominio].
Suas responsabilidades:
- [responsabilidade 1]
- [responsabilidade 2]

Regras:
- Sempre responda em portugues
- Seja objetivo e direto
```

## Estrutura do no OpenAI

### Acoes disponiveis no no OpenAI:
```
1. Create Assistant    → Criar assistente na plataforma OpenAI
2. Send Message        → Enviar mensagem de texto ao modelo
3. Create Image        → Gerar imagem (DALL-E)
4. Create Audio        → Gerar audio (TTS)
5. Work with Files     → Upload/manipulacao de arquivos
```

### Uso basico: Enviar mensagem ao modelo
```
[Trigger] → [OpenAI: Message Model]
```
Neste caso, o OpenAI node recebe a mensagem e retorna a resposta diretamente, sem memoria ou ferramentas.

## Comparacao visual: AI Agent vs OpenAI

```
AI AGENT (orquestrador):
┌──────────────────────┐
│     AI Agent Node     │
│                      │
│  Options:            │
│  - System Message    │
│  - Max Iterations    │
│  - Return Options    │
│                      │
│  Sub-nodes:          │
│  ├── Chat Model ─────│── Qual LLM
│  ├── Memory ─────────│── Historico
│  └── Tools ──────────│── Acoes externas
└──────────────────────┘

OPENAI (executor direto):
┌──────────────────────┐
│     OpenAI Node       │
│                      │
│  Action: Message     │
│  Model: gpt-4        │
│  Prompt: [mensagem]  │
│                      │
│  (sem sub-nodes)     │
└──────────────────────┘
```

## Fluxo completo de prompts no AI Agent

```
Trigger envia: { "chatInput": "Qual o status do pedido 123?" }
                    │
                    ▼
AI Agent combina:
┌─────────────────────────────────────┐
│ SYSTEM: "Voce e um assistente de    │
│ atendimento ao cliente..."          │
│                                     │
│ USER: "Qual o status do pedido 123?"│
└─────────────────────────────────────┘
                    │
                    ▼
         Enviado ao Chat Model (ex: GPT-4)
                    │
                    ▼
         Resposta retornada ao workflow
```

## Navegacao para modo escuro/claro

```
Passo a passo:
1. Clique no icone do perfil (canto inferior esquerdo)
2. Selecione "Settings"
3. Va em "Personal"
4. Em "Theme", escolha: Light | Dark | System Default
```