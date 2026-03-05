# Deep Explanation: Docker Compose — Declarando Multiplos Containers

## Por que Docker Compose existe

O instrutor explica que o problema central é o gerenciamento manual de multiplos containers. Quando voce roda `docker run` para a aplicacao, funciona bem. Mas quando adiciona um banco de dados, precisa gerenciar manualmente:

- Definicao de rede
- Definicao de volume
- Liberacao de acesso entre containers
- Variaveis de ambiente para cada container

Isso sao **comandos imperativos** — nao existe nada declarativo. O Docker Compose surgiu exatamente para resolver esse problema: transformar comandos imperativos em um manifesto declarativo.

## Escopo do Docker Compose

Ponto critico enfatizado pelo instrutor: **Docker Compose é exclusivamente para ambiente local.** Para producao, usa-se ferramentas de orquestracao (Kubernetes, Docker Swarm, etc). O Compose existe para facilitar a vida do desenvolvedor no dia a dia.

## Anatomia da estrutura

O arquivo tem tres blocos principais:

1. **services** (obrigatorio) — define os containers
2. **networks** (opcional, boa pratica) — define redes de comunicacao
3. **volumes** (opcional, depende do use case) — define persistencia de dados

O instrutor destaca que rede é "boa pratica se ter", e volume "depende do use case" — mas para banco de dados, é importante ter volume para nao perder informacoes.

## Comportamento de rede default

Observacao importante do instrutor: mesmo sem declarar rede, o Docker Compose cria uma rede default automaticamente. Isso é similar ao comportamento da rede bridge no `docker run`, mas o Compose vai alem e cria uma rede bridge dedicada para aquele compose.

## Naming convention automatica

O Docker Compose gera nomes de container seguindo o padrao:

```
{nome-do-diretorio}_{nome-do-servico}_{numero}
```

Exemplo: se o diretorio é `api` e o servico é `mysql`, o container sera `api_mysql_1`.

O ponto critico: **o nome do servico no compose se torna o hostname na rede interna.** Entao quando a aplicacao precisa se conectar ao MySQL, ela usa `mysql` como host (nao o nome completo do container).

## Erro comum com variaveis de ambiente

O instrutor demonstrou ao vivo: rodou o compose sem variaveis de ambiente e o MySQL falhou com erro sobre `MYSQL_ROOT_PASSWORD`, `ALLOW_EMPTY_PASSWORD`, e `RANDOM_ROOT_PASSWORD`. O container precisa de pelo menos uma dessas variaveis.

Isso acontece porque no `docker run` as variaveis eram passadas via `-e`, mas no compose elas precisam estar declaradas no bloco `environment`.

## Sobre a versao do compose

O instrutor usa `version: "3.7"`. Versoes mais recentes do Docker Compose (v2+) tornaram a declaracao de version opcional, mas manter a versao explicita garante compatibilidade e deixa claro quais features estao disponiveis.

## Comandos essenciais

| Comando | Funcao |
|---------|--------|
| `docker compose version` | Verificar se esta instalado |
| `docker compose up` | Subir containers (foreground, mostra logs) |
| `docker compose up -d` | Subir containers em background |
| `Ctrl+C` (durante up sem -d) | Para os containers gracefully |
| `docker ps` | Verificar containers rodando |