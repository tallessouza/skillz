# Deep Explanation: Validando Horario do Check-in

## Por que TDD brilha ao adicionar regras de negocio

O instrutor destaca que TDD e especialmente valioso quando voce **ja tem uma feature desenvolvida** e precisa adicionar uma nova regra de negocio. O fluxo red-green-refactor permite:

1. **Red**: Escrever um teste que descreve o comportamento esperado da nova regra — o teste falha porque a regra ainda nao existe
2. **Green**: Implementar o minimo necessario para o teste passar
3. **Refactor**: Melhorar o codigo (criar erro especifico, extrair constantes)

Isso e diferente de TDD para features novas. Quando a feature ja existe, voce tem a seguranca dos testes anteriores protegendo contra regressoes enquanto adiciona o novo comportamento.

## Mocking de datas no Vitest

### Por que mockar?

Testes que dependem de `new Date()` sao nao-deterministicos — podem passar as 13h e falhar as 23h. O Vitest oferece fake timers que interceptam todas as chamadas a `Date`, `setTimeout`, etc.

### `setSystemTime` vs `advanceTimersByTime`

- **`vi.setSystemTime(date)`**: Define a data "atual" do sistema mockado. Usado no inicio do teste para estabelecer o ponto de partida.
- **`vi.advanceTimersByTime(ms)`**: Avanca o relogio mockado em X milissegundos. Mais expressivo que chamar `setSystemTime` novamente porque comunica a **intencao** — "21 minutos se passaram".

O instrutor mostra que `advanceTimersByTime` e mais elegante que setar uma segunda data manualmente, porque expressa a passagem de tempo de forma declarativa.

### Datas UTC

O instrutor nota que `new Date(2023, 0, 1, 13, 40)` usa UTC. No Brasil (UTC-3), isso apareceria como 16:40 num `console.log`. Mas isso nao importa para o teste, porque o que importa e a **diferenca** entre as duas datas, nao o horario absoluto.

## Day.js `diff()` — Ordem dos parametros

O metodo `diff()` do Day.js calcula: `data_chamadora - data_parametro`.

```typescript
dayjs(dataAtual).diff(dataCriacao, 'minutes') // positivo (atual > criacao)
dayjs(dataCriacao).diff(dataAtual, 'minutes') // negativo (criacao < atual)
```

O instrutor explica que a data **no passado** deve ser o parametro, e a data **mais recente** deve ser a chamadora. Assim o resultado e positivo sem precisar de `Math.abs()`.

O segundo parametro (`'minutes'`, `'hours'`, `'days'`) define a unidade da diferenca. Sem ele, retorna milissegundos.

## Numeros magicos e nomeacao

O instrutor demonstra o problema de `1000 * 60 * 21` aparecendo diretamente no codigo. Ele sugere criar uma constante como `TWENTY_ONE_MINUTES_IN_MS` para que qualquer pessoa entenda o significado sem precisar calcular mentalmente.

Da mesma forma, a variavel `distanceInMinutesFromCheckInCreation` e intencionalmente longa. O instrutor argumenta que clareza para quem da manutencao vale mais que brevidade.

## Erros especificos por regra de negocio

Em vez de `throw new Error('message')`, o padrao do projeto cria classes de erro especificas:

```typescript
export class LateCheckInValidationError extends Error {
  constructor() {
    super('The check-in can only be validated until 20 minutes of its creation.')
  }
}
```

Isso permite:
- Tratamento especifico no controller HTTP (ex: retornar 403 vs 404 vs 400)
- Testes mais precisos com `toBeInstanceOf()`
- Busca no codebase por tipo de erro

## Contexto da aplicacao

Esta regra faz parte de um sistema de check-in de academias (gym). As regras de negocio incluem:
- Check-in so pode ser validado ate 20 minutos apos criacao
- Check-in so pode ser validado por administradores (proxima aula)
- Academia so pode ser cadastrada por administradores (proxima aula)

A validacao temporal impede que um check-in seja validado muito tempo depois, garantindo que o usuario realmente estava presente na academia naquele momento.