# Code Examples: SAST

## App vulneravel usada na demonstracao

### requirements.txt

```txt
fastapi[standard]
requests
django==4.0.0
```

O Django 4.0.0 foi instalado propositalmente numa versao antiga com vulnerabilidades conhecidas — usado nas proximas aulas sobre SCA (Software Composition Analysis).

### app.py (codigo vulneravel de exemplo)

```python
from fastapi import FastAPI
import requests
import hashlib

app = FastAPI()

# VULNERABILIDADE 1: SQL Injection
# Monta URL/query usando concatenacao de string
@app.get("/user/{username}")
async def get_user(username: str):
    query = "SELECT * FROM users WHERE username = '" + username + "'"
    # Bandit detecta: "possible SQL injection vector"
    hashed = hashlib.md5(username.encode()).hexdigest()
    # Bandit detecta: "uso de MD5 — hash inseguro para seguranca"
    return {"query": query, "hash": hashed}

# VULNERABILIDADE 2: requests sincrono em funcao async + sem timeout
@app.get("/cep/{cep}")
async def get_cep(cep: str):
    response = requests.get(f"https://viacep.com.br/ws/{cep}/json/")
    # Bandit detecta: "requests sem timeout — risco de DDoS"
    # SonarQube detecta: "cliente sincrono em funcao async"
    return response.json()
```

## Rodando Bandit

```bash
# Instalar
pip install bandit

# Rodar no arquivo especifico
bandit app.py

# Rodar recursivo numa pasta (excluindo venv)
bandit -r src/

# Gerar report HTML
bandit -r src/ -f html -o bandit-report.html

# Filtrar por severity (para git hooks)
bandit -r src/ --severity-level high
```

### Saida do Bandit (3 findings)

1. **Severity: MEDIUM** — Possible SQL Injection Vector — concatenacao de string em query SQL
2. **Severity: MEDIUM** — Use of insecure MD5 hash — `hashlib.md5()` usado possivelmente para seguranca
3. **Severity: LOW** — Requests call without timeout — `requests.get()` sem parametro `timeout`

## Rodando SonarQube

```bash
# 1. Subir SonarQube com Docker
docker run -d --name sonarqube -p 9000:9000 sonarqube:community

# 2. Aguardar inicializacao (~2 minutos)
# Acessar http://localhost:9000
# Login padrao: admin/admin (troca senha no primeiro acesso)

# 3. Criar projeto local na UI
# Project name: my-project → Next → Use default → Locally → Generate token

# 4. Instalar scanner Python
pip install pysonar-scanner

# 5. Rodar analise (comando gerado pela UI do SonarQube)
sonar-scanner \
  -Dsonar.projectKey=my-project \
  -Dsonar.sources=src/ \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=sqp_xxxxxxxxxxxxx
```

### Saida do SonarQube (2 findings)

1. **Security Hotspot** — Uso de MD5 — "This hash is secure? Make sure it is safe"
2. **Code Smell** — Cliente sincrono (`requests`) dentro de funcao `async`

## Integracao com Git Hooks

### Pre-commit com Bandit

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.5
    hooks:
      - id: bandit
        args: ["-r", "src/", "--severity-level", "high"]
        pass_filenames: false
```

### Script manual de pre-commit

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running SAST analysis..."
bandit -r src/ --severity-level high -q

if [ $? -ne 0 ]; then
    echo "SAST found HIGH severity issues. Commit blocked."
    exit 1
fi

echo "SAST passed."
```

## Organizacao de pastas para SAST

```
project/
├── src/              # Codigo fonte — SAST analisa AQUI
│   ├── app.py
│   └── routes/
├── venv/             # Virtual env — EXCLUIR do scan
├── node_modules/     # Deps JS — EXCLUIR do scan
├── requirements.txt
└── .pre-commit-config.yaml
```

O instrutor destacou a importancia de separar o codigo fonte das dependencias: "Tanto no SonarQube quanto no Bandit, quanto em qualquer outra ferramenta, da pra voce separar e dizer, olha, ignore o Virtual Env."