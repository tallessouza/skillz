# Deep Explanation: Servico de Busca com Filtro por Data

## Por que separar em tres etapas?

O instrutor organiza o servico em etapas distintas com comentarios:
1. **Faz a requisicao** — `fetch()` retorna um Response object
2. **Converte para JSON** — `response.json()` e async, retorna Promise
3. **Filtra pelo dia** — logica de negocio separada da comunicacao

Essa separacao permite:
- Debug passo a passo (saber se o erro e na rede, no parse ou no filtro)
- Reutilizar a etapa de fetch se precisar de filtros diferentes
- Testar a logica de filtro isoladamente

## Client-side vs Server-side filtering

O instrutor reconhece explicitamente: "em um cenario que voce tem uma API que utiliza banco de dados, a propria API ja pode te devolver filtrado — voce passaria na propria URL o dia".

Ele escolhe filtrar no client por dois motivos pedagogicos:
1. A API do projeto nao suporta query params de filtro
2. E uma oportunidade de praticar `Array.filter()` com JavaScript

**Em producao:** prefira filtrar no servidor para nao trafegar dados desnecessarios. Passe o dia como query param: `/schedules?date=2024-01-15`

## Por que dayjs.isSame em vez de comparacao de strings?

Datas podem vir em formatos diferentes da API (`ISO 8601`, timestamps, etc). Comparar strings com `.includes()` e fragil — quebra se o formato mudar.

`dayjs(date).isSame(schedule.when, "day")` normaliza ambas as datas e compara apenas ano/mes/dia, ignorando hora, minuto e segundo. O segundo parametro `"day"` define a granularidade da comparacao.

## Padrao de nomenclatura de servicos

O instrutor segue um padrao consistente:
- `schedule-create.js` — servico de criacao (POST)
- `schedule-fetch-by-day.js` — servico de busca filtrada (GET)

Padrao: `{entidade}-{acao}[-{qualificador}].js`

Isso permite encontrar rapidamente todos os servicos de uma entidade listando a pasta `services/`.

## Try/catch com alert

O padrao usado e simples mas efetivo para mobile:
- `console.log(error)` para debug do desenvolvedor
- `alert()` para feedback ao usuario

Em apps mais maduros, substitua `alert()` por um sistema de toast/snackbar, mas o principio se mantem: sempre comunique o erro ao usuario.

## A funcao exportada e async

O `export async function` permite que o componente que chama faca `await scheduleFetchByDay(selectedDate)` e receba o array filtrado diretamente. Sem async, seria necessario encadear `.then()`.