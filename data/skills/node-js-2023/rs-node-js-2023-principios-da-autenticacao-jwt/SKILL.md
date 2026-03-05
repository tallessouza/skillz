---
name: rs-node-js-2023-principios-autenticacao-jwt
description: "Applies JWT authentication concepts when designing or implementing auth flows in Node.js APIs. Use when user asks to 'implement authentication', 'add JWT', 'create login route', 'protect routes', 'add auth middleware', or 'validate tokens'. Covers Basic Auth vs JWT trade-offs, token anatomy (header/payload/signature), stateless strategy, and bearer token usage. Make sure to use this skill whenever building authentication in web APIs. Not for OAuth flows, session-based auth, or frontend auth state management."
---

# Principios da Autenticacao JWT

> Autenticacao em APIs web usa tokens stateless (JWT) que o backend gera com uma chave secreta, permitindo validacao sem persistencia em banco de dados.

## Rules

1. **Use JWT, nao Basic Auth, para APIs** — Basic Auth envia email+senha em toda requisicao (mesmo em Base64), expondo credenciais a interceptacao; JWT envia credenciais apenas uma vez no login
2. **Token e stateless** — nunca salve o JWT em banco de dados, porque a validacao acontece pela assinatura criptografica, nao por lookup
3. **Chave secreta deve ser longa e aleatoria** — quanto mais complexa a palavra-chave, mais dificil para um atacante forjar tokens
4. **Payload carrega o subject (sub)** — coloque o ID do usuario no campo `sub` do payload, porque e a convencao para identificar o dono do token
5. **Nunca confie em payload sem validar assinatura** — qualquer alteracao no payload muda a assinatura, e o backend detecta a adulteracao
6. **Envie JWT no header Authorization com prefixo Bearer** — `Authorization: Bearer <token>`, porque e o padrao para token-based auth na web

## Decision framework

| Estrategia | Quando usar | Quando evitar |
|------------|-------------|---------------|
| Basic Auth | Scripts internos, automacoes simples com HTTPS garantido | APIs publicas, SPAs, mobile apps |
| JWT (HS256) | Aplicacoes web simples, APIs REST | Quando precisar revogar tokens individualmente |
| JWT (RS256) | Microservicos, quando multiplos servicos validam tokens | Aplicacoes simples onde HS256 basta |

## Anatomia do JWT

```
header.payload.signature
```

### Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
Algoritmo usado para gerar a assinatura. HS256 usa string secreta, RS256 usa par de chaves publica/privada.

### Payload
```json
{
  "sub": "user-uuid-123",
  "iat": 1677721600
}
```
Dados do usuario. `sub` = subject (ID do usuario). Qualquer modificacao aqui altera a assinatura.

### Assinatura
```
HMACSHA256(base64(header) + "." + base64(payload), secret)
```
Gerada pelo backend usando a chave secreta. Garante integridade — se payload mudar, assinatura nao bate.

## Fluxo de autenticacao

```
1. POST /sessions → envia { email, senha }
2. Backend valida credenciais no banco
3. Backend gera JWT com sub = userId usando chave secreta
4. Retorna { token } para o cliente
5. Cliente envia em toda requisicao: Authorization: Bearer <token>
6. Backend valida assinatura do token com a mesma chave secreta
7. Extrai sub do payload → sabe qual usuario esta autenticado
```

## Exemplo de rotas

```typescript
// Rotas publicas (sem autenticacao)
app.post('/users', registerController)
app.post('/sessions', authenticateController)

// Rotas protegidas (requerem JWT valido)
app.get('/me', profileController)
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Rota retorna dados do usuario logado | Extrair userId do sub no JWT, nao receber como parametro |
| Precisa invalidar token | JWT puro nao suporta — use refresh tokens ou blacklist |
| Algoritmo para app simples | HS256 com string secreta e suficiente |
| Microservicos precisam validar | RS256 — chave privada gera, chave publica valida |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Salvar JWT no banco de dados | Confiar na validacao por assinatura |
| Enviar email+senha em toda requisicao | Enviar apenas no login, depois usar JWT |
| Colocar senha no payload do JWT | Colocar apenas `sub` (ID) e metadados nao-sensiveis |
| Usar chave secreta simples como "secret123" | Usar string longa e aleatoria como chave |
| Usar `Authorization: Basic` para tokens | Usar `Authorization: Bearer <token>` |
| Confiar no payload sem validar assinatura | Sempre validar assinatura antes de usar dados do payload |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
