# Deep Explanation: Tipagem no Knex

## Por que o Knex nao tem autocomplete por padrao?

O Knex e um Query Builder — ele traduz chamadas JavaScript/TypeScript para SQL. Diferente de um ORM (como Prisma ou TypeORM), o Knex nao tem um schema declarativo que descreve as tabelas. Ele apenas envia queries para o banco. Por isso, quando voce escreve `knex('transactions').insert({})`, o Knex nao sabe quais colunas existem na tabela `transactions`.

Essa e uma limitacao inerente a Query Builders. O instrutor Diego menciona que esse sera "um dos grandes motivos da gente utilizar um ORM" mais para frente — ORMs automatizam esse mapeamento. Mas enquanto se usa Knex, a solucao e manual.

## O mecanismo por baixo dos panos

O Knex exporta uma interface `Tables` vazia dentro do modulo `knex/types/tables`. Essa interface existe especificamente para ser sobrescrita pelo usuario. O TypeScript tem um recurso chamado **declaration merging** — quando voce declara o mesmo modulo/interface em dois lugares, o TypeScript combina as duas declaracoes.

Entao quando voce escreve:

```typescript
declare module 'knex/types/tables' {
  export interface Tables {
    transactions: { ... }
  }
}
```

O TypeScript combina sua declaracao com a interface vazia original, e agora `Tables` tem a propriedade `transactions`. Isso faz com que:
- `knex('nome_tabela')` sugira os nomes das tabelas cadastradas
- `.insert({})` valide os campos contra a interface
- `Ctrl+Space` mostre todas as colunas disponiveis

## Por que `.d.ts` e nao `.ts`?

O instrutor explica: "Um arquivo `.d.ts` e um arquivo que nao vai ter codigo JavaScript dentro dele, somente codigo TypeScript." Arquivos `.d.ts` (declaration files) sao ignorados na compilacao — eles existem apenas para fornecer informacoes de tipo. Como estamos apenas declarando tipos (sem logica), `.d.ts` e o formato correto.

## Por que o import com eslint-disable?

O `import { Knex } from 'knex'` no topo do arquivo nao e usado diretamente no codigo — ele serve para que o TypeScript saiba que estamos estendendo os tipos do pacote `knex`. Sem esse import, o `declare module` criaria um modulo novo ao inves de estender o existente. O eslint reclama porque a variavel importada nao e referenciada, entao ignoramos essa linha.

## A pasta `@types`

O instrutor usa `src/@types/` com o `@` na frente para que a pasta fique no topo da listagem de arquivos (ordenacao alfabetica). O nome da pasta nao importa para o TypeScript — o que importa e que o arquivo `.d.ts` esteja dentro do escopo do `tsconfig.json`.

## Filosofia do instrutor sobre TypeScript

Diego enfatiza a importancia de integrar completamente a aplicacao ao TypeScript: "Eu particularmente gosto muito que a minha aplicacao esteja totalmente integrada ao TypeScript." O argumento e sobre **manutenibilidade** — quando outro desenvolvedor precisa adicionar um campo, basta dar `Ctrl+Space` ao inves de consultar o banco de dados. Quem escreve o codigo hoje facilita a manutencao futura.

## Conexao com o ecossistema

- **Zod** — validacao de dados em runtime (mencionado como parte da estrategia de tipagem)
- **ORM** — solucao futura que automatiza esse mapeamento (Prisma, TypeORM)
- **Migrations** — a fonte de verdade para quais colunas existem e suas constraints