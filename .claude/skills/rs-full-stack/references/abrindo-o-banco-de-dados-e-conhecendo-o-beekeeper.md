---
name: rs-full-stack-beekeeper-sqlite
description: "Configures SQLite database connection setup in Beekeeper Studio when user asks to 'connect to database', 'open SQLite file', 'setup Beekeeper', 'view database tables', or 'run SQL queries'. Covers connection configuration, testing, saving, and basic UI navigation. Make sure to use this skill whenever setting up a database GUI client for SQLite development. Not for database schema design, SQL query writing, or production database administration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [sqlite, beekeeper, database, gui, sql, connection]
---

# Conectando SQLite ao Beekeeper Studio

> Configure e gerencie conexoes SQLite no Beekeeper Studio para visualizar e executar SQL interativamente.

## Prerequisites

- Beekeeper Studio instalado (versao Community gratuita e suficiente)
- Arquivo `.db` do SQLite ja criado no projeto

## Steps

### Step 1: Criar nova conexao

1. Abrir Beekeeper Studio
2. Clicar no botao de adicionar nova conexao (painel lateral)
3. Em **Connection Type**, selecionar **SQLite** na lista dropdown
4. Clicar no botao de selecao de arquivo e navegar ate o `database.db` do projeto
5. Clicar **Open** para confirmar o arquivo

### Step 2: Testar e salvar a conexao

```
1. Clicar em "Test" para verificar — deve aparecer mensagem de conexao OK
2. Definir nome da conexao (ex: "Aulas Banco de Dados")
3. Opcionalmente escolher uma cor para diferenciar de outras conexoes
4. Clicar em "Save" para persistir a configuracao
5. Clicar em "Connect" para abrir o banco
```

### Step 3: Navegar na interface

| Area | Funcao |
|------|--------|
| Painel lateral esquerdo | Lista entidades (tabelas), campo de busca |
| Area central superior | Editor SQL — escrever e executar queries |
| Botao **Run** | Executar o SQL escrito |
| Area central inferior | Resultados da query |
| Botao **Save** (editor) | Salvar scripts SQL para uso futuro |

### Step 4: Desconectar e reconectar

- **Desconectar:** File → Disconnect
- **Reconectar:** Clicar na conexao salva no painel lateral → Connect

## Heuristics

| Situacao | Acao |
|----------|------|
| Varias conexoes salvas | Usar cores diferentes para identificar cada uma |
| Tabela nao aparece no painel | Verificar se a tabela foi criada — campo de busca filtra por nome |
| Botao "Upgrade" aparece | Ignorar — versao Community atende para desenvolvimento |
| Entidade vs Tabela | Sao sinonimos — Beekeeper usa "Entities" para listar tabelas |

## Verification

- Conexao testada com sucesso (mensagem positiva no botao Test)
- Banco aparece conectado com nome e tipo SQLite no painel
- Editor SQL acessivel e botao Run funcional

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Teste de conexao falha | Arquivo `.db` inexistente ou corrompido | Verifique se o arquivo existe e recrie se necessario |
| Tabelas nao aparecem no painel | Banco vazio ou conexao com arquivo errado | Confirme o path do arquivo e verifique se migrations rodaram |
| Botao Run nao executa SQL | Nenhuma query selecionada no editor | Selecione o texto SQL antes de clicar em Run |
| Beekeeper mostra "Upgrade" | Feature da versao paga | Ignore — a versao Community atende para desenvolvimento |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre interface do Beekeeper e conceitos de entidade vs tabela
- [code-examples.md](references/code-examples.md) — Exemplos de configuracao e navegacao passo a passo