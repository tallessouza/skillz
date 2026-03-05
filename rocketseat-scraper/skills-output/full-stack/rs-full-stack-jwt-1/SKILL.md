---
name: rs-full-stack-jwt-1
description: "Applies JWT (JSON Web Token) knowledge when implementing authentication and authorization flows. Use when user asks to 'create auth', 'implement login', 'generate token', 'validate JWT', or 'add authorization'. Explains JWT structure (header, payload, signature) and guides correct usage in API security. Make sure to use this skill whenever working with token-based authentication or authorization middleware. Not for session-based auth, OAuth provider setup, or cookie-based authentication."
---

# JWT (JSON Web Token)

> JWT é um padrão de mercado para trocar informações de forma segura e compacta usando tokens no formato JSON.

## Key concept

Um JWT é um token composto por três partes separadas por pontos (`.`): **header**, **payload** e **signature**. Cada parte é codificada em Base64URL, formando um hash compacto que pode ser transmitido em headers HTTP, query params ou body de requisições.

O JWT permite carregar informações dentro do próprio token — como ID do usuário e permissões — eliminando a necessidade de consultar o banco a cada requisição para identificar quem está fazendo o request.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Usuário fez login e precisa de identificação nas próximas requests | Gerar JWT com ID do usuário no payload |
| API precisa verificar permissões do usuário | Decodificar JWT e checar claims no payload |
| Precisa transmitir dados entre serviços de forma compacta | Usar JWT como container de informações |
| Precisa garantir que o token não foi adulterado | Verificar a signature do JWT |

## How to think about it

### Estrutura do token

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│              HEADER              │                    PAYLOAD                     │              SIGNATURE              │
```

**Header** — Define o algoritmo de criptografia e o tipo do token:
```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload** — Conteúdo do token (dados que você quer transmitir):
```json
{ "sub": "user-123", "name": "John Doe", "iat": 1516239022 }
```

**Signature** — Garante a integridade, prova que o token não foi alterado.

### Fluxo de autorização

1. Usuário faz login com credenciais
2. Servidor valida credenciais e gera um JWT com ID e permissões no payload
3. Cliente recebe o JWT e envia em cada requisição subsequente
4. Servidor decodifica o JWT, identifica o usuário e verifica permissões

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| JWT é criptografia — ninguém consegue ler o conteúdo | O payload é apenas codificado em Base64, qualquer um pode decodificar. A signature garante **integridade**, não **sigilo** |
| JWT substitui sessões em todos os casos | JWT é stateless e ideal para APIs, mas sessões server-side ainda são válidas para aplicações web tradicionais |
| Pode colocar qualquer coisa no payload | Mantenha o payload enxuto — dados sensíveis como senha nunca devem estar no payload, porque ele é legível |

## When to apply

- Autenticação em APIs REST/GraphQL onde o servidor precisa identificar o usuário a cada request
- Comunicação entre microsserviços que precisam validar identidade sem compartilhar sessão
- Cenários onde o token precisa carregar claims (permissões, roles, ID) de forma compacta

## Limitations

- JWT não pode ser invalidado antes da expiração sem uma blocklist server-side
- Payload é legível por qualquer um — não armazene dados sensíveis
- Tokens grandes aumentam o tamanho de cada requisição HTTP

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações