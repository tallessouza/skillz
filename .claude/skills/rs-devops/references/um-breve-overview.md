---
name: rs-devops-um-breve-overview
description: "Applies multi-container local orchestration patterns for running application and database containers together. Use when user asks to 'run app with database locally', 'use docker run for MySQL', 'connect app to containerized database', 'avoid installing dependencies on host', or 'test container connectivity'. Enforces container naming, explicit environment variables, versioned images, and testing connectivity patterns. Make sure to use this skill whenever running multiple containers locally with docker run or connecting an application to a containerized database. Not for Docker Compose, Kubernetes, or production deployments."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-multi-container
  tags: [docker, multi-container, mysql, environment-variables, port-mapping, container-naming, local-development]
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


## Troubleshooting

### App nao conecta ao banco com "Unable to connect to the database"
**Symptom:** Aplicacao falha ao iniciar com erro de conexao ao MySQL
**Cause:** MySQL ainda nao terminou de inicializar, ou host/porta/senha estao incorretos
**Fix:** Verifique com `docker logs mysql` se o banco esta "Ready for connections" antes de iniciar a app, e confirme credenciais

### Erro "container name already in use"
**Symptom:** `docker run --name mysql` falha dizendo que o nome ja existe
**Cause:** Container anterior com mesmo nome ainda existe (parado ou rodando)
**Fix:** Remova com `docker container rm mysql` e rode novamente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Orquestração de Containers Local

## Por que não instalar o banco no host?

O instrutor demonstra que a aplicação NestJS com TypeORM falha ao tentar conectar com MySQL (`Unable to connect to the database`). A solução "óbvia" seria instalar MySQL na máquina, mas isso viola o princípio fundamental de containers: isolamento. Cada dependência deve rodar em seu próprio container.

## Dockerfile vs docker run direto

O instrutor faz uma distinção importante: Dockerfile é necessário quando você precisa de **instruções extras** além de subir o serviço. Para a aplicação Node, o Dockerfile faz sentido porque precisa copiar código, instalar dependências, buildar e definir entrypoint. Para o MySQL, não há nada extra — só precisa subir o serviço com variáveis de ambiente. Por isso, `docker run` direto é suficiente.

Ele mostra que **poderia** criar um `Dockerfile.mysql` com:
```dockerfile
FROM mysql:8
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=rocketdb
```
Mas isso é redundante quando `-e` no `docker run` resolve.

## A complexidade crescente é intencional

O instrutor aponta explicitamente: "tá meio complexo demais". Rodar `docker run` para a app E `docker run` para o banco, cada um com suas flags, portas e variáveis, é trabalhoso. Isso prepara o terreno para docker-compose, que resolve exatamente esse problema de orquestração declarativa.

## Por que nomear containers é crítico

O `--name mysql` não é cosmético. Quando dois containers precisam se comunicar na mesma rede Docker, o nome do container funciona como hostname DNS. Se a app roda dentro de um container e precisa acessar o banco, ela usa `mysql` como host (não `localhost`). O instrutor enfatiza: "nesse fluxo aqui é importante a definição desse nome".

## Tag latest: por que evitar

O instrutor é direto: "não é recomendado rodar nenhum container com a tag latest". Recomenda usar a hash do commit ou a versão da biblioteca. Isso garante reprodutibilidade — o mesmo comando gera o mesmo resultado em qualquer momento.

## Teste de conectividade: dentro vs fora

O instrutor testa a app **fora do container** conectando ao MySQL que está **dentro do container**. Funciona porque `-p 3306:3306` mapeia a porta do host para o container. Ele antecipa que **dentro do container** o comportamento muda (host não é mais `localhost`, e sim o nome do container), deixando para a próxima aula.

## Validação por quebra proposital

Técnica de debugging demonstrada: o instrutor remove um caractere da config do banco, roda a app, confirma que falha, e restaura. Isso prova que a conexão é real e não um falso positivo.

---

# Code Examples: Orquestração de Containers Local

## Configuração TypeORM da aplicação

A aplicação usa TypeORM com MySQL, configuração hardcoded para exemplo:

```typescript
// app.module.ts (configuração TypeORM)
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',  // funciona quando app roda FORA do container
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'rocketdb',
  // ... demais configs
})
```

## Docker run completo para MySQL

```bash
docker run -d \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=rocketdb \
  --name mysql \
  mysql:8
```

### Breakdown de cada flag:

| Flag | Função |
|------|--------|
| `-d` | Detach mode — roda em background |
| `-p 3306:3306` | Porta host:porta container |
| `-e MYSQL_ROOT_PASSWORD=root` | Senha do root |
| `-e MYSQL_DATABASE=rocketdb` | Banco criado automaticamente no startup |
| `--name mysql` | Nome do container (usado como hostname) |
| `mysql:8` | Imagem e tag específica |

## Verificação de logs

```bash
docker logs mysql
```

Output esperado:
```
MySQL init process done. Ready for startup.
...
ready for connections. Version: '8.x.x'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306
```

## Gerenciamento de container existente

Se o container já existe com o mesmo nome:
```bash
# Remover container parado
docker container rm mysql

# Depois rodar novamente
docker run -d -p 3306:3306 ... --name mysql mysql:8
```

## Alternativa: Dockerfile para MySQL (quando necessário)

```dockerfile
# Dockerfile.mysql — só vale a pena se precisar de instruções extras
FROM mysql:8
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=rocketdb
```

Build e run:
```bash
docker build -f Dockerfile.mysql -t my-mysql .
docker run -d -p 3306:3306 --name mysql my-mysql
```

## Múltiplas variáveis de ambiente

Padrão: repita `-e` para cada variável:
```bash
docker run -d \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=rocketdb \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=admin123 \
  --name mysql \
  mysql:8
```

## Teste fora do container

```bash
# App no host conecta via localhost:3306 (port mapping ativo)
yarn run start

# Saída esperada: TypeORM module initialized
# Saída de erro: Unable to connect to the database
```
