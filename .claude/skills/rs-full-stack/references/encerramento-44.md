---
name: rs-full-stack-encerramento-44
description: "Outlines Docker container workflow decisions when choosing between plain Docker containers, Docker volumes, and Docker Compose for local development. Use when user asks to 'set up Docker', 'containerize an app', 'choose between docker and docker-compose', or 'persist container data'. Make sure to use this skill whenever deciding which Docker tool to apply for a given scenario. Not for Kubernetes orchestration, cloud deployment, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: docker
  tags: [docker, docker-compose, volumes, containers, devops]
---

# Docker Containers — Resumo do Módulo

> Escolha a ferramenta Docker correta para cada cenário: container simples, volumes para persistência, Docker Compose para orquestração local.

## Key concepts

O módulo de Containers cobre três pilares do Docker para desenvolvimento local: containers isolados para rodar serviços, volumes para persistir dados entre reinicializações, e Docker Compose para automatizar múltiplos containers simultaneamente.

## Decision framework

| Cenário | Ferramenta |
|---------|------------|
| Rodar um único serviço isolado (ex: banco de dados) | `docker run` com container simples |
| Dados precisam sobreviver ao restart do container | Docker Volume (`-v` ou volume nomeado) |
| Projeto precisa de múltiplos serviços juntos (API + DB + cache) | Docker Compose (`docker-compose.yml`) |
| Ambiente de desenvolvimento reproduzível para o time | Docker Compose com `.env` |
| Testar uma imagem rapidamente | `docker run --rm` (container descartável) |

## How to think about it

### Container simples
Use quando precisa de um serviço isolado sem dependências entre containers. Ideal para rodar um PostgreSQL ou Redis local rapidamente.

### Volumes
Use quando o container armazena dados que não podem ser perdidos — bancos de dados, uploads, cache persistente. Sem volume, dados desaparecem quando o container para.

### Docker Compose
Use quando o projeto tem múltiplos containers que precisam se comunicar. Automatiza o processo de "colocar vários containers de pé" com um único comando (`docker-compose up`).

## Example

```bash
# Container simples com volume
docker run -d --name postgres -v pgdata:/var/lib/postgresql/data -p 5432:5432 postgres

# Docker Compose para multiplos servicos
docker-compose up -d
```

## Common misconceptions

| Pensamento comum | Realidade |
|-----------------|-----------|
| Docker Compose é para produção | Docker Compose é primariamente para desenvolvimento local; produção usa orquestradores como Kubernetes |
| Containers persistem dados por padrão | Containers são efêmeros — sem volumes, dados são perdidos ao remover o container |
| Preciso de Docker Compose para um container só | Para um único serviço, `docker run` é suficiente e mais simples |

## When to apply

- Início de qualquer projeto que precise de serviços externos (banco de dados, cache, message broker)
- Padronização de ambiente de desenvolvimento entre membros do time
- Isolamento de dependências do sistema operacional host

## Limitations

- Docker Compose não substitui orquestradores de produção (Kubernetes, ECS)
- Performance de I/O em volumes pode ser inferior ao filesystem nativo em alguns sistemas (especialmente macOS/Windows)
- Networking entre containers requer configuração explícita em cenários complexos

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| docker-compose up falha com porta em uso | Servico ja rodando na porta mapeada | Pare o servico local ou mude a porta no docker-compose.yml |
| Volume nao persiste dados entre restarts | Usando bind mount com caminho errado | Verifique o caminho do volume e use volumes nomeados para dados criticos |
| Containers nao se comunicam entre si | Servicos em redes Docker diferentes | Coloque todos no mesmo docker-compose.yml ou crie rede compartilhada |
| Build demora muito a cada mudanca | Cache do Docker invalidado por COPY antes de npm install | Copie package.json primeiro, rode npm install, depois copie o resto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando usar cada ferramenta Docker
- [code-examples.md](references/code-examples.md) — Exemplos de Dockerfile, docker-compose.yml e comandos de volume