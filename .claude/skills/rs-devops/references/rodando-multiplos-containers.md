---
name: rs-devops-rodando-multiplos-containers
description: "Applies Docker multi-container networking patterns for inter-container communication. Use when user asks to 'connect containers', 'run app with database', 'fix container DNS', 'use docker network', or 'debug container communication'. Enforces custom network usage, container naming for DNS, and host substitution from localhost to container name. Make sure to use this skill whenever connecting multiple Docker containers or debugging inter-container networking issues. Not for Docker Compose orchestration, Kubernetes networking, or single-container setups."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-networking
  tags: [docker, networking, containers, dns, custom-network, multi-container, mysql]
---

# Rodando Multiplos Containers

> Containers na mesma rede custom se comunicam pelo nome do container, nunca por localhost.

## Rules

1. **Sempre nomeie containers** — use `--name mysql` porque o nome vira o hostname DNS na rede, sem nome nao ha como referenciar o container
2. **Nunca use localhost entre containers** — substitua `localhost` pelo nome do container (ex: `mysql`), porque cada container tem seu proprio namespace de rede isolado
3. **Use rede custom compartilhada** — ambos containers devem estar na mesma rede custom (`--network minha-rede`), porque a rede bridge default nao resolve nomes DNS
4. **Verifique a rede antes de debugar a app** — use `docker network inspect` para confirmar que ambos containers estao na mesma rede, porque 90% dos erros de conexao sao rede errada
5. **Suba dependencias antes da aplicacao** — MySQL demora para inicializar, se a app subir antes vai falhar com connection refused
6. **Use `docker ps -a` ou `docker ps -l` para containers que sumiram** — containers que crasham no start desaparecem do `docker ps` normal

## How to write

### Criar rede e subir containers conectados

```bash
# 1. Criar rede custom
docker network create minha-rede

# 2. Subir banco COM nome e NA rede
docker run -d --name mysql --network minha-rede \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=mydb \
  mysql:8

# 3. Aguardar banco inicializar, depois subir app NA MESMA rede
docker run -d --network minha-rede \
  -p 3001:3000 \
  minha-app:v1
```

### Configuracao de conexao na aplicacao

```typescript
// O host eh o NOME do container, nao localhost
const dbConfig = {
  host: 'mysql',      // nome do container
  port: 3306,
  database: 'mydb',
  username: 'root',
  password: 'root',
}
```

## Example

**Before (erro comum — localhost entre containers):**
```
DATABASE_URL=mysql://root:root@localhost:3306/mydb
```
Container sobe, tenta conectar em localhost (ele mesmo), falha: `Unable to connect to the database`.

**After (nome do container como host):**
```
DATABASE_URL=mysql://root:root@mysql:3306/mydb
```
Container resolve `mysql` via DNS da rede custom, conexao funciona.

## Heuristics

| Situacao | Acao |
|----------|------|
| Container sumiu do `docker ps` | Rodar `docker ps -a` ou `docker ps -l`, depois `docker logs <id>` |
| `ENOTFOUND` ou `getaddrinfo failed` | Containers estao em redes diferentes — verificar com `docker network inspect` |
| `Connection refused` no start | Dependencia ainda nao inicializou — aguardar ou implementar retry |
| Precisa mover container para outra rede | `docker stop` + `docker rm` + `docker run` com `--network` correto |
| Quer confirmar qual rede o container esta | `docker container inspect <id>` e verificar campo Networks |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `host: 'localhost'` entre containers | `host: 'mysql'` (nome do container) |
| Rodar containers sem `--network` compartilhado | `--network minha-rede` em ambos |
| Rodar container sem `--name` | `--name mysql` para criar DNS resolvivel |
| Debugar app sem checar rede | `docker network inspect minha-rede` primeiro |
| Ignorar container que sumiu | `docker ps -l` + `docker logs` para diagnosticar |

## Troubleshooting

### Container da app sobe e morre imediatamente
**Symptom:** Container aparece em `docker ps -a` com status Exited, logs mostram "Unable to connect to the database"
**Cause:** App tenta conectar em `localhost` que resolve para o proprio container, ou banco ainda nao inicializou
**Fix:** Troque `localhost` pelo nome do container do banco (ex: `mysql`) e confirme que ambos estao na mesma rede custom

### ENOTFOUND ou getaddrinfo failed ao conectar entre containers
**Symptom:** Erro de DNS ao tentar resolver nome do container
**Cause:** Containers estao em redes diferentes — rede bridge default nao resolve nomes DNS
**Fix:** Crie rede custom com `docker network create` e use `--network` em ambos os containers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Rodando Multiplos Containers

## Por que localhost nao funciona entre containers

