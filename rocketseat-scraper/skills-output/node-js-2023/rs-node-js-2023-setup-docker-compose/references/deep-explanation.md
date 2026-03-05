# Deep Explanation: Setup Docker Compose

## Por que Docker Compose e nao instalacao local?

O instrutor enfatiza que a razao principal e o **compartilhamento de ambiente**. Quando uma aplicacao depende de Postgres, Redis, Kafka e outros servicos, cada pessoa do time teria que criar todo o ambiente do zero na maquina. Docker Compose resolve isso com um unico arquivo de configuracao.

A frase chave do instrutor: "é muito ruim para as pessoas do nosso time terem que criar esse ambiente totalmente do zero na máquina delas, ou seja, o Docker Compose ajuda demais com isso."

## Anatomia do docker-compose.yml

### Version
- `version: "3.8"` era a mais recente no momento da gravacao
- Para verificar a versao mais atual: pesquisar "Docker Compose Version" → Compose File Version → Version 3
- Nota: versoes mais recentes do Docker Compose (v2+) nao exigem mais o campo `version`

### Services
Cada servico e um container. O nome do servico (ex: `postgres`) e usado internamente pelo Docker para networking entre containers.

### container_name
O instrutor alerta: "não deixar ele gerar automático, senão ele vai gerar um id bem maluco." Sempre defina um nome legivel como `nest-clean-pg`.

### image
- **Desenvolvimento:** `postgres` (imagem oficial, super leve)
- **Producao:** `bitnami/postgres` — o instrutor recomenda especificamente Bitnami por ter "uma camada a mais de segurança". Bitnami tem imagens para Postgres, Redis, Mongo, Kubernetes e muitos outros.

### ports
`5432:5432` significa: redirecionar a porta 5432 de dentro do container para a porta 5432 no localhost. Isso permite acessar o Postgres como se estivesse instalado localmente.

### environment
Variaveis de ambiente especificas da imagem oficial do Postgres:
- `POSTGRES_USER` — usuario padrao criado automaticamente
- `POSTGRES_PASSWORD` — senha do usuario
- `POSTGRES_DB` — banco de dados pre-criado automaticamente ao iniciar o container
- `PGDATA` — caminho DENTRO do container onde os dados do Postgres sao armazenados

### volumes
O volume e o conceito mais importante para persistencia:

```
./.data/pg:/data/postgres
```

Isso significa: a pasta local `.data/pg` do projeto e sincronizada com `/data/postgres` dentro do container. Tudo que o Postgres salva em `/data/postgres` (definido por `PGDATA`) aparece em `.data/pg` na maquina local.

**Beneficio:** se o container for deletado, os dados permanecem na pasta local. Ao recriar o container, os dados sao restaurados automaticamente.

**Opcional:** o instrutor menciona que volumes sao opcionais para desenvolvimento — "são dados em desenvolvimento, então talvez não são tão importantes assim." Funciona sem volumes, mas ha risco de perder dados ao deletar o container.

## Comandos essenciais

- `docker compose up -d` — flag `-d` significa "detached" (background). Sem ela, o terminal fica preso ao container.
- `docker ps` — verifica se o container esta rodando
- Para conectar: `localhost`, usuario `postgres`, senha `docker`

## Ferramentas de acesso ao banco

O instrutor usa Postico (macOS) para verificar que o banco funciona, mas ressalta que nao sera usado no curso — "mais pra frente a gente vai usar o Prisma para conectar e tudo mais." Qualquer ferramenta de acesso a Postgres serve (DBeaver, pgAdmin, DataGrip, etc.).