---
name: rs-full-stack-criando-o-banco-de-dados
description: "Generates SQLite database setup when user asks to 'create a database', 'setup SQLite', 'initialize db file', or 'start a new project with database'. Applies correct file naming conventions (.db extension), folder structure, and cross-platform creation methods. Make sure to use this skill whenever setting up a new SQLite database from scratch. Not for database schema design, migrations, or ORM configuration."
---

# Criando o Banco de Dados SQLite

> Crie o arquivo .db vazio na pasta correta antes de qualquer operação com o banco.

## Prerequisites

- Sistema operacional: Linux, Mac ou Windows
- Terminal ou editor de texto disponivel

## Steps

### Step 1: Criar a pasta do banco de dados

```bash
mkdir database
```

### Step 2: Criar o arquivo .db vazio

**Linux/Mac:**
```bash
touch database/database.db
```

**Windows (ou qualquer OS):**
Criar arquivo vazio no editor e salvar como `database.db` na pasta.

**Node.js (programatico):**
```javascript
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'

if (!existsSync('database')) {
  mkdirSync('database')
}
writeFileSync('database/database.db', '')
```

## Output format

```
project/
└── database/
    └── database.db    # Arquivo vazio, pronto para uso
```

## Convencoes de nomenclatura

| Extensao | Uso |
|----------|-----|
| `.db` | Convencao padrao para SQLite (recomendado) |
| `.sqlite` | Alternativa comum |
| `.sql` | Usado por outros bancos, evitar para SQLite |

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto com SQLite | Criar pasta `database/` + arquivo `.db` vazio |
| Nome do arquivo | Use nome descritivo: `database.db`, `app.db`, `{projeto}.db` |
| Arquivo ja existe | Nao sobrescrever, verificar com `existsSync` antes |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar .db na raiz do projeto sem pasta | Criar pasta `database/` dedicada |
| Usar extensao `.sql` para SQLite | Usar `.db` ou `.sqlite` |
| Escrever conteudo no arquivo manualmente | Deixar vazio, a ferramenta SQLite gerencia o conteudo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre SQLite como arquivo e metodos de criacao
- [code-examples.md](references/code-examples.md) — Exemplos de criacao em diferentes plataformas e linguagens

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-o-banco-de-dados/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-o-banco-de-dados/references/code-examples.md)
