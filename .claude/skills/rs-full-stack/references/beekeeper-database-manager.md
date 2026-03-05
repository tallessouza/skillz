---
name: rs-full-stack-beekeeper-database-manager
description: "Guides setup and usage of Beekeeper Studio as database manager and SQL editor. Use when user asks to 'connect to database', 'install database tool', 'setup SQL editor', 'manage database GUI', or 'configure Beekeeper'. Make sure to use this skill whenever setting up database management tools for development. Not for writing SQL queries, database schema design, or ORM configuration."
---

# Beekeeper Studio — Database Manager

> Usar o Beekeeper Studio Community Edition como ferramenta padrao para acessar, visualizar e manipular bancos de dados durante o desenvolvimento.

## Conceito

Beekeeper Studio e um **SQL Editor** e **Database Manager** (tambem chamado SGBD — Sistema de Gerenciamento de Banco de Dados). A versao Community (gratuita) atende perfeitamente para desenvolvimento no dia a dia.

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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha da ferramenta e conceitos de SGBD
- [code-examples.md](references/code-examples.md) — Exemplos de conexao e uso pratico do Beekeeper

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-beekeeper-database-manager/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-beekeeper-database-manager/references/code-examples.md)
