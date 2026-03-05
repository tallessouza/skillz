# Code Examples: Instalando N8N no Easypanel

## Nota sobre esta aula

Esta aula e inteiramente baseada em interface grafica (Easypanel UI e N8N UI). Nao ha codigo envolvido. Abaixo estao os passos visuais documentados e alternativas via CLI para referencia.

## Passo a passo visual no Easypanel

### 1. Criar projeto
```
Easypanel Dashboard → "+ Create Project" → Nome: "n8n-production" → Create
```

### 2. Adicionar servico N8N
```
Dentro do projeto → "Add Service" → Buscar "n8n" → Selecionar
→ Service Name: "n8n"
→ Image: (manter padrao)
→ "Create"
```

### 3. Verificar deploy
```
Aguardar status mudar para "Running"
Menu lateral mostra: Overview, Source, Environment, Domains, etc.
```

### 4. Obter URL de acesso
```
Menu "Environment" → Copiar valor da variavel de URL
Formato tipico: https://n8n-{hash}.easypanel.host
```

### 5. Setup inicial do N8N
```
Abrir URL → Preencher:
- First Name
- Last Name  
- Email
- Password (digitar manualmente, nao usar autofill)
→ "Next"
→ Preencher pesquisa da empresa (opcional)
→ "Get Started"
```

### 6. Ativacao
```
Aguardar email do N8N (ate 2 min)
→ Copiar activation key do email
→ Colar no campo de ativacao
→ Confirmar
```

## Alternativa: Instalacao via Docker (para referencia)

Se nao usar Easypanel, o equivalente manual seria:

```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_HOST=0.0.0.0 \
  -e N8N_PORT=5678 \
  -e N8N_PROTOCOL=https \
  -e WEBHOOK_URL=https://seu-dominio.com/ \
  n8nio/n8n
```

O Easypanel faz exatamente isso por baixo dos panos, mas sem voce precisar escrever nenhum comando.

## Alternativa: Docker Compose (para referencia)

```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://seu-dominio.com/
    restart: unless-stopped

volumes:
  n8n_data:
```

Novamente, o Easypanel abstrai toda essa configuracao. Os exemplos Docker sao apenas para entender o que acontece por baixo dos panos.