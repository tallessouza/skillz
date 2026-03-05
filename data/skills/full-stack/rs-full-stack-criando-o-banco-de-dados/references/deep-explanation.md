# Deep Explanation: Criando o Banco de Dados SQLite

## Por que SQLite e um arquivo?

SQLite e um banco de dados serverless — diferente de PostgreSQL ou MySQL, nao precisa de um servidor rodando. O banco inteiro vive dentro de um unico arquivo no sistema de arquivos. Isso significa que "criar um banco de dados" e literalmente "criar um arquivo vazio".

## Por que o arquivo precisa ser vazio?

O SQLite tem seu proprio formato binario. Quando voce abre o arquivo vazio com uma ferramenta SQLite (como DB Browser, sqlite3 CLI, ou uma biblioteca como better-sqlite3/knex), a ferramenta escreve os headers e estruturas internas automaticamente. Escrever qualquer coisa manualmente no arquivo corromperia o banco.

## Metodos de criacao por plataforma

### Linux e Mac: `touch`

O comando `touch` cria um arquivo vazio se ele nao existir, ou atualiza o timestamp se ja existir. E a forma mais direta:

```bash
cd pasta-do-projeto
mkdir database
touch database/database.db
```

### Windows

No Windows, `touch` nao existe nativamente. Alternativas:
1. **Bloco de notas** — Abrir, salvar como `database.db` (o instrutor demonstrou este metodo)
2. **PowerShell** — `New-Item database/database.db -ItemType File`
3. **CMD** — `type nul > database\database.db`
4. **Menu de contexto** — Botao direito > Novo arquivo

### Programatico (recomendado para projetos reais)

Na pratica, a maioria das bibliotecas SQLite cria o arquivo automaticamente ao conectar:

```javascript
// better-sqlite3 cria o arquivo se nao existir
import Database from 'better-sqlite3'
const db = new Database('database/database.db')
```

Mesmo assim, e boa pratica garantir que a pasta exista antes.

## Convencao de extensao

O instrutor explicou que `.db` e a convencao usada no curso. Na industria:
- `.db` — Mais generico, muito usado com SQLite
- `.sqlite` ou `.sqlite3` — Explicita a tecnologia
- `.sql` — Geralmente reservado para arquivos de script SQL, nao para bancos SQLite

A escolha e de preferencia, mas `.db` e a mais comum em projetos Node.js/JavaScript.

## Estrutura de pastas

Manter o banco em uma pasta dedicada (`database/`) ao inves da raiz do projeto:
- Facilita configurar `.gitignore` (geralmente voce nao quer versionar o .db)
- Separa dados de codigo
- Permite multiplos arquivos de banco se necessario (ex: `test.db`, `dev.db`)