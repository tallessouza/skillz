# Code Examples: Validacao de Entrada e Sanitizacao

## Aplicacao Flask completa (vulneravel)

Esta e a aplicacao demonstrada na aula, com a vulnerabilidade de SQL Injection:

```python
from flask import Flask, request, session, redirect
import sqlite3

app = Flask(__name__)
app.secret_key = "secret"

def query_db(query):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute(query)
    result = cursor.fetchall()
    conn.close()
    return result

@app.route("/")
def index():
    if "user_id" in session:
        return f"Hello, user {session['user_id']}! <a href='/logout'>Logout</a>"
    return "Voce nao esta logado. <a href='/login'>Login</a>"

@app.route("/logout")
def logout():
    session.pop("user_id", None)
    return "Voce foi deslogado. <a href='/'>Voltar</a>"

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method != "POST":
        return """
        <form method="post">
            <input name="email" placeholder="Email">
            <input name="password" type="password" placeholder="Password">
            <button type="submit">Login</button>
        </form>
        """

    email = request.form["email"]
    password = request.form["password"]

    # VULNERAVEL: concatenacao de string direto na query
    query = f"SELECT * FROM users WHERE email = '{email}' AND password = '{password}'"
    user = query_db(query)

    if user:
        session["user_id"] = user[0][0]
        return "Login com sucesso! <a href='/'>Home</a>"

    return "Credenciais invalidas"
```

## Payloads de SQL Injection demonstrados

### Payload 1: OR com comentario
```
Email: elcio@vise.com.br' OR 1=1 --
Password: qualquer
```

Query resultante:
```sql
SELECT * FROM users WHERE email = 'elcio@vise.com.br' OR 1=1 --' AND password = 'qualquer'
```

### Payload 2: Fechamento com comentario simples
```
Email: elcio@robervise.com.br' ---
Password: qualquer
```

Query resultante:
```sql
SELECT * FROM users WHERE email = 'elcio@robervise.com.br' ---' AND password = 'qualquer'
```

## Correcao: Prepared queries

```python
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method != "POST":
        return "<form>..."

    email = request.form["email"]
    password = request.form["password"]

    # CORRETO: placeholders + parametros separados
    query = "SELECT * FROM users WHERE email = ? AND password = ?"
    user = query_db(query, (email, password))

    if user:
        session["user_id"] = user[0][0]
        return "Login com sucesso!"

    return "Credenciais invalidas"

def query_db(query, params=()):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute(query, params)  # biblioteca cuida do escape
    result = cursor.fetchall()
    conn.close()
    return result
```

## Validacao de email adicionada

```python
import re

def is_valid_email(email: str) -> bool:
    """Valida formato de email — camada extra de defesa."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

@app.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    password = request.form["password"]

    # Camada 1: validacao de entrada
    if not is_valid_email(email):
        return "Email invalido", 400

    if len(password) > 128:  # limite razoavel
        return "Senha muito longa", 400

    # Camada 2: prepared query
    query = "SELECT * FROM users WHERE email = ? AND password = ?"
    user = query_db(query, (email, password))
    # ...
```

## Exemplo do cookie de tema (mencionado na aula)

### Vulneravel:
```python
@app.route("/")
def index():
    theme = request.cookies.get("theme", "default")
    # VULNERAVEL: cookie vai direto pra query
    query = f"SELECT * FROM themes WHERE name = '{theme}'"
    colors = query_db(query)
    # Atacante coloca no cookie: default'; DROP TABLE themes; --
```

### Corrigido:
```python
ALLOWED_THEMES = {"default", "dark", "light", "blue", "green"}

@app.route("/")
def index():
    theme = request.cookies.get("theme", "default")

    # Camada 1: validar contra whitelist
    if theme not in ALLOWED_THEMES:
        theme = "default"

    # Camada 2: prepared query (mesmo assim)
    query = "SELECT * FROM themes WHERE name = ?"
    colors = query_db(query, (theme,))
```

## Exemplo do header HTTP (mencionado na aula)

### Vulneravel:
```python
# Salvando User-Agent no banco para log
user_agent = request.headers.get("User-Agent", "unknown")
query = f"INSERT INTO logs (user_agent) VALUES ('{user_agent}')"
db.execute(query)
# Atacante manipula User-Agent: '; DROP DATABASE; --
```

### Corrigido:
```python
user_agent = request.headers.get("User-Agent", "unknown")

# Camada 1: limitar tamanho
user_agent = user_agent[:256]

# Camada 2: prepared query
query = "INSERT INTO logs (user_agent) VALUES (?)"
db.execute(query, (user_agent,))
```

## Pattern geral para qualquer framework

### Node.js / Express + pg
```javascript
// ERRADO
const query = `SELECT * FROM users WHERE email = '${email}'`;

// CERTO
const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
const result = await pool.query(query, [email, password]);
```

### Java / JDBC
```java
// ERRADO
String query = "SELECT * FROM users WHERE email = '" + email + "'";

// CERTO
PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE email = ? AND password = ?");
stmt.setString(1, email);
stmt.setString(2, password);
```

### PHP / PDO
```php
// ERRADO
$query = "SELECT * FROM users WHERE email = '$email'";

// CERTO
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND password = ?");
$stmt->execute([$email, $password]);
```