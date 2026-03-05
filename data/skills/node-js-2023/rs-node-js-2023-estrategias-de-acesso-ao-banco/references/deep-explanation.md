# Deep Explanation: Estrategias de Acesso ao Banco de Dados

## Por que bancos relacionais primeiro?

O instrutor (Diego) e enfatico: se voce nao sabe profundamente nenhum tipo de banco, foque em relacional primeiro. A razao e pragmatica — bancos relacionais (SQLite, MySQL, Postgres) fornecem 99% das funcionalidades para 99% das aplicacoes. Bancos NoSQL (MongoDB, CockroachDB) foram criados para resolver problemas especificos. Embora estejam avancando, o foco de 90% das aplicacoes no mundo real, inclusive as que usam Node.js, e relacional.

A mensagem central: **nao aprenda NoSQL "porque esta na moda". Aprenda relacional porque resolve o problema.**

## Por que SQLite para desenvolvimento?

Diego escolhe SQLite deliberadamente para quem esta tendo o primeiro contato com banco de dados no Node. As razoes:

1. **Zero instalacao** — todos os dados sao salvos em arquivos fisicos dentro do projeto. Nao precisa de Docker, nao precisa subir nenhum servico.
2. **Queries compativeis** — boa parte do codigo SQL escrito para SQLite e extremamente semelhante ao MySQL, Postgres, SQL Server. Migrar depois e trivial.
3. **Foco no aprendizado** — elimina a friccao de configuracao para que o aluno foque no que importa: aprender a se comunicar com banco de dados.

## Os tres niveis de abstracao — modelo mental

Diego apresenta como um gradiente de "quanto voce precisa se preocupar com SQL":

### Driver Nativo (preocupacao total)
- Voce escreve a query exatamente como vai executar no banco
- Nivel mais baixo de comunicacao possivel
- Exemplos: mysql2, pg, better-sqlite3
- Analogia: e como falar diretamente com o banco na "lingua dele"

### Query Builder (preocupacao media)
- "Construtor de queries" — o nome ja diz
- Converte sintaxe JavaScript para SQL
- O codigo ainda precisa ser semelhante ao SQL, mas usa metodos encadeados
- Exemplo: Knex.js (o mais famoso no ecossistema Node)
- Vantagem: permite focar na linguagem (JS) em vez de aprender SQL profundamente

Diego demonstra ao vivo:
```javascript
knex('users')
  .where({ first_name: 'test', last_name: 'user' })
  .select('id')
```
Que gera:
```sql
SELECT id FROM users WHERE first_name = 'test' AND last_name = 'user'
```

### ORM (preocupacao minima)
- Praticamente nao se preocupa com SQL para 90% das consultas
- Sintaxe e muito mais da linguagem do que SQL
- Diego menciona que vai abordar ORMs em modulos futuros — nao e o foco aqui

## A vantagem da portabilidade

Diego destaca como um ponto "super importante" e "super legal": quando voce usa Query Builder ou ORM, a sintaxe e reaproveitada entre qualquer banco suportado. No caso do Knex, ele mostra a lista: MySQL, MariaDB, Postgres, CockroachDB, Redshift, SQLite, MSSQL, Oracle.

Na pratica: se amanha voce trocar de SQLite para Postgres, muda a URL de conexao e nada mais no codigo precisa mudar.

## Decisao do modulo

Para este modulo especifico, Diego escolhe **SQLite + Knex (Query Builder)** como a combinacao ideal para primeiros passos. A logica:
- SQLite elimina friccao de setup
- Knex ensina conceitos SQL sem exigir SQL puro
- A combinacao e portatil para qualquer banco relacional depois