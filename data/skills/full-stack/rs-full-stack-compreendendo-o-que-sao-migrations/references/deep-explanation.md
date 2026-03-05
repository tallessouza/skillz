# Deep Explanation: Compreendendo Migrations

## O modelo mental central

O instrutor apresenta migrations como um conceito em duas camadas:

**Camada 1 — Definicao de estrutura:** Antes de inserir, atualizar ou deletar dados, voce precisa criar o banco. Migrations permitem definir tabelas, colunas, tipos de dados, chaves primarias, constraints de nullable — tudo sem escrever SQL. Voce usa metodos do Query Builder, e ele gera o SQL otimizado para o banco especifico.

**Camada 2 — Gestao de mudancas:** A aplicacao cresce, funcionalidades novas surgem, e o banco precisa acompanhar. Migrations sao o mecanismo que gerencia essa evolucao ao longo do tempo.

## A analogia Git (central na aula)

O instrutor faz uma analogia direta e recorrente:

- **Git** versiona **codigo** com commits numa timeline
- **Migrations** versionam o **banco de dados** com migrations numa timeline

Cada migration e um ponto na historia. O banco de dados atual e o resultado cumulativo de todas as migrations aplicadas em sequencia. Assim como voce pode fazer `git log` e ver a historia do codigo, voce pode ver a lista de migrations e entender a historia do banco.

## Timeline ilustrada pelo instrutor

O instrutor desenha uma linha do tempo:

```
[Migration 1] → [Migration 2] → [Migration 3] → [Rollback 3] → [Migration 5] → [Banco Atual]
  Pessoa A        Pessoa B        Pessoa A         Pessoa B        Pessoa A
  Cria produtos   Cria fornecedores  Modifica produtos  Desfaz mod.   Nova alteracao
```

Pontos-chave dessa ilustracao:
1. **Pessoas diferentes** criam migrations na mesma timeline
2. **Rollback** nao e uma nova migration necessariamente — e desfazer uma migration existente
3. Voce pode fazer rollback para uma migration **especifica**, desfazendo todas as posteriores
4. A seta do banco atual aponta para a ultima migration aplicada

## Por que nao SQL direto?

O instrutor enfatiza que o Query Builder abstrai o SQL. Isso significa:
- Voce escreve `createTable('products')` em vez de `CREATE TABLE products`
- O Query Builder gera SQL **compativel e otimizado** para o banco em uso
- Se trocar de PostgreSQL para MySQL, as migrations continuam funcionando

## Operacoes de migration mencionadas

1. **Criar tabela** — definir nome, colunas, tipos, chave primaria, nullable
2. **Modificar tabela** — adicionar coluna, remover coluna
3. **Rollback** — desfazer uma migration (voltar na timeline)
4. **Rollback para migration especifica** — desfazer varias migrations de uma vez
5. **Desfazer todas** — voltar ao estado zero do banco

## Contexto de equipe

O instrutor destaca o valor em times (2, 3, 4 pessoas):
- Cada desenvolvedor cria suas migrations
- Todas convivem na mesma timeline
- O versionamento permite que todos saibam o que mudou e quando
- Similar a como commits de diferentes pessoas convivem no Git

## Resumo do instrutor (final da aula)

> "Migration e utilizada para criar tabelas, definir estrutura, mas tambem para gestao de mudancas e versionamento da evolucao do banco de dados. Permite criar novas migrations para modificar, criar coisas dentro do banco, mas tambem permite voltar em alguma migration, descartando as modificacoes que ela fez."