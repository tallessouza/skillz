# Code Examples: Paginação Offset com Prisma

## Exemplo 1: Schema de validação com Zod

```typescript
import { z } from "zod"

const listRefundsSchema = z.object({
  name: z.string().optional(),
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),
})
```

O `z.coerce.number()` converte automaticamente a string da query param para número. O `.default()` define o valor quando o parâmetro não é enviado.

## Exemplo 2: Controller completo do instrutor

```typescript
async function listRefunds(request: Request, response: Response) {
  const { name, page, perPage } = listRefundsSchema.parse(request.query)

  const skip = (page - 1) * perPage

  const where = {
    ...(name && {
      name: { contains: name },
    }),
  }

  const refunds = await prisma.refund.findMany({
    where,
    skip,
    take: perPage,
  })

  const totalRecords = await prisma.refund.count({
    where,
  })

  const totalPages = Math.ceil(totalRecords / perPage)

  return response.json({
    refunds,
    pagination: {
      page,
      perPage,
      totalRecords,
      totalPages: totalPages > 0 ? totalPages : 1,
    },
  })
}
```

## Exemplo 3: Versão otimizada com Promise.all

Executar `findMany` e `count` em paralelo reduz o tempo total da requisição:

```typescript
const [refunds, totalRecords] = await Promise.all([
  prisma.refund.findMany({ where, skip, take: perPage }),
  prisma.refund.count({ where }),
])
```

## Exemplo 4: Cenários de teste demonstrados pelo instrutor

### Sem paginação explícita (defaults)
```
GET /refunds
→ page=1, perPage=10
→ Retorna todos os registros (se < 10)
→ totalPages=1
```

### Com perPage=1
```
GET /refunds?perPage=1
→ page=1, perPage=1
→ Retorna 1 registro
→ totalRecords=2, totalPages=2
```

### Navegando entre páginas
```
GET /refunds?perPage=1&page=1 → primeiro registro
GET /refunds?perPage=1&page=2 → segundo registro
GET /refunds?perPage=1&page=3 → array vazio (sem registros)
```

### Filtro + paginação
```
GET /refunds?perPage=1&name=Rodrigo
→ totalRecords=1, totalPages=1 (filtro reduz o total)
```

## Exemplo 5: Variação com ordenação

```typescript
const refunds = await prisma.refund.findMany({
  where,
  skip,
  take: perPage,
  orderBy: { createdAt: "desc" },
})
```

A ordenação é independente da paginação mas essencial para resultados consistentes — sem `orderBy`, a ordem dos registros pode variar entre requisições.

## Exemplo 6: Reutilizando o where em um objeto

A técnica do instrutor de extrair o `where` para uma constante garante que `findMany` e `count` usem exatamente os mesmos filtros:

```typescript
// Extrair filtros para uma constante
const where = {
  ...(name && { name: { contains: name } }),
  ...(status && { status }),
}

// Mesmo where em ambas as queries
const data = await prisma.refund.findMany({ where, skip, take: perPage })
const total = await prisma.refund.count({ where })
```

Se os filtros fossem escritos inline em cada query, seria fácil esquecer um filtro em uma delas, causando inconsistência entre dados e contagem.