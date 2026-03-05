# Deep Explanation: Query Builder — Fundamentos

## Por que usar um Query Builder?

O Query Builder existe para resolver um problema fundamental: **SQL escrito diretamente no codigo da aplicacao acopla seu codigo a um banco de dados especifico e e fragil**.

### Abstracao do SQL

O conceito central e que voce nao escreve SQL diretamente. Em vez disso, voce usa metodos de um objeto Query Builder. Esses metodos geram o SQL correto para o banco de dados que voce esta usando. Isso significa que se voce trocar de banco de dados (por exemplo, de SQLite em desenvolvimento para PostgreSQL em producao), o mesmo codigo funciona sem alteracao.

### Legibilidade como vantagem principal

O instrutor enfatiza que a legibilidade e uma das maiores vantagens. Comparando:

```sql
INSERT INTO users (name, email, active) VALUES ('João', 'joao@email.com', true)
```

vs:

```typescript
db('users').insert({ name: 'João', email: 'joao@email.com', active: true })
```

A segunda forma e JavaScript/TypeScript nativo. Voce nao precisa fazer "context switch" mental entre duas linguagens.

### Os tres pilares do Query Builder

1. **Query Builder em si** — metodos para CRUD (insert, select, update, delete)
2. **Migrations** — versionamento da estrutura do banco de dados. Cada migration e um passo na evolucao do schema, e pode ser revertida
3. **Seeds** — populacao de dados. Util para dados iniciais (roles, categorias) e dados de teste

### Quando NAO usar Query Builder

- **Queries extremamente complexas** com CTEs recursivas, window functions avancadas — nestes casos, `.raw()` pode ser necessario
- **Procedimentos armazenados** — se o banco ja tem stored procedures, chame-as diretamente
- **Operacoes bulk massivas** — para milhoes de registros, SQL nativo ou COPY pode ser mais eficiente

### Mental model

Pense no Query Builder como um **tradutor**: voce fala JavaScript, ele traduz para SQL. Assim como um tradutor humano, ele cobre 95% das situacoes perfeitamente. Para os 5% restantes (expressoes idiomaticas muito especificas), voce pode recorrer ao SQL direto via `.raw()`.

## Conexao com o ecossistema

No contexto full-stack Node.js, o Query Builder mais comum e o **Knex.js**. Ele serve como base para ORMs como Objection.js, mas pode ser usado sozinho quando voce quer controle sem a complexidade de um ORM completo.

A decisao entre Query Builder puro e ORM depende da complexidade do dominio:
- **Dominio simples (CRUD)** → Query Builder puro
- **Dominio complexo (relacoes, validacoes, hooks)** → ORM que usa Query Builder por baixo