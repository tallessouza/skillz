# Deep Explanation: Comunicacao entre Containers

## Build vs Image no Docker Compose

Quando um servico apenas roda uma imagem existente (como MySQL), usa-se `image:`. Quando o servico precisa construir a partir de um Dockerfile customizado (como uma API Node.js), usa-se `build:` com o `context` apontando para o diretorio onde esta o Dockerfile.

O `context: .` significa que o Dockerfile esta no mesmo nivel do docker-compose.yml. Se o Dockerfile estiver em outro diretorio (ex: `./docker/`), basta referenciar o path no context.

## Race Condition entre Servicos

O instrutor destacou um problema real: quando a API sobe antes do MySQL estar pronto, a aplicacao falha na conexao com o banco. Isso e uma **race condition**.

### depends_on — mitigacao parcial

O `depends_on` apenas garante que o **container** do MySQL existe (aparece no `docker ps`). Porem, o **servico** dentro do container (o processo MySQL) tem seu proprio tempo de inicializacao. Entao mesmo com `depends_on`, a API pode tentar conectar antes do MySQL aceitar conexoes.

### wait-for-it — garantia real

A ferramenta `wait-for-it` verifica o **healthcheck** do container. So libera a subida do container dependente quando o servico esta de fato healthy. Isso garante de verdade que o banco esta pronto.

Em ambiente local para testes, o `depends_on` e suficiente (eventualmente o banco sobe e a API reconecta). Em producao ou testes de integracao, a race condition causa **downtime real** e precisa de wait-for-it ou healthchecks.

## Naming de Containers

Por padrao, o Docker Compose gera nomes no formato `{diretorio}_{servico}_{numero}`. Exemplo: se o projeto esta na pasta `api`, os containers ficam `api-mysql-1`, `api-api-rocket-1`.

Usar `container_name` explicito resolve isso e torna logs, inspect e debug muito mais claros.

## Redes no Docker Compose

### Rede default

O Compose cria automaticamente uma rede com nome `{diretorio}_default` (tipo bridge). Funciona, mas o nome e imprevisivel e muda conforme o diretorio.

### Rede customizada

Declarar uma rede explicita com `networks:` no final do arquivo e associar cada servico a ela garante controle total. Todos os servicos na mesma rede se enxergam pelo nome do servico (DNS interno do Docker).

### Rede externa

Se a rede ja foi criada manualmente (`docker network create primeira-network`), use `external: true` + `name:` para referencia-la no Compose sem tentar recria-la.

Se remover `external` e `name`, o Compose cria a rede automaticamente caso nao exista.

## Comandos Docker Compose — CLI

| Comando | O que faz |
|---------|-----------|
| `docker compose up -d` | Sobe containers (nao rebuilda) |
| `docker compose up --build -d` | Builda + sobe containers |
| `docker compose build` | So builda, nao sobe |
| `docker compose stop` | Para containers + remove rede |
| `docker compose logs` | Logs de TODOS os servicos |
| `docker compose logs mysql` | Logs de um servico especifico |

O `docker compose build` usa a mesma estrutura de cache do `docker build` puro — por baixo dos panos e exatamente o mesmo processo.

O `docker compose logs` e uma abstracao que agrega os logs de todos os servicos definidos no YAML. E contextual ao diretorio — roda baseado no docker-compose.yml do diretorio atual.