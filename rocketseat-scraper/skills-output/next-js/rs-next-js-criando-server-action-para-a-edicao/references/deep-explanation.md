# Deep Explanation: Server Action para Edicao

## Por que a checagem de duplicata no update e diferente do create

No create, voce simplesmente busca se existe um registro com aquele valor unico (ex: horario). No update, voce precisa de um detalhe crucial: **excluir o proprio registro da busca**.

Se o usuario edita um agendamento mas nao muda o horario (muda apenas o nome, por exemplo), a query de duplicata encontraria o proprio registro e retornaria erro falso. Por isso o instrutor usa `id: { not: id }` — isso diz ao Prisma "busque registros com esse horario, MAS que nao sejam o registro que estou editando".

```typescript
where: {
  scheduledAt: parsedData.scheduledAt,
  id: { not: id },  // exclui o proprio registro
}
```

## A duplicacao consciente como tecnica pedagogica

O instrutor deliberadamente duplica a logica entre create e update, e menciona que sabe que nao e ideal: "a gente ja sabe que nao e bom, tem algumas formas melhores de fazer isso". Ele antecipa que vai refatorar depois, usando uma abordagem de "sentir a dor primeiro".

Essa tecnica e valiosa: primeiro implemente duplicado, sinta o problema real, depois extraia. Isso evita abstracoes prematuras — voce so abstrai quando tem pelo menos 2 casos concretos.

## Diferenciando create e update pela presenca do id

A logica e simples: se o objeto appointment ja tem um id, ele veio do banco (edicao). Se nao tem, e um novo registro (criacao).

```typescript
const isEdit = !!appointment.id
```

Isso permite reusar o mesmo formulario para ambos os fluxos. O form nao precisa saber se e create ou update — ele so envia os dados e a presenca/ausencia do id determina o caminho.

## Mensagem dinamica no toast

O instrutor usa template string com ternario para ajustar a mensagem:

```typescript
`Agendamento ${isEdit ? "atualizado" : "criado"} com sucesso!`
```

Isso e um padrao simples mas que melhora a UX — o usuario sabe exatamente o que aconteceu.

## Validacao de horario no update — caso real demonstrado

O instrutor demonstra ao vivo: tenta mudar um agendamento para 11h30 que ja esta ocupado. A validacao bloqueia corretamente. Isso prova que a regra de negocio (nao permitir horarios duplicados) funciona tanto no create quanto no update.

## Estrutura da Server Action de update

A assinatura recebe dois parametros separados (nao um objeto unico):

```typescript
export async function updateAppointment(id: string, data: AppointmentData)
```

Isso e intencional — o `id` e um parametro de identificacao (QUAL registro), enquanto `data` sao os valores novos (O QUE mudar). Separar deixa a intencao clara.