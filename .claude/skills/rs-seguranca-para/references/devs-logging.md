---
name: rs-seguranca-devs-logging
description: "Enforces security-aware logging practices when writing application code. Use when user asks to 'add logging', 'implement logs', 'track events', 'audit trail', 'monitor activity', or any observability task. Applies rules: never log secrets/PII/session tokens, separate log storage from app storage, include security relevance flag, log both legitimate high-risk actions and suspicious activity. Make sure to use this skill whenever generating logging code or designing observability. Not for infrastructure monitoring, firewall logs, or log aggregation tool setup."
---

# Logging de Seguranca para Aplicacoes

> Logs registram eventos para debugging E seguranca — trate o log como um ativo que pode vazar e projete-o com zero trust.

## Rules

1. **Nunca logue segredos** — senhas, tokens de acesso, chaves criptograficas, strings de conexao, IDs de sessao, dados de cartao, CPF, porque se o log vazar, cada segredo ali vira um vetor de ataque
2. **Separe armazenamento de logs do da aplicacao** — usuario/conta/token/banco diferentes, porque se a aplicacao for comprometida, o atacante nao acessa o historico de logs (e vice-versa)
3. **Inclua flag de relevancia de seguranca** — marque `securityRelevant: true` em eventos de seguranca, porque facilita filtragem quando processar logs da trabalho
4. **Logue a causa, nao dados sensíveis** — use IDs internos e hashes em vez de dados pessoais, porque o log pode vazar sem que o banco de dados vaze
5. **Logue acoes legitimas de alto risco** — admin criou usuario, alguem acessou dados de pagamento, exportou dados, porque durante uma investigacao voce precisa saber o que o invasor fez
6. **Logue violacoes de logica de negocio** — valores fora do range esperado, passos fora de ordem, opcoes inexistentes em selects, porque usuario legitimo nao faz isso
7. **Registre local do codigo no log** — module/arquivo/funcao que gerou o evento, porque `login.log` em 38 arquivos diferentes e inutil sem essa informacao
8. **Nunca exponha logs na web** — pasta de logs nunca pode estar acessivel via servidor web, porque isso acontece com frequencia e e critico

## How to write

### Estrutura de um evento de log

```typescript
interface LogEvent {
  timestamp: string           // ISO 8601 - quando foi logado
  eventTimestamp?: string     // quando o evento aconteceu (filas/async)
  correlationId: string       // identificador da interacao
  app: string                 // nome da aplicacao
  appVersion: string          // versao ou commit hash
  host: string                // hostname/IP/porta
  userId?: string             // ID interno (nunca CPF/email)
  sourceIp?: string           // IP de origem
  userAgent?: string          // identificador do cliente
  location?: string           // URL/rota/dialog/botao
  codeLocation: string        // modulo:funcao:linha
  eventType: string           // tipo do evento
  severity: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL'
  securityRelevant: boolean   // flag de seguranca
  description: string         // o que aconteceu
}
```

### Logging de autenticacao

```typescript
logger.info({
  eventType: 'AUTH_SUCCESS',
  userId: user.id,
  sourceIp: request.ip,
  codeLocation: 'auth.service:login',
  securityRelevant: true,
  description: `User authenticated successfully`
})

// Falha - nunca logue a senha tentada
logger.warn({
  eventType: 'AUTH_FAILURE',
  userId: attemptedUsername,
  sourceIp: request.ip,
  codeLocation: 'auth.service:login',
  securityRelevant: true,
  description: `Failed login attempt`
})
```

### Logging de violacao de logica de negocio

```typescript
// Valor recebido fora do conjunto valido (select/combo manipulado)
logger.warn({
  eventType: 'INVALID_DISCRETE_VALUE',
  userId: user.id,
  sourceIp: request.ip,
  codeLocation: 'order.controller:setCountry',
  securityRelevant: true,
  description: `Received country value "${received}" not in valid set — likely tampering`
})
```

## Example

**Before (inseguro):**
```typescript
console.log(`User ${user.email} logged in with password ${password}`)
console.log(`DB connection: ${connectionString}`)
console.log(`Session: ${sessionId}`)
console.log('Login failed')
```

**After (com esta skill):**
```typescript
logger.info({
  eventType: 'AUTH_SUCCESS',
  userId: user.id,  // ID interno, nao email
  sourceIp: req.ip,
  codeLocation: 'auth.controller:login',
  securityRelevant: true,
  description: 'User authenticated successfully'
})
// Sem senha, sem connection string, sem session ID
// Session ID -> use hash se precisar correlacionar
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Valor recebido fora de lista finita (select/enum) | Log com severidade alta + securityRelevant: true |
| Acao de admin (CRUD usuarios, tokens, privilegios) | Log sempre, mesmo sendo uso legitimo |
| Acesso a dados de pagamento/cartao | Log o acesso (sem os dados) |
| Passos executados fora de ordem (wizard/fluxo) | Log como violacao de logica de negocio |
| Tentativa de exceder limites (alcada, rate limit) | Log + block |
| Opt-in legal (cookies, LGPD, marketing) | Log com timestamp para nao-repudio |
| Erro de TLS/certificado em chamada backend | Log como potencial MITM |
| Verbo HTTP inesperado | Log como potencial scan/ataque |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `log(password)` | Nunca logue senhas |
| `log(sessionId)` | `log(hash(sessionId))` |
| `log(user.cpf)` | `log(user.id)` |
| `log(connectionString)` | Nao logue strings de conexao |
| `log(creditCard)` | `log("payment_access", { userId })` |
| `log(stackTrace)` completo no log principal | Salve tracebacks em pasta/sistema separado |
| Logs na pasta publica do Apache/Nginx | Pasta com permissoes restritas, fora do webroot |
| Mesmo usuario/token acessa app e logs | Usuarios e credenciais separados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-logging/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-logging/references/code-examples.md)
