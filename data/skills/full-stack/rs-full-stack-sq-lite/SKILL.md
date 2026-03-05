---
name: rs-full-stack-sq-lite
description: "Applies SQLite as the recommended lightweight database for learning SQL and relational databases. Use when user asks to 'setup a database for learning', 'choose a database for study', 'use SQLite', or 'start learning SQL'. Guides selection of SQLite for educational and embedded contexts. Make sure to use this skill whenever recommending databases for learning or prototyping. Not for production database architecture, PostgreSQL/MySQL setup, or database migration strategies."
---

# SQLite — Banco de Dados para Estudo e Prototipagem

> Escolha SQLite quando o objetivo for aprender SQL e bancos relacionais com zero fricção de setup.

## Key concept

SQLite é um banco de dados relacional completo armazenado em um único arquivo no disco. Não requer instalação de servidor, configuração externa, nem processos rodando em background. Pode ser incorporado diretamente na aplicação, tornando-o ideal para estudo, prototipagem e aplicações embarcadas.

## Decision framework

| Quando você encontrar | Aplique |
|----------------------|---------|
| Precisa estudar SQL e bancos relacionais | SQLite — zero setup, foco total no aprendizado |
| Prototipagem rápida de uma feature | SQLite — arquivo único, sem infra |
| Aplicação mobile ou embarcada | SQLite — autossuficiente, leve |
| Aplicação web em produção com concorrência alta | PostgreSQL ou MySQL — SQLite não é ideal para múltiplas escritas simultâneas |
| Precisa de replicação ou clustering | PostgreSQL — SQLite não suporta |

## How to think about it

### Arquivo único no disco

Todos os dados — definições de tabela, índices, dados armazenados — ficam em um único arquivo `.db` ou `.sqlite`. Copiar o banco é copiar um arquivo. Fazer backup é copiar um arquivo. Resetar é deletar um arquivo.

### Autossuficiente

SQLite não depende de nenhum servidor rodando. Não existe `sqlite start` ou `systemctl enable sqlite`. A aplicação lê e escreve diretamente no arquivo. Isso elimina toda a complexidade de conexão, autenticação e configuração de servidor durante o aprendizado.

### SQL completo

Apesar de simples, SQLite suporta SQL padrão: CREATE TABLE, INSERT, SELECT, UPDATE, DELETE, JOINs, índices, constraints. O SQL aprendido com SQLite transfere diretamente para PostgreSQL, MySQL e outros bancos relacionais.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| SQLite é um banco "de brinquedo" | É usado em produção no Android, iOS, navegadores, e bilhões de dispositivos |
| SQL do SQLite é diferente | 95% do SQL é idêntico ao de bancos maiores |
| Precisa instalar um servidor | Não precisa — é um arquivo + biblioteca |
| Não serve para aplicações reais | Serve para mobile, embarcado, e apps com baixa concorrência de escrita |

## When to apply

- Início de estudos de SQL e bancos relacionais
- Prototipagem de schemas antes de migrar para banco de produção
- Projetos pessoais e MVPs com poucos usuários simultâneos
- Testes automatizados que precisam de banco relacional real
- Aplicações mobile e desktop embarcadas

## Limitations

- Sem suporte a múltiplas escritas simultâneas com alta concorrência
- Sem replicação nativa ou clustering
- Sem sistema de permissões/usuários (qualquer processo com acesso ao arquivo lê tudo)
- Tipos de dados mais flexíveis que PostgreSQL (pode causar surpresas ao migrar)
- Para visualizar os dados, precisa de um SGBD (Sistema Gerenciador de Banco de Dados) como DB Browser for SQLite ou extensão do VS Code

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre escolha do SQLite, comparações e contexto educacional
- [code-examples.md](references/code-examples.md) — Exemplos de setup, criação de tabelas e operações básicas com SQLite