# Deep Explanation: Rota de Metrica de Pedidos Diarios

## Contexto da rota

Esta rota faz parte de um dashboard de metricas para um sistema de restaurantes. O padrao e identico ao usado na rota `getMonthReceipt` (receita mensal), adaptado para contagem diaria de pedidos.

## Por que comparar com ontem?

O instrutor explica que nao basta retornar o total de pedidos do dia — o dashboard precisa mostrar a **variacao percentual** em relacao ao dia anterior. Isso permite ao dono do restaurante entender se o dia esta indo melhor ou pior que o anterior.

## Mecanica do calculo percentual

O instrutor enfatiza que 1 pedido ontem e 4 hoje = **300%**, nao 400%. A logica:
- Diferenca: 4 - 1 = 3
- Percentual: 3 / 1 * 100 = 300%
- Interpretacao: "300% a mais", ou seja, 3 pedidos a mais em relacao a 1

Isso e diferenca relativa, nao razao. Se fosse razao seria 400% (4/1*100).

## Padrao de reuso com getMonthReceipt

O instrutor literalmente copia a estrutura da rota `getMonthReceipt` e adapta:
- Troca `subMonths(today, 1)` por subtracao de 1 dia
- Troca formato `YYYY-MM` por `YYYY-MM-DD` (precisa do dia)
- Troca nomes das variaveis de `monthReceipt` para `ordersPerDay`
- Troca `diffFromLastMonth` para `diffFromYesterday`

Isso mostra que metricas de dashboard seguem um padrao consistente: **query agrupada + find por periodo + calculo de diff**.

## SQL to_char para agrupamento

O uso de `to_char` no PostgreSQL formata o timestamp em string, permitindo agrupar por dia. Sem isso, cada timestamp unico seria um grupo separado (inutilizando o count).

O instrutor comenta que poderia usar so o dia (`DD`), mas prefere a data completa (`YYYY-MM-DD`) porque "ja fica mais facil" — evita ambiguidade entre dias de meses diferentes.

## startOfDay como limite inferior

Usar `startOfDay(yesterday)` garante que a query comeca exatamente a meia-noite de ontem. Isso captura todos os pedidos do dia completo de ontem e do dia atual ate o momento.

## Debugging durante a aula

O instrutor encontrou dois problemas:
1. **Cookies no Hopscotch** — ao reiniciar o cliente HTTP, perdeu os cookies de autenticacao e precisou refazer o fluxo de login (magic link)
2. **Erro de sintaxe SQL** — faltou aspas no template literal do `to_char`, gerando erro `syntax near YYYY...`. Corrigiu adicionando as aspas corretas.

Isso reforca: sempre verifique se strings SQL dentro de template literals estao com aspas corretas.