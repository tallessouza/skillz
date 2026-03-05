# Code Examples: Server-Side Request Forgery (SSRF)

## Setup vulneravel completo (PHP + Flask)

### Servidor PHP autenticado com token de parceiro

```php
<?php
// index.php — permite acesso via sessao OU token
if (!isset($_SESSION['user']) && $_GET['token'] !== 'SecureToken') {
    header('Location: login.php');
    exit;
}
// ... conteudo da pagina
?>
```

### Aplicacao Flask vulneravel (parceiro)

```python
from flask import Flask, request
import requests

app = Flask(__name__)

# VULNERAVEL — URL vem diretamente do usuario
@app.route("/analyze")
def analyze():
    page = request.args.get("page")
    response = requests.get(page + "?token=SecureToken")
    return response.text

# Formulario que expoe URLs completas nos valores do select
HTML = """
<select name="page">
    <option value="http://localhost/index.php">Home</option>
    <option value="http://localhost/page1.php">Page 1</option>
</select>
<button>Analyze</button>
"""
```

**Ataque:** O hacker troca o valor de `page` para `http://hacker.com` e recebe o token nos logs.

---

## Correcao com dicionario (metodo preferido)

```python
from flask import Flask, request, render_template_string
import requests

app = Flask(__name__)

SECRET_TOKEN = "SecureToken"

# Dicionario no backend — usuario nunca ve URLs
PAGES = {
    1: {"name": "Home", "path": "http://localhost/index.php"},
    2: {"name": "Page 1", "path": "http://localhost/page1.php"},
    3: {"name": "Page 2", "path": "http://localhost/page2.php"},
}

@app.route("/")
def index():
    options = "".join(
        f'<option value="{pid}">{p["name"]}</option>'
        for pid, p in PAGES.items()
    )
    return f"""
    <form action="/analyze">
        <select name="page">{options}</select>
        <button>Analyze</button>
    </form>
    """

@app.route("/analyze")
def analyze():
    page_id = int(request.args.get("page", 0))
    if page_id not in PAGES:
        return "Invalid page", 400
    url = PAGES[page_id]["path"] + "?token=" + SECRET_TOKEN
    response = requests.get(url)
    return response.text

app.run(debug=True)
```

**Resultado:** O formulario so envia numeros (1, 2, 3). Qualquer outro valor retorna erro 400.

---

## Validacao de formato — erro comum vs correto

### ERRADO (vulneravel a bypass)

```python
def validate_page(url: str) -> bool:
    # SEM barra final — atacante registra localhost.hacker.com
    return url.startswith("http://localhost")
```

Bypasses possiveis:
- `http://localhost.hacker.com` → subdominio malicioso
- `http://localhost@hacker.com` → HTTP basic auth, acessa hacker.com
- `http://localhost:123@hacker.com` → usuario:senha, acessa hacker.com

### CORRETO (com barra final)

```python
def validate_page(url: str) -> bool:
    # COM barra final — bloqueia subdominios e auth bypass
    return url.startswith("http://localhost/")
```

---

## Equivalentes em outras linguagens

### Node.js (fetch)

```javascript
// VULNERAVEL
app.get("/analyze", async (req, res) => {
    const response = await fetch(req.query.url);  // input direto
    res.send(await response.text());
});

// SEGURO — dicionario
const PAGES = {
    1: "http://localhost/index.php",
    2: "http://localhost/page1.php",
};

app.get("/analyze", async (req, res) => {
    const url = PAGES[parseInt(req.query.page)];
    if (!url) return res.status(400).send("Invalid page");
    const response = await fetch(`${url}?token=${SECRET_TOKEN}`);
    res.send(await response.text());
});
```

### PHP (file_get_contents)

```php
<?php
// VULNERAVEL — file_get_contents aceita http://
$content = file_get_contents($_GET['page']);

// SEGURO — dicionario
$pages = [
    1 => '/var/www/html/page1.php',
    2 => '/var/www/html/page2.php',
];
$id = (int) $_GET['page'];
if (!isset($pages[$id])) { die('Invalid page'); }
$content = include($pages[$id]);  // include local, sem HTTP
?>
```

**Insight:** O instrutor destaca que `file_get_contents` em PHP aceita `http://` transparentemente, transformando uma operacao de leitura de arquivo em requisicao HTTP. Usar `include` elimina esse vetor.