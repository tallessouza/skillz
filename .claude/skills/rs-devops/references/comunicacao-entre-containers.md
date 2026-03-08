---
name: rs-devops-comunicacao-entre-containers
description: "Applies Docker Compose multi-service configuration patterns when writing docker-compose.yml files. Use when user asks to 'create docker-compose', 'add service to compose', 'configure container networking', 'connect containers', or 'setup depends_on'. Enforces build context, container naming, custom networks, depends_on, and docker-compose CLI usage. Make sure to use this skill whenever generating or reviewing Docker Compose files with multiple services. Not for single-container Dockerfiles, Kubernetes manifests, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-compose
  tags: [docker, docker-compose, networking, depends-on]
---

# Comunicacao entre Containers com Docker Compose

> Ao configurar multiplos servicos no Docker Compose, defina build context, nomeie containers explicitamente, crie redes customizadas e declare dependencias entre servicos.

## Rules

1. **Use `build` para servicos com Dockerfile customizado** — `build: { context: . }` nao `image:`, porque o servico precisa executar a receita do Dockerfile, nao apenas puxar uma imagem pronta
2. **Nomeie todo container explicitamente** — `container_name: api-skillz` nao deixar o Compose gerar nomes automaticos com prefixo do diretorio, porque nomes automaticos sao confusos em logs e inspecao
3. **Declare redes customizadas** — crie uma network com driver bridge e associe a todos os servicos, porque a rede default do Compose usa o nome do diretorio e nao e previsivel
4. **Use `depends_on` para dependencias** — declare `depends_on: [mysql]` no servico que depende do banco, porque mitiga race conditions na ordem de subida (nao garante 100%, apenas garante que o container existe)
5. **Use `up --build -d` para rebuild completo** — `docker compose up --build -d` faz build + sobe containers, porque `up` sozinho nao rebuilda imagens alteradas
6. **Associe TODOS os servicos dependentes a mesma rede** — se a API usa a rede customizada, o MySQL tambem precisa estar nela, porque na abstracao de rede um servico so enxerga os outros que estao na mesma network

## How to write

### Servico com build context local

```yaml
services:
  api-skillz:
    build:
      context: .
    container_name: api-skillz
    ports:
      - "3001:3000"
    depends_on:
      - mysql
    networks:
      - app-network
```

### Servico com imagem pronta

```yaml
  mysql:
    image: mysql:8
    container_name: mysql
    networks:
      - app-network
```

### Rede customizada (nova)

```yaml
networks:
  app-network:
    driver: bridge
```

### Rede customizada (ja existente externamente)

```yaml
networks:
  app-network:
    external: true
    name: primeira-network
```

## Example

**Before (incompleto, problemas de naming e rede):**
```yaml
services:
  mysql:
    image: mysql:8
  api-skillz:
    build:
      context: .
    ports:
      - "3001:3000"
```

**After (com naming, rede e dependencia):**
```yaml
services:
  mysql:
    image: mysql:8
    container_name: mysql
    networks:
      - app-network

  api-skillz:
    build:
      context: .
    container_name: api-skillz
    ports:
      - "3001:3000"
    depends_on:
      - mysql
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Servico usa Dockerfile no mesmo diretorio | `build: { context: . }` |
| Servico usa Dockerfile em outro path | `build: { context: ./docker }` |
| Servico depende de outro para funcionar | Adicione `depends_on` (mitiga, nao garante) |
| Precisa garantir health antes de subir dependente | Use wait-for-it com healthcheck (nao apenas depends_on) |
| Rede ja foi criada via `docker network create` | Use `external: true` + `name:` |
| Rede nao existe ainda | Declare sem `external`, Compose cria automaticamente |
| Quer ver logs de todos os servicos | `docker compose logs` |
| Quer ver logs de um servico especifico | `docker compose logs mysql` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Servico sem `container_name` | `container_name: nome-explicito` |
| Servicos dependentes em redes diferentes | Todos na mesma network |
| `docker compose up -d` apos alterar Dockerfile | `docker compose up --build -d` |
| Confiar que `depends_on` garante servico pronto | Usar wait-for-it ou healthcheck para garantia real |
| Usar rede default sem declarar | Declarar network customizada com driver bridge |

## Troubleshooting

### Container nao consegue conectar a outro servico na mesma rede
**Symptom:** Erro de conexao recusada entre containers no Docker Compose
**Cause:** Os servicos nao estao na mesma rede customizada ou o depends_on nao foi declarado
**Fix:** Verifique se ambos os servicos estao associados a mesma network e use `docker compose up --build -d`

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-comunicacao-entre-containers/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-comunicacao-entre-containers/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
