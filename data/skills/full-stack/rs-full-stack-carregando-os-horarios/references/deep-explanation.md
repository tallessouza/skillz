# Deep Explanation: Carregando Horários Disponíveis

## Por que organizar por domínio em pastas?

O instrutor enfatiza que a estrutura de pastas **comunica intenção**. Quando você vê `schedules/load.js`, já entende que é "carregamento dos agendamentos" sem precisar abrir o arquivo. Ele reforça: "a própria estrutura já facilita também no entendimento".

Porém, faz uma ressalva importante: **não existe estrutura obrigatória**. Cada desenvolvedor vai desenvolvendo seu estilo com o tempo, e empresas têm seus próprios padrões. O importante é organizar bem — a forma específica é flexível.

## A estratégia do centralizador

O `load.js` dentro de `schedules/` não carrega dados diretamente. Ele **centraliza** todos os carregamentos relacionados a agendamento:

1. Horários disponíveis (lado esquerdo da UI — formulário)
2. Agendamentos do dia (lado direito da UI — lista)

O instrutor explica: "dentro dessa de agendamento do dia, a gente vai centralizar todos os carregamentos relacionados a agendamento". Isso evita que o `page-load.js` precise conhecer todos os detalhes de cada sub-carregamento.

### Cadeia de chamadas

```
page-load.js → schedulesDay() → hoursLoad({ date })
                               → (futuro) loadAppointments({ date })
```

## Desestruturação como ferramenta de comunicação

Quando o instrutor faz `const [scheduleHour] = hour.split(":")`, ele primeiro mostra o resultado sem desestruturar:

```javascript
// Sem desestruturar: retorna ["09", "00"], ["10", "00"], etc.
const result = hour.split(":")

// Com desestruturar: pega só a hora, omite os minutos
const [scheduleHour] = hour.split(":")
```

A desestruturação comunica: "só me interessa o primeiro elemento". A segunda posição é deliberadamente omitida.

## Verificação de horário passado — a lógica completa

O instrutor passa por uma jornada de descoberta ao vivo:

1. **Primeiro tentou `isBefore`** — `dayjs(date).add(hour, "hour").isBefore(dayjs())` — isso retorna `true` para horários no passado
2. **Inverteu com `!`** — `!isBefore` para obter disponibilidade
3. **Percebeu que `isAfter` é mais direto** — `isAfter(dayjs())` retorna `true` para horários futuros, sem precisar inverter

A lição: `isAfter` é semanticamente mais claro que `!isBefore` quando você quer saber "está disponível?".

### Variáveis para filtro de disponibilidade

O instrutor destaca que "horário disponível" precisa considerar múltiplas variáveis:

1. **Horário futuro** — não pode estar no passado
2. **Horário não agendado** — não pode já ter sido reservado por alguém

Na aula, implementa-se apenas o filtro de horário futuro. O filtro de "não agendado" vem depois, quando os dados da API são integrados.

## Parâmetros como objeto desestruturado

O instrutor muda de `function hoursLoad(date)` para `function hoursLoad({ date })` e explica: "para independente da ordem que passar e tudo mais". Isso é especialmente útil quando a função eventualmente receber mais parâmetros (ex: `{ date, excludeBooked }`).

## O padrão `is` para booleanos

O instrutor destaca: "é muito legal você utilizar esse padrãozinho `is` quando você quer guardar valor booleano dentro de uma constante que você vai usar para fazer alguma condição ou verificação". Exemplos: `isHourPast`, `isAvailable`.

## Retorno estruturado do map

Em vez de retornar apenas o horário ou apenas o booleano, retorna-se `{ hour, available }`. Isso permite que a UI use ambos os valores — exibir o horário E controlar se está habilitado/desabilitado.