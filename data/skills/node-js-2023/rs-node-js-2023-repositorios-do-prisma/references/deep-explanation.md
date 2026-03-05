# Deep Explanation: Repositórios do Prisma

## Camadas da aplicação — do core para fora

O instrutor enfatiza um conceito arquitetural fundamental: a aplicação se divide em **camadas**, e as camadas mais internas (casos de uso, regras de negócio) são as mais importantes. Os repositórios Prisma são uma **camada externa** — a camada de persistência.

A ordem de desenvolvimento proposta é intencional:
1. **Primeiro:** casos de uso + testes unitários (core da aplicação)
2. **Depois:** repositórios Prisma, controllers, rotas (camadas externas)

> "A coisa menos importante da nossa aplicação, pasme, mas é o banco de dados, é as rotas HTTP. Isso aqui [casos de uso] é o core da aplicação. Isso aqui não pode deixar de funcionar em nenhum momento."

Essa é a essência do princípio de Dependency Inversion (o D do SOLID): o core não depende do banco de dados. O banco de dados depende das interfaces definidas pelo core.

## Por que findFirst e não findUnique

O Prisma tem uma distinção importante entre `findUnique` e `findFirst`:

- **`findUnique`**: só aceita campos que tenham `@id` ou `@unique` no schema. O TypeScript não compila se você tentar usar um campo comum.
- **`findFirst`**: aceita qualquer campo no `where`, mas retorna apenas o primeiro registro que bater.

No caso de `findByUserIdOnDate`, o campo `createdAt` não tem `@unique` no schema (e não faria sentido ter), então obrigatoriamente precisamos usar `findFirst`.

## A estratégia de filtragem por data

O problema: bancos de dados armazenam `datetime` com precisão de hora, minuto e segundo. Quando queremos saber se um usuário fez check-in "naquele dia", não podemos comparar `equals` porque isso exigiria hora/minuto/segundo exatos.

A solução: criar uma **janela temporal** do início ao fim do dia.

```
startOfDay = 2023-01-15T00:00:00.000Z
endOfDay   = 2023-01-15T23:59:59.999Z
```

Qualquer `createdAt` entre esses dois valores está "naquele dia". Essa é a mesma lógica usada no In-Memory repository, agora traduzida para queries Prisma usando `gte` (greater than or equal) e `lte` (less than or equal).

O instrutor destaca que o dayjs retorna objetos da própria biblioteca, não `Date` nativo do JavaScript. O Prisma exige `Date`, então `.toDate()` é obrigatório.

## Operadores de comparação do Prisma

| Operador | Significado | SQL equivalente |
|----------|-------------|-----------------|
| `equals` | Exatamente igual | `= value` |
| `gt` | Greater than (maior que) | `> value` |
| `gte` | Greater than or equal | `>= value` |
| `lt` | Less than (menor que) | `< value` |
| `lte` | Less than or equal | `<= value` |

## Paginação com skip/take

O Prisma usa `skip` e `take` que correspondem ao `OFFSET` e `LIMIT` do SQL:

- `take: 20` → "me traga 20 registros" (LIMIT 20)
- `skip: (page - 1) * 20` → "pule os registros das páginas anteriores" (OFFSET)

Exemplo prático:
- Página 1: skip = (1-1) * 20 = 0 → começa do primeiro registro
- Página 2: skip = (2-1) * 20 = 20 → pula os 20 primeiros
- Página 3: skip = (3-1) * 20 = 40 → pula os 40 primeiros

## O método count

O `prisma.model.count()` traduz para `SELECT COUNT(*)` no SQL. Aceita `where` para filtrar, então `count({ where: { userId } })` conta apenas os registros daquele usuário.

## Pattern: copiar estrutura do InMemory

O instrutor mostra que os repositórios InMemory já têm toda a lógica necessária — a implementação Prisma é essencialmente a mesma lógica traduzida para queries do Prisma Client. Isso valida a arquitetura: se a interface está bem definida, implementar novos repositórios é mecânico.