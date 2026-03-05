---
name: rs-seguranca-devs-token-reset-senha
description: "Enforces secure password reset token generation when implementing authentication flows. Use when user asks to 'reset password', 'generate token', 'forgot password', 'password recovery', or any auth token generation. Applies rules: CSPRNG instead of Math.random, never use HTTP host header for URL construction, always set token expiration storing request time not expiry time. Make sure to use this skill whenever implementing password reset or any security-sensitive token generation. Not for session tokens, JWTs, or OAuth flows."
---

# Gerando Token de Reset de Senha Seguro

> Tokens de reset de senha exigem randomizacao criptografica, URLs com host fixo e tempo de expiracao — nunca Math.random, nunca header host, nunca token eterno.

## Rules

1. **Use CSPRNG, nunca Math.random** — `crypto.randomBytes(32)` nao `Math.random()`, porque computadores sao maquinas deterministicas e Math.random tem baixa entropia, permitindo que um atacante deduza o token
2. **Nunca monte URL com header HTTP host** — use host fixo de configuracao, porque headers HTTP podem ser injetados, redirecionando o link de reset para um dominio do atacante
3. **Token sempre tem tempo de expiracao** — armazene o momento da requisicao (`reset_time`), nao o momento da expiracao, porque isso permite alterar a janela de validade sem invalidar tokens existentes
4. **Valide com janela bilateral** — na verificacao, filtre tokens entre limite inferior (ex: 30min atras) E limite superior (agora), porque impede tokens futuros injetados via falha de codigo
5. **Resposta identica para host invalido** — se receber header host diferente do configurado, retorne a mesma resposta e leve o mesmo tempo, mas nao envie email nem gere token, porque isso impede o atacante de saber se o ataque funcionou
6. **CSPRNG so para seguranca** — para delays de jogos ou usos nao-criticos, use Math.random normalmente, porque CSPRNG consome mais processamento

## How to write

### Geracao de token seguro (Node.js)

```javascript
const crypto = require('crypto');

// 32 bytes = 256 bits de entropia criptografica
const token = crypto.randomBytes(32).toString('base64url');
```

### URL com host fixo

```javascript
// Host vindo de configuracao, NUNCA de req.headers.host
const APP_HOST = process.env.APP_HOST || 'https://meusite.com';

const resetUrl = `${APP_HOST}/new-password/${token}`;
```

### Armazenamento com tempo de requisicao

```javascript
// Armazene QUANDO foi requisitado, nao quando expira
db.run(
  'UPDATE users SET reset_token = ?, reset_time = ? WHERE email = ?',
  [token, Date.now(), email]
);
```

### Verificacao com janela bilateral

```javascript
const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;
const now = Date.now();

const user = db.get(
  'SELECT * FROM users WHERE reset_token = ? AND reset_time > ? AND reset_time <= ?',
  [token, now - THIRTY_MINUTES_IN_MS, now]
);
```

## Example

**Before (inseguro):**

```javascript
const token = Math.random().toString(36).substr(2);
const resetUrl = `http://${req.headers.host}/new-password/${token}`;
db.run('UPDATE users SET reset_token = ? WHERE email = ?', [token, email]);
```

**After (com esta skill aplicada):**

```javascript
const crypto = require('crypto');
const APP_HOST = process.env.APP_HOST;

const token = crypto.randomBytes(32).toString('base64url');
const resetUrl = `${APP_HOST}/new-password/${token}`;
db.run(
  'UPDATE users SET reset_token = ?, reset_time = ? WHERE email = ?',
  [token, Date.now(), email]
);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Token para reset de senha, chave cripto, senha | Use CSPRNG (`crypto.randomBytes`) |
| Delay aleatorio em jogo, shuffle de array visual | Use `Math.random` (performance) |
| App open source que roda em hosts variados | Whitelist de hosts no arquivo de config |
| App com host unico conhecido | Host fixo em variavel de ambiente |
| Atacante injeta host header diferente | Mesma resposta, mesmo tempo, mas nao envie email |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `Math.random()` para tokens | `crypto.randomBytes(32).toString('base64url')` |
| `req.headers.host` na URL de reset | `process.env.APP_HOST` ou config fixo |
| Token sem expiracao | `reset_time = Date.now()` + verificacao com janela |
| `expires_at` fixo no banco | `reset_time` (momento da requisicao) |
| Erro 403 para host invalido | Mesma resposta 200, sem acao real |
| `reset_time < expires_at` (so limite superior) | Janela bilateral: `reset_time > agora - 30min AND reset_time <= agora` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
