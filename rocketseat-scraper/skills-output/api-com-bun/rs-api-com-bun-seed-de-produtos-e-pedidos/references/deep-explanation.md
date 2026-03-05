# Deep Explanation: Seed de Produtos e Pedidos

## Por que a ordem dos deletes importa

O Postgres tem um comportamento padrao chamado `restrict` para foreign keys. Isso significa que se voce tenta deletar um registro que e referenciado por outra tabela, o banco **bloqueia** a operacao.

Exemplo concreto: se um usuario e `managerId` de um restaurante e voce nao definiu `onDelete: 'cascade'` nessa foreign key, o Postgres vai recusar deletar o usuario enquanto o restaurante existir.

A solucao tem duas vias:
1. **Definir `onDelete: 'cascade'` no schema** — quando o pai e deletado, os filhos sao automaticamente removidos
2. **Deletar na ordem correta** — primeiro as tabelas mais "folha" da arvore de dependencias

O instrutor descobriu durante a aula que esqueceu o cascade nos `authLinks`, entao adicionou `onDelete('cascade')` e rodou uma nova migration. Isso e um padrao comum: voce descobre gaps no schema quando tenta fazer o seed.

## Por que acumular inserts em array

O instrutor reconhece que poderia usar `Promise.all` para paralelizar os deletes, mas argumenta: "isso aqui em localhost vai ser tao rapido que... a gente nao vai ficar rodando esse comando de seed toda hora". Seeds sao ferramentas de desenvolvimento, nao de producao. Otimizacao prematura aqui e perda de tempo.

Porem, para os 200 pedidos, ele NAO faz 200 inserts individuais. Em vez disso, acumula em `ordersToInsert[]` e `orderItemsToInsert[]` e faz dois inserts no final. Isso e uma otimizacao que vale a pena porque reduz de ~400 queries para 2.

## O erro do priceInCents no orderItem

O instrutor cometeu um erro ao vivo e corrigiu: inicialmente colocou `priceInCents: orderProduct.priceInCents * quantity` no order item. Mas o order item armazena o **preco unitario**, nao o total. O total e calculado separadamente e acumulado em `totalInCents` do pedido.

A logica correta:
- `orderItems.priceInCents` = preco unitario do produto
- `orderItems.quantity` = quantidade pedida
- `orders.totalInCents` = soma de (preco * quantidade) de todos os itens

## faker.helpers.arrayElements vs arrayElement

- `arrayElements` (plural) — retorna um **array** com N elementos aleatorios. Aceita `{ min, max }`.
- `arrayElement` (singular) — retorna **um unico** elemento aleatorio.

O instrutor usa `arrayElements` para pegar 1-3 produtos aleatorios por pedido, e `arrayElement` para pegar 1 customer aleatorio.

## typeof table.$inferInsert

O Drizzle ORM expoe um tipo utilitario `$inferInsert` em cada tabela. Usando `type OrderInsert = typeof orders.$inferInsert`, voce obtem o tipo exato que o `db.insert().values()` espera, com campos opcionais (que tem defaults) marcados como optional.

Isso e essencial quando voce cria arrays tipados fora do contexto do insert, porque sem essa tipagem o TypeScript nao consegue dar autocomplete nos campos.

## faker.commerce.price retorna string

O `faker.commerce.price()` retorna uma **string**, nao um numero. O instrutor investiga isso ao vivo ("o desgraçado me retorna um string") e resolve com `Number()` envolvendo o resultado. Alem disso, passa `dec: 0` para nao gerar casas decimais, ja que o preco esta em centavos (inteiros).

## faker.date.recent para datas aleatorias

`faker.date.recent({ days: 40 })` gera uma data aleatoria nos ultimos 40 dias. O instrutor usa isso no `createdAt` dos pedidos para ter variedade temporal nos dados, o que e util para testar dashboards e listagens com filtros de data.

## O erro da foreign key no final

Ao rodar o seed pela primeira vez com os pedidos, deu erro: `insert or update on table orders violate foreign key constraint`. O instrutor usou `bun run studio` (Drizzle Studio) para debugar e descobriu que havia um erro no schema das tabelas orders/orderItems (provavelmente referencia incorreta de coluna). Corrigiu com `bun run generate` + `bun run migrate` + `bun run seed`.

Licao: seeds sao excelentes para encontrar bugs no schema. Se o seed nao roda, provavelmente tem algo errado nas suas migrations.