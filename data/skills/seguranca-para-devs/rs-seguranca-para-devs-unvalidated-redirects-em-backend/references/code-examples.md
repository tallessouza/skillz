# Code Examples: Unvalidated Redirects

## Exemplo completo do fluxo vulneravel (PHP)

### Estrutura do site

```
site/
├── header.php      # Verifica autenticacao, redireciona para login
├── footer.php      # HTML do footer
├── index.php       # Pagina inicial
├── page1.php       # Pagina 1
├── page2.php       # Pagina 2
├── login.php       # Formulario de login
└── logout.php      # Destroi sessao
```

### header.php (protecao de autenticacao)

```php
<?php
session_start();

// Redirect vulneravel — passa a URI atual como parametro next
if (!isset($_SESSION['user'])) {
    header("Location: login.php?next=" . $_SERVER['REQUEST_URI']);
    exit;
}
?>
<html>
<head><title><?= $title ?></title></head>
<body>
<nav>
    <a href="index.php">Home</a>
    <a href="page1.php">Page 1</a>
    <a href="page2.php">Page 2</a>
    <a href="logout.php">Sair</a>
</nav>
<h1><?= $title ?></h1>
```

### login.php (versao VULNERAVEL)

```php
<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Aqui voce iria ao banco, verificaria senha com password_verify(), etc.
    $_SESSION['user'] = $_POST['username'];

    // VULNERAVEL: aceita qualquer URL do parametro next
    $next = $_GET['next'] ?? 'index.php';
    header("Location: $next");
    exit;
}
?>
<html>
<head><title>Login</title></head>
<body>
<form method="post">
    <input name="username" placeholder="Usuario">
    <input name="password" type="password" placeholder="Senha">
    <button type="submit">Entrar</button>
</form>
</body>
</html>
```

### logout.php

```php
<?php
session_start();
session_destroy();
header("Location: login.php");
exit;
```

### O ataque

```
URL maliciosa enviada pelo atacante:
https://site-legitimo.com/login.php?next=https://hacker.com/login.php

1. Usuario clica → ve o site legitimo, URL confere
2. Digita usuario e senha → login funciona
3. Redirect vai para hacker.com/login.php (clone visual)
4. Clone mostra "Senha invalida, tente novamente"
5. Usuario digita senha de novo → hacker captura
6. Hacker redireciona de volta para o site real
7. Usuario nunca percebe
```

### Site do hacker (login.php clone)

```php
<!-- hacker.com/login.php -->
<html>
<head><title>Login</title></head>
<body>
<h2>Senha invalida, tente novamente</h2>
<form method="post">
    <input name="username" placeholder="Usuario">
    <input name="password" type="password" placeholder="Senha">
    <button type="submit">Entrar</button>
</form>
</body>
</html>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Captura credenciais
    $stolen = $_POST['username'] . ':' . $_POST['password'];
    file_put_contents('stolen.txt', $stolen . "\n", FILE_APPEND);

    // Redireciona de volta para o site real — usuario nao percebe nada
    header("Location: https://site-legitimo.com/index.php");
    exit;
}
?>
```

## Correcoes aplicadas (4 niveis)

### Nivel 1: Sem redirect dinamico

```php
// header.php — sem parametro next
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}

// login.php — sempre vai para index
header("Location: index.php");
exit;
```

### Nivel 2: Dicionario de destinos

```php
// header.php
if (!isset($_SESSION['user'])) {
    // Mapeia a pagina atual para um ID
    $pageMap = [
        '/index.php' => 1,
        '/page1.php' => 2,
        '/page2.php' => 3,
    ];
    $pageId = $pageMap[$_SERVER['REQUEST_URI']] ?? 1;
    header("Location: login.php?next=$pageId");
    exit;
}

// login.php
$destinations = [
    1 => '/index.php',
    2 => '/page1.php',
    3 => '/page2.php',
];
$nextId = (int) ($_GET['next'] ?? 1);
$location = $destinations[$nextId] ?? '/index.php';
header("Location: $location");
exit;
```

### Nivel 3: Whitelist

```php
// login.php
$whitelist = ['/index.php', '/page1.php', '/page2.php'];
$next = $_GET['next'] ?? '/index.php';

if (!in_array($next, $whitelist, true)) {
    $next = '/index.php';
    // Em aplicacoes criticas: logar tentativa
    error_log("Blocked redirect attempt to: " . $_GET['next']);
}

header("Location: $next");
exit;
```

### Nivel 4: Validacao de formato

```php
// login.php
$next = $_GET['next'] ?? '/index.php';

// Deve comecar com / mas NAO com // (protocol-relative)
if (!preg_match('/^\/[^\/]/', $next)) {
    $next = '/index.php';
}

header("Location: $next");
exit;
```

## Equivalentes em outros frameworks

### Node.js/Express

```javascript
// VULNERAVEL
app.post('/login', (req, res) => {
    // ...autenticacao...
    res.redirect(req.query.next || '/');
});

// SEGURO (whitelist)
const ALLOWED_REDIRECTS = new Set(['/', '/dashboard', '/profile', '/settings']);

app.post('/login', (req, res) => {
    // ...autenticacao...
    const next = ALLOWED_REDIRECTS.has(req.query.next) ? req.query.next : '/';
    res.redirect(next);
});
```

### Python/Django

```python
# VULNERAVEL
def login_view(request):
    # ...autenticacao...
    return redirect(request.GET.get('next', '/'))

# SEGURO (Django tem url_has_allowed_host_and_scheme built-in)
from django.utils.http import url_has_allowed_host_and_scheme

def login_view(request):
    next_url = request.GET.get('next', '/')
    if not url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}):
        next_url = '/'
    return redirect(next_url)
```

### Ruby on Rails

```ruby
# VULNERAVEL
redirect_to params[:next] || root_path

# SEGURO
ALLOWED = %w[/ /dashboard /profile].freeze
next_path = ALLOWED.include?(params[:next]) ? params[:next] : root_path
redirect_to next_path
```