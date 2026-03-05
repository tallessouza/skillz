# Deep Explanation: Criando Docker Compose

## Por que Docker Compose existe

O instrutor demonstra o problema central: sem Docker Compose, voce precisa executar `docker run` manualmente para cada container, passando portas, variaveis de ambiente, volumes — tudo pelo terminal. Isso e propenso a erro e impossivel de reproduzir de forma consistente.

Docker Compose resolve isso: **configure uma vez, execute sempre com um comando so**.

## Hierarquia YAML — A armadilha silenciosa

O instrutor enfatiza repetidamente a importancia da indentacao. Em YAML, indentacao define hierarquia (o que pertence a o que). Diferente de JSON que usa chaves `{}`, YAML usa espacos.

Estrutura hierarquica:
```
services:           # nivel 0 — secao raiz
  api:              # nivel 1 — nome do servico
    build:          # nivel 2 — configuracao do servico
      context: .    # nivel 3 — detalhe da configuracao
```

Dica do instrutor: use as linhas guia do VSCode para verificar se voce esta no nivel correto. Se se perder, use `Shift+Tab` para voltar um nivel ou `Backspace` para apagar ate o nivel correto.

## Build com Dockerfile vs Imagem direta

Dois padroes distintos para definir servicos:

**Build (aplicacao custom):** Quando voce tem um Dockerfile proprio que define o ambiente (imagem base, diretorio de trabalho, dependencias). O Docker Compose le o Dockerfile e constroi a imagem.

```yaml
build:
  context: .           # onde o Docker olha para encontrar arquivos
  dockerfile: Dockerfile  # qual arquivo de instrucoes usar
```

`context: .` significa "use a raiz do projeto como referencia". O Docker Compose vai la e encontra o Dockerfile.

**Imagem direta (software pronto):** Para servicos como PostgreSQL, Redis, etc, que ja tem imagens prontas no Docker Hub. Nao precisa de Dockerfile.

```yaml
image: bitnami/postgresql:latest
```

## depends_on — Ordem de inicializacao

O instrutor explica: a API Node precisa que o banco de dados esteja disponivel para consumir dados. `depends_on` garante que o PostgreSQL suba antes da API.

Importante: `depends_on` garante ordem de **inicio**, nao que o servico esteja **pronto**. O container do Postgres pode iniciar antes do banco estar aceitando conexoes. Para producao, considere healthchecks.

## Volumes — Persistencia de dados

Analogia do instrutor: "imagina so, recriar o container de banco de dados e perder os dados". Volumes resolvem isso isolando os dados do container.

**Sem volume:** dados vivem dentro do container. Container destruido = dados perdidos.

**Com volume nomeado:** dados vivem em um volume gerenciado pelo Docker. Container destruido = dados intactos.

```yaml
volumes:
  - database:/var/lib/postgresql/data
```

O lado esquerdo (`database`) e o nome do volume. O lado direito (`/var/lib/postgresql/data`) e onde o PostgreSQL armazena dados dentro do container.

A secao `volumes:` no nivel raiz do arquivo declara o volume:
```yaml
volumes:
  database:    # nao precisa de configuracao, Docker gerencia automaticamente
```

## Por que o API NAO precisa de volume

O instrutor explica: "para o container da API, nao, porque eu nao vou guardar dados dentro do container da API". A API e stateless — o codigo e copiado durante o build. Se precisar reconstruir, o Dockerfile recria tudo.

## .dockerignore — Nao esquecer

O instrutor adiciona `docker-compose.yml` ao `.dockerignore` porque esse arquivo e para orquestracao externa, nao precisa estar dentro de nenhum container.

## Variaveis de ambiente

Para o PostgreSQL, tres variaveis essenciais:
- `POSTGRESQL_USER` — usuario do banco
- `POSTGRESQL_PASSWORD` — senha
- `POSTGRESQL_DB` — nome do banco de dados

Essas variaveis sao definidas pela imagem `bitnami/postgresql`. Outras imagens (como `postgres` oficial) usam nomes diferentes (`POSTGRES_USER`, etc).