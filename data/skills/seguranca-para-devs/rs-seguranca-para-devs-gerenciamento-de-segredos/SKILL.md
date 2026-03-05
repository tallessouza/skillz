---
name: rs-seguranca-devs-gerenciamento-segredos
description: "Enforces secrets management practices when writing application code that connects to databases, APIs, or external services. Use when user asks to 'connect to database', 'add API key', 'configure credentials', 'deploy application', or 'setup environment variables'. Applies rules: no hardcoded credentials, config-sample pattern, least-privilege database access, dedicated application users. Make sure to use this skill whenever generating code with connection strings, API keys, or any sensitive configuration. Not for encryption algorithms, authentication flows, or frontend security."
---

# Gerenciamento de Segredos

> Segredos pertencem ao ambiente, nunca ao codigo. Zero Trust: so quem precisa ter acesso, tem acesso.

## Rules

1. **Nunca hardcode credenciais** — nenhuma senha, chave de API, connection string ou token no codigo fonte, porque qualquer pessoa com acesso ao repositorio teria acesso ao segredo
2. **Use arquivo de configuracao separado** — `config.json`, `.env`, ou equivalente da linguagem, porque separa segredos do codigo versionado
3. **Versione apenas o sample** — `config-sample.json` com valores de exemplo vai pro Git, `config.json` real vai no `.gitignore`, porque o sample documenta a estrutura sem expor dados reais
4. **Minima permissao no banco** — se a aplicacao so le, GRANT apenas SELECT; se tem migrations, GRANT apenas o necessario, porque limita o dano em caso de comprometimento
5. **Usuario dedicado para a aplicacao** — crie um usuario do sistema operacional sem sudo e um usuario do banco sem permissoes administrativas, porque engaiola o atacante no escopo da aplicacao
6. **Segredos so existem no ambiente de producao** — nem programadores que nao administram producao devem ter acesso, porque Zero Trust significa acesso apenas para quem realmente precisa

## How to write

### Arquivo de configuracao (config.json)

```json
{
  "db": {
    "host": "127.0.0.1",
    "user": "app_user",
    "password": "senha-gerada-segura",
    "database": "app_database"
  },
  "redis": {
    "url": "redis://localhost:6379"
  },
  "api_keys": {
    "aws_s3": "chave-real-aqui"
  }
}
```

### Arquivo sample (config-sample.json) — este vai pro Git

```json
{
  "db": {
    "host": "localhost",
    "user": "example_user",
    "password": "example_password",
    "database": "example_db"
  },
  "redis": {
    "url": "redis://localhost:6379"
  },
  "api_keys": {
    "aws_s3": "your-key-here"
  }
}
```

### .gitignore

```gitignore
config.json
.env
```

### Leitura da configuracao no codigo

```python
import json

with open("config.json") as f:
    config = json.load(f)

db_connection = mysql.connector.connect(
    host=config["db"]["host"],
    user=config["db"]["user"],
    password=config["db"]["password"],
    database=config["db"]["database"]
)
```

### Permissoes minimas no banco

```sql
-- Criar usuario com senha segura
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'senha-longa-gerada';

-- Dar APENAS a permissao necessaria
GRANT SELECT ON app_database.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

## Example

**Before (credenciais hardcoded no codigo):**

```python
import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="minhasenha123",
    database="producao"
)
```

**After (com gerenciamento de segredos):**

```python
import json
import mysql.connector

with open("config.json") as f:
    config = json.load(f)

db = mysql.connector.connect(**config["db"])
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo projeto com banco de dados | Criar config-sample.json + .gitignore desde o primeiro commit |
| Chave de API de servico externo | Tratar como segredo, colocar no config.json |
| CI/CD precisa de credenciais | Usar secrets do GitHub Actions ou variavel de ambiente do CI, nunca no codigo |
| Multiplos ambientes (dev/staging/prod) | Um config.json por ambiente, nunca versionado |
| Deploy em container | Usar variáveis de ambiente ou secrets do orquestrador (Docker secrets, K8s secrets) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `password = "minhasenha123"` | `password = config["db"]["password"]` |
| `GRANT ALL PRIVILEGES ON *.*` | `GRANT SELECT ON app_db.* TO 'app_user'@'localhost'` |
| Rodar aplicacao como root/sudo | Criar usuario dedicado sem permissoes administrativas |
| Commitar `config.json` com credenciais reais | Commitar apenas `config-sample.json` com valores de exemplo |
| Conectar ao banco como root na aplicacao | Criar usuario do banco com permissoes minimas |
| Deixar arquivo de dump SQL no servidor | Remover dumps apos importacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
