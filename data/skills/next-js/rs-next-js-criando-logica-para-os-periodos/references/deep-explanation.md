# Deep Explanation: Logica de Agrupamento por Periodos

## Por que transformar antes de filtrar?

O instrutor demonstra um padrao importante: primeiro ele faz um `map` nos appointments adicionando campos derivados (`time` formatado, `period` classificado), e so depois filtra tres vezes pelo campo `period`. A alternativa seria filtrar o array original tres vezes recalculando `getHours()` em cada filtragem — isso triplica o trabalho de classificacao.

O `map` cria uma representacao intermediaria (`transformedAppointments`) que ja contem toda informacao derivada. Os filtros subsequentes sao triviais — apenas comparacao de string.

## A importancia da tipagem explicita

O instrutor faz questao de criar um arquivo `types/appointment.ts` separado com:
- `AppointmentPeriod` como union type (`'morning' | 'afternoon' | 'evening'`)
- `AppointmentPeriodDay` com metadados de exibicao
- `Appointment` com campos da UI

Ele destaca que quebrar o `AppointmentPeriod` em um type separado permite reutiliza-lo tanto na funcao `getPeriod` (retorno) quanto no componente `PeriodSection` (prop). Sem isso, strings magicas se espalham pelo codigo.

## Separacao entre tipo do Prisma e tipo da UI

O instrutor renomeia o tipo do Prisma para `AppointmentPrisma` na funcao, e usa `Appointment` (tipo proprio) como retorno. Isso e critico porque:
- O Prisma retorna relacoes aninhadas (`apt.schedule.scheduleAt`)
- A UI precisa de campos achatados (`time`, `period`, `service`)
- A transformacao acontece em um unico ponto (a funcao `groupAppointmentsByPeriod`)

## Estrutura de retorno como array fixo

O retorno e um array de exatamente 3 elementos, cada um com `title`, `type`, `timeRange` e `appointments`. Isso permite que o componente simplesmente faca `periods.map(...)` sem nenhuma logica condicional. O instrutor enfatiza: "agora a gente ja tem as nossas secoes ali, ne?"

## Funcao getPeriod como classificador puro

A funcao `getPeriod` recebe apenas um `number` (hora) e retorna o periodo. Nao depende de estado, nao acessa o DOM, nao faz IO. Isso a torna:
- Facilmente testavel com unit tests
- Reutilizavel em qualquer contexto
- Previsivel — mesma entrada, mesma saida

## Formatacao com toLocaleTimeString

O instrutor usa `toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })` durante o `map`, nao durante o render. Isso garante que o componente recebe strings prontas para exibir, sem logica de formatacao no JSX.

## Faixas de horario do pet shop

- Manha: 9h - 12h (hour >= 9 && hour < 12)
- Tarde: 13h - 18h (hour >= 13 && hour < 18)
- Noite: tudo que sobra (evening como fallback)

O instrutor nota que o `evening` nao precisa de condicao explicita — e o fallback natural do `getPeriod`.