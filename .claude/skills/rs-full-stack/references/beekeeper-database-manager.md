---
name: rs-full-stack-beekeeper-database-manager
description: "Configures setup and usage of Beekeeper Studio as database manager and SQL editor. Use when user asks to 'connect to database', 'install database tool', 'setup SQL editor', 'manage database GUI', or 'configure Beekeeper'. Make sure to use this skill whenever setting up database management tools for development. Not for writing SQL queries, database schema design, or ORM configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: tooling
  tags: [beekeeper, database, sql-editor, gui, sgbd]
---

# Beekeeper Studio — Database Manager

> Usar o Beekeeper Studio Community Edition como ferramenta padrao para acessar, visualizar e manipular bancos de dados durante o desenvolvimento.

## Key concepts

Beekeeper Studio e um **SQL Editor** e **Database Manager** (tambem chamado SGBD — Sistema de Gerenciamento de Banco de Dados). A versao Community (gratuita) atende perfeitamente para desenvolvimento no dia a dia.

## Example

```sql
-- Query basica no SQL Editor do Beekeeper
SELECT * FROM users WHERE active = true ORDER BY created_at DESC;
```

## Setup

### Step 1: Download
1. Buscar "Beekeeper Studio Community Edition" no Google
2. Acessar a pagina da versao Community (nao a versao paga)
3. Inserir e-mail e clicar em "Continuar para download"
4. Selecionar o instalador para seu SO (Windows, Mac ou Linux)

### Step 2: Instalacao
- Windows: executar o instalador `.exe` normalmente
- Mac: arrastar para Applications
- Linux: usar o `.AppImage` ou pacote `.deb`

### Step 3: Conexao ao banco
1. Abrir Beekeeper Studio
2. Selecionar o tipo de banco (PostgreSQL, MySQL, SQLite, etc.)
3. Preencher host, porta, usuario, senha e database
4. Testar conexao e salvar

## Quando usar

| Situacao | Acao |
|----------|------|
| Precisa visualizar dados de tabelas | Abrir Beekeeper, conectar ao banco |
| Precisa executar queries SQL manuais | Usar o SQL Editor integrado |
| Precisa inspecionar schema/estrutura | Navegar pelo Database Manager |
| Precisa exportar dados | Usar funcao de export do Beekeeper |

## Versoes

| Versao | Custo | Recomendacao |
|--------|-------|-------------|
| Community Edition | Gratuita | Usar esta — atende para desenvolvimento |
| Ultimate (paga) | Planos pagos | Desnecessaria para a maioria dos casos |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Conexao falha com o banco | Host, porta, usuario ou senha incorretos | Confira as credenciais de conexao e teste novamente |
| Beekeeper nao encontra tabelas | Conectou ao banco errado ou schema vazio | Verifique o nome do database na conexao |
| Query retorna erro de sintaxe | SQL incorreto no editor | Revise a query antes de executar, confira ponto-e-virgula |
| Versao Community nao abre | Problema de instalacao | Reinstale usando o instalador correto para seu SO |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha da ferramenta e conceitos de SGBD
- [code-examples.md](references/code-examples.md) — Exemplos de conexao e uso pratico do Beekeeper