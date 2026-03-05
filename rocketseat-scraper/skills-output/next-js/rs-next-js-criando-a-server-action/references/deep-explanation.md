# Deep Explanation: Criando Server Actions no Next.js

## Por que validar duas vezes (client E server)?

O instrutor enfatiza que a server action e a **ultima linha de defesa** entre os dados do cliente e o banco de dados. Mesmo que o formulario tenha validacao com Zod no client-side (impedindo submit de campos vazios, por exemplo), qualquer pessoa pode burlar essa validacao manipulando requests diretamente. O schema do servidor e imprescindivel.

A analogia usada: o client-side e a primeira barreira (UX), mas o server-side e o porteiro final antes do banco.

## `parse()` vs `safeParse()`

O instrutor explica a diferenca diretamente:
- **`parse()`** — lanca um erro (throw) se a validacao falhar. Por isso precisa estar dentro de um try/catch.
- **`safeParse()`** — nao lanca erro, retorna um objeto com `success: boolean` e `data` ou `error`.

Na aula, o instrutor escolhe `parse()` com try/catch porque quer interromper o fluxo completamente se os dados forem invalidos.

## Regras de negocio como guards

O instrutor cria variaveis booleanas nomeadas para cada faixa de horario do pet shop:
- `isMorning`: 9h-12h
- `isAfternoon`: 13h-18h
- `isEvening`: 19h-21h

A razao: "para deixar bem descritivo o que a gente esta fazendo, para nao ficar varios numeros soltos". Isso torna o codigo auto-documentado e facil de manter se os horarios mudarem.

## Verificacao de conflito

O pet shop e pequeno, nao tem equipe grande, entao nao permite dois agendamentos no mesmo horario. A estrategia e simples: `findFirst` com o `scheduledAt` exato. Se existir, lanca erro antes de criar.

## A diretiva `"use server"`

O instrutor mostra que sem `"use server"` no topo do arquivo, a funcao nao e reconhecida como server action pelo Next.js e causa erro. Toda server action e uma server function, mas nem toda server function e uma server action (server actions sao invocadas pelo client como resultado de uma acao do usuario).

## Integracao com o formulario

No formulario (client component), a server action e chamada dentro do `onSubmit`:

```typescript
async function onSubmit(data) {
  await createAppointment({
    ...data,
    scheduledAt: selectedDate,
  })
}
```

Os dados do formulario sao combinados com a data selecionada e enviados para a server action.

## Carregando dados com Prisma na page

Apos criar agendamentos, o instrutor mostra que na page (server component), os dados sao buscados com `prisma.appointments.findMany()` e passados para os componentes. Ao atualizar a pagina, os novos agendamentos aparecem na lista.