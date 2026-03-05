# Deep Explanation: Refatorando Server Actions

## Por que refatorar a duplicacao?

O instrutor identifica um problema classico: a mesma logica de validacao de horarios aparece tanto na criacao (`createAppointment`) quanto na atualizacao (`updateAppointment`). O problema nao e apenas estetico — se o horario de atendimento mudar (ex: passar a atender ate 19h), a mudanca precisa ser feita em dois lugares. Esquecendo um, o sistema fica inconsistente.

## O espectro de solucoes consideradas

O instrutor apresenta um espectro de complexidade crescente:

### 1. Funcao pura (escolhida)
- Menor overhead
- Sem estado, sem side effects
- Facil de testar
- Mantem a logica perto do uso

### 2. Classe Entity
O instrutor menciona explicitamente: "a gente poderia criar uma classe `Appointment`" com um construtor que recebe o horario e faz o calculo. Mas descarta por ser **overengineering** para o caso. Uma classe faz sentido quando:
- Ha estado mutavel a gerenciar
- Ha multiplos metodos que operam sobre os mesmos dados
- Ha invariantes complexas a manter

Para 3 comparacoes booleanas, uma funcao e suficiente.

### 3. Pasta `entities/` em `src/`
Mencionado como possibilidade para projetos maiores. O instrutor sugere `src/entities/` como convencao, mas nao implementa.

## Onde colocar a funcao?

O instrutor discute duas abordagens:

### No mesmo arquivo das actions
**Argumento a favor:** "O motivo de mudanca e o mesmo" — se os horarios mudam, voce ja esta no arquivo certo. Principio de coesao: coisas que mudam juntas devem ficar juntas.

### No arquivo utils existente
**Argumento a favor:** Ja existe um `appointment-utils.ts`, entao e um "forte candidato". O instrutor acaba movendo para la, mas enfatiza que para uma funcao pequena nao ha necessidade forte.

**Conclusao do instrutor:** Ambas as abordagens sao validas. A decisao depende do tamanho e da organizacao do projeto. O principio guia e: **nao crie complexidade organizacional desnecessaria**.

## O padrao de retorno com destructuring

A funcao retorna `{ isMorning, isAfternoon, isEvening }` como objeto. Isso permite:
- Consumo seletivo: pegar so o que precisa
- Extensibilidade: adicionar novos periodos sem quebrar consumidores existentes
- Legibilidade: nomes explicitos no ponto de uso

## Validacao ponta a ponta

O instrutor testa todos os cenarios apos a refatoracao:
- Horario valido de manha (10h) — funciona
- Horario valido de noite (19h) — funciona
- Horario invalido (12:30) — bloqueia
- Horario invalido (18:30 ou 18:00 exato) — bloqueia
- Horario invalido (21h) — bloqueia

Isso confirma que a extracao nao introduziu regressao — os limites de horario continuam funcionando identicamente.