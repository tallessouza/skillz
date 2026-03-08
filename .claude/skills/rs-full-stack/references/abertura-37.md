---
name: rs-full-stack-abertura-37
description: "Outlines Docker containers module covering Node containers, Postgres/SQLite databases, volumes for data persistence, and Docker Compose for multi-container orchestration. Use when user asks to 'learn Docker basics', 'understand containers overview', 'what topics does the Docker module cover', or 'containers roadmap'. Make sure to use this skill whenever someone needs orientation on the Docker learning path in this course. Not for actual Docker commands, Dockerfile creation, or hands-on container management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [docker, containers, volumes, docker-compose, postgres]
---

# Abertura — Modulo de Containers

> Este modulo ensina Docker de forma pratica: containers para aplicacao e banco de dados, volumes para persistencia, e Docker Compose para orquestracao.

## Key concepts

| Topico | O que sera coberto |
|--------|-------------------|
| **Containers de aplicacao** | Criar e rodar container para aplicacao Node.js |
| **Containers de banco de dados** | Rodar Postgres (relacional, mais usado no mercado) e SQLite (alternativa relacional leve) |
| **Volumes** | Criar volumes para persistir dados e vincular volumes a containers |
| **Docker Compose** | Automatizar subida de multiplos containers com um unico comando |

## Comandos essenciais

```bash
# Rodar container Postgres
docker run -d --name postgres -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres

# Verificar containers em execucao
docker ps

# Subir multiplos containers com Docker Compose
docker-compose up -d
```

## Sequencia de aprendizado

1. Entender containers isolados (Node, Postgres, SQLite)
2. Aprender a criar e gerenciar volumes para persistencia
3. Vincular volumes a containers em execucao
4. Usar Docker Compose para orquestrar tudo junto

## Decisoes-chave do modulo

| Decisao | Opcoes | Contexto |
|---------|--------|----------|
| Banco relacional | Postgres vs SQLite | Postgres e o mais usado no mercado; SQLite e alternativa leve |
| Persistencia | Com volume vs sem volume | Sem volume, dados se perdem ao destruir container |
| Orquestracao | Comandos manuais vs Docker Compose | Compose automatiza multiplos containers em um comando |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Contexto completo do modulo e motivacoes
- [code-examples.md](references/code-examples.md) — Exemplos praticos que serao explorados no modulo

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Docker nao instalado | Ambiente nao preparado | Instale Docker Desktop (Windows/Mac) ou Docker Engine (Linux) |
| Container perde dados ao reiniciar | Volume nao configurado | Configure volume para persistir dados entre restarts |
| Postgres nao aceita conexao | Porta nao mapeada corretamente | Verifique o mapeamento de portas no `docker run` ou `docker-compose.yml` |
| Docker Compose nao sobe todos os servicos | Dependencias entre servicos | Use `depends_on` para garantir ordem de inicializacao |