# Deep Explanation: Rota de Metrica de Receita Mensal

## Por que uma unica query?

O instrutor destaca que a abordagem correta e buscar todos os pedidos desde o inicio do mes anterior ate agora numa unica query, e depois separar os resultados no JavaScript. Isso e mais eficiente que fazer duas queries separadas (uma para cada mes), porque:

1. Uma unica ida ao banco de dados
2. O groupBy do SQL faz a separacao de forma otimizada
3. Menos codigo para manter

## O truque do toChar

O `to_char` e uma funcao do PostgreSQL que converte uma data para string num formato especifico. Ao usar `to_char(created_at, 'YYYY-MM')`, voce transforma `2024-02-21 14:30:00` em `2024-02-01`. Isso permite agrupar todos os pedidos do mesmo mes, independente do dia.

O instrutor prepara as mesmas chaves (`YYYY-MM`) com DayJS no JavaScript para depois fazer o `.find()` no resultado. As chaves batem exatamente.

## sum() retorna string — armadilha classica

No SQL, `SUM()` retorna um tipo numerico, mas o Drizzle ORM converte para string no JavaScript. O instrutor usa `.mapWith(Number)` que efetivamente faz `Number(valor)` em cada resultado. Isso e diferente do `sql<string>` que so adiciona tipagem TypeScript sem converter o valor.

- `.mapWith(Number)` → converte o valor de fato
- `sql<string>` → so diz ao TypeScript qual o tipo, sem conversao

## Calculo do diferencial percentual

A logica e uma regra de 3 simples:

```
diff = (receita_atual * 100 / receita_anterior) - 100
```

Se o resultado e 10, significa que o mes atual teve 10% a mais que o anterior. Se for -15, teve 15% a menos.

O instrutor mostra que sem o `- 100`, o resultado seria tipo 110 (representando 110% do anterior), o que nao e o que o frontend espera.

## Tratamento de dados ausentes

Se nao houve pedidos em janeiro, o `monthReceipts.find()` retorna `undefined`. O instrutor usa uma condicional:

```typescript
currentMonthReceipt && lastMonthReceipt ? /* calculo */ : null
```

Retornar `null` e melhor que `0` porque o frontend pode distinguir "nao ha dados suficientes" de "a diferenca e zero".

## Nota sobre naming

O instrutor menciona que usou `receipt` ao inves de `revenue` porque o frontend (feito na formacao de React) ja estava usando esse nome. Na pratica, `revenue` seria o nome correto para receita. Isso ilustra que em projetos reais, as vezes voce mantem nomes sub-otimos por compatibilidade com o frontend existente.

## DayJS: subtract + startOf

O instrutor explica o encadeamento:

1. `today.subtract(1, 'month')` → se hoje e 21/02, retorna 21/01
2. `.startOf('month')` → muda para 01/01

Sem o `startOf`, voce perderia os pedidos dos dias 1-20 de janeiro. E um detalhe sutil mas critico para metricas corretas.

## Conversao de DayJS para Date nativo

O Drizzle espera um `Date` nativo do JavaScript no `gte()`, nao uma instancia DayJS. Por isso o `.toDate()` na query:

```typescript
gte(orders.createdAt, startOfLastMonth.toDate())
```