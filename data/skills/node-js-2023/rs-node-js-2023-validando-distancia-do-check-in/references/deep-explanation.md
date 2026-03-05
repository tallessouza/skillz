# Deep Explanation: Validando Distancia do Check-in

## Por que extrair o calculo para utils/

O calculo de distancia entre coordenadas usa a formula Haversine — um calculo naval que envolve seno, cosseno, PI e conversoes de graus para radianos. Como o instrutor diz: "a minha matematica ficou la no calculo 2 da faculdade". O ponto e: voce nao precisa entender a matematica, precisa encapsular em uma funcao reutilizavel e testar com coordenadas reais.

## A armadilha dos numeros magicos

O instrutor demonstra o problema: `0.1` sozinho no codigo "nao diz muita coisa para o usuario". Mesmo sabendo que estamos tratando de distancia, a pessoa que le o codigo nao sabe que `0.1` significa 100 metros. A solucao:

```typescript
const MAX_DISTANCE_IN_KILOMETERS = 0.1
```

Tres informacoes em um nome:
1. `MAX` — e um limite superior
2. `DISTANCE` — e uma distancia
3. `IN_KILOMETERS` — a unidade e quilometros

## A constante de conversao na formula

A formula Haversine retorna a distancia em diferentes unidades dependendo de uma constante de multiplicacao. O valor `1.609344` converte milhas para quilometros. Mudando esse valor, voce pode obter metros, milhas ou outras unidades.

## O problema do Prisma Decimal

O Prisma salva latitude e longitude como tipo `Decimal`, nao como `number` do JavaScript. Se voce passar `gym.latitude` direto para funcoes matematicas, vai ter comportamento inesperado. Sempre use `.toNumber()` para converter.

## Por que os testes quebraram

Quando o instrutor adicionou a validacao de distancia, todos os testes existentes quebraram. Motivo: as academias nos testes tinham `latitude: 0, longitude: 0` (Decimal zero por padrao), que fica a milhoes de quilometros de qualquer coordenada real. A solucao foi atualizar as fixtures dos testes existentes para usar coordenadas proximas do usuario.

**Licao:** ao adicionar uma validacao nova, atualize TODOS os testes existentes para que suas fixtures sejam validas sob a nova regra.

## Nomeando testes de forma resiliente

O instrutor nomeou o teste como `should not be able to check in on distant gym` em vez de `should not check in beyond 100m`. Razao: "pode ser que essa distancia mude no futuro e o nosso teste nao tem que estar alocado especificamente a uma distancia especifica." O teste valida a REGRA (distancia), nao o VALOR (100m).

## TDD neste contexto

O fluxo seguido:
1. Escrever o teste que espera o erro
2. Rodar — falha porque a validacao nao existe
3. Implementar a validacao no use-case
4. Rodar — novos testes passam, antigos quebram
5. Corrigir fixtures dos testes antigos
6. Todos passam