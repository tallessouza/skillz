# Deep Explanation: Bloqueando Horários Já Agendados

## O problema central

Em sistemas de agendamento, quando horários já ocupados continuam aparecendo como disponíveis, o usuário pode agendar no mesmo horário de outra pessoa. Isso gera conflito de dados e experiência ruim.

A solução envolve duas camadas de verificação que DEVEM funcionar juntas:
1. **Horário já está ocupado?** (agendamento existente)
2. **Horário já passou?** (tempo no passado)

## O bug clássico: AND vs OR

O instrutor cometeu esse erro ao vivo e corrigiu. A lógica é:

```
available = condição1 AND condição2
```

Se usar OR:
- `!includes("20:00") || !isBefore()` → se o horário é 20:00 (ocupado) mas não está no passado, `!isBefore()` retorna true, e `true || false` = true → horário aparece como disponível ERRONEAMENTE

Se usar AND:
- `!includes("20:00") && !isBefore()` → `false && true` = false → horário corretamente bloqueado

**Regra mental:** quando TODAS as condições precisam ser verdadeiras para algo estar disponível, use AND. OR é para quando QUALQUER condição basta.

## Por que extrair horários com map + format

Os agendamentos da API vêm como objetos completos:

```javascript
{
  id: "abc123",
  name: "João da Silva",
  when: "2024-02-15T20:00:00.000Z"
}
```

O campo `when` contém data + hora em ISO format. Para comparar com os horários do array de funcionamento (que são strings como "09:00", "10:00"), precisamos extrair apenas "HH:mm":

```javascript
dayjs("2024-02-15T20:00:00.000Z").format("HH:mm") // → "20:00"
```

Sem essa transformação, `includes` nunca encontraria match porque compararia "20:00" com "2024-02-15T20:00:00.000Z".

## Fluxo de dados completo

```
1. Usuário seleciona data no input
2. API retorna agendamentos daquela data (dailySchedules)
3. hoursLoad recebe: data selecionada + agendamentos
4. map extrai horários ocupados: ["20:00"]
5. forEach percorre horários de funcionamento: ["09:00", "10:00", ..., "21:00"]
6. Para cada horário: verifica includes + isBefore
7. Renderiza com classe "unavailable" se não disponível
```

## Analogia do instrutor

O instrutor tratou como "camadas de verificação" — a primeira camada (passado) já existia, a segunda (ocupação) foi adicionada. Cada camada é um filtro independente, mas ambas precisam passar (AND) para o horário estar disponível.

## Edge cases importantes

- **Mesmo horário, datas diferentes:** o map é executado para os agendamentos DA DATA selecionada, então não confunde
- **Formato de hora:** garantir que o format do dayjs produz exatamente o mesmo formato usado no array de horários de funcionamento
- **Fuso horário:** dayjs interpreta o ISO string e formata no fuso local — cuidado em produção