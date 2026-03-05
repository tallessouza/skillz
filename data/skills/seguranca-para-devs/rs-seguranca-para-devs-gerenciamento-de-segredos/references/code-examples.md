# Code Examples: Gerenciamento de Segredos

## Exemplo 1: Aplicacao Flask ANTES (insegura)

```python
# app.py — ERRADO: credenciais hardcoded
import mysql.connector
from flask import Flask, jsonify

app = Flask(__name__)

db = mysql.connector.connect(
    host="localhost",
    user="test",
    password="test",
    database="task"
)

@app.route("/")
def index():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM pessoa")
    pessoas = [{"id": row[0], "nome": row[1]} for row in cursor.fetchall()]
    return jsonify(pessoas)
```

## Exemplo 2: Aplicacao Flask DEPOIS (segura)

```python
# app.py — CORRETO: credenciais no arquivo de configuracao
import json
import mysql.connector
from flask import Flask, jsonify

app = Flask(__name__)

with open("config.json") as f:
    config = json.load(f)

db = mysql.connector.connect(
    host=config["db"]["host"],
    user=config["db"]["user"],
    password=config["db"]["password"],
    database=config["db"]["database"]
)

@app.route("/")
def index():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM pessoa")
    pessoas = [{"id": row[0], "nome": row[1]} for row in cursor.fetchall()]
    return jsonify(pessoas)
```

## Exemplo 3: config.json (NAO versionado)

```json
{
  "db": {
    "host": "127.0.0.1",
    "user": "seguro",
    "password": "senha-gerada-com-openssl-rand",
    "database": "seguro"
  }
}
```

## Exemplo 4: config-sample.json (versionado)

```json
{
  "db": {
    "host": "localhost",
    "user": "example_user",
    "password": "example_password",
    "database": "example_db"
  }
}
```

## Exemplo 5: .gitignore

```gitignore
config.json
```

## Exemplo 6: Setup do banco com permissoes minimas

```sql
-- Criar o banco
CREATE DATABASE seguro;

-- Importar dados
-- mysql seguro < test.sql

-- Criar usuario com senha segura (gerar com: openssl rand -base64 32)
CREATE USER 'seguro'@'localhost' IDENTIFIED BY 'senha-longa-e-segura-gerada';

-- Dar APENAS permissao de leitura
GRANT SELECT ON seguro.pessoa TO 'seguro'@'localhost';
FLUSH PRIVILEGES;

-- Verificacao: testar que INSERT e negado
-- INSERT INTO pessoa (nome) VALUES ('teste');
-- ERROR: INSERT command denied
```

## Exemplo 7: Criacao de usuario do SO sem sudo

```bash
# Criar usuario dedicado para a aplicacao
adduser seguro

# Verificar que nao tem sudo
su - seguro
sudo su
# Resultado: "seguro is not in the sudoers file"
```

## Exemplo 8: Deploy key SSH (read-only)

```bash
# No servidor, como usuario da aplicacao
ssh-keygen
# Aceitar defaults

# Copiar chave publica
cat ~/.ssh/id_rsa.pub
# Colar no GitHub > Settings > Deploy Keys > Add (sem write access)

# Clonar repositorio
git clone git@github.com:user/repo.git
```

## Exemplo 9: Configuracao do Apache como proxy reverso

```apache
<VirtualHost *:443>
    # ... SSL config ...

    <Location />
        ProxyPass http://127.0.0.1:8000/
        ProxyPassReverse http://127.0.0.1:8000/
    </Location>
</VirtualHost>
```

```bash
# Habilitar modulo proxy
a2enmod proxy_http
systemctl restart apache2
```

## Exemplo 10: Variacao com .env (Node.js)

```javascript
// .env (NAO versionado)
// DB_HOST=127.0.0.1
// DB_USER=seguro
// DB_PASSWORD=senha-segura
// DB_NAME=seguro

// .env.example (versionado)
// DB_HOST=localhost
// DB_USER=example_user
// DB_PASSWORD=example_password
// DB_NAME=example_db

// app.js
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
```

## Exemplo 11: Variacao com variaveis de ambiente (sem arquivo)

```python
import os
import mysql.connector

db = mysql.connector.connect(
    host=os.environ["DB_HOST"],
    user=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    database=os.environ["DB_NAME"]
)
```

```bash
# Definir no ambiente (systemd, Docker, etc)
export DB_HOST=127.0.0.1
export DB_USER=seguro
export DB_PASSWORD=senha-segura
export DB_NAME=seguro
```