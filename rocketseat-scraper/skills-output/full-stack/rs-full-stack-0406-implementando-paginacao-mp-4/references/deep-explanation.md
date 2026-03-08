# Deep Explanation: Paginação Offset com Prisma

## Por que paginar no banco e não no código

A tentação de buscar todos os registros e fatiar com `.slice()` é grande quando a tabela tem poucos dados. Mas essa abordagem não escala — quando a tabela cresce para milhares de registros, a aplicação carrega tudo na memória para depois descartar a maioria. O Prisma oferece `skip` e `take` que são traduzidos diretamente para `OFFSET` e `LIMIT` no SQL, fazendo o banco retornar apenas os registros necessários.

## A fórmula do skip

```
skip = (page - 1) * perPage
```

- Página 1: `(1 - 1) * 10 = 0` → começa do primeiro registro
- Página 2: `(2 - 1) * 10 = 10` → pula os 10 primeiros
- Página 3: `(3 - 1) * 10 = 20` → pula os 20 primeiros

O `take` corresponde ao `perPage` — é o número máximo de registros retornados. Se a última página tem menos registros que `perPage`, o Prisma simplesmente retorna o que existe.

## Filtros compartilhados entre findMany e count

O instrutor enfatiza que o `where` do `count` DEVE ser idêntico ao do `findMany`. Quando o usuário filtra por nome "Rodrigo" e tem 1 resultado, o `totalRecords` deve ser 1 (não o total da tabela inteira). A paginação é calculada sobre o resultado filtrado.

### Demonstração prática do instrutor:
- Sem filtro, perPage=1: 2 registros → 2 páginas
- Filtro "Rodrigo", perPage=1: 1 registro → 1 página
- Filtro "João", perPage=1: 1 registro → 1 página
- Sem filtro, perPage=10: 2 registros → 1 página (ambos cabem)

Isso prova que o total de páginas muda dinamicamente conforme os filtros aplicados.

## totalPages com proteção contra zero

```typescript
totalPages: totalPages > 0 ? totalPages : 1
```

Quando não há registros (totalRecords = 0), `Math.ceil(0 / 10) = 0`. Retornar 0 páginas é confuso para o frontend — sempre retorne pelo menos 1 página, mesmo que vazia.

## Query params como string

Parâmetros de URL sempre chegam como string. O instrutor usa coerce do Zod para converter automaticamente para número, com fallback para o default. Sem essa conversão, operações matemáticas como `(page - 1) * perPage` produzem resultados incorretos (concatenação de string ao invés de multiplicação).

## Performance

Offset pagination tem uma limitação conhecida: conforme o `skip` cresce, o banco precisa percorrer mais registros antes de retornar os resultados. Para tabelas com milhões de registros, cursor-based pagination é mais eficiente. Mas para a maioria das aplicações (até dezenas de milhares de registros), offset pagination é suficiente e mais simples de implementar.

## Estrutura do response

O instrutor estrutura o retorno com dados e metadados separados:

```json
{
  "refunds": [...],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "totalRecords": 2,
    "totalPages": 1
  }
}
```

Essa estrutura permite ao frontend:
- Saber em qual página está
- Quantos itens por página estão sendo exibidos
- O total de registros encontrados (para exibir "Mostrando X de Y")
- O total de páginas (para renderizar botões de paginação)