# Code Examples: Gerando Token de Reset de Senha Seguro

## Exemplo 1: Geracao de token — Math.random vs crypto

### Versao insegura (Math.random)

```javascript
// NAO FACA ISSO — baixa entropia, possivel de deduzir
const token = Math.random().toString(36).substr(2);
```

### Versao segura (crypto.randomBytes)

```javascript
const crypto = require('crypto');

// 32 bytes = 256 bits de entropia criptografica
// base64url = seguro para usar em URLs (sem +, /, =)
const token = crypto.randomBytes(32).toString('base64url');
```

**Output exemplo:** `dG9rZW4gc2VndXJvIGdlcmFkbyBjb20gY3J5cHRv...` (string base64url)

## Exemplo 2: Injecao de Host Header — o ataque

### Servidor vulneravel

```javascript
app.post('/reset-password', (req, res) => {
  const user = db.get('SELECT * FROM users WHERE email = ?', [req.body.email]);
  const token = crypto.randomBytes(32).toString('base64url');
  
  db.run('UPDATE users SET reset_token = ? WHERE email = ?', [token, req.body.email]);
  
  // VULNERAVEL: host vem do header HTTP, pode ser injetado
  const resetUrl = `http://${req.headers.host}/new-password/${token}`;
  
  sendEmail(user.email, `Reset sua senha: ${resetUrl}`);
  res.json({ message: 'Password reset email sent' });
});
```

### Ataque via curl

```bash
# Atacante injeta header Host
curl -X POST http://site-real.com/reset-password \
  -H "Host: hacker.com" \
  -d "email=vitima@email.com"

# Email enviado para a vitima contem:
# "Reset sua senha: http://hacker.com/new-password/{token}"
```

### O que o atacante ve no access log

```
# Quando a vitima clica no link:
GET /new-password/dG9rZW4gc2VndXJvIGdlcmFkby... HTTP/1.1
# Atacante captura o token e monta a URL real:
# http://site-real.com/new-password/dG9rZW4tc2VndXJvLWdlcmFkby...
```

### Servidor corrigido

```javascript
// Host fixo de configuracao
const APP_HOST = process.env.APP_HOST; // ex: 'https://site-real.com'

app.post('/reset-password', (req, res) => {
  const user = db.get('SELECT * FROM users WHERE email = ?', [req.body.email]);
  
  // Defesa: verificar se host header e valido
  // Se invalido, responder igual mas nao fazer nada
  if (req.headers.host !== expectedHost) {
    // Mesma resposta, mesmo tempo — atacante nao percebe
    res.json({ message: 'Password reset email sent' });
    return;
  }
  
  const token = crypto.randomBytes(32).toString('base64url');
  
  db.run(
    'UPDATE users SET reset_token = ?, reset_time = ? WHERE email = ?',
    [token, Date.now(), req.body.email]
  );
  
  // URL com host fixo
  const resetUrl = `${APP_HOST}/new-password/${token}`;
  
  sendEmail(user.email, `Reset sua senha: ${resetUrl}`);
  res.json({ message: 'Password reset email sent' });
});
```

## Exemplo 3: Expiracao de token com janela bilateral

### Schema (SQLite)

```sql
ALTER TABLE users ADD COLUMN reset_time INTEGER;
```

### Armazenamento do token com timestamp

```javascript
db.run(
  'UPDATE users SET reset_token = ?, reset_time = ? WHERE email = ?',
  [token, Date.now(), email]
);
```

### Verificacao com janela bilateral

```javascript
const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;
const now = Date.now();

// Limite inferior: token requisitado nos ultimos 30 min
// Limite superior: token nao pode ser do futuro
const user = db.get(
  `SELECT * FROM users 
   WHERE reset_token = ? 
   AND reset_time > ? 
   AND reset_time <= ?`,
  [token, now - THIRTY_MINUTES_IN_MS, now]
);

if (!user) {
  return res.status(400).json({ error: 'Token invalido ou expirado' });
}

// Token valido — permitir reset de senha
```

### Por que `reset_time` e nao `expires_at`

```javascript
// Com reset_time: mudar janela so no codigo
const FIVE_MINUTES = 5 * 60 * 1000;   // Mais restritivo
const ONE_HOUR = 60 * 60 * 1000;       // Mais permissivo
// Tokens existentes se adaptam automaticamente

// Com expires_at: tokens ja gravados tem expiracao fixa
// Mudar a politica exige atualizar todos os tokens no banco
```

## Exemplo 4: CSPRNG em outras linguagens

### Python

```python
import secrets

token = secrets.token_urlsafe(32)  # 32 bytes, base64url
```

### PHP

```php
$token = bin2hex(random_bytes(32));  // 32 bytes, hex
```

### Java

```java
import java.security.SecureRandom;
import java.util.Base64;

SecureRandom random = new SecureRandom();
byte[] bytes = new byte[32];
random.nextBytes(bytes);
String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
```

### Go

```go
import (
    "crypto/rand"
    "encoding/base64"
)

bytes := make([]byte, 32)
rand.Read(bytes)
token := base64.URLEncoding.EncodeToString(bytes)
```

### Busca rapida

Pesquise: **"CSPRNG + [sua linguagem]"** para encontrar a implementacao correta.