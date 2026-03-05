# Deep Explanation: Cadastrando Módulos com Knex e SQLite

## Por que SQLite não ativa foreign keys por padrão?

O SQLite foi projetado para ser leve e retrocompatível. Foreign key enforcement foi adicionado na versão 3.6.19, mas desabilitado por padrão para não quebrar aplicações existentes. Isso significa que mesmo com `.references('id').inTable('courses')` na migration, o SQLite **não valida** se o ID referenciado existe — a constraint é apenas metadata.

O instrutor demonstrou isso na prática: inseriu um módulo com `course_id = 54` (inexistente) e o SQLite aceitou silenciosamente. Esse é um dos bugs mais traiçoeiros em projetos SQLite porque os dados parecem corretos até você fazer um JOIN e descobrir registros órfãos.

## O papel do `pool.afterCreate`

O Knex gerencia um pool de conexões com o banco. Cada vez que uma nova conexão é criada, o `afterCreate` é executado. Isso é essencial porque o PRAGMA foreign_keys é **per-connection** no SQLite — precisa ser ativado em cada conexão, não uma vez só.

```typescript
pool: {
  afterCreate: (connection, done) => {
    connection.run('PRAGMA foreign_keys = ON', done)
  }
}
```

O `done` é um callback que sinaliza ao Knex que a conexão está pronta para uso. O `connection.run` executa SQL raw diretamente na conexão SQLite.

## Fluxo de correção de migrations

O instrutor mostrou um cenário real: esqueceu de colocar `.notNullable()` na coluna `course_id`. Como a migration já tinha sido executada, ele demonstrou o fluxo correto:

1. **Desfazer a migration específica:** `npx knex migrate:down nome_do_arquivo.ts`
   - Detalhe importante: o nome precisa incluir a extensão `.ts`
   - Sem a extensão, o Knex não encontra o arquivo
2. **Editar a migration** adicionando `.notNullable()`
3. **Executar novamente:** `npx knex migrate:latest`

Esse fluxo só é seguro para tabelas recém-criadas sem dados importantes. Para tabelas em produção com dados, seria necessário criar uma nova migration de alteração.

## O erro do campo invertido

O instrutor cometeu um erro ao vivo: passou `id_course` em vez de `course_id` no insert. Como resultado, o campo `course_id` ficou como NULL (o valor foi para uma propriedade inexistente). Isso reforça a importância de:
- `.notNullable()` na migration (teria barrado o NULL)
- Nomear campos consistentemente com o schema do banco

## Restrição de chave estrangeira na prática

Após ativar o PRAGMA, o SQLite passa a verificar:
1. **INSERT:** O valor da FK existe na tabela referenciada?
2. **UPDATE:** O novo valor da FK existe?
3. **DELETE:** Alguém referencia este registro? (depende de ON DELETE)

O erro retornado é `SQLITE_CONSTRAINT: FOREIGN KEY constraint failed` — sem tratamento de exceção, isso derruba o servidor Node.js (o instrutor mostrou isso e mencionou que tratamento de exceção seria abordado depois).

## Testando restrições

O instrutor seguiu uma sequência pedagógica importante:
1. Tentou inserir sem `course_id` → mostrou que NULL era aceito (problema)
2. Adicionou `.notNullable()` → mostrou que NULL agora é barrado
3. Tentou inserir com `course_id = 54` (inexistente) → mostrou que era aceito (problema)
4. Adicionou PRAGMA → mostrou que agora é barrado
5. Inseriu com `course_id` válido → mostrou que funciona corretamente

Essa progressão demonstra que são **duas camadas** de proteção: NOT NULL (nível de coluna) e PRAGMA foreign_keys (nível de relacionamento).