---
name: rs-full-stack-testando-app-producao
description: "Enforces production testing workflow when validating deployed APIs against remote databases. Use when user asks to 'test in production', 'verify deployment', 'check production database', 'validate API in prod', or 'smoke test deployed app'. Guides through creating test data, verifying database state, testing authentication, and validating CRUD flows end-to-end in production. Make sure to use this skill whenever confirming a deploy works correctly. Not for local development, unit testing, or CI/CD pipeline configuration."
---

# Testando a Aplicação em Produção

> Valide o deploy executando um fluxo completo de CRUD contra o banco de produção, verificando cada operação tanto pela API quanto diretamente no banco.

## Prerequisites

- API deployada e acessível (ambiente de produção configurado no cliente HTTP)
- Acesso ao banco de dados remoto de produção (conexão salva no cliente SQL, ex: Beekeeper)
- Cliente HTTP configurado com ambiente de produção selecionado (ex: Insomnia com env "prod")

## Steps

### Step 1: Verificar estado inicial do banco

Conecte ao banco de dados remoto de produção e confirme o estado antes de qualquer operação.

```sql
SELECT * FROM users;
```

Confirme que o resultado está conforme esperado (vazio ou com dados conhecidos).

### Step 2: Cadastrar usuário via API

Envie requisição POST para criação de usuário no ambiente de produção.

```http
POST /users
Content-Type: application/json

{
  "name": "Rodrigo",
  "email": "rodrigo@email.com",
  "password": "123456"
}
```

Verifique o retorno da API e confirme no banco:

```sql
SELECT * FROM users;
```

### Step 3: Testar autenticação

Faça login com o usuário criado para validar o fluxo de sessão.

```http
POST /sessions
Content-Type: application/json

{
  "email": "rodrigo@email.com",
  "password": "123456"
}
```

Confirme que o token/sessão é retornado corretamente.

### Step 4: Alterar dados diretamente no banco (quando necessário)

Para testar fluxos que dependem de roles específicas, altere diretamente no banco.

```sql
UPDATE users SET role = 'sale' WHERE id = '<user_id>';
```

Verifique a alteração:

```sql
SELECT * FROM users;
```

### Step 5: Testar fluxo completo de domínio

Autentique com o usuário correto e execute operações de domínio (ex: criar entrega).

```http
POST /deliveries
Content-Type: application/json

{
  "user_id": "<recipient_user_id>",
  "description": "Teclado mecânico"
}
```

Confirme no banco:

```sql
SELECT * FROM deliveries;
```

### Step 6: Atualizar status e verificar

Atualize o status via API e confirme a mudança.

```http
PATCH /deliveries/<delivery_id>/status
Content-Type: application/json

{
  "status": "shipped"
}
```

### Step 7: Verificar logs/auditoria

Liste os logs gerados pelas operações e crie novos registros.

```http
GET /deliveries/<delivery_id>/show
```

```http
POST /deliveries/<delivery_id>/logs
Content-Type: application/json

{
  "description": "O pedido está a caminho"
}
```

## Output format

Cada operação deve produzir:
1. Resposta da API com status 2xx e dados corretos
2. Registro correspondente visível no banco de dados de produção

## Error handling

| Situação | Ação |
|----------|------|
| API retorna erro de conexão | Verificar se o deploy foi concluído e a URL está correta |
| Banco não conecta | Verificar credenciais e se o banco remoto está acessível |
| Dados não aparecem no banco | Verificar se a API está apontando para o banco de produção correto |
| Autenticação falha | Verificar se o usuário foi criado com sucesso no Step 2 |

## Verification

- [ ] Usuário criado aparece tanto na resposta da API quanto no banco
- [ ] Autenticação retorna token válido
- [ ] Operações de domínio (entregas, logs) persistem corretamente
- [ ] Alterações de status refletem no banco e na API
- [ ] Logs de atividade registram cada mudança de estado

## Heuristics

| Situação | Faça |
|----------|------|
| Primeiro teste pós-deploy | Execute todos os steps na ordem |
| Validação rápida (smoke test) | Steps 1-3 são suficientes |
| Teste de fluxo específico | Pule para o step do domínio relevante |
| Dados de teste no banco de prod | Use nomes identificáveis para facilitar limpeza posterior |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre validação em produção e interação API-banco
- [code-examples.md](references/code-examples.md) — Todos os exemplos de requisições e queries expandidos com variações