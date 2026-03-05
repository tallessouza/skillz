# Deep Explanation: Criando Seed com Drizzle

## Por que um seed e indispensavel

O instrutor enfatiza que o seed nao e opcional — e indispensavel. O cenario classico: alguem pega sua aplicacao para dar manutencao e quer testar a funcionalidade de deletar um usuario, mas nao tem nenhum usuario cadastrado. Isso e "muito ruim". O seed resolve isso populando o banco com dados ficticios prontos para uso.

## Conexao separada vs conexao do migrate

O instrutor faz questao de criar um arquivo `connection.ts` separado do `migrate.ts`. A razao: no migrate, a conexao usa `max: 1` (uma unica conexao) porque migration e um processo sequencial. Mas para a aplicacao em producao, voce quer multiplas conexoes no pool para suportar muitas requisicoes simultaneas. O arquivo de conexao da aplicacao nao deve ter essa restricao.

A sintaxe e a mesma — a diferenca e arquitetural. O `connection.ts` sera reutilizado pela aplicacao inteira, enquanto o migrate tem sua propria conexao isolada.

## Import com asterisco para schema

```typescript
import * as schema from './schema'
export const db = drizzle(connection, { schema })
```

O `import * as schema` pega TODAS as exportacoes do arquivo de schema e coloca dentro de um unico objeto. Isso e necessario porque o Drizzle precisa conhecer todo o schema para funcionar corretamente (tipagem, relacoes, etc).

## Por que NAO usar Promise.all nos deletes

O instrutor explica explicitamente: existe uma dependencia entre as foreign keys. Se voce criou uma foreign key com `restrict` (ao inves de `set null` ou `cascade`), o banco nao permite deletar um registro que e referenciado por outro. Entao a ORDEM de delecao importa.

Exemplo concreto da aula: se o restaurante tivesse `restrict` no `managerId`, voce nao poderia deletar um usuario que e manager de um restaurante. Teria que deletar o restaurante primeiro.

## O padrao de reset + insert

A logica e clara:
1. Delete tudo (na ordem correta)
2. Insira tudo (na ordem correta — tabelas pai primeiro)

Isso garante que rodar o seed N vezes sempre funciona. Sem o reset, a segunda execucao quebraria em campos unique (como email).

## Returning do Drizzle — tipagem forte

O instrutor destaca que o Drizzle e "altamente tipado". Quando voce usa `.returning({ id: users.id })`, o TypeScript ja sabe que o resultado e `{ id: string }[]`. Voce nao precisa fazer type assertion.

Dois detalhes importantes:
1. **Sem argumentos** (`returning()`) retorna todas as colunas
2. **Com objeto** (`returning({ id: users.id })`) retorna apenas os campos especificados, com os nomes que voce definiu

O retorno e SEMPRE um array, mesmo para insert de um unico registro, porque o Drizzle permite inserir multiplos registros de uma vez. Para extrair o unico resultado, use desestruturacao: `const [manager] = await ...`

## Email fixo para usuario de teste

O instrutor usa `admin@admin.com` como email fixo para o manager. A razao: esse usuario sera usado para logar na aplicacao durante desenvolvimento. Se o email fosse gerado pelo faker, cada execucao do seed geraria um email diferente, e voce nao saberia qual usar para testar o login.

O nome do manager pode ser faker porque "tanto faz, nao vai ser utilizado" para login.

## Evolucao incremental do seed

O instrutor finaliza dizendo que "a ideia e que a gente va populando esse seed aos poucos conforme a gente for tendo mais tabelas do banco de dados". O seed nao e um arquivo estatico — ele cresce junto com o schema.