Cada container Docker tem seu proprio network namespace. Quando a aplicacao dentro do container A faz uma requisicao para `localhost`, ela esta falando com ela mesma — o loopback do proprio container. O container B (MySQL) esta em outro namespace completamente isolado.

A solucao eh usar **nomes de container como hostnames**. Quando voce cria um container com `--name mysql`, o Docker registra esse nome no DNS interno da rede. Qualquer outro container na mesma rede pode resolver `mysql` para o IP correto.

## Rede bridge default vs rede custom

A rede `bridge` (default) nao oferece resolucao DNS por nome de container. Ela funciona apenas por IP. Ja redes custom (criadas com `docker network create`) habilitam automaticamente o DNS interno.

Isso explica o erro `ENOTFOUND`: o container da app estava na rede custom `primeira-network`, mas o MySQL estava na rede `bridge` default. Mesmo que ambos existam no mesmo host fisico, estao em interfaces de rede diferentes e nao se enxergam.

## O problema de ordem de inicializacao

MySQL demora alguns segundos para inicializar completamente (criar databases, configurar usuarios, etc). Se a aplicacao subir antes e tentar conectar imediatamente, vai receber `Connection refused`.

Na aula, o instrutor menciona que isso sera resolvido em aulas futuras (com Docker Compose e healthchecks). Por hora, a solucao manual eh aguardar o MySQL estar pronto antes de subir a app.

## Diagnosticando containers que "somem"

Quando um container falha no startup (ex: app nao consegue conectar no banco), ele encerra e desaparece do `docker ps` (que mostra apenas containers rodando). Duas flags uteis:

- `docker ps -a` — mostra TODOS os containers, incluindo parados/crashados
- `docker ps -l` — mostra apenas o ultimo container criado (util quando ha muitos)

Depois de identificar o container, `docker logs <id>` mostra o que aconteceu.

## Movendo container para outra rede

Nao eh possivel alterar a rede de um container em execucao de forma simples. O fluxo eh:
1. `docker stop <container>`
2. `docker rm <container>`
3. `docker run` novamente com `--network` correto

## Inspecao de rede

`docker network inspect <nome-da-rede>` mostra todos os containers conectados aquela rede, seus IPs e configuracoes. Essa eh a ferramenta principal para debugar problemas de comunicacao entre containers.

## Crescimento da imagem

O instrutor observou que a imagem cresceu de 210MB (v8) para 263MB (v9) — 53MB a mais por causa do TypeORM e do pacote MySQL. Isso ilustra a importancia de monitorar o tamanho das imagens conforme dependencias sao adicionadas.

---

# Code Examples: Rodando Multiplos Containers

## Fluxo completo da aula

### 1. Build da imagem com configuracao de banco

```bash
docker build -t ns-api-skillz:v9 .
```

Verificando tamanho da imagem:
```bash
docker images ns-api-skillz
# v9: 263MB (cresceu 53MB por TypeORM + MySQL driver)
# v8: 210MB
```

### 2. Primeira tentativa — app na rede custom, banco na bridge

```bash
# App na rede custom
docker run -d --network primeira-network -p 3001:3000 ns-api-skillz:v9
```

Resultado: container sobe e logo morre. `docker ps` nao mostra nada.

### 3. Diagnostico do container que sumiu

```bash
# Mostrar todos os containers (incluindo parados)
docker ps -a

# Mostrar apenas o ultimo container criado
docker ps -l

# Ver logs do container crashado
docker logs <container-id>
# Output: "Unable to connect to the database. Retrying..."
```

### 4. Verificando em qual rede o MySQL esta

```bash
docker container inspect <mysql-container-id>
# Na secao Networks: "bridge" — rede default, NAO a custom
```

### 5. Corrigindo — colocando MySQL na mesma rede

```bash
# Parar e remover o MySQL atual
docker stop <mysql-container-id>
docker rm <mysql-container-id>

# Recriar na rede correta
docker run -d --name mysql --network primeira-network \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=mydb \
  mysql:8
```

### 6. Corrigindo a aplicacao — host localhost para mysql

Antes (no codigo da app):
```
DATABASE_URL=mysql://root:root@localhost:3306/mydb
```

Depois:
```
DATABASE_URL=mysql://root:root@mysql:3306/mydb
```

Rebuild:
```bash
docker build -t ns-api-skillz:v10 .
```

### 7. Subindo app corrigida

```bash
docker run -d --network primeira-network -p 3001:3000 ns-api-skillz:v10
```

Verificando:
```bash
docker logs <app-container-id>
# Output: TypeORM iniciado com sucesso
```

### 8. Confirmando que ambos estao na mesma rede

```bash
docker network inspect primeira-network
# Mostra dois containers:
# - app (sem nome definido)
# - mysql
```

## Monitoramento com watch

```bash
# Acompanhar containers em tempo real
watch docker ps
```

Util para ver containers subindo e caindo durante debug.
