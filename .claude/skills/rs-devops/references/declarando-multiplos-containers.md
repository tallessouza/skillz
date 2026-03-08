---
name: rs-devops-declarando-multiplos-containers
description: "Applies Docker Compose multi-container declaration patterns. Use when user asks to 'create docker-compose.yml', 'declare multiple services', 'configure compose networks', or 'orchestrate containers locally'. Enforces proper YAML indentation, descriptive service names, environment variable declaration, and version 3.7+ syntax. Make sure to use this skill whenever writing or reviewing docker-compose.yml files with multiple services. Not for Kubernetes deployments (use deployando-a-nossa-primeira-aplicacao) or single container runs."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-compose
  tags: [docker, docker-compose, containers, yaml, services, networks, volumes]
---

# Docker Compose — Declarando Multiplos Containers

> Declare todos os containers da aplicacao em um unico arquivo docker-compose.yml para orquestrar servicos localmente de forma declarativa.

## Rules

1. **Use docker-compose.yml como nome padrao** — qualquer outro nome exige `-f`
2. **Respeite a identacao YAML rigorosamente** — YAML quebra silenciosamente com identacao errada
3. **Declare services como bloco principal** — networks e volumes sao opcionais
4. **Nomeie servicos pelo que sao** — `mysql` nao `db1`, porque o nome vira hostname na rede interna
5. **Sempre declare environment variables no compose**
6. **Use `-d` para rodar em background** — `docker compose up -d`

## How to write

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

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `version: "2"` sem necessidade | `version: "3.7"` |
| Servico sem `image` nem `build` | Sempre declarar |
| Nome generico (`service1`) | Nome descritivo (`mysql`, `redis`, `api`) |
| Portas sem aspas (`- 3306:3306`) | `- "3306:3306"` |

## Troubleshooting

### Container nao conecta em outro servico pelo nome
**Symptom:** Aplicacao retorna connection refused ao tentar conectar em `mysql:3306`
**Cause:** Servicos nao estao na mesma network declarada no compose
**Fix:** Declarar a mesma network em ambos os servicos e no bloco `networks:` do compose

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
