---
name: rs-devops-um-breve-overview
description: "Guides multi-container orchestration setup when running a local app with a database container. Use when user asks to 'run mysql in docker', 'connect app to database container', 'docker run with environment variables', 'orchestrate multiple containers', or 'run database alongside app'. Covers docker run with env vars, port mapping, container naming, and connectivity testing. Make sure to use this skill whenever setting up local multi-container environments without docker-compose. Not for Kubernetes, docker-compose files, or production deployment."
---

# Orquestração de Containers — Multi-Container Local

> Ao rodar múltiplos containers localmente, cada serviço roda isolado e a conectividade entre eles exige configuração explícita de nomes, portas e variáveis de ambiente.

## Rules

1. **Nunca use a tag `latest`** — sempre especifique versão (`mysql:8`, `node:20`), porque `latest` é imprevisível em CI e Kubernetes
2. **Sempre nomeie containers** — use `--name` em todo `docker run`, porque a comunicação entre containers depende do nome como hostname
3. **Passe variáveis de ambiente com `-e`** — uma flag `-e` por variável, porque hardcoded credentials no Dockerfile são um risco de segurança
4. **Não instale dependências no host** — se a app precisa de MySQL, rode um container MySQL, porque instalar no host viola o princípio de isolamento
5. **Use Dockerfile apenas quando há instruções extras** — se só precisa subir o serviço sem customização, `docker run` direto é suficiente
6. **Teste conectividade fora e dentro do container** — porque o comportamento de rede muda entre host e container network

## Steps

### Step 1: Verificar containers rodando

```bash
docker ps
```

### Step 2: Rodar container do banco de dados

```bash
docker run -d \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=rocketdb \
  --name mysql \
  mysql:8
```

Flags essenciais:
- `-d` — modo detach (background)
- `-p 3306:3306` — mapeia porta do host para o container
- `-e VAR=valor` — repita para cada variável de ambiente
- `--name mysql` — nome usado como hostname na rede Docker

### Step 3: Verificar se o banco iniciou

```bash
docker logs mysql
```

Procure por: `Ready for connections` e `ready for startup`.

### Step 4: Testar conexão da aplicação (fora do container)

```bash
# A app no host usa localhost:3306 para alcançar o container
yarn run start
```

Se a app conecta com `host: localhost`, `port: 3306`, ela alcança o MySQL via port mapping.

### Step 5: Testar que a conexão é real

Quebre propositalmente uma config (ex: senha errada) e confirme que dá erro. Restaure e confirme sucesso.

## Heuristics

| Situação | Ação |
|----------|------|
| Serviço sem customização (MySQL, Redis, Postgres) | `docker run` direto, sem Dockerfile |
| Serviço com build steps (app Node, Go) | Criar Dockerfile com multi-stage |
| Múltiplos containers ficando complexos | Migrar para docker-compose (próximo passo) |
| App fora do container, DB dentro | Host da app = `localhost`, porta mapeada |
| App dentro do container, DB dentro | Host da app = nome do container (`mysql`) |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| `docker run mysql` (sem tag) | `docker run mysql:8` |
| `docker run -d ... mysql:latest` | `docker run -d ... mysql:8` |
| Instalar MySQL no host para dev | `docker run --name mysql mysql:8` |
| Rodar container sem `--name` | Sempre definir `--name` explícito |
| Criar Dockerfile só com `FROM mysql:8` sem instruções extras | Usar `docker run` direto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-um-breve-overview/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-um-breve-overview/references/code-examples.md)
