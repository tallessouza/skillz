---
name: rs-devops-declarando-multiplos-containers
description: "Generates Docker Compose configurations when user asks to 'create docker compose', 'run multiple containers', 'orchestrate containers locally', 'setup database with app', or 'write docker-compose.yml'. Applies correct service structure, port mapping, environment variables, and naming conventions. Make sure to use this skill whenever generating or reviewing Docker Compose files. Not for Kubernetes, production orchestration, or Dockerfile creation."
---

# Docker Compose — Declarando Multiplos Containers

> Declare todos os containers da aplicacao em um unico arquivo docker-compose.yml para orquestrar servicos localmente de forma declarativa.

## Rules

1. **Use docker-compose.yml como nome padrao** — porque qualquer outro nome exige passar `-f` na linha de comando, adicionando fricção desnecessária
2. **Respeite a identacao YAML rigorosamente** — porque YAML é sensível a espacos e quebra silenciosamente com identacao errada
3. **Declare services como bloco principal** — networks e volumes sao opcionais; services é obrigatório
4. **Nomeie servicos pelo que sao** — `mysql` nao `db1`, `service-a`, porque o nome do servico vira o hostname na rede interna
5. **Sempre declare environment variables no compose** — porque variaveis passadas via `docker run -e` nao existem no contexto do compose e o container falha silenciosamente
6. **Use `-d` para rodar em background** — `docker compose up -d` libera o terminal, sem `-d` os logs prendem a execução

## How to write

### Estrutura basica de docker-compose.yml

```yaml
version: "3.7"

services:
  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=myapp
      - MYSQL_USER=admin
      - MYSQL_PASSWORD=secret
```

### Servico com rede e volume (boa pratica)

```yaml
version: "3.7"

services:
  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=myapp
    networks:
      - app-network
    volumes:
      - mysql-data:/var/lib/mysql

networks:
  app-network:

volumes:
  mysql-data:
```

## Example

**Before (comandos imperativos via docker run):**
```bash
docker network create app-net
docker volume create db-data
docker run -d --name mysql \
  --network app-net \
  -v db-data:/var/lib/mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=myapp \
  mysql:8
docker run -d --name api \
  --network app-net \
  -p 3000:3000 \
  my-api:latest
```

**After (declarativo com Docker Compose):**
```yaml
version: "3.7"

services:
  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=myapp
    networks:
      - app-network
    volumes:
      - mysql-data:/var/lib/mysql

  api:
    image: my-api:latest
    ports:
      - "3000:3000"
    networks:
      - app-network

networks:
  app-network:

volumes:
  mysql-data:
```

## Heuristics

| Situation | Do |
|-----------|-----|
| App precisa de banco de dados | Declare volume para persistencia |
| Multiplos containers precisam se comunicar | Declare uma network explicita |
| Imagem nao existe no registry | Compose falha no pull — verifique nome e tag antes |
| Precisa ver logs em tempo real | `docker compose up` (sem `-d`) |
| Precisa liberar o terminal | `docker compose up -d` |
| Container precisa de env vars | Declare em `environment`, nunca dependa de shell externo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `version: "2"` (sem necessidade de legado) | `version: "3.7"` |
| Servico sem `image` nem `build` | Sempre declarar `image:` ou `build:` |
| Variáveis de ambiente faltando | Declarar todas em `environment:` |
| Nome de servico generico (`service1`) | Nome descritivo (`mysql`, `redis`, `api`) |
| Arquivo nomeado `compose-dev.yaml` sem motivo | `docker-compose.yml` (nome padrao) |
| Portas sem aspas em YAML (`- 3306:3306`) | `- "3306:3306"` (evita parsing errado) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
