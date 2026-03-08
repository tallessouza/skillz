---
name: rs-full-stack-criando-o-banco-de-dados-1
description: "Configures PostgreSQL database deployment on Render when provisioning a cloud-hosted Postgres instance. Use when user asks to 'deploy database', 'create Postgres on Render', 'provision cloud database', 'setup production database', or 'host PostgreSQL'. Covers instance naming, region selection for latency optimization, and free tier configuration. Make sure to use this skill whenever deploying a PostgreSQL database to Render or similar PaaS. Not for local database setup, Docker Compose databases, or database schema design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: deploy-render
  tags: [postgresql, render, deploy, cloud, database]
---

# Criando o Banco de Dados no Render

> Provisione uma instancia PostgreSQL no Render com naming consistente, regiao otimizada para latencia e plano adequado.

## Prerequisites

- Conta no Render (render.com) criada e autenticada
- Aplicacao que utiliza PostgreSQL como banco de dados
- Se nao tem conta: criar em render.com antes de prosseguir

## Steps

### Step 1: Acessar o Dashboard

Acesse o dashboard do Render. Clique no botao **New** e selecione **PostgreSQL** entre as opcoes de servico.

### Step 2: Configurar nome da instancia

Defina o nome da instancia seguindo o padrao:

```
{nome-da-aplicacao}-postgresql
```

Exemplo: `rocketlog-postgresql`

O nome identifica a instancia no dashboard — use o nome da aplicacao para facilitar a localizacao.

### Step 3: Configurar nome do banco de dados

Defina o nome do banco de dados (database name) com o nome da aplicacao:

```
rocketlog
```

### Step 4: Selecionar regiao

Escolha a regiao mais proxima dos usuarios da aplicacao, porque menor distancia = menor latencia = menor tempo de resposta.

| Regiao | Quando usar |
|--------|-------------|
| Proxima dos usuarios | Producao com usuarios reais |
| Proxima do servidor da API | Quando API e DB devem estar co-localizados |
| Default (US) | Projetos de estudo ou prototipo |

### Step 5: Selecionar plano

Selecione o plano adequado:

| Plano | Quando usar |
|-------|-------------|
| **Free** | Projetos de estudo, prototipos, MVPs iniciais |
| Pago | Producao com dados reais e SLA necessario |

Para projetos de estudo, selecione **Free**.

### Step 6: Criar o banco

Clique em **Create Database**. O status mudara para "Creating" — aguarde alguns minutos ate o provisionamento concluir. O Render reserva storage e cria o volume automaticamente.

## Output format

Apos criacao, o Render fornece:
- **Internal Database URL** — para conexao de servicos dentro do Render
- **External Database URL** — para conexao externa (development local)
- **PSQL Command** — para acesso direto via terminal
- **Hostname, Port, Database, Username, Password** — credenciais individuais

## Verification

- Status no dashboard muda de "Creating" para **"Available"**
- Testar conexao com a URL externa usando `psql` ou cliente de banco

## Error handling

- Se criacao demora mais de 10 minutos: verifique o status no dashboard, pode haver problema na plataforma
- Se regiao indisponivel: selecione a proxima regiao mais proxima disponivel

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto de estudo | Free tier, regiao default |
| API e DB no mesmo provider | Mesma regiao para ambos |
| Usuarios no Brasil | Regiao mais proxima (US East ou South America se disponivel) |
| Naming da instancia | `{app-name}-postgresql` — sempre identificavel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha de regiao, latencia e planos
- [code-examples.md](references/code-examples.md) — Exemplos de conexao e configuracao de variavel de ambiente

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Status "Creating" por mais de 10 minutos | Problema na plataforma Render | Verifique o status page do Render ou tente novamente |
| Conexao externa falha com timeout | IP bloqueado ou URL incorreta | Use a External Database URL e verifique se o IP esta liberado |
| Erro de autenticacao ao conectar | Credenciais incorretas | Copie usuario/senha diretamente do dashboard do Render |
| Regiao indisponivel | Capacidade esgotada na regiao | Selecione a proxima regiao mais proxima |
| Free tier expirou | Render limita instancias free a 90 dias | Crie nova instancia ou migre para plano pago |