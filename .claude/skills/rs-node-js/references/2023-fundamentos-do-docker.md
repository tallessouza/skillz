---
name: rs-node-js-2023-fundamentos-do-docker
description: "Applies Docker container fundamentals when setting up development environments or database services. Use when user asks to 'run postgres', 'setup database', 'docker compose', 'containerize', 'development environment', or mentions Docker, containers, or local services. Ensures correct mental model of containers vs VMs and proper isolation practices. Make sure to use this skill whenever the user needs to run external services locally. Not for Dockerfile optimization, CI/CD pipelines, or production deployment strategies."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: docker-fundamentals
  tags: [docker, containers, postgres, redis, development-environment, devops]
---

# Fundamentos do Docker

> Utilize containers Docker para isolar servicos externos (bancos de dados, cache, filas) do ambiente de desenvolvimento, mantendo a maquina limpa e o setup reproduzivel.

## Key concepts

Docker cria containers — ambientes isolados que compartilham o kernel do sistema operacional host, diferente de VMs que instalam um SO completo. Containers sao mais rapidos, mais leves e descartaveis.

```bash
# Subir container PostgreSQL para desenvolvimento
docker run --name my-postgres -e POSTGRES_PASSWORD=mysecret -p 5432:5432 -d postgres

# Verificar containers ativos
docker ps

# Parar e remover container
docker stop my-postgres && docker rm my-postgres
```

## Modelo mental: Container vs VM

| Aspecto | VM (VirtualBox/VMware) | Container (Docker) |
|---------|----------------------|-------------------|
| SO | Instala SO completo do zero | Compartilha kernel do host |
| Peso | Gigabytes | Megabytes |
| Startup | Minutos | Segundos |
| Isolamento | Total (hardware virtual) | Processo + filesystem isolado |
| Uso tipico | Servidores cloud (EC2, GCE) | Servicos de desenvolvimento e deploy |

## Regras

1. **Nunca instale bancos de dados diretamente na maquina** — use containers Docker para Postgres, Redis, Mongo e qualquer servico externo, porque ao excluir o container, tudo morre junto (dados, config, arquivos)
2. **Um container por aplicacao** — se tem 5 apps usando Postgres, crie 5 containers separados, porque compartilhar banco entre projetos vira "baguncca geral" apos 6 meses
3. **Containers sao descartaveis** — trate como efemeros: subir, usar, matar sem resquicios no sistema
4. **Windows requer setup extra** — Docker roda sobre Unix/kernel Linux; no Windows, precisa WSL2 ou Docker Desktop com backend Linux

## Quando usar Docker no desenvolvimento

| Situacao | Acao |
|----------|------|
| App precisa de banco de dados | Subir container com Postgres/MySQL/Mongo |
| App precisa de cache | Subir container com Redis/Memcached |
| Novo membro no time | `docker compose up` e tudo funciona |
| Quer testar versao diferente do servico | Criar container com a versao especifica |
| Terminou o projeto | Excluir containers, maquina limpa |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Instalar Postgres/Redis/Mongo direto no SO | `docker run` com o servico |
| Compartilhar um banco entre varios projetos | Um container por projeto |
| Usar VirtualBox para rodar um banco local | Usar Docker (mais leve, mais rapido) |
| Deixar containers antigos rodando eternamente | Parar e remover quando nao estiver usando |

## Troubleshooting

### Container Docker nao inicia ou porta ja em uso
**Symptom:** docker run falha com erro de porta ja alocada ou o container para imediatamente
**Cause:** Outro processo ou container ja esta usando a mesma porta no host
**Fix:** Use docker ps para verificar containers ativos, pare o conflitante com docker stop, ou mapeie para outra porta (-p 5433:5432)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
