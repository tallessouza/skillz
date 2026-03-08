---
name: rs-full-stack-criando-o-docker-compose
description: "Generates Docker Compose configurations for multi-container applications. Use when user asks to 'create docker-compose', 'orchestrate containers', 'setup docker services', 'define multi-container app', or 'configure postgres with node'. Applies patterns: service definition with build context, volume persistence for databases, port mapping, depends_on for service dependencies, environment variables. Make sure to use this skill whenever setting up Docker Compose for Node.js + PostgreSQL stacks. Not for Dockerfile creation, Kubernetes, or cloud deployment configurations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: docker
  tags: [docker, docker-compose, postgresql, containers, volumes]
---

# Criando Docker Compose

> Defina todos os containers do projeto em um unico arquivo docker-compose.yml e suba tudo com um unico comando.

## Rules

1. **Adicione docker-compose.yml ao .dockerignore** — porque o arquivo de orquestracao nao precisa ser copiado para dentro dos containers
2. **Respeite a indentacao YAML rigorosamente** — porque YAML usa indentacao para definir hierarquia (o que pertence a o que), erro de indentacao quebra silenciosamente
3. **Use Dockerfile para servicos custom, imagem direta para servicos padrao** — API Node usa `build` com Dockerfile, PostgreSQL usa `image` direto, porque banco nao precisa de customizacao de build
4. **Sempre defina `container_name`** — porque sem nome explicito o Docker gera nomes aleatorios baseados no servico, dificultando debug
5. **Use `depends_on` para declarar dependencias entre servicos** — porque a API precisa que o banco esteja disponivel antes de iniciar
6. **Persista dados de banco com volumes nomeados** — porque recriar o container sem volume significa perder todos os dados do banco
7. **Defina volumes na secao raiz `volumes:`** — porque volumes nomeados precisam ser declarados no top-level para o Docker gerenciar automaticamente

## How to write

### Estrutura completa do docker-compose.yml

```yaml
version: "3.9"

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    image: node-js
    container_name: api
    ports:
      - "3333:3333"
    depends_on:
      - postgres

  postgres:
    image: bitnami/postgresql:latest
    container_name: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRESQL_USER: postgres
      POSTGRESQL_PASSWORD: postgres
      POSTGRESQL_DB: api
    volumes:
      - database:/var/lib/postgresql/data

volumes:
  database:
```

### Servico com Dockerfile (aplicacao custom)

```yaml
api:
  build:
    context: .          # raiz do projeto como referencia
    dockerfile: Dockerfile  # aponta para o Dockerfile existente
  container_name: api
  ports:
    - "3333:3333"
  depends_on:
    - postgres
```

### Servico com imagem direta (banco de dados)

```yaml
postgres:
  image: bitnami/postgresql:latest
  container_name: postgres
  ports:
    - "5432:5432"
  environment:
    POSTGRESQL_USER: postgres
    POSTGRESQL_PASSWORD: postgres
    POSTGRESQL_DB: api
  volumes:
    - database:/var/lib/postgresql/data
```

## Example

**Before (comandos manuais no terminal):**
```bash
docker run -d -p 5432:5432 -e POSTGRESQL_USER=postgres bitnami/postgresql
docker build -t api .
docker run -d -p 3333:3333 api
# Precisa lembrar e executar cada vez, sem ordem garantida
```

**After (com docker-compose):**
```bash
docker compose up
# Um comando sobe tudo, na ordem certa, com volumes persistidos
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Servico usa codigo proprio (API, worker) | Use `build:` com Dockerfile |
| Servico usa software pronto (DB, Redis, cache) | Use `image:` direto |
| Servico armazena dados que nao podem ser perdidos | Declare volume nomeado |
| Servico A precisa de servico B rodando | Use `depends_on` |
| Portas entre host e container sao iguais | Mapeie `"PORTA:PORTA"` com aspas |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|--------------|
| Rodar containers manualmente um a um | Definir tudo no docker-compose.yml |
| Banco sem volume | Sempre `volumes:` para persistencia |
| Deixar Docker gerar nome de container | Definir `container_name:` explicito |
| Copiar docker-compose.yml para dentro do container | Adicionar ao `.dockerignore` |
| Indentacao com mix de tabs e espacos | Usar apenas espacos (2 espacos por nivel) |
| Variaveis de ambiente com valores em caixa baixa nas chaves | Chaves em MAIUSCULAS: `POSTGRESQL_USER` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre hierarquia YAML, volumes vs bind mounts, e depends_on
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Container do banco perde dados ao recriar | Volume nao declarado ou bind mount incorreto | Declare volume nomeado na secao `volumes:` raiz e mapeie no servico |
| API nao conecta ao banco | `depends_on` ausente ou banco ainda inicializando | Adicione `depends_on` e implemente retry/healthcheck na API |
| Erro de indentacao no YAML | Mix de tabs e espacos ou nivel incorreto | Use apenas espacos (2 por nivel), valide com `docker compose config` |
| `docker compose up` falha com "service not found" | Nome do servico com typo ou YAML mal formatado | Verifique nomes dos servicos e indentacao com `docker compose config` |
| Porta ja em uso no host | Outro processo usando a mesma porta | Altere a porta do host no mapeamento `"OUTRA_PORTA:PORTA_CONTAINER"` |