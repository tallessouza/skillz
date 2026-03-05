# Deep Explanation: Armazenamento de Volumes no Docker

## Por que volumes existem

Containers Docker tem um filesystem efemero. Quando o container para ou e removido, todos os dados escritos dentro dele sao perdidos. Para servicos stateless como APIs, isso nao e problema — o codigo esta na imagem e o estado esta em outro lugar (banco, cache, etc.). Mas para bancos de dados, perder dados e catastrofico.

Volumes resolvem isso criando um armazenamento **apartado** do container. Os dados ficam gerenciados pelo Docker em um diretorio no host (`/docker/volumes/<nome>/_data`), e sobrevivem ao ciclo de vida do container.

## Como o Docker Compose gerencia volumes

Quando voce declara um volume nomeado no `docker-compose.yml`:

```yaml
volumes:
  db:
```

O Docker Compose cria um volume com prefixo do projeto. Se o diretorio do projeto se chama `api`, o volume sera `api_db`. Isso e visivel com `docker volume ls` e no output de `docker container inspect`.

No inspect, a secao relevante e "Mounts":
- **Source:** caminho no host (ex: `/docker/volumes/api_db/_data`)
- **Destination:** caminho dentro do container (ex: `/var/lib/mysql`)

## Decisao: quando usar volume

O instrutor deixa claro o criterio de decisao:

- **MySQL (banco de dados):** precisa de volume porque armazena dados que devem persistir
- **API Rocket (aplicacao):** nao precisa de volume porque nao tem esse caso de uso — e stateless

A regra e simples: **se o servico armazena dados que precisam sobreviver a um restart, precisa de volume.**

## Contexto no curso

Esta aula fecha o modulo de containers, cobrindo os 4 pilares essenciais:
1. **Multiplos containers** rodando juntos
2. **Redes** para comunicacao entre containers
3. **Volumes** para persistencia de dados
4. **Variaveis de ambiente** para configuracao

O instrutor ressalta que esses conceitos basicos sao fundamentais antes de avancar para CI/CD (build de imagem a cada commit/PR) e orquestracao com Kubernetes (problemas reais de producao).

## Paths de dados por banco

| Banco | Path de montagem |
|-------|-----------------|
| MySQL | `/var/lib/mysql` |
| PostgreSQL | `/var/lib/postgresql/data` |
| MongoDB | `/data/db` |
| Redis | `/data` |