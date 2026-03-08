# Deep Explanation: Gerando Tabelas e Abrindo Banco de Dados

## Por que usar `prisma migrate dev`?

O comando `npx prisma migrate dev` é o comando de desenvolvimento do Prisma que faz três coisas em sequência:

1. **Gera o SQL** — Compara o estado atual do banco com o `schema.prisma` e cria um arquivo `.sql` com as diferenças
2. **Aplica no banco** — Executa o SQL gerado contra o banco de dados configurado na `DATABASE_URL`
3. **Regenera o Prisma Client** — Atualiza o client TypeScript para refletir as novas tabelas/colunas

O nome da migration (ex: `Create-tables`) é importante porque:
- Fica registrado na pasta `prisma/migrations/` com timestamp
- Serve como documentação do que mudou
- Facilita rastreamento em equipe (cada migration é um commit lógico do schema)

## Beekeeper Studio vs Prisma Studio

O instrutor mostra duas formas de verificar as tabelas:

### Beekeeper Studio
- É um client SQL genérico (funciona com PostgreSQL, MySQL, SQLite, etc.)
- Precisa configurar a conexão manualmente (host, porta, user, password, database)
- Mostra as tabelas em `Public > Tables`
- Útil para queries SQL diretas e administração geral do banco

### Prisma Studio
- É integrado ao Prisma — não precisa configurar conexão separada
- Usa a `DATABASE_URL` do `.env` automaticamente
- Interface web mais amigável para visualizar e editar registros
- Roda em `localhost:5555` por padrão
- O instrutor recomenda usar o Prisma Studio em vez do Beekeeper durante o desenvolvimento, porque é mais prático e integrado

## O fluxo mental do desenvolvedor

```
1. Definiu models no schema.prisma
2. Precisa criar as tabelas no banco
3. Executa: npx prisma migrate dev
4. Dá um nome descritivo para a migration
5. Verifica se as tabelas foram criadas corretamente
6. Usa Prisma Studio para inspecionar visualmente
7. Confirma que colunas, tipos e relações estão corretos
8. Pronto para começar a inserir dados
```

## Quando o banco está "limpo"

O instrutor destaca que após a migration, as tabelas existem mas estão vazias — "nosso banco de dados tá limpo, não tem nenhum registro, mas temos as nossas tabelas criadas". Isso é esperado: a migration cria a estrutura, não os dados. Dados virão depois via seeds ou pela aplicação.

## Contexto do projeto

No projeto RocketLog (API de entregas de encomendas), as tabelas criadas foram:
- **Users** — com campos: id, nome, email, password
- **Delivery** — tabela de entregas
- **Delivery Log** — log de status das entregas

Todas essas tabelas foram definidas previamente no `schema.prisma` e a migration as materializou no PostgreSQL.