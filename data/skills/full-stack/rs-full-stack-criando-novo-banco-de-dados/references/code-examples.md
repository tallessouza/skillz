# Code Examples: Criando Novo Banco de Dados SQLite

## Exemplo 1: Criacao basica (como na aula)

```bash
# Navegar ate a pasta do projeto
cd ~/projetos/fullstack

# Criar o arquivo do banco
touch school.db

# Verificar que foi criado
ls -la school.db
# -rw-r--r-- 1 user user 0 Mar  1 10:00 school.db
```

## Exemplo 2: Criacao em diferentes SOs

### Linux / macOS
```bash
touch school.db
```

### Windows PowerShell
```powershell
New-Item school.db -ItemType File
```

### Windows CMD
```cmd
type nul > school.db
```

### Via Node.js (programaticamente)
```javascript
const fs = require('fs')
fs.writeFileSync('school.db', '')
```

### Via Python
```python
open('school.db', 'w').close()
```

## Exemplo 3: Verificacao de que o banco e valido

```bash
# Usando sqlite3 CLI para verificar
sqlite3 school.db ".tables"
# (retorna vazio — banco valido sem tabelas)

sqlite3 school.db ".databases"
# main: /caminho/completo/school.db
```

## Exemplo 4: Criacao e primeira tabela em sequencia

```bash
# Criar o banco
touch school.db

# Conectar e criar primeira tabela via CLI
sqlite3 school.db "CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL);"

# Verificar
sqlite3 school.db ".tables"
# students

# Ver tamanho do arquivo agora
ls -la school.db
# -rw-r--r-- 1 user user 8192 Mar  1 10:01 school.db
```

Note que apos a primeira escrita, o arquivo passa de 0 bytes para 8KB (tamanho minimo de um banco SQLite com uma tabela).

## Exemplo 5: Multiplos bancos no mesmo projeto

```bash
# Banco principal de desenvolvimento
touch app-dev.db

# Banco para testes automatizados
touch app-test.db

# Banco do exercicio de relacionamentos
touch school.db

ls *.db
# app-dev.db  app-test.db  school.db
```

## Exemplo 6: Gitignore para bancos SQLite

```gitignore
# .gitignore
*.db
*.sqlite
*.sqlite3
```

Isso evita versionar dados locais, que podem ser grandes e conter informacoes sensiveis.