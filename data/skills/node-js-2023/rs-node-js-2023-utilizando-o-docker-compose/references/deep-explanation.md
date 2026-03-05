# Deep Explanation: Docker Compose para Desenvolvimento

## Por que Docker Compose em vez de docker run?

O Diego explica o problema central: quando alguem clona seu projeto, essa pessoa precisaria executar todo o comando `docker run` do zero. Agora imagine que nao e so um Postgres — sao cinco, seis servicos entre bancos de dados, cache, filas, etc. Colocar tudo no README nao escala.

O Docker Compose resolve isso com um arquivo declarativo (`docker-compose.yml`) na raiz do projeto. Quem clonar o repositorio so precisa rodar `docker compose up -d` e todos os servicos sobem automaticamente.

## A armadilha do docker compose down

O Diego fez uma correcao importante durante a aula (voltou para gravar uma retificacao). Ele inicialmente mostrou `docker compose down`, mas depois explicou que esse comando **deleta** os containers, nao apenas para. Isso significa:

- Tabelas criadas por migrations sao perdidas
- Dados inseridos no banco sao apagados
- Ao subir novamente com `up`, o container e zerado

A alternativa correta e `docker compose stop`, que para o container sem deletar. Ao rodar `docker compose up -d` novamente, ele **reusa** o container existente com todos os dados preservados.

## O ciclo de vida em desenvolvimento

```
docker compose up -d     → Sobe containers (cria se nao existir, reusa se existir)
docker compose stop      → Para sem deletar (dados preservados)
docker compose up -d     → Reinicia reusando container existente
docker compose down      → CUIDADO: deleta tudo, dados perdidos
```

## Por que a flag -d e importante

Sem `-d`, o Docker Compose mostra os logs de todos os containers no terminal, travando-o. O desenvolvedor perde o terminal e precisa abrir outro. Com `-d` (detached), os containers rodam em background.

Diego tambem demonstrou que parar um container no meio da inicializacao (sem `-d`) pode demorar mais, porque o processo de shutdown precisa esperar o processo de inicializacao terminar.

## Traducao de docker run para docker-compose.yml

O Docker Compose e literalmente uma traducao 1:1 do comando `docker run`:

| docker run | docker-compose.yml |
|------------|-------------------|
| `--name api-solid-pg` | Nome do servico: `api-solid-pg:` |
| `bitnami/postgresql` (ultimo argumento) | `image: bitnami/postgresql` |
| `-p 5432:5432` | `ports: - 5432:5432` |
| `-e POSTGRESQL_USERNAME=docker` | `environment: - POSTGRESQL_USERNAME=docker` |

## Nome do container no Docker Compose

Diego observou que ao usar Docker Compose, o nome do container fica diferente do esperado — ele concatena o nome da pasta do projeto com o nome do servico. Isso nao e problema porque para gerenciar os containers, usa-se `docker compose stop/up` em vez de `docker stop <nome>`.

## Apos recriar o container

Quando Diego deletou o container antigo (`docker rm api-solid-pg`) e subiu um novo via Docker Compose, o banco veio vazio. Ele precisou rodar `npx prisma migrate dev` novamente para recriar as tabelas. Usuarios e dados anteriores foram perdidos.

## YAML e indentacao

O Docker Compose usa formato YAML, que e "totalmente baseado na indentacao". Diego mencionou que pode ser 2 ou 4 espacos, desde que consistente. As configuracoes de cada servico ficam indentadas abaixo do nome do servico.