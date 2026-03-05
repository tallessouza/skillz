# Deep Explanation: Query Builder

## O raciocinio central do instrutor

O ponto fundamental da aula e que bancos de dados relacionais (MySQL, Postgres, SQLite) compartilham SQL como linguagem padrao, mas possuem **diferencas sutis** na implementacao. Essas diferencas — um ponto e virgula obrigatorio aqui, uma palavra reservada diferente ali — criam fricao quando voce precisa suportar multiplos bancos ou trocar de banco.

O Query Builder resolve isso colocando uma camada entre seu codigo e o banco. Essa camada:

1. **Recebe instrucoes via metodos** (`.select()`, `.insert()`, `.update()`, `.delete()`)
2. **Conhece o banco de destino** (configurado uma vez)
3. **Gera o SQL correto** para aquele banco especifico

## A analogia da traducao

Pense no Query Builder como um tradutor. Voce fala "selecione todos os usuarios ativos" em uma linguagem universal (metodos do Query Builder), e o tradutor converte para o dialeto especifico do banco que voce esta usando. Se amanha voce trocar de banco, o tradutor muda, mas o que voce fala continua igual.

## Por que legibilidade importa

O instrutor enfatiza que a legibilidade do Query Builder e "muito boa". Isso acontece porque:

- Metodos encadeados leem como instrucoes em linguagem natural
- Cada operacao e um metodo separado, facil de identificar
- A estrutura do codigo reflete a estrutura logica da query
- Nao ha concatenacao de strings SQL, que e propensa a erros

## Tres niveis de abstracao para acesso a banco

| Nivel | Ferramenta | Controle | Portabilidade |
|-------|-----------|----------|---------------|
| Baixo | SQL cru (`pg`, `mysql2`) | Total | Nenhuma |
| Medio | Query Builder (Knex) | Alto | Alta |
| Alto | ORM (Prisma, TypeORM) | Medio | Alta |

O Query Builder ocupa o meio-termo: voce ganha portabilidade sem perder o controle sobre as queries geradas.

## Edge cases e nuancas

### Diferencas entre bancos que o Query Builder resolve

- **Postgres:** Usa `RETURNING *` apos INSERT para retornar o registro inserido
- **MySQL:** Nao suporta `RETURNING`, precisa de query separada
- **SQLite:** Tem limitacoes em ALTER TABLE que outros bancos nao tem
- **Delimitadores:** Postgres usa aspas duplas para identificadores, MySQL usa crases

### Quando o Query Builder nao consegue abstrair

- Tipos de dados especificos (JSONB do Postgres, ENUM do MySQL)
- Extensions do Postgres (PostGIS, pg_trgm)
- Full-text search com sintaxe especifica do banco
- Procedures e functions armazenadas

Nesses casos, a maioria dos Query Builders permite executar SQL cru como escape hatch, mantendo a portabilidade para o restante das queries.