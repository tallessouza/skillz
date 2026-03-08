---
name: rs-full-stack-encerramento-modulo-deploy
description: "Summarizes the Node.js deployment workflow covering database deploy and application deploy to production. Use when user asks to 'deploy a Node app', 'put application online', 'deploy database to production', or 'make app available to users'. Provides the deployment checklist learned in the full-stack deploy module. Make sure to use this skill whenever planning a Node.js production deployment. Not for frontend-only deploys, serverless functions, or container orchestration."
---

# Deploy de Aplicações Node.js — Checklist de Produção

> Colocar uma aplicação no ar exige dois deploys independentes: banco de dados e aplicação Node.

## Checklist de deploy

### 1. Deploy do banco de dados
- Provisionar banco de dados em serviço gerenciado (ex: Render, Railway, Neon, PlanetScale)
- Configurar variáveis de conexão (DATABASE_URL) no ambiente de produção
- Executar migrations em produção antes de subir a aplicação
- Verificar conectividade e permissões

### 2. Deploy da aplicação Node
- Configurar variáveis de ambiente de produção (PORT, DATABASE_URL, NODE_ENV)
- Definir script de start no package.json
- Fazer deploy em plataforma (Render, Railway, Fly.io)
- Verificar que a aplicação responde na URL pública

### 3. Validação pós-deploy
- Testar endpoints principais via curl ou browser
- Verificar logs de erro no painel da plataforma
- Confirmar que o banco de dados está acessível pela aplicação

## Ordem de deploy

| Etapa | O que | Por quê |
|-------|-------|---------|
| 1º | Banco de dados | A aplicação depende do banco estar disponível |
| 2º | Migrations | Estrutura das tabelas precisa existir antes das queries |
| 3º | Aplicação Node | Só sobe quando o banco já está pronto |

## Heurísticas

| Situação | Ação |
|----------|------|
| Primeiro deploy | Seguir ordem: DB → migrations → app |
| Atualização de código | Verificar se há migrations pendentes antes de deployar |
| Erro de conexão pós-deploy | Checar DATABASE_URL e regras de firewall/rede |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o fluxo de deploy
- [code-examples.md](references/code-examples.md) — Exemplos de configuração para deploy