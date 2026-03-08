# Code Examples: Informando Token do Usuário

## Exemplo 1: Configuração manual do Bearer Token

### Corpo da requisição de sessão (POST /sessions)

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### Resposta da sessão

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

### Header gerado automaticamente pelo Insomnia

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Exemplo 2: Filtros JSONPath aplicados à resposta

Dado a resposta acima:

| Filtro | Resultado |
|--------|-----------|
| `$` | `{"token": "eyJ...", "user": {"name": "John Doe", "email": "user@example.com"}}` |
| `$.token` | `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."` |
| `$.user` | `{"name": "John Doe", "email": "user@example.com"}` |
| `$.user.name` | `"John Doe"` |
| `$.user.email` | `"user@example.com"` |

## Exemplo 3: Configuração passo a passo no Insomnia

### Passo 1 — Abrir template tags
```
Campo Token > Ctrl + Barra de Espaço > Response — Body Attribute
```

### Passo 2 — Configurar referência
```
Request:          [Sessions] POST session
Filter:           $.token
Trigger Behavior: Always — Resend request when needed
```

### Passo 3 — Resultado visual
```
Campo Token: [tag azul com ícone de Response Body Attribute]
```

## Exemplo 4: Estrutura típica de pastas no Insomnia

```
📁 API de Entregas
├── 📁 Sessions
│   └── POST session          ← Requisição referenciada
├── 📁 Deliveries
│   ├── POST create           ← Auth: Bearer Token [auto]
│   ├── GET list              ← Auth: Bearer Token [auto]
│   └── PATCH update status   ← Auth: Bearer Token [auto]
└── 📁 Users
    └── POST create           ← Sem auth necessária
```

## Exemplo 5: Variações de Trigger Behavior

### Para desenvolvimento local (token não expira rápido)
```
Trigger Behavior: No History
```
Usa cache quando disponível, só re-executa se nunca fez a requisição.

### Para ambiente de staging (token expira em 15min)
```
Trigger Behavior: Always — Resend request when needed
```
Sempre garante token fresco a cada requisição.

### Para testes manuais controlados
```
Trigger Behavior: Never
```
Você controla exatamente quando o token é atualizado, executando a sessão manualmente.

## Exemplo 6: Quando a tag fica vermelha (erro)

### Causa comum 1: Requisição referenciada não existe mais
```
Request: [deleted request]
Status: ❌ Vermelho — "Request not found"
Fix: Recriar a requisição de sessão ou selecionar outra
```

### Causa comum 2: Filtro JSONPath inválido
```
Filter: token          ← Faltou o $
Status: ❌ Vermelho — "No match"
Fix: Usar $.token
```

### Causa comum 3: Credenciais inválidas na sessão referenciada
```
Request: [Sessions] POST session
Body: {"email": "wrong@email.com", "password": "wrong"}
Status: ❌ Vermelho — Resposta é erro 401, não tem campo token
Fix: Corrigir credenciais na requisição de sessão
```