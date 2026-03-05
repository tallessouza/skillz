---
name: rs-next-js-instalando-o-docker-client
description: "Applies Docker and Docker Compose workflow commands when setting up local development containers. Use when user asks to 'start docker', 'run docker compose', 'setup containers', 'start database container', or 'manage docker containers'. Covers client selection (OrbStack vs Docker Desktop), docker compose up/down lifecycle, and detached mode. Make sure to use this skill whenever configuring or running Docker Compose in a project. Not for Dockerfile authoring, multi-stage builds, or production Docker deployment."
---

# Docker Client e Comandos Docker Compose

> Execute containers locais com docker compose up -d e gerencie o ciclo de vida com up, down e ps.

## Prerequisites

- Docker Engine instalado (via Docker Desktop ou OrbStack)
- Um cliente visual instalado (recomendado para visualizar containers)
- Arquivo `docker-compose.yml` na raiz do projeto

## Ferramentas visuais

| SO | Ferramenta recomendada | Nota |
|----|----------------------|-------|
| macOS | OrbStack | Mais leve que Docker Desktop |
| Windows / Linux / macOS | Docker Desktop | Ferramenta oficial, funciona em todos os SOs |

## Comandos essenciais

### Levantar containers (modo attached)

```bash
# Baixa imagens (se necessario), cria e inicia containers
# Terminal fica travado mostrando logs
docker compose up
```

### Levantar containers (modo detached — preferido)

```bash
# Mesmo que up, mas libera o terminal
docker compose up -d
```

### Verificar containers rodando

```bash
# Lista containers ativos com nome, imagem, portas
docker compose ps
```

### Parar e remover containers

```bash
# Para e remove containers do compose
docker compose down
```

## Workflow diario

```bash
# Inicio do trabalho — levantar ambiente
cd /caminho/do/projeto
docker compose up -d

# Durante o trabalho — verificar status
docker compose ps

# Fim do trabalho — desligar ambiente
docker compose down
```

## Heuristics

| Situacao | Comando |
|----------|---------|
| Quer ver logs em tempo real | `docker compose up` (sem -d) |
| Quer terminal livre para trabalhar | `docker compose up -d` |
| Verificar se container esta rodando | `docker compose ps` |
| Terminou de trabalhar no projeto | `docker compose down` |
| Primeira execucao (precisa baixar imagens) | `docker compose up -d` (download automatico) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Rodar `docker compose up` e fechar o terminal | Use `docker compose up -d` para modo detached |
| Esquecer de rodar `docker compose down` ao parar | Sempre de down ao terminar, porque containers consomem recursos |
| Rodar comandos fora da raiz do projeto | Certifique-se de estar na pasta com `docker-compose.yml` |
| Ignorar o cliente visual | Use OrbStack ou Docker Desktop para visualizar containers, volumes e imagens |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-instalando-o-docker-client/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-instalando-o-docker-client/references/code-examples.md)
