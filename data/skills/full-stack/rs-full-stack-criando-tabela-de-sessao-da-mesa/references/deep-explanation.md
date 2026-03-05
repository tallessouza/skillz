# Deep Explanation: Migrations com Tabelas de Sessão

## Por que timestamps nullable como indicador de estado?

O instrutor usa uma abordagem elegante: em vez de criar uma coluna `is_open: boolean` para saber se a mesa está aberta, ele simplesmente deixa `closed_at` como `nullable`. A lógica é:

- `closed_at IS NULL` → mesa ainda está aberta
- `closed_at` tem valor → mesa foi fechada naquele momento

Isso elimina redundância. Se tivesse `is_open` E `closed_at`, haveria risco de inconsistência (e.g., `is_open = true` mas `closed_at` preenchido). Com apenas o timestamp, o estado é derivado diretamente do dado, sem possibilidade de conflito.

### Consulta derivada do padrão

```sql
-- Mesas abertas (sessões ativas)
SELECT * FROM tables_sessions WHERE closed_at IS NULL;

-- Mesas fechadas
SELECT * FROM tables_sessions WHERE closed_at IS NOT NULL;
```

## Foreign Key: por que o tipo deve ser idêntico?

O instrutor enfatiza: "é importante que a gente utilize o mesmo tipo da chave primária lá na tabela de mesa". A razão é que bancos relacionais exigem que FK e PK tenham tipos compatíveis. `increments()` no Knex gera um `INTEGER AUTO_INCREMENT` — portanto a FK deve ser `integer()`.

Se você usar `string()` ou `bigInteger()` para referenciar um `integer`, o banco pode:
- Rejeitar a migration com erro
- Aceitar silenciosamente mas falhar em JOINs
- Ter performance degradada por conversão implícita de tipos

## Cadeia de raciocínio: references().inTable()

A sintaxe encadeada do Knex para FK:

```typescript
table.integer("table_id")    // 1. Tipo igual à PK
  .notNullable()              // 2. Obrigatoriedade
  .references("id")           // 3. Qual coluna referencia
  .inTable("tables")          // 4. Em qual tabela
```

Cada parte tem um propósito distinto. O instrutor destaca a importância de `.notNullable()` — toda sessão DEVE estar vinculada a uma mesa. Não faz sentido uma sessão "órfã".

## O método `down` e reversibilidade

O instrutor sempre implementa o `down` com `dropTable`. Isso segue o princípio de que toda migration deve ser reversível. Em produção, isso permite:
- Rollback em caso de falha no deploy
- Desenvolvimento iterativo (migrate/rollback durante dev)
- CI/CD pipelines que testam migrations em ambas direções

## Contexto da tabela no sistema do restaurante

A tabela `tables_sessions` é a terceira no sistema:
1. **products** — cardápio
2. **tables** — mesas físicas do restaurante
3. **tables_sessions** — controle de ocupação (abrir/fechar mesa)

A sessão será posteriormente vinculada aos pedidos, permitindo saber quais pedidos pertencem a qual período de ocupação de uma mesa.

## Default `knex.fn.now()` vs definir na aplicação

O instrutor usa `defaultTo(knex.fn.now())` para `opened_at`. Vantagem: o banco gera o timestamp automaticamente no INSERT, garantindo consistência mesmo que o código da aplicação esqueça de enviar. É uma camada de segurança no nível do banco.