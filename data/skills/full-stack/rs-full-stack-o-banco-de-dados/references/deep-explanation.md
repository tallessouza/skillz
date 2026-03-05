# Deep Explanation: Setup PostgreSQL com Docker para ORM

## Por que trocar de SQLite para PostgreSQL?

O instrutor posiciona essa transicao como uma **evolucao natural de repertorio**. SQLite e um banco relacional baseado em arquivo — simples, sem servidor, ideal para aprender SQL puro. PostgreSQL e um banco robusto, com servidor dedicado, que representa o que se usa em producao.

A ideia nao e que SQLite seja ruim. E que o aluno precisa **expandir repertorio**: saber trabalhar com ambos. O SQLite ja cumpriu seu papel de ensinar fundamentos relacionais. Agora, o PostgreSQL entra como o banco que sera manipulado via ORM.

## Por que Docker?

O instrutor usa Docker como padrao para rodar PostgreSQL. A justificativa implicita:

1. **Isolamento** — O banco roda em container, nao polui o sistema operacional
2. **Reprodutibilidade** — Qualquer aluno, em qualquer OS, roda o mesmo comando
3. **Facilidade de reset** — Deletar o container e recriar do zero e trivial
4. **Ja foi ensinado** — Os alunos ja aprenderam a rodar containers Docker antes

O instrutor mostra `docker ps` no terminal para confirmar que o container esta ativo. Isso reforça o habito de **verificar antes de prosseguir**.

## Conexao via Beekeeper (e o spoiler)

O instrutor usa Beekeeper Studio para testar a conexao, mostrando os parametros padrao (localhost, 5432, postgres/postgres). O banco aparece vazio — apenas schemas internos do PostgreSQL.

Porem, o instrutor imediatamente fecha o Beekeeper e da um "spoiler": nas proximas aulas, sera usado uma **ferramenta do proprio ORM** para visualizar o banco. Isso indica que o Beekeeper serve apenas para verificacao inicial, e o fluxo de trabalho real sera via ORM tooling.

## O banco comeca vazio (e isso e intencional)

O instrutor enfatiza que o banco esta vazio. Isso e importante porque:

- Nao ha migracao de dados do SQLite
- O ORM vai criar toda a estrutura (tabelas, relacoes)
- Comecar do zero permite entender o ORM sem bagagem

## Mentalidade do instrutor

A abordagem e pragmatica: "garanta que voce tenha um Postgres rodando". Nao ha teoria profunda sobre PostgreSQL nesta aula — e puramente setup. O valor esta em **nao prosseguir sem o pre-requisito atendido**.