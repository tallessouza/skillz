# Deep Explanation: Busca Dinamica com searchParams

## Por que searchParams e nao useState?

O instrutor enfatiza uma vantagem fundamental: se voce filtra por data via URL (`?date=2025-09-08`), qualquer pessoa que receber esse link ja cai no filtro correto. Nao precisa falar "entra ai no dia 10" — o link ja carrega filtrado. Isso e impossivel com useState, que vive apenas na memoria do cliente.

## Mudanca de sincrono para assincrono (Next.js 15+)

O instrutor destaca que nas versoes mais recentes do Next.js, tanto `params` quanto `searchParams` mudaram de objetos sincronos para Promises. Antigamente:

```typescript
// ANTES (Next.js < 15)
export default function Page({ searchParams }) {
  const date = searchParams.date // sincrono
}

// AGORA (Next.js 15+)
export default async function Page({ searchParams }) {
  const { date } = await searchParams // assincrono, precisa de await
}
```

Isso vale tanto para `params` (slugs de rota) quanto para `searchParams` (query strings). A tipagem agora e `Promise<{ ... }>`.

## Server Components vs useSearchParams

O instrutor menciona que a documentacao do Next.js mostra exemplos com `useSearchParams` (hook client-side), mas no caso desta aplicacao, tudo e feito via Server Components. A prop `searchParams` esta disponivel em qualquer page (nao so no layout), e permite acessar os query params no servidor, sem JavaScript no cliente.

## Por que date-fns e nao new Date?

O instrutor alerta: "trabalhar com datas, por isso que a gente utiliza essas libs, ne? Que e bem mais facil que no JavaScript, porque a chance de voce acabar fazendo alguma besteira e grande." O `parseISO` do date-fns faz parsing correto de strings ISO (como `2025-09-08`), enquanto `new Date("2025-09-08")` pode gerar problemas com timezone.

## Logica do filtro gte/lte

Para filtrar "todos os agendamentos de um dia", voce nao pode comparar igualdade (`scheduledAt === selectedDate`) porque os agendamentos tem horarios diferentes (10:30, 11:30, 15:00, etc). A solucao e criar um range:

- `gte: startOfDay(selectedDate)` → inicio do dia (00:00:00)
- `lte: endOfDay(selectedDate)` → fim do dia (23:59:59)

O instrutor pesquisou a sintaxe na documentacao do Prisma durante a aula, mostrando que `gte` (greater than or equal) e `lte` (less than or equal) sao os operadores corretos para range queries.

## Importancia do orderBy

Sem `orderBy`, os resultados vem na ordem de insercao no banco — nao na ordem cronologica. O instrutor adiciona `orderBy: { scheduledAt: 'asc' }` para que agendamentos aparecam em ordem temporal: 10:30, 11:30, 15:00, 20:00, 20:30.

## Fluxo completo

1. Usuario acessa `/appointments?date=2025-09-08`
2. Server Component recebe `searchParams` (Promise)
3. `await searchParams` extrai `date`
4. `parseISO(date)` converte string para Date
5. `startOfDay` e `endOfDay` criam o range
6. Prisma filtra com `gte/lte` e ordena com `orderBy`
7. Resultados renderizados no servidor, HTML enviado ao cliente