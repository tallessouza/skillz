# Deep Explanation: Metrica de Pedidos Mensais

## Raciocinio do instrutor

### Por que copiar a rota de receipt?

O instrutor explicitamente diz que esta rota "vai ser muito semelhante ao month receipt" e por isso copia a rota inteira como ponto de partida. O padrao e claro: rotas de metrica de comparacao mensal compartilham a mesma estrutura — o que muda e apenas a agregacao (sum vs count) e os nomes dos campos.

Isso reflete um principio importante de desenvolvimento: **quando a estrutura logica e identica, reutilize e adapte em vez de reescrever do zero.** A logica de comparacao mes-a-mes (calcular datas, filtrar, agrupar, comparar, calcular diff percentual) e a mesma independente da metrica.

### O que muda entre receipt e orders amount

1. **Query de agregacao**: `sum(orders.totalInCents)` vira `count()` — importado do Drizzle
2. **Nomes de variaveis**: `monthReceipts` vira `ordersPerMonth`
3. **Campos retornados**: `receipt` vira `amount`
4. **Variaveis de resultado**: `currentMonthReceipt` vira `currentMonthOrdersAmount`, idem para `lastMonth`
5. **Agrupamento**: continua por `monthWithYear` (YYYY-MM)

### Reutilizacao da query de day orders

O instrutor menciona que a query de agregacao (o `count`) e a mesma usada em `getDayOrdersAmount`. Apenas o agrupamento muda — de dia para mes. Isso mostra outro padrao: queries de contagem de pedidos sao reutilizaveis entre granularidades temporais.

### Fluxo de adaptacao

```
1. Copiar getMonthReceipt inteiro
2. Renomear funcao para getMonthOrdersAmount
3. Substituir query de agregacao (copiar de getDayOrdersAmount)
4. Ajustar agrupamento para monthWithYear (ano + mes)
5. Ajustar filtro para startOfLastMonth
6. Renomear todas as variaveis: receipt → amount
7. Importar count do Drizzle
8. Registrar rota no server
9. Testar
```

### Resultado esperado

O instrutor testou e obteve: 98 pedidos no mes, com queda de 3,92% em relacao ao mes anterior. Isso confirma que a estrutura de comparacao percentual funciona identicamente entre receipt e orders amount.

### Observacao do instrutor sobre limpeza

No final, o instrutor nota que ficou um import nao utilizado — mostrando a importancia de limpar imports ao adaptar codigo copiado.