---
name: rs-csharp-dotnet-maui-refresh-token-intro
description: "Applies refresh token architecture patterns when implementing authentication flows in .NET/C# APIs. Use when user asks to 'implement refresh token', 'renew access token', 'handle token expiration', 'manage user sessions', or 'implement authentication flow'. Ensures correct separation between access tokens and refresh tokens, proper expiration times, and transparent token renewal. Make sure to use this skill whenever building auth systems with token rotation. Not for OAuth third-party flows, API key auth, or cookie-based session management."
---

# Refresh Token — Arquitetura e Implementacao

> Access tokens identificam; refresh tokens controlam sessoes e renovam acesso de forma transparente ao usuario.

## Key concept

O access token (JWT) tem vida curta (5-20 minutos) e serve apenas para identificar quem faz a requisicao. O refresh token e um valor aleatorio armazenado no banco de dados que permite gerar novos access tokens sem exigir login do usuario. Essa separacao existe porque access tokens nao podem ser invalidados (sao auto-contidos), mas refresh tokens podem ser removidos ou bloqueados no banco.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Definindo expiracao de access token | 5-20 minutos. Dados sensiveis (bancarios, documentos) = menor. Dados nao-sensiveis = maior |
| Precisando invalidar acesso de um usuario | Invalide o refresh token no banco, nao o access token |
| API retorna token expirado | Aplicativo usa refresh token automaticamente, sem interacao do usuario |
| Precisando de sessoes multi-dispositivo | Um refresh token por dispositivo, associado a informacoes do device |
| Gerando refresh token | Valor aleatorio unico, NAO use JWT — ocupa menos espaco no banco |

## Fluxo de renovacao

```
1. Login → API devolve access_token + refresh_token
2. App guarda ambos em local seguro
3. App usa access_token em cada requisicao
4. API detecta token expirado → responde 401
5. App envia refresh_token para endpoint de renovacao
6. API valida refresh_token no banco → gera NOVO access_token + NOVO refresh_token
7. App refaz a requisicao original com novo access_token
   (transparente para o usuario — zero interacao)
```

## O que implementar

### No projeto API
1. **Nova tabela** no banco para armazenar refresh tokens (valor unico, user_id, status/validade)
2. **Novo endpoint** que recebe refresh token e devolve novo par (access + refresh)
3. **Regra de negocio** que valida existencia do refresh token no banco e identifica o usuario associado

### No projeto do aplicativo
1. **Interceptor de requisicao** que detecta resposta 401 (token expirado)
2. **Logica de renovacao** que chama o endpoint de refresh automaticamente
3. **Retry da requisicao original** com o novo access token

## Heuristics

| Situacao | Faca |
|----------|------|
| Access token expiracao | Entre 5 e 20 minutos, nunca horas ou dias |
| Refresh token formato | String aleatoria unica, NAO JWT |
| Token roubado | Expiracao curta do access token minimiza dano |
| Multiplas sessoes (WhatsApp-style) | Um refresh token por dispositivo no banco |
| Deslogar dispositivo remoto | Delete ou invalide o refresh token daquele device |
| Endpoint de refresh | Sempre devolva NOVO access token E NOVO refresh token |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Aumentar expiracao do access token resolve o problema de relogin | Cria vulnerabilidade — token roubado vale por dias |
| Access token pode ser invalidado | Nao pode — e auto-contido (JWT). So refresh token pode ser invalidado no banco |
| Refresh token precisa ser JWT | Nao — valor aleatorio unico e suficiente e ocupa menos espaco |
| Renovacao de token exige interacao do usuario | Deve ser 100% transparente — o app faz automaticamente |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Access token com validade de dias/semanas | 5-20 minutos de validade |
| Redirecionar para login quando token expira | Usar refresh token para renovar automaticamente |
| Refresh token como JWT grande | Valor aleatorio unico e compacto |
| Mesmo refresh token para todos os dispositivos | Um refresh token por sessao/dispositivo |
| Invalidar access token no banco | Invalidar refresh token no banco |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
