# Code Examples: Componente OpenAI Assistants no N8N

## Fluxo completo: Conectar Assistant ao N8N

### 1. Criar organizacao e projeto na OpenAI Platform

```
1. Acesse platform.openai.com
2. Crie sua conta (vai pedir dados + cartao de credito)
3. O pagamento funciona por creditos pre-pagos (nao assinatura mensal)
4. Crie sua organizacao (seu nome ou empresa)
5. Dentro da organizacao, crie um projeto (ex: "Meu Projeto IA")
```

### 2. Gerar API Key

```
1. Dentro do projeto, va em API Keys
2. Clique em "Create new secret key"
3. De um nome (ex: "aula")
4. Selecione o projeto relacionado
5. COPIE A CHAVE IMEDIATAMENTE — ela so aparece uma vez
6. Guarde em local seguro
```

### 3. Criar um Assistant na OpenAI Platform

```
1. Va para a tela de Dashboards (nao a tela de Settings/API Keys)
2. Clique em "Assistants"
3. Clique em "Create"
4. Configure:
   - Name: "Assistente Aula"
   - System Instructions: "Voce e um professor de IA..."
   - Model: GPT-4 Mini (ou outro disponivel)
   - Tools: File Search (opcional), Code Interpreter (opcional)
   - Temperature: 0 a 2 (0 = direto, 2 = criativo)
   - Response format: Text ou JSON
5. Teste no playground: envie uma mensagem e clique "Run"
```

### 4. Configurar credencial no N8N

```
1. Adicione um bloco OpenAI ao workflow
2. Em "Credentials to connect with", clique na seta
3. Clique em "Create new credential"
4. Cole a API Key que voce copiou da OpenAI Platform
5. Clique "Save" — o N8N testa automaticamente
6. Se "Connection tested successfully" aparecer, esta funcionando
```

### 5. Usar o Assistant no N8N

```
1. No bloco OpenAI:
   - Resource: Assistant
   - Operation: Send Message
   - Credential: selecione a credencial criada
   - Assistant: From List → selecione o assistant (ex: "Assistente Aula")
2. Configure a mensagem de input (vinda do trigger ou bloco anterior)
3. Execute o workflow
```

## Exemplo de workflow completo

```
[Webhook/Chat Trigger]
        │
        ▼
[OpenAI — Assistant]
  Resource: Assistant
  Operation: Send Message
  Credential: "Projeto Aula - OpenAI"
  Assistant: "Assistente Aula"
  Message: {{ $json.chatInput }}
        │
        ▼
[Respond to Webhook / Chat Output]
  Message: {{ $json.output }}
```

## Comparacao visual dos 3 modelos

### Modelo 1: AI Agent (tudo no N8N)
```
[Trigger] → [AI Agent Node]
                 │
                 ├── [Tool: HTTP Request]
                 ├── [Tool: Database Query]
                 ├── [Memory: Window Buffer]
                 └── [LLM: OpenAI Chat Model]
```

### Modelo 2: Assistant (tudo na OpenAI)
```
[Trigger] → [OpenAI Node (Assistant > Send Message)]
                 │
                 └── Conecta ao Assistant na OpenAI Platform
                     (prompt, tools, docs, modelo — tudo la fora)
```

### Modelo 3: API direta (chamada simples)
```
[Trigger] → [OpenAI Node (Chat/Audio/Image)]
                 │
                 └── Chamada stateless, sem memoria, sem tools
```