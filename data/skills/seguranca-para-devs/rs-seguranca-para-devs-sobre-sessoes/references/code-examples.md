# Code Examples: Gerenciamento Seguro de Sessoes

## Exemplo completo da aula — session.php

```php
<?php
session_start();

if (!isset($_SESSION['counter'])) {
    $_SESSION['counter'] = 0;
}

$_SESSION['counter']++;

if (!isset($_SESSION['agent'])) {
    $_SESSION['agent'] = $_SERVER['HTTP_USER_AGENT'];
}

echo "Counter: " . $_SESSION['counter'] . "<br>";
echo "Agent: " . $_SESSION['agent'];
```

## Configuracao do php.ini — antes e depois

### Antes (inseguro — padrao do PHP):
```ini
; php.ini
session.name = PHPSESSID
session.cookie_httponly = 0
session.cookie_secure = 0
; session.cookie_samesite nao definido (default lax do navegador)
session.use_strict_mode = 0
```

### Depois (seguro):
```ini
; php.ini
session.name = SESSIONID
session.cookie_httponly = 1
session.cookie_secure = 1
session.cookie_samesite = Strict
session.use_strict_mode = 1
```

Apos alterar, reiniciar o PHP:
```bash
service php8.4-fpm restart
```

## Demonstracao do ataque de script injection

### Arquivo malicioso injetado (hacker.html):
```html
<!-- Atacante conseguiu injetar isso numa pagina do servidor -->
<script>
document.cookie = "SESSIONID=123456";
</script>
```

Isso seta um session ID conhecido pelo atacante. Se strict mode nao estiver habilitado, o servidor aceita esse ID e cria uma sessao para ele.

## Verificando sessoes no servidor (Ubuntu)

```bash
# Diretorio de sessoes no Ubuntu
ls /var/lib/php/sessions/

# Ver conteudo de uma sessao
cat /var/lib/php/sessions/sess_29bf...

# Exemplo de conteudo (formato serializado PHP):
# counter|i:8;agent|s:101:"Mozilla/5.0 ...";
```

## Configuracao via codigo (alternativa ao php.ini)

```php
<?php
// Configurar antes de session_start()
session_set_cookie_params([
    'lifetime' => 0,          // expira ao fechar navegador
    'path'     => '/',         // disponivel em todo o site
    'domain'   => 'exemplo.com',
    'secure'   => true,        // apenas HTTPS
    'httponly'  => true,        // sem acesso via JavaScript
    'samesite' => 'Strict',    // sem envio cross-origin
]);

// Mudar nome do cookie
session_name('SESSIONID');

// Habilitar strict mode via codigo
ini_set('session.use_strict_mode', '1');

session_start();
```

## Exemplo em Laravel

```php
// config/session.php
return [
    'driver'          => 'file',
    'cookie'          => 'SESSIONID',       // nome generico
    'http_only'       => true,              // httpOnly
    'secure'          => env('SESSION_SECURE_COOKIE', true),
    'same_site'       => 'strict',          // ou 'lax'
    'expire_on_close' => false,
];
```

## Exemplo em Django

```python
# settings.py
SESSION_COOKIE_NAME = 'sessionid'          # ja e generico por padrao
SESSION_COOKIE_HTTPONLY = True              # padrao True no Django
SESSION_COOKIE_SECURE = True               # habilitar em producao
SESSION_COOKIE_SAMESITE = 'Strict'         # ou 'Lax'
```

## Exemplo em Express.js (Node)

```javascript
const session = require('express-session');

app.use(session({
    name: 'sessionid',          // nome generico
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,   // equivale a strict mode
    cookie: {
        httpOnly: true,
        secure: true,           // apenas HTTPS
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60, // 1 hora
    },
}));
```

## Verificando seguranca via DevTools

```javascript
// No console do navegador — deve retornar vazio se httpOnly esta correto
document.cookie
// Resultado esperado: "" (cookie de sessao nao acessivel)
```

## Tabela de entropia vs tempo de brute force

| Bits de entropia | Bytes | Tempo (1000 req/s, 10k usuarios) |
|-----------------|-------|----------------------------------|
| 32 bits | 4 bytes | ~7 minutos |
| 64 bits | 8 bytes | ~585 anos |
| 128 bits | 16 bytes | astronomico |
| 256 bits | 32 bytes | impossivel |

O PHP gera session IDs com entropia alta por padrao — use-o.