# Deep Explanation: Caso de Uso de Academias Próximas

## Por que objetos nomeados em vez de parametros posicionais

O instrutor demonstra um insight importante: ao chamar `findManyNearby(latitude, longitude)` com dois numeros, e impossivel saber qual e qual no call site. Ao receber um objeto `{ latitude, longitude }`, o codigo fica autodocumentado. Esse padrao se aplica a QUALQUER metodo que receba mais de um parametro do mesmo tipo.

## Prefixo `user` nas coordenadas

A decisao de usar `userLatitude` e `userLongitude` no use case (mas `latitude`/`longitude` no repositorio) e deliberada. No use case, existem duas "entidades" com coordenadas: o usuario e a academia. O prefixo elimina ambiguidade. No repositorio, so chega uma coordenada (a de referencia), entao o prefixo e desnecessario.

## Exportar a interface de params

O instrutor enfatiza exportar `FindManyNearbyParams` do arquivo do repositorio. Isso permite que tanto a implementacao in-memory quanto a implementacao real do Prisma (e os testes) compartilhem o mesmo contrato tipado.

## Raio de 10km como regra de negocio

O instrutor adiciona "Academias proximas: ate 10km" no README do projeto. Isso transforma um numero magico no codigo em uma regra de negocio documentada. O valor 10 no filtro `distance <= 10` e uma decisao de produto, nao uma decisao tecnica.

## Estrategia de teste com coordenadas reais

O instrutor vai ao Google Maps e pega coordenadas reais de duas cidades: uma proxima (~0km) e uma distante (~20km). Isso e mais confiavel que inventar numeros, porque:
- Voce sabe a distancia real entre os pontos
- O teste valida que o calculo de distancia funciona corretamente
- Coordenadas reais evitam edge cases de coordenadas impossiveis

O teste cria duas academias — "Near Gym" e "Far Gym" — e verifica que apenas a proxima e retornada. O instrutor inclusive usa `console.log(distance)` para confirmar que a "near" esta a 0km e a "far" a ~20km.

## Conversao de Decimal do Prisma

O Prisma armazena coordenadas como `Decimal`, que nao e compativel com operacoes matematicas nativas do JavaScript. O `.toNumber()` e necessario antes de passar para `getDistanceBetweenCoordinates`. Sem essa conversao, o calculo falha silenciosamente ou retorna `NaN`.

## Reutilizacao de estrutura entre use cases

O instrutor copia a estrutura do `SearchGymsUseCase` para criar o `FetchNearbyGymsUseCase`. Isso mostra que use cases seguem um padrao consistente: interface de request, interface de response, classe com constructor injetando repositorio, metodo execute. A diferenca esta apenas nos parametros e no metodo do repositorio chamado.