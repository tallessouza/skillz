# Deep Explanation: PostgreSQL com Docker

## Por que Docker e nao instalacao local?

O instrutor enfatiza que Docker permite ter **varias versoes de PostgreSQL rodando na mesma maquina**, cada uma para sua aplicacao, sem conflitar configuracoes. Se um dia nao quiser mais o banco, basta `docker rm` e sumiu — sem residuos no sistema.

## Por que Bitnami e nao a imagem oficial?

O instrutor explica que a Bitnami se preocupa especificamente com seguranca:

- **Nao permite senha padrao** do Postgres — voce e forcado a definir uma
- **Nao permite usar o usuario root diretamente** — voce cria um usuario novo
- **Nao permite subir sem nome de usuario personalizado** — previne configuracoes inseguras

A recomendacao e se acostumar com Bitnami porque essas praticas de seguranca ja vem embutidas.

> **Nota de atualizacao:** A imagem correta e `bitnamilegacy/postgresql` (nao mais `bitnami/postgresql`), devido a mudancas na forma como a Bitnami libera suas imagens.

## Isolamento de containers — o conceito de port mapping

O instrutor explica com clareza: quando voce sobe um Postgres no Docker, ele roda em um **ambiente totalmente isolado** da maquina. Acessar `localhost:5432` nao funciona automaticamente — o container e como um subsistema separado.

O parametro `-p 5432:5432` faz o **direcionamento**: a porta 5432 do host (sua maquina) aponta para a porta 5432 dentro do container. Sem isso, o banco existe mas e inacessivel.

## Ciclo de vida do container

1. **`docker run`** — cria o container pela primeira vez (baixa imagem se necessario, configura variaveis ambiente)
2. **Ctrl+C** — para o container, mas o Docker mantem em cache
3. **`docker start {nome}`** — reinicia o container sem precisar re-digitar tudo
4. **`docker stop {nome}`** — para o container
5. **`docker rm {nome}`** — remove o container definitivamente
6. **`docker ps`** — lista containers rodando
7. **`docker ps -a`** — lista todos os containers (incluindo parados)
8. **`docker logs {nome}`** — ve os logs; `-f` para seguir em tempo real

O ponto-chave: voce **nunca** precisa digitar o comando `docker run` completo de novo. Use `docker start` com o nome que voce definiu.

## Prisma Migrations — controle de versao do banco

O instrutor descreve migrations como uma **linha do tempo do banco de dados**. Cada migration tem:

- **Timestamp** — quando foi executada (para ordenacao cronologica)
- **Nome descritivo** — o que mudou (ex: `createUsers`)
- **SQL gerado automaticamente** — o Prisma le o `schema.prisma`, compara com o estado atual do banco, e gera o SQL necessario

Fluxo:
1. Altere o `schema.prisma`
2. Rode `npx prisma migrate dev`
3. Prisma detecta as diferencas
4. Pede um nome para a migration
5. Gera o SQL e executa automaticamente
6. Cria pasta `prisma/migrations/{timestamp}_{nome}/migration.sql`

## Prisma Studio

O instrutor mostra que `npx prisma studio` abre uma interface web para navegar pelas tabelas e dados do banco — sem precisar instalar nenhuma ferramenta adicional (como Postico, pgAdmin, etc).