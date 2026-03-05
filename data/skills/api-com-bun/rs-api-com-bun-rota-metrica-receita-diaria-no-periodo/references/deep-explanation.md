# Deep Explanation: Receita Diaria por Periodo

## Por que corrigir timezone com utcOffset?

O instrutor explica o problema central: quando o banco de dados salva datas em UTC e o frontend envia datas com timezone local (ex: UTC-3), os limites da query ficam deslocados.

**Exemplo concreto do instrutor:** Se o frontend envia uma data as 22h no timezone UTC-3, no banco (UTC) essa data ja e o dia seguinte (01h). Sem correcao, voce filtra pelo dia errado — pega registros do dia 21 ao 15, quando o correto seria do dia 22 ao 16.

A solucao: `startDate.add(startDate.utcOffset(), 'minutes')` pega o offset do timezone (ex: -180 minutos para UTC-3) e adiciona como minutos, efetivamente convertendo a data para UTC antes de fazer a query.

**Teste pratico:** Se voce assiste a aula depois das 21h (9 PM), vai ver diferenca nos resultados com e sem a correcao de timezone. Antes das 21h, os resultados parecem iguais porque o offset nao cruza a fronteira do dia.

## Por que startOfDay e endOfDay?

Quando voce cria uma data com dayjs sem especificar horario, ele usa o horario atual. Isso significa que se voce roda a query as 15h, so pega registros ate 15h do ultimo dia do periodo.

- `startOf('day')` → 00:00:00.000 (meia-noite)
- `endOf('day')` → 23:59:59.999

## Por que ordenar no JavaScript e nao no SQL?

O instrutor considerou ordenar no PostgreSQL mas decidiu contra, porque o `to_char` retorna texto no formato `DD/MM`. Ordenar texto lexicograficamente colocaria `02/02` antes de `28/01`, o que esta cronologicamente errado.

A ordenacao no JS usa uma abordagem em duas etapas:
1. Se mesmo mes: compara dias diretamente (subtrai)
2. Se meses diferentes: cria objetos Date e compara timestamps (epoch)

## O detalhe dos meses em JavaScript

O instrutor destaca com frustacao: `new Date(year, month, day)` em JavaScript usa meses indexados em zero (janeiro = 0). Quando o banco retorna mes 1 (janeiro), voce precisa fazer `month - 1` para o construtor Date.

## Defaults encadeados com ternario

O instrutor reconhece que ternarios encadeados geralmente sao ruins para legibilidade, mas neste caso considera aceitavel porque a logica e clara:
- Se tem `to`: usa `to`
- Se nao tem `to` mas tem `from`: usa `from + 7 dias`
- Se nao tem nenhum: usa data atual

## to_char para formato do frontend

Ao usar `to_char(createdAt, 'DD/MM')` diretamente no SQL, o banco ja retorna o formato que o frontend precisa, evitando transformacao adicional no backend.