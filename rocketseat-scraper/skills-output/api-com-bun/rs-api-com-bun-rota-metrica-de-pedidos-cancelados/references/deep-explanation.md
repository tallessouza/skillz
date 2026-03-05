# Deep Explanation: Metrica de Pedidos Cancelados

## Raciocinio do Instrutor

### Reutilizacao como estrategia principal

O instrutor demonstra que a rota de pedidos cancelados e **estruturalmente identica** a `getMonthOrdersAmount`. A unica diferenca e a adicao de um filtro `eq(orders.status, 'cancelled')` no `where` da query. Isso reforca o principio de que metricas de dashboard seguem um padrao repetivel — copiar e adaptar e mais seguro e rapido que reescrever.

Frase do instrutor: "Ela vai ser igual a essa getMonthOrdersAmount, posso até copiar igualzinha."

### Semantica invertida de metricas

O ponto mais importante da aula nao e tecnico, e de **interpretacao de dados**. O instrutor destaca que essa metrica tem semantica invertida em relacao as outras:

- **Outras metricas** (receita, pedidos): diff positivo = BOM (crescimento)
- **Cancelamentos**: diff positivo = RUIM (mais cancelamentos que mes passado)

Exemplo concreto: 16% de diff parece bom a primeira vista, mas significa 16% MAIS cancelamentos, o que e negativo para o restaurante.

### Responsabilidade frontend vs backend

O instrutor e claro: a inversao de interpretacao e responsabilidade do **frontend**, nao do backend. A API retorna o diff calculado da mesma forma que as outras metricas. O frontend e que decide:
- `diffFromLastMonth > 0` → vermelho (mais cancelamentos)
- `diffFromLastMonth < 0` → verde (menos cancelamentos)

Frase do instrutor: "Mas bom, isso é uma coisa lá para o front-end."

### Padrao de nomenclatura

O instrutor renomeia cuidadosamente para seguir o padrao estabelecido: `getMonth` + `Cancelled` + `OrdersAmount`. Isso mantem consistencia com `getMonthOrdersAmount`, `getMonthRevenue`, etc.

## Edge cases discutidos

- Se nao houve cancelamentos no mes passado (`lastMonthAmount = 0`), o calculo de percentual retorna 0 para evitar divisao por zero
- Os 21 pedidos cancelados com 16% de diff indicam que o seed de dados gera cenarios realistas para teste