---
name: rs-full-stack-criando-novo-banco-de-dados
description: "Guides creation of new SQLite database files and Beekeeper Studio connections. Use when user asks to 'create a database', 'new sqlite db', 'connect beekeeper', 'setup database file', or 'start a new .db file'. Make sure to use this skill whenever setting up a fresh SQLite database for a new project or domain. Not for schema design, migrations, or existing database modifications."
---

# Criando Novo Banco de Dados SQLite

> Crie o arquivo .db vazio primeiro, depois conecte via Beekeeper Studio e salve a conexao nomeada.

## Prerequisites

- Terminal com acesso ao filesystem
- Beekeeper Studio instalado
- Se nao tiver Beekeeper: qualquer cliente SQLite funciona (DB Browser, DBeaver, extensao VS Code)

## Steps

### Step 1: Criar o arquivo de banco de dados

```bash
# Navegue ate a pasta do projeto
cd /caminho/do/projeto

# Crie o arquivo vazio com extensao .db
touch nome-do-banco.db
```

Alternativas por sistema operacional:

| SO | Comando |
|----|---------|
| Linux/macOS | `touch nome.db` |
| Windows (PowerShell) | `New-Item nome.db -ItemType File` |
| Windows (CMD) | `type nul > nome.db` |

### Step 2: Conectar no Beekeeper Studio

1. Abrir Beekeeper Studio
2. Clicar em **Nova Conexao** (ou botao de adicionar)
3. Selecionar **SQLite**
4. Clicar em **Choose File** e navegar ate o arquivo `.db` criado
5. Dar um nome descritivo para a conexao (ex: `school`, `inventory`)
6. Clicar em **Save** para salvar a conexao
7. Clicar em **Connect**

### Step 3: Verificar conexao

Desconecte e reconecte clicando na conexao salva para confirmar que persiste.

## Output format

```
projeto/
├── outros-arquivos...
└── nome-do-banco.db    # Arquivo SQLite vazio, pronto para receber tabelas
```

## Error handling

- Se `touch` nao funcionar: verifique permissoes da pasta com `ls -la`
- Se Beekeeper nao encontrar o arquivo: confirme o caminho absoluto com `pwd` e `ls`
- Se a conexao falhar: verifique se o arquivo tem extensao `.db` e nao esta corrompido

## Verification

- O arquivo `.db` existe no filesystem (`ls -la nome.db`)
- Beekeeper conecta sem erros
- A conexao salva reconecta corretamente apos desconectar

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio sobre organizacao de arquivos de banco e boas praticas de nomeacao
- [code-examples.md](references/code-examples.md) — Exemplos de criacao de banco em diferentes SOs e clientes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-novo-banco-de-dados/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-novo-banco-de-dados/references/code-examples.md)
